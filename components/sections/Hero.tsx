'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgRef.current) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.25;
            bgRef.current.style.transform = `translateY(${rate}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg" aria-hidden="true">
        <img
          ref={bgRef}
          src="/assets/hero_bg.png"
          alt=""
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Decorative dot pattern */}
      <div className="hero-dots" aria-hidden="true">
        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="dots-svg">
          <circle cx="60" cy="60" r="3" fill="#C9962E" opacity="0.4" />
          <circle cx="120" cy="40" r="2" fill="#C9962E" opacity="0.3" />
          <circle cx="180" cy="70" r="4" fill="#A8431E" opacity="0.25" />
          <circle cx="240" cy="35" r="2.5" fill="#C9962E" opacity="0.35" />
          <circle cx="300" cy="80" r="3" fill="#E7B856" opacity="0.2" />
          <circle cx="360" cy="50" r="2" fill="#C9962E" opacity="0.3" />
          <circle cx="420" cy="65" r="3.5" fill="#A8431E" opacity="0.25" />
          <circle cx="480" cy="30" r="2" fill="#E7B856" opacity="0.35" />
          <circle cx="540" cy="75" r="3" fill="#C9962E" opacity="0.3" />
          <circle cx="600" cy="45" r="2.5" fill="#A8431E" opacity="0.2" />
          <circle cx="660" cy="85" r="2" fill="#C9962E" opacity="0.35" />
          <circle cx="720" cy="55" r="4" fill="#E7B856" opacity="0.25" />
          <circle cx="780" cy="38" r="2.5" fill="#C9962E" opacity="0.3" />
          <circle cx="840" cy="72" r="3" fill="#A8431E" opacity="0.2" />
          <circle cx="900" cy="48" r="2" fill="#C9962E" opacity="0.4" />
          <circle cx="960" cy="68" r="3.5" fill="#E7B856" opacity="0.25" />
          <circle cx="1020" cy="42" r="2" fill="#C9962E" opacity="0.3" />
          <circle cx="1080" cy="60" r="3" fill="#A8431E" opacity="0.35" />
          <circle cx="1140" cy="35" r="2.5" fill="#C9962E" opacity="0.2" />
        </svg>
      </div>

      <div className={`container hero-content ${visible ? 'is-visible' : ''}`.trim()}>
        <div className="hero-eyebrow" data-animate="fade-up">
          <span className="eyebrow-line" aria-hidden="true"></span>
          Kallipgur Coalition Aboriginal Corporation
        </div>

        <h1 id="hero-heading" className="hero-heading" data-animate="fade-up" data-delay="100">
          Rooted in Country.<br />
          <em>Rising Together.</em>
        </h1>

        <p className="hero-subtext" data-animate="fade-up" data-delay="200">
          A coalition in formation, registered 22 June 2026 under the CATSI Act 2006.
          We stand on Yabaru country, Boorloo.
        </p>

        <div className="hero-actions" data-animate="fade-up" data-delay="300">
          <Button href="/about" size="lg" id="hero-learn-more">
            Learn Our Story
          </Button>
          <Button href="/programs" variant="ghost" size="lg" id="hero-programs">
            Our Programs
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className={`hero-stats ${visible ? 'is-visible' : ''}`.trim()}
        data-animate="fade-up"
        data-delay="400"
        aria-label="Key statistics"
      >
        <div className="stat-item">
          <span className="stat-number">30+</span>
          <span className="stat-label">Years of Community Service</span>
        </div>
        <div className="stat-divider" aria-hidden="true"></div>
        <div className="stat-item">
          <span className="stat-number">1,200+</span>
          <span className="stat-label">Community Members Supported</span>
        </div>
        <div className="stat-divider" aria-hidden="true"></div>
        <div className="stat-item">
          <span className="stat-number">15</span>
          <span className="stat-label">Active Programs & Initiatives</span>
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="scroll-line"></span>
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
