'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MembershipFilters from './MembershipFilters';
import MembershipTable, { type MembershipApplicationRow } from './MembershipTable';
import Pagination from './Pagination';
import LoadingSkeleton from './LoadingSkeleton';
import AdminEmptyState from '../AdminEmptyState';

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function MembershipPageClient() {
  // ── State ──────────────────────────────────
  const [data, setData] = useState<MembershipApplicationRow[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Initialize status from URL query param if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlStatus = params.get('status');
      if (urlStatus) {
        setStatus(urlStatus);
      }
    }
  }, []);

  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ── Debounced search ───────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [status, membershipType, sort]);

  // ── Fetch data ─────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', '10');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status) params.set('status', status);
      if (membershipType) params.set('membershipType', membershipType);
      params.set('sort', sort);

      const res = await fetch(`/api/admin/membership?${params.toString()}`);

      if (res.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Failed to load applications.');
      }

      setData(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, membershipType, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handlers ───────────────────────────────
  const handleRefresh = () => fetchData();
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleMembershipTypeChange = (value: string) => {
    setMembershipType(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  // ── Render ─────────────────────────────────
  return (
    <div className="admin-fade-in">
      {/* Page Header */}
      <div className="admin-membership__header">
        <h1 className="admin-membership__title">Membership Applications</h1>
        <p className="admin-membership__subtitle">
          Manage and review membership applications submitted through the website.
        </p>
      </div>

      {/* Filters */}
      <MembershipFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={handleStatusChange}
        membershipType={membershipType}
        onMembershipTypeChange={handleMembershipTypeChange}
        sort={sort}
        onSortChange={handleSortChange}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Error State */}
      {error && (
        <div className="admin-alert admin-alert--error" role="alert" style={{ marginBottom: '1rem' }}>
          <span className="admin-alert__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </span>
          <div className="admin-alert__content">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && <LoadingSkeleton />}

      {/* Data Table */}
      {!loading && !error && data.length > 0 && (
        <>
          <MembershipTable data={data} />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <AdminEmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
          }
          title="No membership applications found"
          description={
            debouncedSearch || status || membershipType
              ? 'Try adjusting your search or filter criteria.'
              : 'Applications submitted through the website will appear here.'
          }
          actionLabel={debouncedSearch || status || membershipType ? 'Clear Filters' : undefined}
          onAction={
            debouncedSearch || status || membershipType
              ? () => {
                  setSearch('');
                  setStatus('');
                  setMembershipType('');
                  setSort('newest');
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
