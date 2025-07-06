import type { FC } from 'react';
import { useState, useRef } from 'react';

interface ToolbarProps {
  onHideFields: (columnsToHide: string[]) => void;
  onSort: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter: (columnId: string, value: string) => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onShare: () => void;
  onAddNew: () => void;
  onInsertColumn: (columnName: string) => void;
  onFormatCells: (columnId: string, format: string) => void;
  onCellViewToggle: () => void;
  columns: string[];
  columnAccessors: string[];
  hiddenColumns: string[];
}

const Toolbar: FC<ToolbarProps> = ({
  onHideFields,
  onSort,
  onFilter,
  onImport,
  onExport,
  onShare,
  onAddNew,
  onInsertColumn,
  onFormatCells,
  onCellViewToggle,
  columns,
  columnAccessors,
  hiddenColumns,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isToolbarMenuOpen, setIsToolbarMenuOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isInsertColumnModalOpen, setIsInsertColumnModalOpen] = useState(false);
  const [isHideFieldsModalOpen, setIsHideFieldsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(
    columnAccessors[0] || 'job'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('text');
  const [columnsToHide, setColumnsToHide] = useState<string[]>(hiddenColumns);

  const triggerImport = () => fileInputRef.current?.click();

  const handleSort = () => {
    setIsSortModalOpen(true);
  };

  const applySort = () => {
    onSort(selectedColumn, sortDirection);
    console.log(
      `Sort triggered on ${selectedColumn} column (${sortDirection})`
    );
    setIsSortModalOpen(false);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const applyFilter = () => {
    onFilter(selectedColumn, filterValue);
    console.log(
      `Filter triggered on ${selectedColumn} column for "${filterValue}"`
    );
    setIsFilterModalOpen(false);
    setFilterValue('');
  };

  const handleCellView = () => {
    onCellViewToggle();
    console.log('Toggled cell view mode');
  };

  const handleFormatCells = () => {
    setIsFormatModalOpen(true);
  };

  const applyFormat = () => {
    onFormatCells(selectedColumn, selectedFormat);
    console.log(`Applied ${selectedFormat} format to ${selectedColumn} column`);
    setIsFormatModalOpen(false);
  };

  const handleInsertColumn = () => {
    setIsInsertColumnModalOpen(true);
  };

  const applyInsertColumn = () => {
    if (newColumnName) {
      onInsertColumn(newColumnName);
      console.log(`Inserted new column: ${newColumnName}`);
      setNewColumnName('');
      setIsInsertColumnModalOpen(false);
    }
  };

  const handleHideFields = () => {
    setColumnsToHide(hiddenColumns);
    setIsHideFieldsModalOpen(true);
  };

  const applyHideFields = () => {
    onHideFields(columnsToHide);
    console.log(
      `Toggled visibility for columns: ${columnsToHide.join(', ') || 'none'}`
    );
    setIsHideFieldsModalOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-4 h-12 border-b bg-white text-sm text-gray-700 border-gray-200">
      {/* Left Buttons */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsToolbarMenuOpen(!isToolbarMenuOpen)}
            className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
            </svg>
            Tool bar
          </button>
          {isToolbarMenuOpen && (
            <div className="absolute top-8 left-0 bg-white shadow rounded p-2 z-10">
              <button
                onClick={handleFormatCells}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              >
                Format Cells
              </button>
              <button
                onClick={handleInsertColumn}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              >
                Insert Column
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleHideFields}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.94 17.94L6.06 6.06M1 12s4-7 11-7 11 7 11 7-4 7-11 7c-2.14 0-4.09-.55-5.84-1.5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Hide fields
        </button>

        <button
          onClick={handleSort}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h12M3 18h6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Sort
        </button>

        <button
          onClick={handleFilter}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4h16l-6 8v4l-4 4v-8L4 4z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Filter
        </button>

        <button
          onClick={handleCellView}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Cell view
        </button>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={triggerImport}
          className="flex items-center gap-1 border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white rounded hover:bg-gray-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onImport(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        <button
          onClick={onExport}
          className="flex items-center gap-1 border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white rounded hover:bg-gray-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21V9m0 0l-4 4m4-4l4 4M5 3h14"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Export
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1 border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white rounded hover:bg-gray-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4m4-4v16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Share
        </button>

        <button
          onClick={onAddNew}
          className="px-3 py-1 bg-green-700 text-white text-sm rounded hover:bg-green-800 flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" />
          </svg>
          New Action
        </button>
      </div>

      {/* Sort Modal */}
      {isSortModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Sort Options</h3>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              {columns.map((col, index) => (
                <option
                  key={columnAccessors[index]}
                  value={columnAccessors[index]}
                >
                  {col}
                </option>
              ))}
            </select>
            <select
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as 'asc' | 'desc')
              }
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSortModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applySort}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Sort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              {columns.map((col, index) => (
                <option
                  key={columnAccessors[index]}
                  value={columnAccessors[index]}
                >
                  {col}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter filter value"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applyFilter}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Format Cells Modal */}
      {isFormatModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Format Cells</h3>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              {columns.map((col, index) => (
                <option
                  key={columnAccessors[index]}
                  value={columnAccessors[index]}
                >
                  {col}
                </option>
              ))}
            </select>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="currency">Currency</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsFormatModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applyFormat}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Format
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Column Modal */}
      {isInsertColumnModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Insert New Column</h3>
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter column name"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsInsertColumnModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applyInsertColumn}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newColumnName}
              >
                Insert Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hide Fields Modal */}
      {isHideFieldsModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Hide/Show Columns</h3>
            <div className="max-h-64 overflow-y-auto">
              {columns.map((col, index) => (
                <label
                  key={columnAccessors[index]}
                  className="flex items-center gap-2 p-2"
                >
                  <input
                    type="checkbox"
                    checked={!columnsToHide.includes(columnAccessors[index])}
                    onChange={() => {
                      setColumnsToHide((prev) =>
                        prev.includes(columnAccessors[index])
                          ? prev.filter((id) => id !== columnAccessors[index])
                          : [...prev, columnAccessors[index]]
                      );
                    }}
                  />
                  {col}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsHideFieldsModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applyHideFields}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
