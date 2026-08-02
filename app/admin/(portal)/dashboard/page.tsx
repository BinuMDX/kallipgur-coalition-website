import AdminCard from '@/components/admin/AdminCard';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminButton from '@/components/admin/AdminButton';
import { auth } from '@/lib/auth/auth';

export const metadata = {
  title: 'Dashboard | Kallipgur Admin',
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || 'Administrator';
  const userRole = (session?.user as any)?.role || 'ADMIN';

  // Date formatting
  const currentDate = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="admin-fade-in">
      {/* Welcome Greeting Header */}
      <div className="admin-dashboard__welcome">
        <h1 className="admin-dashboard__greeting">
          Welcome back, {userName}
        </h1>
        <div className="admin-dashboard__meta">
          <AdminBadge variant={userRole === 'SUPER_ADMIN' ? 'gold' : 'muted'}>
            {userRole.replace('_', ' ')}
          </AdminBadge>
          <span className="admin-dashboard__date" aria-label="Current date">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="admin-dashboard__actions">
        <AdminButton variant="secondary" size="sm" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add News Article
        </AdminButton>
        <AdminButton variant="secondary" size="sm" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Gallery Photo
        </AdminButton>
        <AdminButton variant="ghost" size="sm" disabled>
          View System Logs
        </AdminButton>
      </div>

      {/* Module Placeholder Grid */}
      <div className="admin-dashboard__cards">
        {/* Membership Applications Card */}
        <AdminCard
          interactive
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          }

        />

        {/* News Management Card */}
        <AdminCard
          interactive
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
              <line x1="10" y1="6" x2="18" y2="6" />
              <line x1="10" y1="10" x2="18" y2="10" />
            </svg>
          }
          title="News Articles"
          metric="--"
          subtitle="Published articles on website"
          footer={
            <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
              Module locked
            </span>
          }
        />

        {/* Gallery Card */}
        <AdminCard
          interactive
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          }
          title="Gallery Items"
          metric="--"
          subtitle="Total community media assets"
          footer={
            <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
              Module locked
            </span>
          }
        />

        {/* Donations Card */}
        <AdminCard
          interactive
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
          title="Donations"
          metric="--"
          subtitle="Charitable support overview"
          footer={
            <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
              Module locked
            </span>
          }
        />
      </div>
    </div>
  );
}
