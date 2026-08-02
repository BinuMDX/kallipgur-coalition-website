import React from 'react';
import AdminButton from './AdminButton';

type AdminEmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function AdminEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: AdminEmptyStateProps) {
  return (
    <div className={`admin-empty ${className}`}>
      {icon && <div className="admin-empty__icon">{icon}</div>}
      <h3 className="admin-empty__title">{title}</h3>
      {description && <p className="admin-empty__desc">{description}</p>}
      {actionLabel && onAction && (
        <AdminButton variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </AdminButton>
      )}
    </div>
  );
}
