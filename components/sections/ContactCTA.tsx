'use client';

import React, { useState, useRef, useId } from 'react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface FormFields {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FIELDS: FormFields = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const MAX_MESSAGE_LENGTH = 3000;

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function validateFields(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fields.fullName.trim().length > 200) {
    errors.fullName = 'Full name must be 200 characters or less.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  } else if (fields.email.trim().length > 254) {
    errors.email = 'Email address is too long.';
  }

  if (fields.phone.trim()) {
    if (!/^[\d\s+\-().]+$/.test(fields.phone.trim())) {
      errors.phone = 'Please enter a valid phone number.';
    } else if (fields.phone.trim().length > 20) {
      errors.phone = 'Phone number is too long.';
    }
  }

  if (!fields.subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (fields.subject.trim().length > 200) {
    errors.subject = 'Subject must be 200 characters or less.';
  }

  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
  } else if (fields.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (fields.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`;
  }

  return errors;
}

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <span id={id} className="contact-field-error" role="alert" aria-live="polite">
      {message}
    </span>
  );
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function ContactCTA() {
  const uid = useId();
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [apiError, setApiError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const id = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-err`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the field error on change
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateFields(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus first errored field
      const firstError = Object.keys(errors)[0] as keyof FieldErrors;
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`);
      el?.focus();
      return;
    }

    setStatus('submitting');
    setFieldErrors({});
    setApiError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fields.fullName.trim(),
          email: fields.email.trim(),
          phone: fields.phone.trim() || undefined,
          subject: fields.subject.trim(),
          message: fields.message.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus('success');
      } else if (res.status === 400 && json.errors) {
        // Server returned field-level validation errors
        setFieldErrors(json.errors as FieldErrors);
        setStatus('idle');
      } else {
        setApiError(
          json.message ||
            "We couldn't submit your enquiry right now. Please try again later.",
        );
        setStatus('error');
      }
    } catch {
      setApiError(
        "We couldn't submit your enquiry right now. Please try again later.",
      );
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFields(INITIAL_FIELDS);
    setFieldErrors({});
    setApiError('');
    setStatus('idle');
  };

  const isSubmitting = status === 'submitting';

  // ── Success state ─────────────────────────────
  if (status === 'success') {
    return (
      <div className="contact-page-grid">
        {/* Contact info column — preserved in success state */}
        <ContactInfoColumn />

        {/* Success panel */}
        <div data-animate="fade-left">
          <div className="contact-success-panel" role="status" aria-live="polite">
            <div className="contact-success-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="var(--clr-gold)" strokeWidth="1.5" />
                <path
                  d="M10 16.5l4.5 4.5 7.5-9"
                  stroke="var(--clr-gold)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="contact-success-heading">Enquiry Received</h2>
            <p className="contact-success-message">
              Thank you for contacting Kallipgur Coalition Aboriginal Corporation.
              Your enquiry has been received.
            </p>
            <p className="contact-success-sub">
              A member of our team will be in touch within 2 business days.
            </p>
            <button
              type="button"
              className="btn btn-outline contact-success-btn"
              onClick={handleReset}
            >
              Send another enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ────────────────────────────────
  return (
    <div className="contact-page-grid">
      <ContactInfoColumn />

      <div data-animate="fade-left">
        <div
          className="form-container"
          style={{
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <h2
            className="section-heading"
            style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}
          >
            Send a message
          </h2>
          <p
            style={{
              color: 'var(--clr-text-muted)',
              fontSize: '0.9rem',
              marginBottom: '2rem',
            }}
          >
            Fill out the form below and a member of our team will get back to
            you within 2 business days.
          </p>

          {/* Form-level error */}
          {status === 'error' && apiError && (
            <div className="contact-form-alert" role="alert" aria-live="assertive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '1px' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Contact enquiry form"
          >
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor={id('fullName')}>
                Full Name{' '}
                <span style={{ color: 'var(--clr-accent)' }} aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                className={`form-control${fieldErrors.fullName ? ' form-control--error' : ''}`}
                id={id('fullName')}
                name="fullName"
                value={fields.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="name"
                aria-required="true"
                aria-describedby={fieldErrors.fullName ? errId('fullName') : undefined}
                aria-invalid={!!fieldErrors.fullName}
                maxLength={200}
              />
              {fieldErrors.fullName && (
                <FieldError id={errId('fullName')} message={fieldErrors.fullName} />
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor={id('email')}>
                Email Address{' '}
                <span style={{ color: 'var(--clr-accent)' }} aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="email"
                className={`form-control${fieldErrors.email ? ' form-control--error' : ''}`}
                id={id('email')}
                name="email"
                value={fields.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="email"
                aria-required="true"
                aria-describedby={fieldErrors.email ? errId('email') : undefined}
                aria-invalid={!!fieldErrors.email}
                maxLength={254}
              />
              {fieldErrors.email && (
                <FieldError id={errId('email')} message={fieldErrors.email} />
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor={id('phone')}>
                Phone Number{' '}
                <span
                  style={{ color: 'var(--clr-text-dim)', fontSize: '0.78rem', fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                className={`form-control${fieldErrors.phone ? ' form-control--error' : ''}`}
                id={id('phone')}
                name="phone"
                value={fields.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="tel"
                aria-describedby={fieldErrors.phone ? errId('phone') : undefined}
                aria-invalid={!!fieldErrors.phone}
                maxLength={20}
                placeholder="+61 4XX XXX XXX"
              />
              {fieldErrors.phone && (
                <FieldError id={errId('phone')} message={fieldErrors.phone} />
              )}
            </div>

            {/* Subject */}
            <div className="form-group">
              <label className="form-label" htmlFor={id('subject')}>
                Subject{' '}
                <span style={{ color: 'var(--clr-accent)' }} aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                className={`form-control${fieldErrors.subject ? ' form-control--error' : ''}`}
                id={id('subject')}
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                aria-required="true"
                aria-describedby={fieldErrors.subject ? errId('subject') : undefined}
                aria-invalid={!!fieldErrors.subject}
                maxLength={200}
                placeholder="e.g. General Enquiry, Program Support, Health Clinic…"
              />
              {fieldErrors.subject && (
                <FieldError id={errId('subject')} message={fieldErrors.subject} />
              )}
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label" htmlFor={id('message')}>
                Message{' '}
                <span style={{ color: 'var(--clr-accent)' }} aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                className={`form-control${fieldErrors.message ? ' form-control--error' : ''}`}
                id={id('message')}
                name="message"
                rows={6}
                value={fields.message}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                aria-required="true"
                aria-describedby={
                  fieldErrors.message
                    ? errId('message')
                    : `${uid}-message-count`
                }
                aria-invalid={!!fieldErrors.message}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div className="contact-message-footer">
                {fieldErrors.message ? (
                  <FieldError id={errId('message')} message={fieldErrors.message} />
                ) : (
                  <span id={`${uid}-message-count`} className="contact-char-count">
                    {MAX_MESSAGE_LENGTH - fields.message.length} characters remaining
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              id="contact-submit-btn"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="contact-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                'Send Enquiry'
              )}
            </button>

            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: 'var(--clr-text-dim)',
                textAlign: 'center',
              }}
            >
              Fields marked{' '}
              <span style={{ color: 'var(--clr-accent)' }}>*</span> are required.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Contact Info Column (extracted for reuse in success state)
// ──────────────────────────────────────────────

function ContactInfoColumn() {
  return (
    <div data-animate="fade-right">
      <h2 className="section-heading" style={{ marginBottom: '2rem' }}>
        Reach out.
      </h2>

      <div className="contact-info-cards">
        <div className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--clr-gold)"
              strokeWidth="1.5"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <div className="contact-info-label">Email</div>
            <div className="contact-info-value">
              <a href="mailto:info@kallipgurcoalition.org.au">
                info@kallipgurcoalition.org.au
              </a>
              <br />
              <a href="mailto:support@kallipgurcoalition.org.au">
                support@kallipgurcoalition.org.au
              </a>
            </div>
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--clr-gold)"
              strokeWidth="1.5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <div className="contact-info-label">Phone</div>
            <div className="contact-info-value">
              <a href="tel:+61800000000">(08) 0000 0000</a> (Reception)
              <br />
              <a href="tel:+61800000001">(08) 0000 0001</a> (Health Clinic)
            </div>
          </div>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--clr-gold)"
              strokeWidth="1.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <div className="contact-info-label">Address</div>
            <div className="contact-info-value">
              123 Country Road
              <br />
              Country Australia, WA 6000
            </div>
          </div>
        </div>
      </div>

      <div className="contact-hours">
        <h3 className="contact-hours-title">Opening Hours</h3>
        <div className="hours-list">
          <div className="hours-row">
            <span>Monday – Friday</span>
            <strong>9:00am – 5:00pm AWST</strong>
          </div>
          <div className="hours-row">
            <span>Saturday</span>
            <strong>Closed</strong>
          </div>
          <div className="hours-row">
            <span>Sunday</span>
            <strong>Closed</strong>
          </div>
        </div>
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--clr-text-dim)',
            marginTop: '1rem',
            fontStyle: 'italic',
          }}
        >
          We are closed on public holidays. For after-hours emergency health
          support, please call 000 or the local hospital.
        </p>
      </div>
    </div>
  );
}
