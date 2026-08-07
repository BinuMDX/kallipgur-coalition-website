import React from 'react';
import AdminBadge from '../AdminBadge';

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_MAP: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || { label: status, variant: 'muted' as const };

  return (
    <AdminBadge variant={config.variant} className={className}>
      {config.label}
    </AdminBadge>
  );
}
