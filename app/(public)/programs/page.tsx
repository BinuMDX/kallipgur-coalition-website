import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Programs from '@/components/sections/Programs';
import Quote from '@/components/ui/Quote';

export const metadata: Metadata = {
  title: 'Programs | Kallipgur Coalition Aboriginal Corporation',
  description:
    'Explore our community-led programs spanning cultural continuity, health and wellbeing, youth education, economic development, housing, and Elder care.',
};

export default function ProgramsPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="programs-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Programs</span>
          </nav>
          <h1 id="programs-page-heading" className="page-hero-title">
            Programs built<br />
            <em>from the ground up.</em>
          </h1>
          <p className="page-hero-desc">
            Every initiative we run is designed with community members, shaped by Elders, and delivered in a way that respects cultural protocols.
          </p>
        </Container>
      </section>

      {/* ===== PROGRAMS LIST ===== */}
      <Programs />

      {/* ===== APPLY / ENQUIRE CTA ===== */}
      <section className="section" aria-labelledby="programs-cta-heading" style={{ background: 'var(--clr-bg-secondary)' }}>
        <Container>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <SectionHeading
              id="programs-cta-heading"
              eyebrow="Get Involved"
              heading={
                <>
                  Ready to connect<br />
                  <em>with your community?</em>
                </>
              }
            />
            <p className="section-intro" style={{ margin: '0 auto 2.5rem' }}>
              Whether you're looking for support, want to volunteer, or would like to partner with us — we'd love to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button href="/contact" size="lg">Enquire Now</Button>
              <Button href="/donate" variant="outline" size="lg">Support Our Programs</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="quote-section" aria-label="Elder quote">
        <Container>
          <Quote
            animate="fade-up"
            quote="Every program we run is a thread in the fabric of our community — each one strengthening the whole, each one an act of love for those who came before and those yet to come."
            attributionName="Aunty Rosemary Garrawurra"
            attributionTitle="Chairperson, Kallipgur Coalition"
          />
        </Container>
      </section>
    </>
  );
}
