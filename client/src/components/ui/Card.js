import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `
    bg-white rounded-xl shadow-sm border border-gray-200
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;