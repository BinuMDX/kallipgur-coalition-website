'use client';

import React from 'react';
import StatusBadge from './StatusBadge';
import AdminButton from '../AdminButton';
import { MEMBERSHIP_TYPES } from '@/lib/constants/membership';

export type MembershipApplicationRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  status: string;
  createdAt: string;
};

type MembershipTableProps = {
  data: MembershipApplicationRow[];
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatMembershipType(value: string): string {
  const found = MEMBERSHIP_TYPES.find((t) => t.value === value);
  return found ? found.label : value.replace(/_/g, ' ');
}

function truncateId(id: string): string {
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export default function MembershipTable({ data }: MembershipTableProps) {
  return (
    <>
      {/* Desktop/Tablet Table */}
      <div className="admin-table-wrapper admin-membership__table-desktop">
        <table className="admin-table" role="table" aria-label="Membership applications">
          <thead>
            <tr>
              <th scope="col">Application ID</th>
              <th scope="col">Applicant Name</th>
              <th scope="col">Email</th>
              <th scope="col" className="admin-membership__hide-mobile">Phone</th>
              <th scope="col" className="admin-membership__hide-mobile">Type</th>
              <th scope="col" className="admin-membership__hide-tablet">Submitted</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id}>
                <td>
                  <span className="admin-membership__id" title={app.id}>
                    {truncateId(app.id)}
                  </span>
                </td>
                <td>
                  <span className="admin-membership__name">
                    {app.firstName} {app.lastName}
                  </span>
                </td>
                <td>
                  <span className="admin-membership__email">{app.email}</span>
                </td>
                <td className="admin-membership__hide-mobile">
                  <span className="admin-membership__phone">{app.phone}</span>
                </td>
                <td className="admin-membership__hide-mobile">
                  <span className="admin-membership__type">
                    {formatMembershipType(app.membershipType)}
                  </span>
                </td>
                <td className="admin-membership__hide-tablet">
                  <span className="admin-membership__date">{formatDate(app.createdAt)}</span>
                </td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td>
                  <div className="admin-membership__actions">
                    <AdminButton variant="ghost" size="sm" aria-label={`View application ${truncateId(app.id)}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View
                    </AdminButton>
                    <AdminButton variant="ghost" size="sm" aria-label={`Review application ${truncateId(app.id)}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Review
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled
                      aria-label="More actions (coming soon)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="admin-membership__cards-mobile" role="list" aria-label="Membership applications">
        {data.map((app) => (
          <div key={app.id} className="admin-membership__card" role="listitem">
            <div className="admin-membership__card-header">
              <div>
                <span className="admin-membership__card-name">
                  {app.firstName} {app.lastName}
                </span>
                <span className="admin-membership__card-id" title={app.id}>
                  {truncateId(app.id)}
                </span>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="admin-membership__card-details">
              <div className="admin-membership__card-row">
                <span className="admin-membership__card-label">Email</span>
                <span className="admin-membership__card-value">{app.email}</span>
              </div>
              <div className="admin-membership__card-row">
                <span className="admin-membership__card-label">Phone</span>
                <span className="admin-membership__card-value">{app.phone}</span>
              </div>
              <div className="admin-membership__card-row">
                <span className="admin-membership__card-label">Type</span>
                <span className="admin-membership__card-value">
                  {formatMembershipType(app.membershipType)}
                </span>
              </div>
              <div className="admin-membership__card-row">
                <span className="admin-membership__card-label">Submitted</span>
                <span className="admin-membership__card-value">{formatDate(app.createdAt)}</span>
              </div>
            </div>

            <div className="admin-membership__card-actions">
              <AdminButton variant="ghost" size="sm" aria-label={`View application ${truncateId(app.id)}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                View
              </AdminButton>
              <AdminButton variant="ghost" size="sm" aria-label={`Review application ${truncateId(app.id)}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Review
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
