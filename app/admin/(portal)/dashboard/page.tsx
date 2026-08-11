import AdminCard from '@/components/admin/AdminCard';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminButton from '@/components/admin/AdminButton';
import AdminAlert from '@/components/admin/AdminAlert';
import StatusBadge from '@/components/admin/membership/StatusBadge';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MEMBERSHIP_TYPES } from '@/lib/constants/membership';

export const metadata = {
  title: 'Dashboard | Kallipgur Admin',
};

// Custom date formatter for "11 Aug 2026" Australian format
function formatDateShort(date: Date): string {
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatMembershipType(value: string): string {
  const found = MEMBERSHIP_TYPES.find((t) => t.value === value);
  return found ? found.label : value.replace(/_/g, ' ');
}

export default async function AdminDashboardPage() {
  const session = await auth();

  // Route guard fallback
  if (!session?.user) {
    redirect('/admin/login');
  }

  const userName = session.user.name || 'Administrator';
  const userRole = (session.user as any).role || 'ADMIN';

  // Current Date Greeting format
  const currentDate = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Data variables
  let totalCount = 0;
  let pendingCount = 0;
  let underReviewCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;
  let countThisMonth = 0;
  let countThisYear = 0;
  let recentApplications: any[] = [];
  let months: { label: string; year: number; month: number; count: number }[] = [];
  let maxMonthCount = 0;
  let errorState = false;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const sixMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Optimized parallel data fetching
    const [
      dbTotalCount,
      statusGroups,
      dbCountThisMonth,
      dbCountThisYear,
      dbRecentApplications,
      monthlyTrendData,
    ] = await Promise.all([
      // Total count
      prisma.membershipApplication.count(),

      // Group by status for counts
      prisma.membershipApplication.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),

      // Count this month
      prisma.membershipApplication.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      // Count this year
      prisma.membershipApplication.count({
        where: {
          createdAt: {
            gte: startOfYear,
          },
        },
      }),

      // Recent 5 applications
      prisma.membershipApplication.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          membershipType: true,
          createdAt: true,
          status: true,
        },
      }),

      // Last 6 months applications (dates only)
      prisma.membershipApplication.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgoStart,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    totalCount = dbTotalCount;
    countThisMonth = dbCountThisMonth;
    countThisYear = dbCountThisYear;
    recentApplications = dbRecentApplications;

    // Distribute status counts
    statusGroups.forEach((group) => {
      const count = group._count.id;
      if (group.status === 'PENDING') pendingCount = count;
      else if (group.status === 'UNDER_REVIEW') underReviewCount = count;
      else if (group.status === 'APPROVED') approvedCount = count;
      else if (group.status === 'REJECTED') rejectedCount = count;
    });

    // Populate last 6 months list dynamically
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('en-AU', { month: 'long' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        count: 0,
      });
    }

    // Map database counts into months
    monthlyTrendData.forEach((app) => {
      const appDate = new Date(app.createdAt);
      const appYear = appDate.getFullYear();
      const appMonth = appDate.getMonth();

      const target = months.find((m) => m.year === appYear && m.month === appMonth);
      if (target) {
        target.count++;
      }
    });

    maxMonthCount = Math.max(...months.map((m) => m.count), 0);
  } catch (error) {
    console.error('[AdminDashboardPage] Database fetch failed:', error);
    errorState = true;
  }

  return (
    <div className="admin-fade-in">
      {/* Welcome Greeting Header */}
      <div className="admin-dashboard__welcome">
        <h1 className="admin-dashboard__greeting">Welcome back, {userName}</h1>
        <div className="admin-dashboard__meta">
          <AdminBadge variant={userRole === 'SUPER_ADMIN' ? 'gold' : 'muted'}>
            {userRole.replace('_', ' ')}
          </AdminBadge>
          <span className="admin-dashboard__date" aria-label="Current date">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Error State Banner */}
      {errorState && (
        <div style={{ marginBottom: '2rem' }}>
          <AdminAlert variant="error">
            <strong>Database Query Failure:</strong> We were unable to fetch real-time dashboard data. Please reload the page or contact the system administrator if the issue persists.
          </AdminAlert>
        </div>
      )}

      {/* Pending Review Alert */}
      {!errorState && (
        <div style={{ marginBottom: '2rem' }}>
          {pendingCount > 0 ? (
            <AdminAlert variant="warning">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span>You have {pendingCount} membership application{pendingCount === 1 ? '' : 's'} awaiting review.</span>
                <Link href="/admin/membership?status=PENDING" passHref legacyBehavior>
                  <AdminButton variant="secondary" size="sm">
                    Review Applications
                  </AdminButton>
                </Link>
              </div>
            </AdminAlert>
          ) : (
            <AdminAlert variant="info">
              <span>No applications are currently awaiting review.</span>
            </AdminAlert>
          )}
        </div>
      )}

      {/* Quick Actions Row */}
      <div className="admin-dashboard__actions">
        <Link href="/admin/membership" passHref legacyBehavior>
          <AdminButton variant="primary" size="sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            View Membership Applications
          </AdminButton>
        </Link>

        <Link href="/admin/membership?status=PENDING" passHref legacyBehavior>
          <AdminButton variant="secondary" size="sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Review Pending Applications
          </AdminButton>
        </Link>

        <AdminButton variant="secondary" size="sm" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create News Article
        </AdminButton>

        <AdminButton variant="secondary" size="sm" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Gallery Photo
        </AdminButton>
      </div>

      {/* Summary Statistics Grid */}
      <div className="admin-dashboard__cards">
        {/* Total Applications */}
        <AdminCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
          title="Total Applications"
          metric={errorState ? '--' : String(totalCount)}
          subtitle="All submitted applications"
        />

        {/* Pending Applications */}
        <AdminCard
          className="admin-card--warning"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
          title="Pending Applications"
          metric={errorState ? '--' : String(pendingCount)}
          subtitle="Require administrative review"
        />

        {/* Under Review */}
        <AdminCard
          className="admin-card--info"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <path d="M11 8a3 3 0 0 0-3 3" />
            </svg>
          }
          title="Under Review"
          metric={errorState ? '--' : String(underReviewCount)}
          subtitle="Currently being audited"
        />

        {/* Approved */}
        <AdminCard
          className="admin-card--success"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          title="Approved"
          metric={errorState ? '--' : String(approvedCount)}
          subtitle="Accepted members"
        />

        {/* Rejected */}
        <AdminCard
          className="admin-card--danger"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          title="Rejected"
          metric={errorState ? '--' : String(rejectedCount)}
          subtitle="Declined applications"
        />

        {/* Applications This Month */}
        <AdminCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          title="This Month"
          metric={errorState ? '--' : String(countThisMonth)}
          subtitle="Submitted this month"
        />

        {/* Applications This Year */}
        <AdminCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          title="This Year"
          metric={errorState ? '--' : String(countThisYear)}
          subtitle="Submitted this calendar year"
        />
      </div>

      {/* Analytics Charts Grid */}
      {!errorState && (
        <div className="admin-dashboard__charts-grid">
          {/* Status Overview Chart */}
          <div className="status-overview">
            <h2 className="status-overview__title">Application Status Breakdown</h2>
            <div className="status-overview__bar-container">
              {totalCount === 0 ? (
                <div className="status-overview__bar status-overview__bar--empty" style={{ width: '100%' }} />
              ) : (
                <>
                  {pendingCount > 0 && (
                    <div
                      className="status-overview__bar status-overview__bar--pending"
                      style={{ width: `${(pendingCount / totalCount) * 100}%` }}
                      title={`Pending: ${pendingCount}`}
                    />
                  )}
                  {underReviewCount > 0 && (
                    <div
                      className="status-overview__bar status-overview__bar--under-review"
                      style={{ width: `${(underReviewCount / totalCount) * 100}%` }}
                      title={`Under Review: ${underReviewCount}`}
                    />
                  )}
                  {approvedCount > 0 && (
                    <div
                      className="status-overview__bar status-overview__bar--approved"
                      style={{ width: `${(approvedCount / totalCount) * 100}%` }}
                      title={`Approved: ${approvedCount}`}
                    />
                  )}
                  {rejectedCount > 0 && (
                    <div
                      className="status-overview__bar status-overview__bar--rejected"
                      style={{ width: `${(rejectedCount / totalCount) * 100}%` }}
                      title={`Rejected: ${rejectedCount}`}
                    />
                  )}
                </>
              )}
            </div>

            <div className="status-overview__legend">
              <div className="status-overview__legend-item">
                <span className="status-overview__dot status-overview__dot--pending" />
                <span className="status-overview__label">Pending</span>
                <span className="status-overview__value">
                  {pendingCount} ({totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}%)
                </span>
              </div>
              <div className="status-overview__legend-item">
                <span className="status-overview__dot status-overview__dot--under-review" />
                <span className="status-overview__label">Under Review</span>
                <span className="status-overview__value">
                  {underReviewCount} ({totalCount > 0 ? Math.round((underReviewCount / totalCount) * 100) : 0}%)
                </span>
              </div>
              <div className="status-overview__legend-item">
                <span className="status-overview__dot status-overview__dot--approved" />
                <span className="status-overview__label">Approved</span>
                <span className="status-overview__value">
                  {approvedCount} ({totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%)
                </span>
              </div>
              <div className="status-overview__legend-item">
                <span className="status-overview__dot status-overview__dot--rejected" />
                <span className="status-overview__label">Rejected</span>
                <span className="status-overview__value">
                  {rejectedCount} ({totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Applications Over Time Trend Chart */}
          <div className="trend-chart">
            <h2 className="trend-chart__title">Applications Over Time (Last 6 Months)</h2>
            <div className="trend-chart__bars">
              {months.map((m, idx) => {
                const pct = maxMonthCount > 0 ? (m.count / maxMonthCount) * 100 : 0;
                // For zero-count months render no bar at all; for others ensure minimum 4% so thin bars remain visible
                const barHeight = m.count === 0 ? '0px' : `${Math.max(pct, 4)}%`;
                return (
                  <div key={idx} className="trend-chart__col">
                    <div className="trend-chart__bar-wrapper">
                      <span className="trend-chart__count">{m.count > 0 ? m.count : ''}</span>
                      <div
                        className="trend-chart__bar"
                        style={{ height: barHeight }}
                        title={`${m.label}: ${m.count} application${m.count !== 1 ? 's' : ''}`}
                      />
                    </div>
                    <div className="trend-chart__label">
                      <span className="trend-chart__label-long">{m.label}</span>
                      <span className="trend-chart__label-short">{m.label.substring(0, 3)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Membership Applications Section */}
      {!errorState && (
        <div className="recent-applications">
          <div className="recent-applications__header">
            <h2 className="recent-applications__title">Recent Membership Applications</h2>
            <Link href="/admin/membership" className="recent-applications__link">
              View all applications &rarr;
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table" role="table" aria-label="Recent membership applications">
              <thead>
                <tr>
                  <th scope="col">Applicant</th>
                  <th scope="col">Membership Type</th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                      No applications are currently registered in the system.
                    </td>
                  </tr>
                ) : (
                  recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 500, color: 'var(--admin-text)' }}>
                        {app.firstName} {app.lastName}
                      </td>
                      <td>{formatMembershipType(app.membershipType)}</td>
                      <td>{formatDateShort(app.createdAt)}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`/admin/membership/${app.id}`} passHref legacyBehavior>
                          <AdminButton variant="ghost" size="sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </AdminButton>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
