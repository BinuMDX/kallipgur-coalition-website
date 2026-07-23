'use client';

import React, { useState } from 'react';

export default function ContactCTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setFeedback('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setFeedback('');

    // Simulate 1.8s delay
    await delay(1800);

    setStatus('success');
    setFeedback('Thank you for reaching out. We will be in touch shortly.');
    
    // Reset fields
    setName('');
    setEmail('');
    setSubject('General Enquiry');
    setMessage('');

    // Clear feedback and reset to idle after 3s
    await delay(3000);
    setStatus('idle');
    setFeedback('');
  };

  return (
    <div className="contact-page-grid">
      <div data-animate="fade-right">
        <h2 className="section-heading" style={{ marginBottom: '2rem' }}>Reach out.</h2>
        
        <div className="contact-info-cards">
          <div className="contact-info-card">
            <div className="contact-info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">
                <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a><br />
                <a href="mailto:support@kallipgurcoalition.org.au">support@kallipgurcoalition.org.au</a>
              </div>
            </div>
          </div>
          
          <div className="contact-info-card">
            <div className="contact-info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">
                <a href="tel:+61800000000">(08) 0000 0000</a> (Reception)<br />
                <a href="tel:+61800000001">(08) 0000 0001</a> (Health Clinic)
              </div>
            </div>
          </div>
          
          <div className="contact-info-card">
            <div className="contact-info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <div className="contact-info-label">Address</div>
              <div className="contact-info-value">
                123 Country Road<br />
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
              <strong>9:00am – 5:00pm</strong>
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
          <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)', marginTop: '1rem', fontStyle: 'italic' }}>
            We are closed on public holidays. For after-hours emergency health support, please call 000 or the local hospital.
          </p>
        </div>
      </div>
      
      <div data-animate="fade-left">
        <div
          className="form-container"
          style={{
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <h2 className="section-heading" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Send a message</h2>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Fill out the form below and a member of our team will get back to you within 2 business days.
          </p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span style={{ color: 'var(--clr-accent)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={status === 'sending'}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span style={{ color: 'var(--clr-accent)' }}>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'sending'}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="subject">Enquiry Type</label>
              <select
                className="form-control"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={status === 'sending'}
              >
                <option value="General Enquiry">General Enquiry</option>
                <option value="Program Support">Program Support</option>
                <option value="Health Clinic">Health Clinic</option>
                <option value="Partnership/Sponsorship">Partnership/Sponsorship</option>
                <option value="Media Enquiry">Media Enquiry</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="message">
                Message <span style={{ color: 'var(--clr-accent)' }}>*</span>
              </label>
              <textarea
                className="form-control"
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={status === 'sending'}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={status === 'sending'}
            >
              {status === 'sending'
                ? 'Sending…'
                : status === 'success'
                ? '✓ Message Sent'
                : 'Send Message'}
            </button>

            {feedback && (
              <div
                role="alert"
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  border: `1px solid ${status === 'success' ? 'rgba(201,150,46,0.5)' : 'rgba(168,67,30,0.5)'}`,
                  background: status === 'success' ? 'rgba(201,150,46,0.08)' : 'rgba(168,67,30,0.1)',
                  color: status === 'success' ? '#E7B856' : '#e87d5c',
                }}
              >
                {feedback}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
