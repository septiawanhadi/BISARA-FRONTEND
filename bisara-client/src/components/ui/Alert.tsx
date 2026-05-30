import React from 'react';

interface AlertProps {
  type?: 'hint' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  type = 'hint', 
  children, 
  className = '' 
}) => {
  let styles = "flex gap-4 p-5 rounded-md border-2 border-dashed";
  
  if (type === 'hint') {
    styles += " bg-[#FFFDF5] border-bisara-orange text-bisara-navy";
  } else if (type === 'warning') {
    styles += " bg-red-50 border-red-400 text-red-700";
  } else if (type === 'info') {
    styles += " bg-[#EBF8FF] border-bisara-accent text-bisara-navy";
  }

  return (
    <div className={`${styles} ${className}`}>
      <span className="text-2xl select-none">
        {type === 'hint' && '💡'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && '🔔'}
      </span>
      <div className="text-sm font-semibold leading-relaxed">
        {children}
      </div>
    </div>
  );
};
