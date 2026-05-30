import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  hoverEffect = true, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "bg-white border-1.5 border-slate-100 rounded-lg p-8 shadow-md transition-all duration-300";
  const hoverStyles = hoverEffect ? "hover:translate-y-[-5px] hover:shadow-lg hover:border-bisara-accent" : "";
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
