import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-white dark:bg-slate-800/70 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
            {children}
        </div>
    );
};
