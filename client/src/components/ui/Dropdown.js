import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1
              ${alignmentClasses[align]}
            `}
            style={{ minWidth: '160px' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  selected = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2
        ${disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }
        ${selected ? 'bg-primary-50 text-primary-700' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{children}</span>
      {selected && <Check className="h-4 w-4 text-primary-600" />}
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="border-t border-gray-200 my-1" />;
};

export const DropdownHeader = ({ children }) => {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </div>
  );
};

// Select Dropdown Component
export const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <Dropdown
      disabled={disabled}
      className={className}
      trigger={
        <div
          className={`
            w-full px-3 py-2 border rounded-lg bg-white text-left flex items-center justify-between
            transition-colors cursor-pointer
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      }
    >
      {options.map((option) => (
        <DropdownItem
          key={option.value}
          onClick={() => {
            onChange(option.value);
            setIsOpen(false);
          }}
          selected={option.value === value}
          disabled={option.disabled}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default Dropdown;