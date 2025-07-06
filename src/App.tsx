import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Toolbar from './components/Toolbar';
import { Table } from './components/Table';
import TitleTabs from './components/TitleTabs';
import TopBar from './components/TopBar';
import { mockData } from './data/mockData';
import './index.css';

interface Data {
  serial: number;
  job: string;
  submitted: string;
  status: string;
  submitter: string;
  url: string;
  assigned: string;
  priority: string;
  due: string;
  value: number;
  [key: string]: string | number;
}

interface ColumnConfig {
  Header: string;
  accessor: string;
  format?: 'text' | 'number' | 'currency';
}

const App = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Data[]>(mockData);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { Header: 'Job Request', accessor: 'job', format: 'text' },
    { Header: 'Submitted', accessor: 'submitted', format: 'text' },
    { Header: 'Status', accessor: 'status', format: 'text' },
    { Header: 'Submitter', accessor: 'submitter', format: 'text' },
    { Header: 'URL', accessor: 'url', format: 'text' },
    { Header: 'Assigned', accessor: 'assigned', format: 'text' },
    { Header: 'Priority', accessor: 'priority', format: 'text' },
    { Header: 'Due Date', accessor: 'due', format: 'text' },
    { Header: 'Est. Value', accessor: 'value', format: 'currency' },
  ]);
  const [filteredData, setFilteredData] = useState<Data[]>(mockData);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [cellViewMode, setCellViewMode] = useState<'normal' | 'formula'>(
    'normal'
  );

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    console.log(`Search term updated: "${searchTerm}"`);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log(`Switched to ${tab}`);
  };

  const handleHideFields = (columnsToHide: string[]) => {
    setHiddenColumns(columnsToHide);
    console.log(
      `Updated hidden columns: ${columnsToHide.join(', ') || 'none'}`
    );
  };

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    const sortedData = [...filteredData].sort((a, b) => {
      const aVal = a[columnId];
      const bVal = b[columnId];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
    setData(sortedData);
    console.log(`Sorted by ${columnId} (${direction})`);
  };

  const handleFilter = (columnId: string, value: string) => {
    const filtered = data.filter((item) =>
      String(item[columnId]).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    console.log(`Filtered ${columnId} by "${value}"`);
  };

  const handleImport = (file: File) => {
    Papa.parse<Data>(file, {
      complete: (result: Papa.ParseResult<any>) => {
        const parsedData = result.data
          .slice(1)
          .filter((row: string[]) => row.length >= columns.length)
          .map((row: string[], index: number) => {
            const rowData: Data = {
              serial: data.length + index + 1,
              job: '',
              submitted: '',
              status: '',
              submitter: '',
              url: '',
              assigned: '',
              priority: '',
              due: '',
              value: 0,
            };
            columns.forEach((col, i) => {
              rowData[col.accessor] =
                col.format === 'number' || col.format === 'currency'
                  ? Number(row[i]) || 0
                  : row[i] || '';
            });
            return rowData;
          });
        const updatedData = [...data, ...parsedData];
        setData(updatedData);
        setFilteredData(updatedData);
        console.log('Imported CSV data:', parsedData);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleExport = () => {
    const csv = Papa.unparse([
      columns.map((col) => col.Header),
      ...filteredData.map((row) => columns.map((col) => row[col.accessor])),
    ]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table.csv';
    link.click();
    console.log('Exported data as CSV');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/table?tab=${activeTab}`;
    console.log('Share URL:', shareUrl);
    alert(`Shareable URL: ${shareUrl}`);
  };

  const handleAddNew = () => {
    const newRow: Data = {
      serial: data.length + 1,
      job: '',
      submitted: '',
      status: '',
      submitter: '',
      url: '',
      assigned: '',
      priority: '',
      due: '',
      value: 0,
    };
    columns.forEach((col) => {
      newRow[col.accessor] =
        col.format === 'number' || col.format === 'currency' ? 0 : '';
    });
    const updatedData = [...data, newRow];
    setData(updatedData);
    setFilteredData(updatedData);
    console.log('Added new row');
  };

  const handleInsertColumn = (columnName: string) => {
    const accessor = columnName.toLowerCase().replace(/\s+/g, '_');
    const newCol: ColumnConfig = {
      Header: columnName,
      accessor,
      format: 'text',
    };
    setColumns([...columns, newCol]);
    const updatedData = data.map((row) => ({ ...row, [accessor]: '' }));
    setData(updatedData);
    setFilteredData(updatedData);
    console.log(`Inserted column: ${columnName}`);
  };

  const handleFormatCells = (columnId: string, format: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.accessor === columnId
          ? { ...col, format: format as 'text' | 'number' | 'currency' }
          : col
      )
    );
    console.log(`Formatted ${columnId} column as ${format}`);
  };

  const handleCellViewToggle = () => {
    setCellViewMode((prev) => (prev === 'normal' ? 'formula' : 'normal'));
    console.log(
      `Toggled cell view mode to ${cellViewMode === 'normal' ? 'formula' : 'normal'}`
    );
  };

  // Apply tab and search filtering
  useEffect(() => {
    const filtered = data.filter((item) => {
      const status = item.status?.toLowerCase().trim();
      const tabMatch =
        activeTab === 'All' ||
        (activeTab === 'Pending' && status === 'need to start') ||
        (activeTab === 'Reviewed' && status === 'in-process') ||
        (activeTab === 'Arrived' && status === 'complete');
      const searchText =
        `${item.job} ${item.status} ${item.submitter} ${item.url} ${item.assigned}`.toLowerCase();
      const searchMatch = searchText.includes(search.toLowerCase().trim());
      return tabMatch && searchMatch;
    });
    setFilteredData(filtered);
    console.log(
      `Filtered data with search term: "${search}" and tab: "${activeTab}"`
    );
  }, [activeTab, search, data]);

  return (
    <div className="font-sans min-h-screen">
      <TopBar onSearch={handleSearch} />
      <Toolbar
        onHideFields={handleHideFields}
        onSort={handleSort}
        onFilter={handleFilter}
        onImport={handleImport}
        onExport={handleExport}
        onShare={handleShare}
        onAddNew={handleAddNew}
        onInsertColumn={handleInsertColumn}
        onFormatCells={handleFormatCells}
        onCellViewToggle={handleCellViewToggle}
        columns={columns.map((col) => col.Header)}
        columnAccessors={columns.map((col) => col.accessor)}
        hiddenColumns={hiddenColumns}
      />
      <div className="flex items-center justify-between px-8">
        <TitleTabs
          tabs={['All', 'Pending', 'Reviewed', 'Arrived']}
          activeTab={activeTab}
          onTabChange={handleTabClick}
        />
      </div>
      <div className="px-8">
        <Table
          data={filteredData}
          columns={columns}
          onHideFields={handleHideFields}
          onSort={handleSort}
          onFilter={handleFilter}
          onAddNew={handleAddNew}
          onInsertColumn={handleInsertColumn}
          onFormatCells={handleFormatCells}
          setData={setData}
          setColumns={setColumns}
          hiddenColumns={hiddenColumns}
          cellViewMode={cellViewMode}
        />
      </div>
    </div>
  );
};

export default App;
