import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TABS } from '../constants';
import { TabId } from '../types';
import TabNavigation from './TabNavigation';
import ContentGenerationTab from './tabs/ContentGenerationTab';
import SEOAnalysisTab from './tabs/SEOAnalysisTab';
import KeywordsTab from './tabs/KeywordsTab';
import SummaryTab from './tabs/SummaryTab';
import { Icon } from './ui/Icon';
import HelpModal from './HelpModal';

interface AIBlogWriterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  postContent: string;
  onAcceptContent: (content: string) => void;
}

const AIBlogWriterSidebar: React.FC<AIBlogWriterSidebarProps> = ({ isOpen, onClose, postContent, onAcceptContent }) => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.CONTENT);
  const [width, setWidth] = useState(450);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 400 && newWidth <= 800) {
      setWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  const renderActiveTab = () => {
    switch (activeTab) {
      case TabId.CONTENT:
        return <ContentGenerationTab onAcceptContent={onAcceptContent} />;
      case TabId.SEO:
        return <SEOAnalysisTab postContent={postContent} />;
      case TabId.KEYWORDS:
        return <KeywordsTab />;
      case TabId.SUMMARY:
          return <SummaryTab postContent={postContent} />;
      default:
        return null;
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width: `${width}px` }}
        className={`fixed top-0 right-0 h-full bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-[99998] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div 
          onMouseDown={handleMouseDown}
          className="absolute top-0 left-0 w-2 h-full cursor-col-resize z-50 group"
        >
          <div className="w-0.5 h-full bg-transparent group-hover:bg-blue-400 transition-colors duration-200 mx-auto"></div>
        </div>
        
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
              <Icon name="sparkles" className="w-6 h-6 text-blue-500"/>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Blog Writer Pro</h2>
              <button onClick={() => setIsHelpModalOpen(true)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-2">Help?</button>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400">
            <Icon name="x" className="w-5 h-5"/>
          </button>
        </header>

        <nav className="p-2 border-b border-slate-200 dark:border-slate-700">
          <TabNavigation tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />
        </nav>

        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveTab()}
        </div>
      </aside>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};

export default AIBlogWriterSidebar;
