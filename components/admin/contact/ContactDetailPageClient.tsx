'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ContactStatusBadge from './ContactStatusBadge';
import AdminButton from '../AdminButton';
import AdminCard from '../AdminCard';
import AdminSpinner from '../AdminSpinner';

type EnquiryDetail = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ContactDetailPageClientProps = {
  id: string;
};

const ALL_STATUSES = [
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ContactDetailPageClient({ id }: ContactDetailPageClientProps) {
  const [data, setData] = useState<EnquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Status change state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fetch Enquiry
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/admin/contact/${id}`);

      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      if (res.status === 401) {
        setError('Unauthorized. Please log in again.');
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to load enquiry.');
      }

      setData(json.data);
      setReplySubject(`Re: ${json.data.subject}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    if (!data || newStatus === data.status || updatingStatus) return;

    setUpdatingStatus(true);
    setStatusFeedback(null);

    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setData(json.data);
        setStatusFeedback({
          type: 'success',
          message: `Status changed to ${newStatus}.`,
        });
      } else {
        setStatusFeedback({
          type: 'error',
          message: json.message || 'Failed to update status.',
        });
      }
    } catch {
      setStatusFeedback({
        type: 'error',
        message: 'Could not update status right now. Please try again.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle reply submit
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || sendingReply) return;

    setSendingReply(true);
    setReplyFeedback(null);

    try {
      const res = await fetch(`/api/admin/contact/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: replySubject.trim(),
          message: replyMessage.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setReplyFeedback({
          type: 'success',
          message: 'Reply sent successfully via Microsoft Graph.',
        });
        setReplyMessage('');
        fetchDetails();
      } else if (json.configured === false) {
        setReplyFeedback({
          type: 'info',
          message:
            'Microsoft Graph email credentials are not configured in environment settings. Please use your standard email client.',
        });
      } else {
        setReplyFeedback({
          type: 'error',
          message: json.message || 'Failed to send reply email.',
        });
      }
    } catch {
      setReplyFeedback({
        type: 'error',
        message: 'Network error sending reply email.',
      });
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div
        className="admin-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
        }}
      >
        <AdminSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: 'var(--admin-text-secondary)' }}>
          Loading enquiry details…
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="admin-fade-in">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/admin/contact" className="admin-btn admin-btn--ghost admin-btn--sm">
            &larr; Back to Contact Enquiries
          </Link>
        </div>
        <div
          className="admin-card"
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}
        >
          <h2 style={{ fontSize: '1.25rem', color: 'var(--admin-text)', marginBottom: '0.5rem' }}>
            Enquiry Not Found
          </h2>
          <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '1.5rem' }}>
            The requested contact enquiry does not exist or has been removed.
          </p>
          <Link href="/admin/contact" className="admin-btn admin-btn--primary">
            View All Enquiries
          </Link>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-fade-in">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/admin/contact" className="admin-btn admin-btn--ghost admin-btn--sm">
            &larr; Back to Contact Enquiries
          </Link>
        </div>
        <div
          role="alert"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--admin-radius)',
            border: '1px solid var(--admin-danger-subtle)',
            background: 'var(--admin-danger-subtle)',
            color: 'var(--admin-danger)',
          }}
        >
          {error || 'Failed to load enquiry.'}
        </div>
      </div>
    );
  }

  const mailtoUrl = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(
    `Re: ${data.subject}`,
  )}`;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link href="/admin/contact" className="admin-btn admin-btn--ghost admin-btn--sm">
          &larr; Back to Enquiries
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={mailtoUrl}
            className="admin-btn admin-btn--secondary admin-btn--sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reply via Mail App
          </a>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => {
              setReplyModalOpen(true);
              setReplyFeedback(null);
            }}
          >
            Reply by Email
          </AdminButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
        <AdminCard style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-gold)' }}>
                Subject
              </span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 500, color: 'var(--admin-text)', margin: '0.2rem 0 0' }}>
                {data.subject}
              </h1>
            </div>
            <ContactStatusBadge status={data.status} />
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
              Message Content
            </span>
            <div
              style={{
                background: 'var(--admin-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius-sm)',
                padding: '1.25rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.9375rem',
                lineHeight: '1.7',
                color: 'var(--admin-text)',
              }}
            >
              {data.message}
            </div>
          </div>
        </AdminCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AdminCard style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', marginBottom: '1rem' }}>
              Status Management
            </h3>

            {statusFeedback && (
              <div
                style={{
                  padding: '0.625rem 0.875rem',
                  marginBottom: '1rem',
                  borderRadius: 'var(--admin-radius-sm)',
                  fontSize: '0.82rem',
                  color: statusFeedback.type === 'success' ? 'var(--admin-success)' : 'var(--admin-danger)',
                }}
              >
                {statusFeedback.message}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="status-select" style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                Update status:
              </label>
              <select
                id="status-select"
                className="admin-input"
                value={data.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </AdminCard>

          <AdminCard style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', marginBottom: '1.25rem' }}>
              Contact Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block' }}>Full Name</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--admin-text)', fontWeight: 500 }}>{data.fullName}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block' }}>Email Address</span>
                <a href={`mailto:${data.email}`} style={{ fontSize: '0.92rem', color: 'var(--admin-gold)' }}>{data.email}</a>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block' }}>Phone Number</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>{data.phone || 'Not provided'}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '0.875rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block' }}>Submitted Date</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)' }}>{formatDate(data.createdAt)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block' }}>Last Updated</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)' }}>{formatDate(data.updatedAt)}</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {replyModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 11, 7, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border-hover)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--admin-text)', margin: 0 }}>
                Reply to {data.fullName}
              </h2>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setReplyModalOpen(false)}
                disabled={sendingReply}
              >
                ✕
              </button>
            </div>

            {replyFeedback && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  borderRadius: 'var(--admin-radius-sm)',
                  fontSize: '0.85rem',
                  color: replyFeedback.type === 'success' ? 'var(--admin-success)' : 'var(--admin-danger)',
                }}
              >
                {replyFeedback.message}
                {replyFeedback.type === 'info' && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <a
                      href={mailtoUrl}
                      className="admin-btn admin-btn--primary admin-btn--sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Email Client Now
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSendReply}>
              <div className="admin-field" style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Recipient Email</label>
                <input type="text" className="admin-input" value={data.email} disabled style={{ opacity: 0.7 }} />
              </div>
              <div className="admin-field" style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Subject</label>
                <input type="text" className="admin-input" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} disabled={sendingReply} required />
              </div>
              <div className="admin-field" style={{ marginBottom: '1.5rem' }}>
                <label className="admin-label">Reply Message</label>
                <textarea className="admin-input" rows={6} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} disabled={sendingReply} placeholder="Type your message…" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <AdminButton variant="ghost" type="button" onClick={() => setReplyModalOpen(false)} disabled={sendingReply}>
                  Cancel
                </AdminButton>
                <AdminButton variant="primary" type="submit" disabled={sendingReply}>
                  {sendingReply ? 'Sending…' : 'Send Email'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
