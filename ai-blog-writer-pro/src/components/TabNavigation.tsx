import React from 'react';
import { Tab, TabId } from '../types';
import { Icon } from './ui/Icon';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabClick: (tabId: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="flex items-center justify-around bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-blue-500 ${
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Icon name={tab.icon} className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
