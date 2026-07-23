import React from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Quote from '../../components/ui/Quote';
import Button from '../../components/ui/Button';

export default function AboutPage() {
  return (
    <>
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-labelledby="about-page-heading">
        <div className="page-hero-bg">
          <img src="/assets/about_banner.png" alt="" />
        </div>
        <Container className="page-hero-content">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span>About Us</span>
          </nav>
          <h1 id="about-page-heading" className="page-hero-title">
            Built by community.<br />
            <em>Guided by Elders.</em>
          </h1>
          <p className="page-hero-desc">
            Kallipgur Coalition Aboriginal Corporation (ICN 11895) — a coalition in formation, registered 22 June 2026 under the CATSI Act 2006. We stand on Yabaru country, Boorloo.
          </p>
        </Container>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="section" aria-labelledby="mission-heading" style={{ background: 'var(--clr-bg-secondary)' }}>
        <Container>
          <div className="about-page-intro">
            <div data-animate="fade-right">
              <SectionHeading
                id="mission-heading"
                eyebrow="Our Mission"
                heading={
                  <>
                    Purpose that runs
                    <br />
                    <em>deeper than policy.</em>
                  </>
                }
              />
              <div className="body-text">
                <p>
                  The Kallipgur Coalition Aboriginal Corporation (ICN 11895) is a coalition in formation, registered 22 June 2026 under the CATSI Act 2006. We stand on Yabaru country, Boorloo. Our mission is to advance the cultural, social, economic, and spiritual wellbeing of Aboriginal people through community-controlled programs, advocacy, and partnerships that honour our traditions and secure our future.
                </p>
                <p>
                  We believe in self-determination as a fundamental right — not a privilege. Every program we run, every service we deliver, and every relationship we build is an expression of that belief.
                </p>
                <p>
                  Our vision is a flourishing Aboriginal community where every person is connected to culture, supported in health and wellbeing, empowered through education and economic opportunity, and able to live with dignity, safety, and pride on Country.
                </p>
              </div>
            </div>
            <div data-animate="fade-left">
              <div className="about-img-wrap">
                <img src="/assets/about_banner.png" alt="Australian Country landscape — the foundation of everything we do" />
                <p className="about-img-caption">Country grounds us. Culture defines us. Community sustains us.</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div data-animate="fade-up">
            <SectionHeading heading="What we stand for." eyebrow="Our Values" />
          </div>
          
          <div className="about-cards" data-animate="fade-up" data-delay="100">
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">01</div>
              <h3 className="value-title">Country &amp; Culture</h3>
              <p className="value-desc">Deep respect for Country and cultural practice forms the foundation of everything we do. Culture is not a program — it is the living heartbeat of our community.</p>
            </Card>
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">02</div>
              <h3 className="value-title">Self-Determination</h3>
              <p className="value-desc">Our people have the right to shape their own future. We champion Aboriginal-led governance and decision-making at every level of our organisation.</p>
            </Card>
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">03</div>
              <h3 className="value-title">Collective Wellbeing</h3>
              <p className="value-desc">True wellbeing is physical, mental, emotional, spiritual, and cultural. We address the whole person, not just the symptom.</p>
            </Card>
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">04</div>
              <h3 className="value-title">Integrity &amp; Accountability</h3>
              <p className="value-desc">We hold ourselves to the highest standards of transparency, honesty, and responsibility — to our community, our Elders, and to Country.</p>
            </Card>
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">05</div>
              <h3 className="value-title">Intergenerational Thinking</h3>
              <p className="value-desc">Every decision we make is measured against its impact on those who have not yet been born. We build for generations, not quarters.</p>
            </Card>
            <Card as="article" className="value-card">
              <div className="value-number" aria-hidden="true">06</div>
              <h3 className="value-title">Relationship &amp; Respect</h3>
              <p className="value-desc">We build partnerships based on mutual respect, shared values, and genuine commitment to outcomes that benefit Aboriginal communities.</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* ===== HISTORY TIMELINE ===== */}
      <section className="section" aria-labelledby="history-heading">
        <Container>
          <div data-animate="fade-up">
            <SectionHeading
              id="history-heading"
              eyebrow="Our History"
              heading={
                <>
                  Three decades of
                  <br />
                  <em>community strength.</em>
                </>
              }
            />
          </div>
          <div style={{ maxWidth: '640px', marginTop: '2.5rem' }} data-animate="fade-up" data-delay="100">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">1992</div>
                <div className="timeline-title">Founded by Elders</div>
                <div className="timeline-desc">Kallipgur Coalition Aboriginal Corporation was established by a group of dedicated Elders with a simple but powerful conviction: that Aboriginal people must lead the decisions that shape their own lives.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">1998</div>
                <div className="timeline-title">First Community Health Program</div>
                <div className="timeline-desc">Launched our inaugural culturally safe health program, becoming one of the first community-controlled health services in the region.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2005</div>
                <div className="timeline-title">Language Revival Initiative</div>
                <div className="timeline-desc">Partnered with Elders and linguists to begin documenting and revitalising traditional language — a program that continues to grow today.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2012</div>
                <div className="timeline-title">Youth Education Hub Opens</div>
                <div className="timeline-desc">Opened our dedicated youth education centre, providing culturally affirming learning environments and mentorship for young Aboriginal people.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2018</div>
                <div className="timeline-title">Economic Development Strategy</div>
                <div className="timeline-desc">Launched a comprehensive economic development strategy focused on Aboriginal-led enterprise, employment, and keeping wealth within community.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-title">30+ Years &amp; Growing</div>
                <div className="timeline-desc">Today we support over 1,200 community members through 15 active programs, led by a Board of community-elected Directors and guided by our Elders.</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== LEADERSHIP ===== */}
      <section className="section" style={{ background: 'var(--clr-bg-secondary)' }} aria-labelledby="leadership-heading">
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="leadership-heading"
              eyebrow="Leadership"
              heading={
                <>
                  Guided by our
                  <br />
                  <em>community.</em>
                </>
              }
            />
            <p className="section-intro">Our Board of Directors is elected from and accountable to our community members. Every decision is made with integrity and cultural authority.</p>
          </div>
          
          <div className="team-grid">
            <Card as="article" className="team-card" id="team-1" animate="fade-up">
              <div className="team-avatar" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="16" r="9" fill="#C9962E" opacity="0.35" />
                  <path d="M4 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#C9962E" opacity="0.25" />
                </svg>
              </div>
              <div className="team-name">Aunty Rosemary Garrawurra</div>
              <div className="team-role">Chairperson</div>
            </Card>
            
            <Card as="article" className="team-card" id="team-2" animate="fade-up" delay="100">
              <div className="team-avatar" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="16" r="9" fill="#C9962E" opacity="0.35" />
                  <path d="M4 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#C9962E" opacity="0.25" />
                </svg>
              </div>
              <div className="team-name">Uncle David Kallipgur</div>
              <div className="team-role">Deputy Chair &amp; Cultural Advisor</div>
            </Card>
            
            <Card as="article" className="team-card" id="team-3" animate="fade-up" delay="200">
              <div className="team-avatar" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="16" r="9" fill="#C9962E" opacity="0.35" />
                  <path d="M4 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#C9962E" opacity="0.25" />
                </svg>
              </div>
              <div className="team-name">Sandra Munarra</div>
              <div className="team-role">Director — Community Services</div>
            </Card>
            
            <Card as="article" className="team-card" id="team-4" animate="fade-up" delay="300">
              <div className="team-avatar" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="16" r="9" fill="#C9962E" opacity="0.35" />
                  <path d="M4 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#C9962E" opacity="0.25" />
                </svg>
              </div>
              <div className="team-name">James Wirritjal</div>
              <div className="team-role">Director — Economic Development</div>
            </Card>
          </div>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="quote-section" aria-label="Call to action">
        <Container>
          <Quote
            animate="fade-up"
            quote="We do not inherit the land from our ancestors — we borrow it from our children. Our work is to ensure the inheritance is worthy of the gift."
            attributionName="Elder Margaret Kallipgur"
            attributionTitle="Founding Elder, Kallipgur Coalition"
          />
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} data-animate="fade-up" data-delay="100">
            <Button href="/contact" size="lg" className="mr-4">
              Get in Touch
            </Button>
            <Button href="/programs" variant="ghost" size="lg" style={{ marginLeft: '1rem' }}>
              Our Programs
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
