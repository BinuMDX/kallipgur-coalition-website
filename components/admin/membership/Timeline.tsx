'use client';

import React from 'react';

export interface AuditLogItem {
  id: string;
  createdAt: string;
  adminId: string;
  adminName: string;
  action: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  reviewNote?: string | null;
}

type TimelineProps = {
  logs: AuditLogItem[];
  submittedAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  STATUS_CHANGE: 'Status Changed',
  NOTE_ADDED: 'Internal Review Note Added',
  DOCUMENT_UPLOADED: 'Document Uploaded',
  EMAIL_SENT: 'Email Notification Sent',
  APPLICATION_SUBMITTED: 'Application Submitted',
};

const ACTION_COLORS: Record<string, string> = {
  STATUS_CHANGE: 'var(--admin-gold)',
  NOTE_ADDED: 'var(--admin-info)',
  DOCUMENT_UPLOADED: 'var(--admin-success)',
  EMAIL_SENT: 'var(--admin-text-secondary)',
  APPLICATION_SUBMITTED: 'var(--admin-accent)',
};

export default function Timeline({ logs, submittedAt }: TimelineProps) {
  // Synthesize initial submission log if not explicitly recorded in database logs
  const submissionExist = logs.some((l) => l.action === 'APPLICATION_SUBMITTED');
  
  const allLogs = [...logs];
  if (!submissionExist) {
    allLogs.unshift({
      id: 'submission-init',
      createdAt: submittedAt,
      adminId: 'system',
      adminName: 'Applicant',
      action: 'APPLICATION_SUBMITTED',
      reviewNote: 'Membership application submitted online.',
    });
  }

  // Sort logs chronologically (descending to show latest first, or ascending for chronological timeline)
  // Let's sort descending (newest at top) as it's standard for admin dashboards, or ascending.
  // The spec says: "Display a timeline showing... timestamp, administrator, action".
  // Sorting descending is usually more helpful to see recent events first. Let's do descending.
  const sortedLogs = [...allLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="admin-membership__timeline-container">
      <h3 className="admin-card__title" style={{ marginBottom: '1.25rem', display: 'block', fontSize: '1rem' }}>
        History Timeline
      </h3>

      <div className="admin-timeline">
        {sortedLogs.map((log) => {
          const color = ACTION_COLORS[log.action] || 'var(--admin-text-muted)';
          const isStatus = log.action === 'STATUS_CHANGE';

          return (
            <div key={log.id} className="admin-timeline__item">
              {/* Timeline node */}
              <div 
                className="admin-timeline__node" 
                style={{ backgroundColor: color, boxShadow: `0 0 0 4px var(--admin-bg), 0 0 0 5px ${color}30` }} 
                aria-hidden="true" 
              />

              {/* Timeline content */}
              <div className="admin-timeline__content">
                <div className="admin-timeline__meta">
                  <span className="admin-timeline__action">
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                  <span className="admin-timeline__time">{formatTimestamp(log.createdAt)}</span>
                </div>

                <div className="admin-timeline__actor">
                  By: <strong>{log.adminName}</strong>
                </div>

                {isStatus && log.previousStatus && log.newStatus && (
                  <div className="admin-timeline__status-change">
                    <span className="admin-timeline__status-val">{getStatusLabel(log.previousStatus)}</span>
                    <svg className="admin-timeline__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                    <span className="admin-timeline__status-val admin-timeline__status-val--new">{getStatusLabel(log.newStatus)}</span>
                  </div>
                )}

                {log.reviewNote && (
                  <p className="admin-timeline__note">
                    &ldquo;{log.reviewNote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
