'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

type AdminPortalShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
};

export default function AdminPortalShell({ children, user }: AdminPortalShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Mapping paths to titles
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/membership')) return 'Membership Applications';
    return 'Dashboard';
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Navbar */}
        <TopNavbar
          title={getPageTitle(pathname)}
          userName={user.name || 'Admin'}
          userRole={user.role || 'ADMIN'}
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content Area */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
