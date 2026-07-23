'use client';

import React from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import News from '../../components/sections/News';



export default function NewsPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="news-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>News &amp; Updates</span>
          </nav>
          <h1 id="news-page-heading" className="page-hero-title">
            Stories from<br />
            <em>our community.</em>
          </h1>
          <p className="page-hero-desc">
            The latest news, milestones, and announcements from across our programs and community partnerships.
          </p>
        </Container>
      </section>

      {/* ===== NEWS ARTICLES ===== */}
      <section className="section" aria-labelledby="news-section-heading">
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="news-section-heading"
              eyebrow="Latest Updates"
              heading={
                <>
                  What&apos;s happening<br />
                  <em>in our community.</em>
                </>
              }
            />
          </div>
          <News />
        </Container>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section" style={{ background: 'var(--clr-bg-secondary)' }} aria-labelledby="categories-heading">
        <Container>
          <div data-animate="fade-up">
            <SectionHeading
              id="categories-heading"
              eyebrow="By Topic"
              heading={
                <>
                  Browse by<br />
                  <em>category.</em>
                </>
              }
            />
          </div>
          <div className="about-cards" data-animate="fade-up" data-delay="100">
            {[
              { label: 'Community Events', desc: 'Gatherings, celebrations, and cultural events that bring our community together.' },
              { label: 'Program Updates', desc: 'News from across our health, education, housing, and cultural programs.' },
              { label: 'Advocacy', desc: 'Our voice in policy, land rights, and self-determination at local and national level.' },
              { label: 'Health &amp; Wellbeing', desc: 'Updates from our community-controlled health services and mobile clinic.' },
              { label: 'Youth &amp; Education', desc: 'Stories of achievement and opportunity from our young community members.' },
              { label: 'Media Releases', desc: 'Official statements and media releases from the Kallipgur Coalition.' },
            ].map((cat, i) => (
              <Card key={i} as="article" className="value-card">
                <h3 className="value-title" dangerouslySetInnerHTML={{ __html: cat.label }} />
                <p className="value-desc">{cat.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="section" aria-label="Newsletter signup call to action">
        <Container>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <SectionHeading
              eyebrow="Stay Connected"
              heading={
                <>
                  Never miss<br />
                  <em>a story.</em>
                </>
              }
            />
            <p className="section-intro" style={{ margin: '0 auto 2.5rem' }}>
              Subscribe to our newsletter for updates delivered direct to your inbox — no more than once a fortnight.
            </p>
            <Button href="/newsletter" size="lg">Subscribe to Newsletter</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
