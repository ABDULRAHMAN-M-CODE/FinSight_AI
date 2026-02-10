import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'danger';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  variant = 'default',
  className = '', 
  ...props 
}) => {
  const variantStyles = {
    default: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'text-red-500 hover:text-red-700 hover:bg-red-50',
  };

  return (
    <button
      type="button"
      className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
