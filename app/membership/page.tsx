import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import MembershipForm from '../../components/forms/MembershipForm';
import MembershipFAQ from './MembershipFAQ';

export const metadata: Metadata = {
  title: 'Membership | Kallipgur Coalition Aboriginal Corporation',
  description:
    'Apply to become a member of Kallipgur Coalition Aboriginal Corporation. Join our community and help strengthen culture, wellbeing, and self-determination.',
};

const overviewCards = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#C9962E" strokeWidth="1" fill="rgba(201, 150, 46, 0.06)" />
        <path d="M18 10v4m0 0v4m0-4h4m-4 0h-4" stroke="#C9962E" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="24" r="2" fill="#C9962E" opacity="0.5" />
      </svg>
    ),
    title: 'Why Become a Member?',
    description:
      'Membership connects you directly with a community dedicated to preserving and strengthening Aboriginal culture. Be part of a coalition that prioritises self-determination, cultural integrity, and collective empowerment.',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#C9962E" strokeWidth="1" fill="rgba(201, 150, 46, 0.06)" />
        <circle cx="18" cy="14" r="5" stroke="#C9962E" strokeWidth="1.5" fill="none" />
        <path d="M10 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#C9962E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Who Can Apply?',
    description:
      'Membership is open to Aboriginal and Torres Strait Islander people, as well as supporters and allies committed to our mission. All applications are reviewed by our Membership Committee.',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#C9962E" strokeWidth="1" fill="rgba(201, 150, 46, 0.06)" />
        <path d="M13 18l3 3 7-7" stroke="#C9962E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Membership Benefits',
    description:
      'Members receive voting rights at General Meetings, access to community programs and events, priority for skills workshops, and a direct voice in the future direction of the Corporation.',
  },
];

const processSteps = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    title: 'Submit Application',
    description: 'Complete and submit the membership application form below with your details and supporting documents.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 8v6l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Review',
    description: 'Our team reviews your application and may contact you for additional information or to schedule a yarn.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14a8 8 0 1116 0 8 8 0 01-16 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 3v3m0 16v3m11-11h-3M6 14H3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    title: 'Committee Decision',
    description: 'The Membership Committee considers your application in alignment with our Constitution and values.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l2.5 6.5H24l-6 4.5 2.5 7L14 18l-6.5 4 2.5-7-6-4.5h7.5L14 4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    title: 'Welcome',
    description: 'Once approved, you receive your welcome pack, member credentials, and an invitation to your first community event.',
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero page-hero--membership" aria-labelledby="membership-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>Membership</span>
          </nav>
          <h1 id="membership-page-heading" className="page-hero-title">
            Become a <em>Member.</em>
          </h1>
          <p className="page-hero-desc">
            Join Kallipgur Coalition Aboriginal Corporation and help strengthen our community, culture, and future.
          </p>
          <div className="membership-hero-actions">
            <Button href="#membership-form" size="lg" id="hero-apply-now">
              Apply Now
            </Button>
            <Button href="#membership-overview" variant="ghost" size="lg" id="hero-learn-membership">
              Learn About Membership
            </Button>
          </div>
        </Container>
      </section>

      {/* ===== MEMBERSHIP OVERVIEW ===== */}
      <section className="section" id="membership-overview" aria-labelledby="overview-heading" style={{ background: 'var(--clr-bg-secondary)' }}>
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="overview-heading"
              eyebrow="Membership"
              heading={
                <>
                  Strengthening community,
                  <br />
                  <em>together.</em>
                </>
              }
            />
            <p className="section-intro">
              Becoming a member means more than joining an organisation — it means becoming part of a movement for cultural strength, community wellbeing, and self-determination.
            </p>
          </div>
          <div className="membership-overview-grid" data-animate="fade-up" data-delay="100">
            {overviewCards.map((card) => (
              <article key={card.title} className="membership-info-card">
                <div className="membership-info-icon" aria-hidden="true">
                  {card.icon}
                </div>
                <h3 className="membership-info-title">{card.title}</h3>
                <p className="membership-info-desc">{card.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== APPLICATION PROCESS ===== */}
      <section className="section" aria-labelledby="process-heading">
        <Container>
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }} data-animate="fade-up">
            <SectionHeading
              id="process-heading"
              eyebrow="How It Works"
              heading={
                <>
                  Application <em>Process</em>
                </>
              }
            />
            <p className="section-intro" style={{ margin: '0 auto' }}>
              Our membership process is simple, transparent, and respectful. Here is what to expect.
            </p>
          </div>
          <div className="membership-process" data-animate="fade-up" data-delay="100">
            {processSteps.map((step, index) => (
              <div key={step.title} className="process-step">
                <div className="process-step-icon">
                  {step.icon}
                  <span className="process-step-num">{index + 1}</span>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="process-step-line" aria-hidden="true" />
                )}
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== MEMBERSHIP FORM ===== */}
      <section
        className="section"
        id="membership-form"
        aria-labelledby="form-heading"
        style={{ background: 'var(--clr-bg-secondary)' }}
      >
        <Container>
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }} data-animate="fade-up">
            <SectionHeading
              id="form-heading"
              eyebrow="Apply Now"
              heading={
                <>
                  Membership <em>Application</em>
                </>
              }
            />
            <p className="section-intro" style={{ margin: '0 auto' }}>
              Complete the form below to submit your membership application. All required fields are marked with an asterisk (*).
            </p>
          </div>
          <MembershipForm />
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" aria-labelledby="faq-heading">
        <Container>
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }} data-animate="fade-up">
            <SectionHeading
              id="faq-heading"
              eyebrow="Questions"
              heading={
                <>
                  Frequently Asked <em>Questions</em>
                </>
              }
            />
          </div>
          <MembershipFAQ />
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="membership-cta" aria-label="Call to action">
        <Container>
          <div className="membership-cta-inner" data-animate="fade-up">
            <h2 className="membership-cta-heading">
              Become Part of <em>Our Community</em>
            </h2>
            <Button href="#membership-form" size="lg" id="cta-apply-today">
              Apply Today
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
