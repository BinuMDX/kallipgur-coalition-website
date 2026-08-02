import React from 'react';

type AdminSkeletonProps = {
  variant?: 'text' | 'title' | 'card' | 'avatar';
  className?: string;
  style?: React.CSSProperties;
};

export default function AdminSkeleton({
  variant = 'text',
  className = '',
  style,
}: AdminSkeletonProps) {
  return (
    <div
      className={`admin-skeleton admin-skeleton--${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
