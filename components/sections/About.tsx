import React from 'react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-heading">
      <Container>
        <div className="section-grid about-grid">
          <div className="about-text" data-animate="fade-right">
            <SectionHeading
              id="about-heading"
              eyebrow="Who We Are"
              heading={
                <>
                  A community built on
                  <br />
                  <em>ancient foundations.</em>
                </>
              }
            />
            <div className="body-text about-body">
              <p>
                The Kallipgur Coalition Aboriginal Corporation (ICN 11895) is a coalition in formation, registered 22 June 2026 under the CATSI Act 2006. We stand on Yabaru country, Boorloo — grounded in the principles of self-determination, cultural pride, and collective strength.
              </p>
              <p>
                Our work bridges the wisdom of traditional knowledge with the practical needs of today, ensuring our people have access to services, opportunities, and a strong voice in decisions that affect their lives.
              </p>
              <p>
                We believe that when community thrives — when culture is celebrated, when families are supported, and when futures are secured — the whole of Country rises with us.
              </p>
            </div>
            <Button href="/programs" variant="outline" id="about-programs-link">
              Explore Our Programs
            </Button>
          </div>

          <div className="about-cards" data-animate="fade-left">
            <Card as="article" className="value-card" id="value-1">
              <div className="value-number" aria-hidden="true">01</div>
              <h3 className="value-title">Country & Culture</h3>
              <p className="value-desc">Deep respect for Country and cultural practice forms the foundation of everything we do. Culture is not a program — it is the living heartbeat of our community.</p>
            </Card>
            <Card as="article" className="value-card" id="value-2">
              <div className="value-number" aria-hidden="true">02</div>
              <h3 className="value-title">Self-Determination</h3>
              <p className="value-desc">Our people have the right to shape their own future. We champion Aboriginal-led governance and decision-making at every level of our organisation.</p>
            </Card>
            <Card as="article" className="value-card" id="value-3">
              <div className="value-number" aria-hidden="true">03</div>
              <h3 className="value-title">Collective Wellbeing</h3>
              <p className="value-desc">True wellbeing encompasses health, housing, education, economic participation, and spiritual connection. We address the whole person, not just the symptom.</p>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
