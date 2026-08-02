'use client';

import React, { useState } from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Programs from '@/components/sections/Programs';
import Quote from '@/components/ui/Quote';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';

export default function HomePage() {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      setStatus('error');
      setFeedback('Please fill in all required fields.');
      return;
    }

    setStatus('sending');
    setFeedback('');

    // Simulate 1.8s delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setStatus('success');
    setFeedback('Thank you for reaching out. We will be in touch shortly.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');

    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStatus('idle');
    setFeedback('');
  };

  return (
    <>
      {/* 1. HERO */}
      <Hero />

      {/* 2. ACKNOWLEDGEMENT OF COUNTRY */}
      <section className="acknowledgement" aria-label="Acknowledgement of Country">
        <Container>
          <div className="ack-inner">
            <div className="ack-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="3" fill="#C9962E" />
                <circle cx="16" cy="16" r="7" stroke="#C9962E" strokeWidth="1" fill="none" opacity="0.6" />
                <circle cx="16" cy="16" r="11" stroke="#C9962E" strokeWidth="0.75" fill="none" opacity="0.35" />
                <circle cx="16" cy="16" r="15" stroke="#C9962E" strokeWidth="0.5" fill="none" opacity="0.2" />
              </svg>
            </div>
            <p className="ack-text">
              Kallipgur Coalition Aboriginal Corporation acknowledges the Traditional Custodians of the lands on which we live and work. We pay our deepest respect to Elders past, present, and emerging, and recognise the continuing connection Aboriginal and Torres Strait Islander peoples have to Country, culture, and community.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. ABOUT */}
      <About />

      {/* 4. ELDER QUOTE */}
      <section className="quote-section" aria-label="Inspirational quote">
        <Container>
          <Quote
            animate="fade-up"
            quote="We do not inherit the land from our ancestors — we borrow it from our children. Our work is to ensure the inheritance is worthy of the gift."
            attributionName="Elder Margaret Kallipgur"
            attributionTitle="Founding Elder, Kallipgur Coalition"
          />
        </Container>
      </section>

      {/* 5. PROGRAMS */}
      <Programs />

      {/* 6. DIVIDER */}
      <div className="dot-divider" aria-hidden="true">
        <img src="/assets/divider_pattern.png" alt="" className="divider-img" />
      </div>

      {/* 7. CULTURE */}
      <section id="culture" className="section culture" aria-labelledby="culture-heading">
        <Container>
          <div className="section-grid culture-grid">
            <div className="culture-visual" data-animate="fade-right" aria-hidden="true">
              <div className="culture-art">
                {/* Animated concentric circles inspired by dot painting */}
                <div className="dot-art">
                  <div className="dot-ring dot-ring-1"></div>
                  <div className="dot-ring dot-ring-2"></div>
                  <div className="dot-ring dot-ring-3"></div>
                  <div className="dot-ring dot-ring-4"></div>
                  <div className="dot-center"></div>
                </div>
              </div>
            </div>

            <div className="culture-content" data-animate="fade-left">
              <div className="section-eyebrow">Our Foundation</div>
              <h2 id="culture-heading" className="section-heading">
                Old ways.<br />
                <em>New possibilities.</em>
              </h2>
              <div className="body-text">
                <p>
                  Aboriginal Australians are the custodians of the world&apos;s oldest living culture — a rich tapestry of knowledge, law, ceremony, and connection to Country that has sustained communities for over 65,000 years.
                </p>
                <p>
                  At Kallipgur Coalition, we do not see culture as something to be preserved behind glass. It is alive. It breathes. It adapts. And it is the most powerful tool we have for healing, for strength, and for building the future our community deserves.
                </p>
              </div>

              <div className="culture-pillars">
                <div className="pillar" id="pillar-1">
                  <div className="pillar-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 12h3v8h6v-5h2v5h6v-8h3L12 2z" fill="#C9962E" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="pillar-text">
                    <strong>Connection to Country</strong>
                    <p>Land is not property. It is family, identity, and spiritual sustenance.</p>
                  </div>
                </div>
                <div className="pillar" id="pillar-2">
                  <div className="pillar-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" fill="#C9962E" opacity="0.8" />
                      <circle cx="5" cy="8" r="2" fill="#C9962E" opacity="0.5" />
                      <circle cx="19" cy="8" r="2" fill="#C9962E" opacity="0.5" />
                      <circle cx="5" cy="16" r="2" fill="#C9962E" opacity="0.5" />
                      <circle cx="19" cy="16" r="2" fill="#C9962E" opacity="0.5" />
                      <line x1="12" y1="9" x2="7" y2="8" stroke="#C9962E" strokeWidth="1" opacity="0.4" />
                      <line x1="12" y1="9" x2="17" y2="8" stroke="#C9962E" strokeWidth="1" opacity="0.4" />
                      <line x1="12" y1="15" x2="7" y2="16" stroke="#C9962E" strokeWidth="1" opacity="0.4" />
                      <line x1="12" y1="15" x2="17" y2="16" stroke="#C9962E" strokeWidth="1" opacity="0.4" />
                    </svg>
                  </div>
                  <div className="pillar-text">
                    <strong>Kinship & Relationships</strong>
                    <p>The web of kinship holds us together and defines our responsibilities to each other.</p>
                  </div>
                </div>
                <div className="pillar" id="pillar-3">
                  <div className="pillar-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#C9962E" strokeWidth="1.5" opacity="0.8" fill="none" />
                      <path d="M12 6v6l4 2" stroke="#C9962E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </div>
                  <div className="pillar-text">
                    <strong>Intergenerational Responsibility</strong>
                    <p>Every decision we make is measured against its impact on those not yet born.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. IMPACT */}
      <section className="impact-strip" aria-labelledby="impact-heading">
        <Container>
          <h2 id="impact-heading" className="sr-only">Our Impact</h2>
          <div className="impact-grid" data-animate="fade-up">
            <div className="impact-item">
              <div className="impact-number">650+</div>
              <div className="impact-label">Families Supported Annually</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">48</div>
              <div className="impact-label">Cultural Events &amp; Ceremonies</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">320</div>
              <div className="impact-label">Young People in Education Programs</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">$2.1M</div>
              <div className="impact-label">Community Investment Last Year</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. GOVERNANCE */}
      <section id="governance" className="section governance" aria-labelledby="governance-heading">
        <Container>
          <div className="section-header" data-animate="fade-up">
            <SectionHeading
              id="governance-heading"
              eyebrow="Governance"
              heading={
                <>
                  Accountable to community.
                  <br />
                  <em>Transparent by design.</em>
                </>
              }
            />
            <p className="section-intro">
              Kallipgur Coalition is governed by a Board of Directors elected from the community. Every decision is made with integrity, accountability, and deep respect for cultural governance principles passed down by our Elders.
            </p>
          </div>

          <div className="governance-grid">
            <Card as="article" className="board-card" id="board-1" animate="fade-up">
              <div className="board-avatar" aria-hidden="true">
                <div className="avatar-placeholder">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="14" r="7" fill="#C9962E" opacity="0.4" />
                    <path d="M4 34c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C9962E" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="board-name">Aunty Rosemary Garrawurra</h3>
              <div className="board-role">Chairperson</div>
              <p className="board-bio">
                A proud Elder with over 40 years of community leadership. Rosemary&apos;s guidance is grounded in traditional law and her lifelong commitment to cultural preservation and community wellbeing.
              </p>
            </Card>

            <Card as="article" className="board-card" id="board-2" animate="fade-up" delay="100">
              <div className="board-avatar" aria-hidden="true">
                <div className="avatar-placeholder">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="14" r="7" fill="#C9962E" opacity="0.4" />
                    <path d="M4 34c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C9962E" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="board-name">Uncle David Kallipgur</h3>
              <div className="board-role">Deputy Chair &amp; Cultural Advisor</div>
              <p className="board-bio">
                Knowledge holder and cultural custodian. David has dedicated his life to ensuring the transmission of traditional knowledge and the protection of sacred sites and ceremonial practices.
              </p>
            </Card>

            <Card as="article" className="board-card" id="board-3" animate="fade-up" delay="200">
              <div className="board-avatar" aria-hidden="true">
                <div className="avatar-placeholder">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="14" r="7" fill="#C9962E" opacity="0.4" />
                    <path d="M4 34c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C9962E" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="board-name">Sandra Munarra</h3>
              <div className="board-role">Director — Community Services</div>
              <p className="board-bio">
                Sandra brings extensive experience in Aboriginal health and social services. Her work has transformed how community members access culturally safe support across all life stages.
              </p>
            </Card>

            <Card as="article" className="board-card" id="board-4" animate="fade-up" delay="300">
              <div className="board-avatar" aria-hidden="true">
                <div className="avatar-placeholder">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="14" r="7" fill="#C9962E" opacity="0.4" />
                    <path d="M4 34c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C9962E" opacity="0.3" />
                  </svg>
                </div>
              </div>
              <h3 className="board-name">James Wirritjal</h3>
              <div className="board-role">Director — Economic Development</div>
              <p className="board-bio">
                An advocate for Aboriginal economic sovereignty, James works to ensure that economic participation generates real, lasting wealth that stays within and benefits our community.
              </p>
            </Card>
          </div>

          <div className="governance-principles" data-animate="fade-up">
            <h3 className="principles-heading">Our Governance Principles</h3>
            <div className="principles-grid">
              <div className="principle" id="gov-principle-1">
                <div className="principle-label">Cultural Authority</div>
                <p>Traditional law and Elders&apos; wisdom are the supreme authority in all cultural matters.</p>
              </div>
              <div className="principle" id="gov-principle-2">
                <div className="principle-label">Transparency</div>
                <p>Our finances, decisions, and processes are open to community scrutiny at all times.</p>
              </div>
              <div className="principle" id="gov-principle-3">
                <div className="principle-label">Accountability</div>
                <p>We are answerable to our community members — not government, not donors, not partners.</p>
              </div>
              <div className="principle" id="gov-principle-4">
                <div className="principle-label">Community First</div>
                <p>Every resource, every partnership, and every decision is evaluated by one question: does this benefit our community?</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. CONTACT (Home Section) */}
      <section id="contact" className="section contact" aria-labelledby="contact-heading">
        <Container>
          <div className="contact-inner">
            <div className="contact-content" data-animate="fade-right">
              <SectionHeading
                id="contact-heading"
                eyebrow="Get Involved"
                heading={
                  <>
                    Join us in building
                    <br />
                    <em>something lasting.</em>
                  </>
                }
              />
              <p className="body-text">
                Whether you are a community member seeking support, an organisation wanting to partner with us, or someone who wants to learn more about our work — we welcome your connection.
              </p>

              <div className="contact-details">
                <div className="contact-item" id="contact-address">
                  <div className="contact-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C7.239 2 5 4.239 5 7c0 4.418 5 11 5 11s5-6.582 5-11c0-2.761-2.239-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#C9962E" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <strong>Location</strong>
                    <p>Country Australia<br />Please contact us for our office address</p>
                  </div>
                </div>
                <div className="contact-item" id="contact-email">
                  <div className="contact-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M17 4H3a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 2.236l-6 4.8-6-4.8V6.5l6 4.8 6-4.8v-.264z" fill="#C9962E" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:info@kallipgurcoalition.org.au" className="contact-link">info@kallipgurcoalition.org.au</a></p>
                  </div>
                </div>
                <div className="contact-item" id="contact-phone">
                  <div className="contact-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6.012 3c-.356 0-.712.16-.952.454L3.464 5.422C2.51 6.6 2.635 8.37 3.75 9.484l6.766 6.766c1.114 1.115 2.884 1.24 4.062.286l1.968-1.596a1.25 1.25 0 00.085-1.862l-1.767-1.767a1.25 1.25 0 00-1.768 0l-.63.63a1.25 1.25 0 00-1.768 0l-.63.63a.5.5 0 01-.696-.018L7.52 7.773a.5.5 0 01-.018-.696l.63-.63a1.25 1.25 0 000-1.768L6.964 3.31A1.249 1.249 0 006.012 3z" fill="#C9962E" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:+61800000000" className="contact-link">(08) 0000 0000</a></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap" data-animate="fade-left">
              <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                <h3 className="form-title">Send us a message</h3>

                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    disabled={status === 'sending'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={status === 'sending'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={status === 'sending'}
                    required
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="community">Community Support</option>
                    <option value="programs">Programs &amp; Services</option>
                    <option value="partnership">Partnership Enquiry</option>
                    <option value="cultural">Cultural Programs</option>
                    <option value="governance">Governance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us how we can help or how you'd like to get involved…"
                    disabled={status === 'sending'}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
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

                <p className="form-note">
                  We respect your privacy. Your information will never be shared outside of Kallipgur Coalition.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
