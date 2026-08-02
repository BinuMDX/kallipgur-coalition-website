'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const topicOptions = [
    'Community Events',
    'Program Updates',
    'Health & Wellbeing',
    'Youth & Education',
    'Advocacy & Policy',
    'Cultural Programs',
  ];

  const toggleInterest = (topic: string) => {
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firstName.trim()) {
      setStatus('error');
      setFeedback('Please fill in your name and email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }
    setStatus('sending');
    setFeedback('');
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
    setFeedback(`Thank you, ${firstName}! You're now subscribed to the Kallipgur Coalition Newsletter.`);
    setEmail('');
    setFirstName('');
    setInterests([]);
    await new Promise((r) => setTimeout(r, 4000));
    setStatus('idle');
    setFeedback('');
  };

  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="newsletter-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Newsletter</span>
          </nav>
          <h1 id="newsletter-page-heading" className="page-hero-title">
            Stay connected<br />
            <em>to Country &amp; community.</em>
          </h1>
          <p className="page-hero-desc">
            Subscribe to receive community news, program updates, and cultural stories — delivered to your inbox, no more than fortnightly.
          </p>
        </Container>
      </section>

      {/* ===== SUBSCRIBE FORM ===== */}
      <section className="section" aria-labelledby="newsletter-form-heading">
        <Container>
          <div className="contact-page-grid">
            {/* Left — Info */}
            <div data-animate="fade-right">
              <SectionHeading
                id="newsletter-form-heading"
                eyebrow="Our Newsletter"
                heading={
                  <>
                    News &amp; stories<br />
                    <em>worth reading.</em>
                  </>
                }
              />
              <div className="body-text" style={{ marginBottom: '2.5rem' }}>
                <p>
                  The Kallipgur Coalition newsletter is our direct line to community — featuring program highlights, upcoming events, Elders&apos; reflections, advocacy wins, and more.
                </p>
                <p>
                  We respect your privacy. We will never share your information with third parties, and you can unsubscribe at any time.
                </p>
              </div>

              <div className="contact-info-cards">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: 'Frequency',
                    value: 'Fortnightly — never more',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    label: 'Privacy',
                    value: 'We never sell or share your data',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    ),
                    label: 'Unsubscribe',
                    value: 'Cancel at any time, instantly',
                  },
                ].map((item, i) => (
                  <div key={i} className="contact-info-card">
                    <div className="contact-info-icon" aria-hidden="true">{item.icon}</div>
                    <div>
                      <div className="contact-info-label">{item.label}</div>
                      <div className="contact-info-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div data-animate="fade-left">
              <div
                className="form-container"
                style={{
                  background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                }}
              >
                <h2 className="section-heading" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                  Subscribe now
                </h2>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Join hundreds of community members already subscribed.
                </p>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="newsletter-firstname">
                      First Name <span style={{ color: 'var(--clr-accent)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newsletter-firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={status === 'sending'}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="newsletter-email">
                      Email Address <span style={{ color: 'var(--clr-accent)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === 'sending'}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topics of Interest</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {topicOptions.map((topic) => {
                        const selected = interests.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleInterest(topic)}
                            style={{
                              padding: '0.4rem 0.9rem',
                              fontSize: '0.78rem',
                              letterSpacing: '0.05em',
                              border: `1px solid ${selected ? 'var(--clr-gold)' : 'var(--clr-border)'}`,
                              background: selected ? 'rgba(201,150,46,0.12)' : 'transparent',
                              color: selected ? 'var(--clr-gold)' : 'var(--clr-text-muted)',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                            }}
                            disabled={status === 'sending'}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending'
                      ? 'Subscribing…'
                      : status === 'success'
                      ? '✓ Subscribed!'
                      : 'Subscribe'}
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
        </Container>
      </section>

      {/* ===== PAST EDITIONS ===== */}
      <section className="section" style={{ background: 'var(--clr-bg-secondary)' }} aria-labelledby="past-editions-heading">
        <Container>
          <div data-animate="fade-up">
            <SectionHeading
              id="past-editions-heading"
              eyebrow="Past Editions"
              heading={
                <>
                  Read our<br />
                  <em>recent newsletters.</em>
                </>
              }
            />
          </div>
          <div className="programs-grid" data-animate="fade-up" data-delay="100">
            {[
              { month: 'July 2026', headline: 'NAIDOC Week Celebrations & Youth Hub Update', excerpt: 'Highlights from our incredible NAIDOC Week community events, plus an update on the expanded Youth Education Hub.' },
              { month: 'June 2026', headline: 'New Mobile Health Clinic & Language Revival Milestone', excerpt: 'Our new mobile clinic has now visited 12 remote communities, and our language revival program celebrates 50 new speakers.' },
              { month: 'May 2026', headline: 'Elders Gathering Recap & Economic Development News', excerpt: 'Reflecting on the Annual Elders Gathering and announcing new employment partnerships within our community enterprises.' },
            ].map((edition, i) => (
              <Card key={i} as="article" className="program-card">
                <div className="program-tag">{edition.month}</div>
                <h3 className="program-title">{edition.headline}</h3>
                <p className="program-desc">{edition.excerpt}</p>
                <a
                  href="#"
                  className="news-card-link"
                  onClick={(e) => e.preventDefault()}
                  style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}
                >
                  Read Edition <span aria-hidden="true">&rarr;</span>
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
