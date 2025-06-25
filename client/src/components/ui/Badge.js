import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animate = false,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-700 bg-white',
    'outline-primary': 'border border-primary-300 text-primary-700 bg-white',
    'outline-success': 'border border-green-300 text-green-700 bg-white',
    'outline-warning': 'border border-yellow-300 text-yellow-700 bg-white',
    'outline-danger': 'border border-red-300 text-red-700 bg-white',
    'outline-info': 'border border-blue-300 text-blue-700 bg-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (animate) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={classes}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Mood Badge Component
export const MoodBadge = ({ mood, className = '' }) => {
  const moodConfig = {
    'very-happy': { variant: 'success', emoji: '😄' },
    'happy': { variant: 'success', emoji: '😊' },
    'content': { variant: 'info', emoji: '😌' },
    'neutral': { variant: 'default', emoji: '😐' },
    'slightly-sad': { variant: 'warning', emoji: '😕' },
    'sad': { variant: 'info', emoji: '😢' },
    'very-sad': { variant: 'danger', emoji: '😭' },
    'anxious': { variant: 'warning', emoji: '😰' },
    'stressed': { variant: 'warning', emoji: '😤' },
    'angry': { variant: 'danger', emoji: '😠' },
    'frustrated': { variant: 'danger', emoji: '😤' },
    'excited': { variant: 'primary', emoji: '🤩' },
    'grateful': { variant: 'success', emoji: '🙏' },
    'hopeful': { variant: 'info', emoji: '🌟' },
    'confused': { variant: 'warning', emoji: '😕' },
    'overwhelmed': { variant: 'danger', emoji: '😵' },
  };

  const config = moodConfig[mood] || { variant: 'default', emoji: '😐' };
  const label = mood.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-1">{config.emoji}</span>
      {label}
    </Badge>
  );
};

// Distortion Badge Component
export const DistortionBadge = ({ type, confidence, className = '' }) => {
  const getVariant = (confidence) => {
    if (confidence >= 0.8) return 'danger';
    if (confidence >= 0.6) return 'warning';
    return 'info';
  };

  const label = type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Badge variant={getVariant(confidence)} className={className}>
      {label} ({confidencePercent}%)
    </Badge>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
    processing: { variant: 'info', label: 'Processing' },
    draft: { variant: 'default', label: 'Draft' },
    published: { variant: 'success', label: 'Published' },
    archived: { variant: 'default', label: 'Archived' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

// Notification Badge Component
export const NotificationBadge = ({ count, max = 99, className = '' }) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge 
      variant="danger" 
      size="sm" 
      className={`absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center ${className}`}
      animate
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;