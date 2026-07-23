import React from 'react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';

export default function Programs() {
  return (
    <section id="programs" className="section programs" aria-labelledby="programs-heading">
      <Container>
        <div className="section-header programs-header">
          <div data-animate="fade-up">
            <SectionHeading
              id="programs-heading"
              eyebrow="What We Do"
              heading={
                <>
                  Programs built from
                  <br />
                  <em>the ground up.</em>
                </>
              }
            />
          </div>
          <p className="section-intro" data-animate="fade-up" data-delay="100">
            Every initiative we run is designed with community members, shaped by Elders, and delivered in a way that respects cultural protocols. Our programs are not services rendered — they are relationships built.
          </p>
        </div>

        <div className="programs-grid">
          <Card
            as="article"
            className="program-card program-card--featured"
            id="program-culture"
            animate="fade-up"
          >
            <div className="program-number" aria-hidden="true">01</div>
            <div className="program-tag">Cultural Programs</div>
            <h3 className="program-title">Cultural Continuity & Language Revival</h3>
            <p className="program-desc">
              Preserving and revitalising our languages, ceremonies, art practices, and traditional knowledge. Working alongside Elders to ensure these sacred traditions are documented, taught, and celebrated by future generations.
            </p>
            <ul className="program-features">
              <li>Language documentation & teaching programs</li>
              <li>Ceremony support & facilitation</li>
              <li>Intergenerational knowledge transfer</li>
              <li>Cultural arts & storytelling workshops</li>
            </ul>
          </Card>

          <Card
            as="article"
            className="program-card"
            id="program-health"
            animate="fade-up"
            delay="100"
          >
            <div className="program-number" aria-hidden="true">02</div>
            <div className="program-tag">Health & Wellbeing</div>
            <h3 className="program-title">Holistic Community Health</h3>
            <p className="program-desc">
              Culturally safe health services addressing physical, mental, emotional, and spiritual wellbeing. Community-controlled, community-led, and always grounded in cultural understanding.
            </p>
          </Card>

          <Card
            as="article"
            className="program-card"
            id="program-youth"
            animate="fade-up"
            delay="150"
          >
            <div className="program-number" aria-hidden="true">03</div>
            <div className="program-tag">Youth & Education</div>
            <h3 className="program-title">Young Leaders & Education Pathways</h3>
            <p className="program-desc">
              Supporting Aboriginal young people through school, vocational training, and higher education with mentorship, scholarships, and culturally affirming learning environments.
            </p>
          </Card>

          <Card
            as="article"
            className="program-card"
            id="program-economic"
            animate="fade-up"
            delay="200"
          >
            <div className="program-number" aria-hidden="true">04</div>
            <div className="program-tag">Economic Development</div>
            <h3 className="program-title">Community Enterprise & Employment</h3>
            <p className="program-desc">
              Creating genuine employment and economic pathways for community members through Aboriginal-led enterprises, training programs, and partnerships that keep wealth within community.
            </p>
          </Card>

          <Card
            as="article"
            className="program-card"
            id="program-housing"
            animate="fade-up"
            delay="250"
          >
            <div className="program-number" aria-hidden="true">05</div>
            <div className="program-tag">Housing & Land</div>
            <h3 className="program-title">Housing Security & Land Connection</h3>
            <p className="program-desc">
              Advocating for and providing access to safe, culturally appropriate housing, while strengthening the relationship between our community and the lands that have sustained us for tens of thousands of years.
            </p>
          </Card>

          <Card
            as="article"
            className="program-card"
            id="program-elders"
            animate="fade-up"
            delay="300"
          >
            <div className="program-number" aria-hidden="true">06</div>
            <div className="program-tag">Elders Support</div>
            <h3 className="program-title">Elder Care & Recognition</h3>
            <p className="program-desc">
              Supporting our Elders to live with dignity and security, while ensuring their invaluable knowledge and leadership are respected, celebrated, and integrated into our community governance.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
