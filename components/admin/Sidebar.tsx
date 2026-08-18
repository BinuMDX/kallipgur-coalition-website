'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminBadge from './AdminBadge';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Membership',
    href: '/admin/membership',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  {
    name: 'Contact Enquiries',
    href: '/admin/contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

const placeholderItems: NavItem[] = [
  {
    name: 'Donations',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    disabled: true,
  },
  {
    name: 'Settings',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    disabled: true,
  },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  if (item.disabled) {
    return (
      <span
        className="admin-nav-item"
        style={{ opacity: 0.4, cursor: 'not-allowed' }}
        aria-disabled="true"
      >
        <span className="admin-nav-item__icon">{item.icon}</span>
        {item.name}
        <span className="admin-nav-item__badge">
          <AdminBadge variant="muted">Soon</AdminBadge>
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="admin-nav-item__icon">{item.icon}</span>
      {item.name}
      {item.badge && (
        <span className="admin-nav-item__badge">
          <AdminBadge variant="gold">{item.badge}</AdminBadge>
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`admin-overlay${isOpen ? ' admin-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`admin-sidebar${isOpen ? ' admin-sidebar--open' : ''}`}
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <Link href="/admin/dashboard" className="admin-sidebar__brand" onClick={onClose}>
          <div className="admin-sidebar__logo" aria-hidden="true" />
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">Kallipgur Coalition</span>
            <span className="admin-sidebar__brand-sub">Administration</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="admin-sidebar__nav" aria-label="Admin menu">
          <div className="admin-sidebar__section-label">Main</div>
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} pathname={pathname} />
          ))}

          <div className="admin-sidebar__section-label" style={{ marginTop: '0.5rem' }}>
            Modules
          </div>
          {placeholderItems.map((item) => (
            <NavLink key={item.name} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-nav-item"
            onClick={onLogout}
            style={{ width: '100%', color: 'var(--admin-danger)' }}
          >
            <span className="admin-nav-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
