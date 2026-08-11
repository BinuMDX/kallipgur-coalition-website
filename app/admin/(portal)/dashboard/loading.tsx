import React from 'react';
import AdminSkeleton from '@/components/admin/AdminSkeleton';

export default function DashboardLoading() {
  return (
    <div className="admin-fade-in">
      {/* Welcome Greeting Header Skeleton */}
      <div className="admin-dashboard__welcome" style={{ marginBottom: '2rem' }}>
        <AdminSkeleton variant="title" style={{ width: '280px', height: '2.25rem', marginBottom: '0.5rem' }} />
        <AdminSkeleton variant="text" style={{ width: '180px', height: '1.25rem' }} />
      </div>

      {/* Alert Skeleton */}
      <div style={{ marginBottom: '2rem' }}>
        <AdminSkeleton variant="card" style={{ height: '4rem' }} />
      </div>

      {/* Quick Actions Row Skeleton */}
      <div className="admin-dashboard__actions" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <AdminSkeleton variant="text" style={{ width: '180px', height: '2.5rem', borderRadius: '6px' }} />
        <AdminSkeleton variant="text" style={{ width: '180px', height: '2.5rem', borderRadius: '6px' }} />
        <AdminSkeleton variant="text" style={{ width: '140px', height: '2.5rem', borderRadius: '6px' }} />
        <AdminSkeleton variant="text" style={{ width: '140px', height: '2.5rem', borderRadius: '6px' }} />
      </div>

      {/* Statistic Cards Grid Skeleton */}
      <div className="admin-dashboard__cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {Array.from({ length: 7 }).map((_, idx) => (
          <AdminSkeleton key={idx} variant="card" style={{ height: '8.5rem' }} />
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="admin-dashboard__charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <AdminSkeleton variant="card" style={{ height: '320px' }} />
        <AdminSkeleton variant="card" style={{ height: '320px' }} />
      </div>

      {/* Recent Applications Section Skeleton */}
      <div className="recent-applications" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <AdminSkeleton variant="title" style={{ width: '220px', height: '1.5rem' }} />
          <AdminSkeleton variant="text" style={{ width: '120px', height: '1rem' }} />
        </div>
        <AdminSkeleton variant="card" style={{ height: '250px' }} />
      </div>
    </div>
  );
}
