import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => {
  const baseClasses = 'w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white';

  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};
