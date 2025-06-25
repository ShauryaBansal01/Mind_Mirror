import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  as: Component,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  // If as prop is passed (e.g. Link), render as that component with button-like UI
  if (Component) {
    return (
      <motion.div
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={classes}
        style={{ display: 'inline-flex' }}
      >
        <Component
          className="flex items-center justify-center w-full h-full"
          onClick={onClick}
          disabled={disabled || loading}
          {...props}
        >
          {loading && (
            <LoadingSpinner 
              size="sm" 
              color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'gray'} 
            />
          )}
          {loading && <span className="ml-2">Loading...</span>}
          {!loading && children}
        </Component>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'gray'} 
        />
      )}
      {loading && <span className="ml-2">Loading...</span>}
      {!loading && children}
    </motion.button>
  );
};

export default Button;