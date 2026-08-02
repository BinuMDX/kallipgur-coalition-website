'use client';

import React from 'react';
import Link from 'next/link';
import AdminBadge from './AdminBadge';

type TopNavbarProps = {
  title: string;
  userName: string;
  userRole: string;
  onMenuToggle: () => void;
  onLogout: () => void;
};

export default function TopNavbar({
  title,
  userName,
  userRole,
  onMenuToggle,
  onLogout,
}: TopNavbarProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate badge type based on role
  const getRoleBadgeVariant = (role: string) => {
    if (role === 'SUPER_ADMIN') return 'gold';
    return 'muted';
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="admin-topbar__toggle"
          aria-label="Toggle sidebar menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Breadcrumb / Title */}
        <div className="admin-topbar__breadcrumb" aria-label="Breadcrumb">
          <Link href="/admin/dashboard">Admin</Link>
          <span aria-hidden="true" style={{ fontSize: '0.65rem' }}>&rsaquo;</span>
          <span className="admin-topbar__breadcrumb-current">{title}</span>
        </div>
      </div>

      <div className="admin-topbar__right">
        {/* Search Placeholder */}
        <div className="admin-topbar__search">
          <svg
            className="admin-topbar__search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search applications..."
            className="admin-topbar__search-input"
            aria-label="Search"
            disabled
          />
        </div>

        {/* Notification Bell Placeholder */}
        <button
          type="button"
          className="admin-topbar__icon-btn"
          aria-label="View notifications"
          disabled
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="admin-topbar__notification-dot" />
        </button>

        <div className="admin-topbar__divider" aria-hidden="true" />

        {/* Profile Card */}
        <div className="admin-topbar__profile">
          <div className="admin-topbar__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="admin-topbar__profile-info">
            <div className="admin-topbar__profile-name">{userName}</div>
            <div className="admin-topbar__profile-role">
              <AdminBadge variant={getRoleBadgeVariant(userRole)} className="mt-0.5" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                {userRole.replace('_', ' ')}
              </AdminBadge>
            </div>
          </div>
        </div>

        <div className="admin-topbar__divider" aria-hidden="true" />

        {/* Quick Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="admin-topbar__icon-btn"
          style={{ color: 'var(--admin-danger)' }}
          aria-label="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
