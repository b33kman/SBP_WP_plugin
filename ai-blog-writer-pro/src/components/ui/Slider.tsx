import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider: React.FC<SliderProps> = ({ className = '', ...props }) => {
  const baseClasses = 'w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer';
  const thumbClasses = '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer';
  const mozThumbClasses = '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0';


  return (
    <input
      type="range"
      className={`${baseClasses} ${thumbClasses} ${mozThumbClasses} ${className}`}
      {...props}
    />
  );
};
