import React from 'react';

type AdminSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function AdminSpinner({ size = 'md', className = '' }: AdminSpinnerProps) {
  return (
    <span
      className={`admin-spinner admin-spinner--${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
