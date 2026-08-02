import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact Us | Kallipgur Coalition Aboriginal Corporation',
  description:
    'Get in touch with the Kallipgur Coalition Aboriginal Corporation. Contact us for program enquiries, health support, partnerships, or general information.',
};

export default function ContactPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="contact-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Contact</span>
          </nav>
          <h1 id="contact-page-heading" className="page-hero-title">
            We&apos;re here.<br />
            <em>Reach out.</em>
          </h1>
          <p className="page-hero-desc">
            Our team is here to answer your questions, connect you with the right program, or explore how we can work together.
          </p>
        </Container>
      </section>

      {/* ===== CONTACT FORM & INFO ===== */}
      <section className="section" aria-labelledby="contact-section-heading">
        <Container>
          <div className="section-header" data-animate="fade-up" style={{ marginBottom: '3.5rem' }}>
            <SectionHeading
              id="contact-section-heading"
              eyebrow="Get in Touch"
              heading={
                <>
                  How can we<br />
                  <em>help you?</em>
                </>
              }
            />
          </div>
          <ContactCTA />
        </Container>
      </section>

      {/* ===== ACKNOWLEDGEMENT ===== */}
      <section
        className="section"
        style={{ background: 'var(--clr-bg-secondary)', borderTop: '1px solid var(--clr-border)' }}
        aria-label="Acknowledgement of Country"
      >
        <Container>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <div
              aria-hidden="true"
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="3" fill="#C9962E" />
                <circle cx="16" cy="16" r="7" stroke="#C9962E" strokeWidth="1" fill="none" opacity="0.6" />
                <circle cx="16" cy="16" r="11" stroke="#C9962E" strokeWidth="0.75" fill="none" opacity="0.35" />
                <circle cx="16" cy="16" r="15" stroke="#C9962E" strokeWidth="0.5" fill="none" opacity="0.2" />
              </svg>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                fontWeight: 300,
                color: 'var(--clr-text-muted)',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              Kallipgur Coalition Aboriginal Corporation acknowledges the Traditional Custodians of the lands on which we live, work, and serve our community. We pay our deepest respects to Elders past, present, and emerging.{' '}
              <strong style={{ color: 'var(--clr-gold)', fontStyle: 'normal', fontWeight: 500 }}>
                Always was, always will be, Aboriginal land.
              </strong>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
