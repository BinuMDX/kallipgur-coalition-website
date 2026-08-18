import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Gallery from '@/components/sections/Gallery';

export const metadata: Metadata = {
  title: 'Gallery | Kallipgur Coalition Aboriginal Corporation',
  description:
    'Browse photos and stories from Kallipgur Coalition community events, cultural programs, youth initiatives, and life on Country.',
};

export default function GalleryPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="gallery-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/gallery_1.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Gallery</span>
          </nav>
          <h1 id="gallery-page-heading" className="page-hero-title">
            Life on Country,<br />
            <em>captured in community.</em>
          </h1>
          <p className="page-hero-desc">
            A visual record of our community gatherings, cultural programs, youth initiatives, and the living landscape that grounds us.
          </p>
        </Container>
      </section>

      {/* ===== GALLERY GRID ===== */}
      <section className="section" aria-labelledby="gallery-section-heading">
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="gallery-section-heading"
              eyebrow="Community Gallery"
              heading={
                <>
                  Moments that<br />
                  <em>matter.</em>
                </>
              }
            />
            <p className="section-intro">
              Filter by category to explore community events, youth programs, cultural arts, and Country.
            </p>
          </div>
          <Gallery />
        </Container>
      </section>
    </>
  );
}
