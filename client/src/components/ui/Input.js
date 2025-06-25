import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error 
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500' 
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;