'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ContactSummaryCards, { type ContactStats } from './ContactSummaryCards';
import ContactFilters from './ContactFilters';
import ContactTable, { type ContactEnquiryRow } from './ContactTable';
import Pagination from '../membership/Pagination';
import LoadingSkeleton from '../membership/LoadingSkeleton';
import AdminEmptyState from '../AdminEmptyState';

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function ContactPageClient() {
  const [data, setData] = useState<ContactEnquiryRow[]>([]);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    new: 0,
    read: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, sort]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', '10');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status) params.set('status', status);
      params.set('sort', sort);

      const res = await fetch(`/api/admin/contact?${params.toString()}`);

      if (res.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Failed to load contact enquiries.');
      }

      setData(json.data);
      setPagination(json.pagination);
      if (json.stats) {
        setStats(json.stats);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => fetchData();
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div className="admin-membership__header">
        <h1 className="admin-membership__title">Contact Enquiries</h1>
        <p className="admin-membership__subtitle">
          View and manage enquiries submitted through the website.
        </p>
      </div>

      {/* Real summary cards */}
      <ContactSummaryCards stats={stats} loading={loading} />

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--admin-radius-sm)',
            border: '1px solid var(--admin-danger-subtle)',
            background: 'var(--admin-danger-subtle)',
            color: 'var(--admin-danger)',
          }}
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <ContactFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Content / Skeleton / Empty state */}
      {loading ? (
        <LoadingSkeleton />
      ) : data.length === 0 ? (
        <AdminEmptyState
          icon={
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
          title="No contact enquiries found."
          description={
            search || status
              ? 'Try adjusting your search criteria or filter options.'
              : 'New enquiries submitted through the contact page will appear here.'
          }
          actionLabel={search || status ? 'Clear Filters' : undefined}
          onAction={
            search || status
              ? () => {
                  setSearch('');
                  setStatus('');
                }
              : undefined
          }
        />
      ) : (
        <>
          <ContactTable data={data} />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
