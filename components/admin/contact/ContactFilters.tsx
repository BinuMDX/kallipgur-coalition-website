'use client';

import React from 'react';
import AdminButton from '../AdminButton';

type ContactFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

export default function ContactFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onRefresh,
  loading = false,
}: ContactFiltersProps) {
  return (
    <div
      className="admin-membership__filters"
      role="search"
      aria-label="Filter contact enquiries"
    >
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
          id="contact-search"
          className="admin-input admin-membership__search-input"
          placeholder="Search by name, email, subject, message…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search contact enquiries"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="admin-membership__filter-group">
        <select
          id="contact-status-filter"
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
          id="contact-sort"
          className="admin-input admin-membership__select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort enquiries"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Refresh Action */}
      <div className="admin-membership__filter-actions">
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh enquiry list"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </AdminButton>
      </div>
    </div>
  );
}
