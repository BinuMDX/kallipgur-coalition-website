import React from 'react';
import AdminBadge from '../AdminBadge';

type ContactStatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_MAP: Record<
  string,
  { label: string; variant: 'gold' | 'info' | 'warning' | 'success' | 'muted' }
> = {
  NEW: { label: 'New', variant: 'gold' },
  READ: { label: 'Read', variant: 'info' },
  IN_PROGRESS: { label: 'In Progress', variant: 'warning' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
  ARCHIVED: { label: 'Archived', variant: 'muted' },
};

export default function ContactStatusBadge({
  status,
  className,
}: ContactStatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    label: status,
    variant: 'muted' as const,
  };

  return (
    <AdminBadge variant={config.variant} className={className}>
      {config.label}
    </AdminBadge>
  );
}
