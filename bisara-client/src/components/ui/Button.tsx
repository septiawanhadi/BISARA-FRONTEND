import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  let baseStyles = "inline-flex items-center justify-center px-8 py-4 font-extrabold rounded-full transition-all duration-300 active:scale-95 shadow-sm";
  
  if (fullWidth) baseStyles += " w-full";
  
  let variantStyles = "";
  if (variant === 'primary') {
    variantStyles = "bg-bisara-accent hover:bg-opacity-90 text-white shadow-[0_8px_25px_rgba(37,99,255,0.25)] hover:translate-y-[-2px] hover:shadow-[0_12px_30px_rgba(37,99,255,0.35)]";
  } else if (variant === 'secondary') {
    variantStyles = "bg-white border-2 border-bisara-accent text-bisara-accent hover:bg-bisara-bg";
  } else if (variant === 'accent') {
    variantStyles = "bg-bisara-pink hover:bg-opacity-90 text-white shadow-[0_8px_25px_rgba(255,77,157,0.25)] hover:translate-y-[-2px]";
  } else if (variant === 'danger') {
    variantStyles = "bg-red-500 hover:bg-red-600 text-white";
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
