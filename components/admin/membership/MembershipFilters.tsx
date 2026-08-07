'use client';

import React from 'react';
import AdminButton from '../AdminButton';
import { MEMBERSHIP_TYPES } from '@/lib/constants/membership';

type MembershipFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  membershipType: string;
  onMembershipTypeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

export default function MembershipFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  membershipType,
  onMembershipTypeChange,
  sort,
  onSortChange,
  onRefresh,
  loading = false,
}: MembershipFiltersProps) {
  return (
    <div className="admin-membership__filters" role="search" aria-label="Filter membership applications">
      {/* Search */}
      <div className="admin-membership__search-wrapper">
        <svg
          className="admin-membership__search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          id="membership-search"
          className="admin-input admin-membership__search-input"
          placeholder="Search by name, email, phone, ID…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search membership applications"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="admin-membership__filter-group">
        <select
          id="membership-status-filter"
          className="admin-input admin-membership__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          id="membership-type-filter"
          className="admin-input admin-membership__select"
          value={membershipType}
          onChange={(e) => onMembershipTypeChange(e.target.value)}
          aria-label="Filter by membership type"
        >
          <option value="">All Types</option>
          {MEMBERSHIP_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          id="membership-sort"
          className="admin-input admin-membership__select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort applications"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action buttons */}
      <div className="admin-membership__filter-actions">
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh applications list"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </AdminButton>

        <AdminButton
          variant="ghost"
          size="sm"
          disabled
          aria-label="Export applications (coming soon)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </AdminButton>
      </div>
    </div>
  );
}
