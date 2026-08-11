'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminButton from '../AdminButton';
import AdminCard from '../AdminCard';
import StatusBadge from './StatusBadge';
import DocumentViewer, { type MembershipDocument } from './DocumentViewer';
import Timeline, { type AuditLogItem } from './Timeline';
import NotesPanel, { type NoteItem } from './NotesPanel';
import AdminSpinner from '../AdminSpinner';
import { MEMBERSHIP_TYPES } from '@/lib/constants/membership';

type ApplicationDetails = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  preferredContactMethod?: string | null;
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  membershipType: string;
  traditionalCountry?: string | null;
  aboriginalOrTorresStraitIslander: string;
  occupation?: string | null;
  reasonForJoining?: string | null;
  skillsAndExperience?: string | null;
  areasOfInterest: string[];
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;
  status: string;
  documents: MembershipDocument[];
  notes: NoteItem[];
  auditLogs: AuditLogItem[];
};

type MembershipDetailPageClientProps = {
  applicationId: string;
};

export default function MembershipDetailPageClient({
  applicationId,
}: MembershipDetailPageClientProps) {
  const router = useRouter();
  const [data, setData] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Status Action Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetStatus: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | null;
  }>({
    isOpen: false,
    targetStatus: null,
  });
  const [reviewNote, setReviewNote] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Fetch Function ────────────────────────
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/admin/membership/${applicationId}`);

      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      if (res.status === 401) {
        setError('Unauthorized access. Please log in again.');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to load application details.');
      }

      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // ── Handlers ──────────────────────────────
  const handleOpenModal = (targetStatus: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED') => {
    setModalState({ isOpen: true, targetStatus });
    setReviewNote('');
    setActionError(null);
  };

  const handleCloseModal = () => {
    if (actionSubmitting) return;
    setModalState({ isOpen: false, targetStatus: null });
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalState.targetStatus) return;

    setActionSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/membership/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: modalState.targetStatus,
          reviewNote: reviewNote,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to update application status.');
      }

      // Close modal and reload content
      setModalState({ isOpen: false, targetStatus: null });
      fetchDetails();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'An error occurred during submission.');
    } finally {
      setActionSubmitting(false);
    }
  };

  // ── Render Helpers ────────────────────────
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatGender = (val: string) => {
    return val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatMembershipType = (value: string) => {
    const found = MEMBERSHIP_TYPES.find((t) => t.value === value);
    return found ? found.label : value.replace(/_/g, ' ');
  };

  // ── Render loading, error, notFound states 
  if (notFound) {
    return (
      <div className="admin-fade-in" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
        <h1 className="admin-membership__title">Application Not Found</h1>
        <p className="admin-membership__subtitle" style={{ marginBottom: '1.5rem' }}>
          The membership application with ID <code style={{ color: 'var(--admin-gold)' }}>{applicationId}</code> does not exist or has been deleted.
        </p>
        <Link href="/admin/membership">
          <AdminButton variant="secondary">Back to Applications List</AdminButton>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-fade-in" style={{ padding: '2rem 1.5rem' }}>
        <div className="admin-alert admin-alert--error" role="alert" style={{ marginBottom: '1.5rem' }}>
          <span className="admin-alert__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </span>
          <div className="admin-alert__content">{error}</div>
        </div>
        <Link href="/admin/membership">
          <AdminButton variant="secondary">Back to Applications List</AdminButton>
        </Link>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="admin-membership__loading-container" style={{ padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AdminSpinner size="lg" />
        <p className="admin-membership__subtitle" style={{ marginTop: '1rem' }}>Loading applicant details…</p>
      </div>
    );
  }

  return (
    <div className="admin-fade-in admin-membership__details-page">
      {/* Breadcrumb */}
      <nav className="admin-topbar__breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/dashboard">Dashboard</Link>
        <span aria-hidden="true" style={{ fontSize: '0.65rem' }}>&rsaquo;</span>
        <Link href="/admin/membership">Membership Applications</Link>
        <span aria-hidden="true" style={{ fontSize: '0.65rem' }}>&rsaquo;</span>
        <span className="admin-topbar__breadcrumb-current">Application Details</span>
      </nav>

      {/* Header Profile Title and Quick Actions */}
      <div className="admin-membership__details-header">
        <div>
          <h1 className="admin-membership__title">
            {data.firstName} {data.lastName}
          </h1>
          <p className="admin-membership__subtitle">
            ID: <span style={{ fontFamily: 'monospace', color: 'var(--admin-gold)' }}>{data.id}</span> • Submitted {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="admin-membership__header-actions">
          {data.status !== 'APPROVED' && (
            <AdminButton 
              variant="primary" 
              size="sm" 
              onClick={() => handleOpenModal('APPROVED')}
            >
              Approve
            </AdminButton>
          )}
          {data.status !== 'REJECTED' && (
            <AdminButton 
              variant="danger" 
              size="sm" 
              onClick={() => handleOpenModal('REJECTED')}
            >
              Reject
            </AdminButton>
          )}
          {data.status === 'PENDING' && (
            <AdminButton 
              variant="secondary" 
              size="sm" 
              onClick={() => handleOpenModal('UNDER_REVIEW')}
            >
              Mark Under Review
            </AdminButton>
          )}
          <Link href="/admin/membership">
            <AdminButton variant="ghost" size="sm">Back</AdminButton>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Current Status:</span>
        <StatusBadge status={data.status} />
      </div>

      {/* Main Two-Column Layout */}
      <div className="admin-membership__details-grid">
        {/* Main Details Panels Column */}
        <div className="admin-membership__details-main">
          {/* Section 1: Personal Info */}
          <AdminCard className="admin-membership__info-card">
            <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', display: 'block' }}>
              Personal Information
            </h3>
            <div className="admin-membership__info-table">
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">First Name</span>
                <span className="admin-membership__info-value">{data.firstName}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Last Name</span>
                <span className="admin-membership__info-value">{data.lastName}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Date of Birth</span>
                <span className="admin-membership__info-value">{formatDate(data.dateOfBirth)}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Gender</span>
                <span className="admin-membership__info-value">{formatGender(data.gender)}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Indigenous Status</span>
                <span className="admin-membership__info-value">
                  {data.aboriginalOrTorresStraitIslander === 'YES' ? 'Aboriginal or Torres Strait Islander' : 'No'}
                </span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Traditional Country</span>
                <span className="admin-membership__info-value">{data.traditionalCountry || 'Not provided'}</span>
              </div>
            </div>
          </AdminCard>

          {/* Section 2: Contact Info */}
          <AdminCard className="admin-membership__info-card" style={{ marginTop: '1.5rem' }}>
            <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', display: 'block' }}>
              Contact Information
            </h3>
            <div className="admin-membership__info-table">
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Email Address</span>
                <span className="admin-membership__info-value">
                  <a href={`mailto:${data.email}`} className="admin-card__link">{data.email}</a>
                </span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Phone Number</span>
                <span className="admin-membership__info-value">
                  <a href={`tel:${data.phone}`} className="admin-card__link">{data.phone}</a>
                </span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Preferred Contact</span>
                <span className="admin-membership__info-value">
                  {data.preferredContactMethod ? data.preferredContactMethod.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : 'Not specified'}
                </span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Street Address</span>
                <span className="admin-membership__info-value">{data.streetAddress}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Suburb / Town</span>
                <span className="admin-membership__info-value">{data.suburb}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">State</span>
                <span className="admin-membership__info-value">{data.state}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Postcode</span>
                <span className="admin-membership__info-value">{data.postcode}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Country</span>
                <span className="admin-membership__info-value">{data.country.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              </div>
            </div>
          </AdminCard>

          {/* Section 3: Membership Info */}
          <AdminCard className="admin-membership__info-card" style={{ marginTop: '1.5rem' }}>
            <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', display: 'block' }}>
              Membership Information
            </h3>
            <div className="admin-membership__info-table">
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Membership Type</span>
                <span className="admin-membership__info-value" style={{ fontWeight: 600, color: 'var(--admin-gold)' }}>
                  {formatMembershipType(data.membershipType)}
                </span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Occupation</span>
                <span className="admin-membership__info-value">{data.occupation || 'Not provided'}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <span className="admin-membership__info-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Reason for Joining</span>
              <p className="admin-membership__card-value" style={{ textAlign: 'left', whiteSpace: 'pre-wrap', color: 'var(--admin-text-secondary)' }}>
                {data.reasonForJoining || 'No response provided.'}
              </p>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <span className="admin-membership__info-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Skills & Experience</span>
              <p className="admin-membership__card-value" style={{ textAlign: 'left', whiteSpace: 'pre-wrap', color: 'var(--admin-text-secondary)' }}>
                {data.skillsAndExperience || 'No response provided.'}
              </p>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <span className="admin-membership__info-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Areas of Interest</span>
              {data.areasOfInterest && data.areasOfInterest.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {data.areasOfInterest.map((interest, index) => (
                    <span key={index} className="admin-badge admin-badge--muted" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="admin-membership__card-value" style={{ textAlign: 'left', color: 'var(--admin-text-muted)' }}>None specified.</p>
              )}
            </div>
          </AdminCard>

          {/* Section 4: Emergency Contact */}
          <AdminCard className="admin-membership__info-card" style={{ marginTop: '1.5rem' }}>
            <h3 className="admin-card__title" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', display: 'block' }}>
              Emergency Contact
            </h3>
            <div className="admin-membership__info-table">
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Contact Name</span>
                <span className="admin-membership__info-value">{data.emergencyContactName || 'Not provided'}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Relationship</span>
                <span className="admin-membership__info-value">{data.emergencyContactRelationship || 'Not provided'}</span>
              </div>
              <div className="admin-membership__info-row">
                <span className="admin-membership__info-label">Phone Number</span>
                <span className="admin-membership__info-value">
                  {data.emergencyContactPhone ? (
                    <a href={`tel:${data.emergencyContactPhone}`} className="admin-card__link">{data.emergencyContactPhone}</a>
                  ) : (
                    'Not provided'
                  )}
                </span>
              </div>
            </div>
          </AdminCard>

          {/* Documents Section */}
          <AdminCard className="admin-membership__info-card" style={{ marginTop: '1.5rem' }}>
            <DocumentViewer documents={data.documents} />
          </AdminCard>
        </div>

        {/* Sidebar Notes & Timeline Column */}
        <div className="admin-membership__details-sidebar">
          {/* Notes Panel */}
          <AdminCard className="admin-membership__sidebar-card">
            <NotesPanel 
              applicationId={data.id} 
              notes={data.notes} 
              onNoteAdded={fetchDetails} 
            />
          </AdminCard>

          {/* History Timeline */}
          <AdminCard className="admin-membership__sidebar-card" style={{ marginTop: '1.5rem' }}>
            <Timeline logs={data.auditLogs} submittedAt={data.createdAt} />
          </AdminCard>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalState.isOpen && modalState.targetStatus && (
        <div 
          className="admin-lightbox" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
          onClick={handleCloseModal}
        >
          <div 
            className="admin-login__card admin-membership__modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'admin-fade-in 0.25s var(--admin-ease)' }}
          >
            <h2 id="modal-title" className="admin-login__title" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
              Confirm {modalState.targetStatus.replace('_', ' ').toLowerCase()} status change
            </h2>
            <p className="admin-membership__subtitle" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              Are you sure you want to change this applicant&apos;s status to <strong>{modalState.targetStatus.replace('_', ' ')}</strong>? This will automatically trigger a branding email notification to the applicant.
            </p>

            <form onSubmit={handleConfirmAction}>
              <div className="admin-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="review-note-input" className="admin-label">
                  Review Notes (Optional)
                </label>
                <textarea
                  id="review-note-input"
                  className="admin-input"
                  placeholder="Explain why you are changing the status (added to logs and optionally included in the email notification)…"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={4}
                  disabled={actionSubmitting}
                />
              </div>

              {actionError && (
                <div className="admin-alert admin-alert--error" role="alert" style={{ marginBottom: '1rem' }}>
                  <span className="admin-alert__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </span>
                  <div className="admin-alert__content">{actionError}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <AdminButton 
                  type="button" 
                  variant="ghost" 
                  onClick={handleCloseModal}
                  disabled={actionSubmitting}
                >
                  Cancel
                </AdminButton>
                <AdminButton 
                  type="submit" 
                  variant={modalState.targetStatus === 'REJECTED' ? 'danger' : 'primary'}
                  loading={actionSubmitting}
                >
                  Confirm Changes
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
