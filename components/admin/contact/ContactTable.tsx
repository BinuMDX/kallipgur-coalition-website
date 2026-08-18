'use client';

import React from 'react';
import Link from 'next/link';
import ContactStatusBadge from './ContactStatusBadge';

export type ContactEnquiryRow = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ContactTableProps = {
  data: ContactEnquiryRow[];
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ContactTable({ data }: ContactTableProps) {
  return (
    <div className="admin-table-container">
      <table className="admin-table" aria-label="Contact enquiries list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Subject</th>
            <th scope="col">Submitted</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {/* Name */}
              <td className="admin-table__cell--primary">
                <Link
                  href={`/admin/contact/${row.id}`}
                  className="admin-table__link"
                  style={{ fontWeight: 500 }}
                >
                  {row.fullName}
                </Link>
                {row.phone && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                    {row.phone}
                  </div>
                )}
              </td>

              {/* Email */}
              <td>
                <a
                  href={`mailto:${row.email}`}
                  className="admin-table__link"
                  style={{ fontSize: '0.85rem' }}
                >
                  {row.email}
                </a>
              </td>

              {/* Subject */}
              <td>
                <span
                  style={{
                    display: 'inline-block',
                    maxWidth: '240px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'middle',
                  }}
                  title={row.subject}
                >
                  {row.subject}
                </span>
              </td>

              {/* Submitted Date */}
              <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--admin-text-secondary)' }}>
                {formatDate(row.createdAt)}
              </td>

              {/* Status */}
              <td>
                <ContactStatusBadge status={row.status} />
              </td>

              {/* Actions */}
              <td style={{ textAlign: 'right' }}>
                <Link
                  href={`/admin/contact/${row.id}`}
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  aria-label={`View enquiry from ${row.fullName}`}
                >
                  View
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ marginLeft: '4px' }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
