import React from 'react';

type AdminBadgeProps = {
  variant?: 'gold' | 'success' | 'danger' | 'warning' | 'info' | 'muted';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdminBadge({
  variant = 'gold',
  children,
  className = '',
  style,
}: AdminBadgeProps) {
  return (
    <span className={`admin-badge admin-badge--${variant} ${className}`} style={style}>
      {children}
    </span>
  );
}
