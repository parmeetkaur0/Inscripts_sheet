import type { FC } from 'react';
import { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';

interface TopBarProps {
  onSearch: (searchTerm: string) => void;
}

const TopBar: FC<TopBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div
      className="w-full h-14 flex justify-between items-center px-4 border-b"
      style={{
        boxSizing: 'border-box',
        background: '#FFFFFF',
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
        <span className="text-gray-500 ml-2">Workspace</span>
        <span className="mx-1">{'>'}</span>
        <span className="text-gray-500">Folder 2</span>
        <span className="mx-1">{'>'}</span>
        <span className="font-semibold text-black">Spreadsheet 3</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm relative">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search within sheet"
            className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Bell size={18} className="text-gray-500 cursor-pointer" />
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/30?img=3"
            alt="avatar"
            className="w-7 h-7 rounded-full"
          />
          <div className="text-sm text-gray-700 hidden md:block">
            <span>John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
