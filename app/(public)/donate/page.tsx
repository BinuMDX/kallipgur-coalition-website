'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Quote from '@/components/ui/Quote';
import DonationCTA from '@/components/sections/DonationCTA';


export default function DonatePage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="donate-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Donate</span>
          </nav>
          <h1 id="donate-page-heading" className="page-hero-title">
            Invest in<br />
            <em>Country &amp; community.</em>
          </h1>
          <p className="page-hero-desc">
            Your contribution directly funds cultural programs, health services, youth education, and Elder care for Aboriginal community members.
          </p>
        </Container>
      </section>

      {/* ===== IMPACT STATS ===== */}
      <section className="section" style={{ background: 'var(--clr-bg-secondary)' }} aria-labelledby="impact-heading">
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="impact-heading"
              eyebrow="Your Impact"
              heading={
                <>
                  Where your donation<br />
                  <em>goes.</em>
                </>
              }
            />
            <p className="section-intro">
              Every dollar is invested directly into community programs — not overhead. See the real difference your generosity makes.
            </p>
          </div>
          <div className="stats-row" data-animate="fade-up" data-delay="100"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {[
              { stat: '1,200+', label: 'Community members supported' },
              { stat: '15', label: 'Active programs running' },
              { stat: '30+', label: 'Years of community service' },
              { stat: '95%', label: 'Funds go directly to programs' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'var(--clr-gold)', lineHeight: 1, marginBottom: '0.75rem' }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== DONATION FORM ===== */}
      <section className="section" aria-labelledby="donation-form-heading">
        <Container>
          <div className="section-header" data-animate="fade-up" style={{ marginBottom: '3rem' }}>
            <SectionHeading
              id="donation-form-heading"
              eyebrow="Make a Donation"
              heading={
                <>
                  Choose how you<br />
                  <em>want to give.</em>
                </>
              }
            />
          </div>
          <DonationCTA />
        </Container>
      </section>

      {/* ===== TRANSPARENCY ===== */}
      <section className="section" style={{ background: 'var(--clr-bg-secondary)' }} aria-labelledby="transparency-heading">
        <Container>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <SectionHeading
              id="transparency-heading"
              eyebrow="Transparency"
              heading={
                <>
                  We are<br />
                  <em>accountable to community.</em>
                </>
              }
            />
            <p className="section-intro" style={{ margin: '0 auto 1.5rem' }}>
              Kallipgur Coalition Aboriginal Corporation is a registered charity. Donations over $2 are tax-deductible. Our annual report is publicly available and all financials are independently audited.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)', marginBottom: '2.5rem' }}>
              ICN 11895 · Registered 22 June 2026 under the CATSI Act 2006
            </p>
            <a
              href="#"
              className="btn btn-outline"
              onClick={(e) => e.preventDefault()}
            >
              Download Annual Report
            </a>
          </div>
        </Container>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="quote-section" aria-label="Elder reflection">
        <Container>
          <Quote
            animate="fade-up"
            quote="When you give to our community, you are not giving charity — you are investing in a future that belongs to all of us. You are part of the story."
            attributionName="Uncle David Kallipgur"
            attributionTitle="Deputy Chair, Kallipgur Coalition"
          />
        </Container>
      </section>
    </>
  );
}
