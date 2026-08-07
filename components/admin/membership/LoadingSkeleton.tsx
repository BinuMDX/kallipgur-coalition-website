import React from 'react';
import AdminSkeleton from '../AdminSkeleton';
import AdminSpinner from '../AdminSpinner';

type LoadingSkeletonProps = {
  rows?: number;
};

export default function LoadingSkeleton({ rows = 10 }: LoadingSkeletonProps) {
  return (
    <div className="admin-membership__loading" role="status" aria-label="Loading membership applications">
      {/* Spinner overlay */}
      <div className="admin-membership__loading-spinner">
        <AdminSpinner size="lg" />
      </div>

      {/* Skeleton table */}
      <div className="admin-table-wrapper" aria-hidden="true">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th className="admin-membership__hide-mobile">Phone</th>
              <th className="admin-membership__hide-mobile">Type</th>
              <th className="admin-membership__hide-tablet">Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td><AdminSkeleton variant="text" style={{ width: '6rem' }} /></td>
                <td><AdminSkeleton variant="text" style={{ width: '8rem' }} /></td>
                <td><AdminSkeleton variant="text" style={{ width: '10rem' }} /></td>
                <td className="admin-membership__hide-mobile"><AdminSkeleton variant="text" style={{ width: '7rem' }} /></td>
                <td className="admin-membership__hide-mobile"><AdminSkeleton variant="text" style={{ width: '6rem' }} /></td>
                <td className="admin-membership__hide-tablet"><AdminSkeleton variant="text" style={{ width: '5rem' }} /></td>
                <td><AdminSkeleton variant="text" style={{ width: '5rem' }} /></td>
                <td><AdminSkeleton variant="text" style={{ width: '6rem' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
