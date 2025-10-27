import React from 'react';
import { cn } from '../utils/common';
import { APP_CONFIG } from '../config';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const { from, to, hover } = APP_CONFIG.brand.colors.primary;
    
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: `bg-gradient-to-r from-[${from}] to-[${to}] hover:from-[${hover.from}] hover:to-[${hover.to}] text-white shadow-sm`,
      secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm',
      outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-full',
      md: 'px-4 py-2 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'opacity-70 cursor-wait',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin mr-2">⏳</span>
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);