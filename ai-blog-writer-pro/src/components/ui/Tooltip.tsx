import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  return (
    <div className={`relative flex items-center group ${className}`}>
      {children}
      <div className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-800 p-3 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 dark:bg-slate-900">
        {content}
        <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-slate-800 dark:border-t-slate-900"></div>
      </div>
    </div>
  );
};
