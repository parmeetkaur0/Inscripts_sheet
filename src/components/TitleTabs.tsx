import type { FC } from 'react';

interface TitleTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TitleTabs: FC<TitleTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === tab
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TitleTabs;
