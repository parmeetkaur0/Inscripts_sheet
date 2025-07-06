import { useTable, useResizeColumns, useFlexLayout } from 'react-table';
import type { Column, Row, CellProps } from 'react-table';
import type { FC } from 'react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Hash,
  FileText,
  Calendar,
  Tag,
  User,
  Globe,
  Users,
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  X,
  Trash2,
} from 'lucide-react';

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

interface TableProps {
  data: Data[];
  columns: ColumnConfig[];
  onHideFields: (columnsToHide: string[]) => void;
  onAddNew: () => void;
  onInsertColumn: (columnName: string) => void;
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
  setColumns: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
  hiddenColumns: string[];
  cellViewMode: 'normal' | 'formula';
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter?: (columnId: string, value: string) => void;
  onFormatCells?: (columnId: string, format: string) => void;
}

const getStatusStyle = (status: string) => {
  const base = 'px-2 py-0.5 rounded text-xs font-medium';
  switch (status) {
    case 'In-process':
      return `${base} bg-yellow-100 text-yellow-700`;
    case 'Need to start':
      return `${base} bg-blue-100 text-blue-700`;
    case 'Complete':
      return `${base} bg-green-100 text-green-700`;
    case 'Blocked':
      return `${base} bg-red-100 text-red-700`;
    default:
      return base;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 font-medium';
    case 'Medium':
      return 'text-yellow-600 font-medium';
    case 'Low':
      return 'text-blue-600 font-medium';
    default:
      return '';
  }
};

const getColumnIcon = (id: string) => {
  const size = 14;
  const icons: Record<string, JSX.Element> = {
    serial: <Hash size={size} />,
    job: <FileText size={size} />,
    submitted: <Calendar size={size} />,
    status: <Tag size={size} />,
    submitter: <User size={size} />,
    url: <Globe size={size} />,
    assigned: <Users size={size} />,
    priority: <AlertTriangle size={size} />,
    due: <Clock size={size} />,
    value: <DollarSign size={size} />,
  };
  return icons[id] || null;
};

export const Table: FC<TableProps> = ({
  data,
  columns,
  onHideFields,
  onAddNew,
  onInsertColumn,
  setData,
  setColumns,
  hiddenColumns,
  cellViewMode,
}) => {
  const [tableData, setTableData] = useState<Data[]>(data);
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>(columns);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    setTableColumns(columns);
  }, [columns]);

  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [multiSelected, setMultiSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (selectedCell) {
      const key = `${selectedCell.rowIndex}-${selectedCell.columnId}`;
      inputRefs.current[key]?.focus();
    }
  }, [selectedCell]);

  const addRow = () => {
    onAddNew();
  };

  const addColumn = () => {
    const name = prompt('Enter new column name:');
    if (name) {
      onInsertColumn(name);
    }
  };

  const deleteRow = useCallback(
    (index: number) => {
      const updated = [...tableData];
      updated.splice(index, 1);
      const newData = updated.map((row, i) => ({
        ...row,
        serial: i + 1,
        job: row.job || '',
        submitted: row.submitted || '',
        status: row.status || '',
        submitter: row.submitter || '',
        url: row.url || '',
        assigned: row.assigned || '',
        priority: row.priority || '',
        due: row.due || '',
        value: row.value || 0,
      }));
      setTableData(newData);
      setData(newData);
    },
    [tableData, setData]
  );

  const deleteColumn = (columnId: string) => {
    if (columnId === 'serial') return;
    const updatedCols = tableColumns.filter((col) => col.accessor !== columnId);
    const updatedData = tableData.map((row, i) => {
      const { [columnId]: _, ...rest } = row;
      return {
        ...rest,
        serial: i + 1,
        job: rest.job || '',
        submitted: rest.submitted || '',
        status: rest.status || '',
        submitter: rest.submitter || '',
        url: rest.url || '',
        assigned: rest.assigned || '',
        priority: rest.priority || '',
        due: rest.due || '',
        value: rest.value || 0,
      } as Data;
    });
    setTableColumns(updatedCols);
    setTableData(updatedData);
    setColumns(updatedCols);
    onHideFields(hiddenColumns.filter((id) => id !== columnId));
  };

  const dataWithSerial = useMemo(
    () => tableData.map((row, i) => ({ ...row, serial: i + 1 })),
    [tableData]
  );

  const visibleColumns: Column<Data>[] = useMemo(
    () => [
      { Header: '', accessor: 'serial' },
      ...tableColumns.filter((col) => !hiddenColumns.includes(col.accessor)),
      {
        Header: '',
        accessor: '__deleteRow',
        Cell: ({ row }: CellProps<Data>) => (
          <div className="flex justify-center items-center">
            <button onClick={() => deleteRow(row.index)} title="Delete Row">
              <Trash2 size={14} className="text-red-500 hover:text-red-700" />
            </button>
          </div>
        ),
        width: 40,
      },
    ],
    [deleteRow, tableColumns, hiddenColumns]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<Data>(
      {
        columns: visibleColumns,
        data: dataWithSerial,
      },
      useFlexLayout,
      useResizeColumns
    );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    columnId: string
  ) => {
    const colIds = visibleColumns
      .map((col) => col.accessor)
      .filter((id) => id !== 'serial' && id !== '__deleteRow') as string[];
    const currentColIndex = colIds.indexOf(columnId);
    let nextRow = rowIndex;
    let nextCol = currentColIndex;

    switch (e.key) {
      case 'ArrowDown':
        nextRow = rowIndex + 1;
        break;
      case 'ArrowUp':
        nextRow = rowIndex - 1;
        break;
      case 'ArrowRight':
        nextCol = currentColIndex + 1;
        break;
      case 'ArrowLeft':
        nextCol = currentColIndex - 1;
        break;
      case 'Enter':
        nextRow = rowIndex + 1;
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          nextCol = currentColIndex - 1;
          if (nextCol < 0) {
            nextCol = colIds.length - 1;
            nextRow = rowIndex - 1;
          }
        } else {
          nextCol = currentColIndex + 1;
          if (nextCol >= colIds.length) {
            nextCol = 0;
            nextRow = rowIndex + 1;
          }
        }
        break;
      default:
        return;
    }

    if (
      nextRow >= 0 &&
      nextRow < tableData.length &&
      nextCol >= 0 &&
      nextCol < colIds.length
    ) {
      setSelectedCell({ rowIndex: nextRow, columnId: colIds[nextCol] });
    }
  };

  const handleShiftClick = (
    e: React.MouseEvent,
    rowIndex: number,
    columnId: string
  ) => {
    if (e.shiftKey && selectedCell) {
      const keyRange: { [key: string]: boolean } = {};
      const startRow = Math.min(selectedCell.rowIndex, rowIndex);
      const endRow = Math.max(selectedCell.rowIndex, rowIndex);
      const colIds = visibleColumns
        .map((col) => col.accessor)
        .filter((id) => id !== 'serial' && id !== '__deleteRow') as string[];
      const startColIndex = colIds.indexOf(selectedCell.columnId);
      const endColIndex = colIds.indexOf(columnId);

      for (let r = startRow; r <= endRow; r++) {
        for (
          let c = Math.min(startColIndex, endColIndex);
          c <= Math.max(startColIndex, endColIndex);
          c++
        ) {
          keyRange[`${r}-${colIds[c]}`] = true;
        }
      }

      setMultiSelected(keyRange);
    } else {
      setSelectedCell({ rowIndex, columnId });
      setMultiSelected({});
    }
  };

  return (
    <div className="overflow-x-auto max-h-[80vh]">
      <div className="min-w-max">
        <div className="flex items-center gap-2 px-4 py-3 text-gray-600 text-sm border-b bg-gray-50 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Q3 Financial Overview
          <span className="ml-2 text-xs text-gray-400">(editable)</span>
          <button
            onClick={addRow}
            className="ml-10 flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            <Plus size={14} /> Add Row
          </button>
          <button
            onClick={addColumn}
            className="ml-2 flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            <Plus size={14} /> Add Column
          </button>
        </div>

        <table
          {...getTableProps()}
          className="min-w-max text-sm border border-gray-300 bg-white"
        >
          <thead className="sticky top-0 z-10 bg-gray-100">
            {headerGroups.map((group) => (
              <tr
                {...group.getHeaderGroupProps()}
                key={group.id}
                className="text-xs text-gray-700"
              >
                {group.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    className="relative px-3 py-2 border-b border-gray-300 font-semibold uppercase text-left whitespace-nowrap group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          {getColumnIcon(column.id)}
                        </span>
                        {column.render('Header')}
                      </div>
                      {column.id !== 'serial' &&
                        column.id !== '__deleteRow' && (
                          <button
                            onClick={() => deleteColumn(column.id)}
                            title="Delete Column"
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X size={12} />
                          </button>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row: Row<Data>) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                  className="hover:bg-gray-50"
                >
                  {row.cells.map((cell) => {
                    const column = cell.column.id;
                    const value = cell.value;
                    const rowIndex = row.index;
                    const columnConfig = tableColumns.find(
                      (col) => col.accessor === column
                    );

                    if (column === '__deleteRow') {
                      return (
                        <td {...cell.getCellProps()} key={cell.column.id}>
                          {cell.render('Cell')}
                        </td>
                      );
                    }

                    let content;

                    if (column === 'status') {
                      content = (
                        <span className={getStatusStyle(value)}>{value}</span>
                      );
                    } else if (column === 'url') {
                      content = (
                        <a
                          href={`https://${value}`}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noreferrer"
                          title={value}
                        >
                          {value}
                        </a>
                      );
                    } else if (column === 'priority') {
                      content = (
                        <span className={getPriorityColor(value)}>{value}</span>
                      );
                    } else if (
                      column === 'value' ||
                      columnConfig?.format === 'currency'
                    ) {
                      content = (
                        <span
                          className="text-right block font-medium"
                          title={
                            columnConfig?.format === 'currency'
                              ? `$${value.toFixed(2)}`
                              : `₹${value.toLocaleString('en-IN')}`
                          }
                        >
                          {cellViewMode === 'formula' &&
                          columnConfig?.format !== 'currency'
                            ? `=${value.toLocaleString('en-IN')}`
                            : columnConfig?.format === 'currency'
                              ? `$${value.toFixed(2)}`
                              : `₹${value.toLocaleString('en-IN')}`}
                        </span>
                      );
                    } else if (column === 'serial') {
                      content = <div className="text-center">{value}</div>;
                    } else {
                      const key = `${rowIndex}-${column}`;
                      const isSelected =
                        selectedCell?.rowIndex === rowIndex &&
                        selectedCell?.columnId === column;
                      const isMulti = multiSelected[key];

                      content = (
                        <input
                          type={
                            columnConfig?.format
                              ? ['number', 'currency'].includes(
                                  columnConfig.format
                                )
                                ? 'number'
                                : 'text'
                              : 'text'
                          }
                          className={`w-full bg-transparent border-none focus:outline-none ${
                            isSelected ? 'ring-2 ring-blue-400 rounded' : ''
                          } ${isMulti ? 'bg-blue-100' : ''}`}
                          value={
                            cellViewMode === 'formula' && column !== 'serial'
                              ? `=${value || ''}`
                              : value || ''
                          }
                          ref={(el) => {
                            inputRefs.current[key] = el;
                          }}
                          onFocus={() =>
                            setSelectedCell({ rowIndex, columnId: column })
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, column)}
                          onClick={(e) => handleShiftClick(e, rowIndex, column)}
                          onChange={(e) => {
                            const updatedData = [...tableData];
                            const rawValue =
                              cellViewMode === 'formula' &&
                              e.target.value.startsWith('=')
                                ? e.target.value.slice(1)
                                : e.target.value;
                            updatedData[rowIndex] = {
                              ...updatedData[rowIndex],
                              [column]: ['number', 'currency'].includes(
                                columnConfig?.format || ''
                              )
                                ? Number(rawValue) || 0
                                : rawValue,
                            };
                            setTableData(updatedData);
                            setData(updatedData);
                          }}
                        />
                      );
                    }

                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="px-3 py-2 border border-gray-200 align-middle truncate"
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
