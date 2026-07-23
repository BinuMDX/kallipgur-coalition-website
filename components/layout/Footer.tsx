'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Top section: Brand + Navigation columns */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo" aria-label="Kallipgur Coalition — Home">
                <span className="logo-mark" aria-hidden="true"></span>
                <span className="logo-text">
                  <span className="logo-primary">Kallipgur Coalition</span>
                  <span className="logo-secondary">Aboriginal Corporation</span>
                </span>
              </Link>
              <p className="footer-tagline">Rooted in Country.<br />Rising Together.</p>
              <p className="footer-reg">ICN 11895 · Registered 22 June 2026<br />under the CATSI Act 2006</p>

              {/* Social Media */}
              <div className="footer-social" aria-label="Social media links">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="X / Twitter">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Quick Links</h4>
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/programs" className="footer-link">Programs</Link>
              <Link href="/news" className="footer-link">News &amp; Updates</Link>
              <Link href="/newsletter" className="footer-link">Newsletter</Link>
              <Link href="/gallery" className="footer-link">Gallery</Link>
              <Link href="/donate" className="footer-link">Donate</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>

            {/* Programs */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Programs</h4>
              <Link href="/programs" className="footer-link">Cultural Programs</Link>
              <Link href="/programs" className="footer-link">Health &amp; Wellbeing</Link>
              <Link href="/programs" className="footer-link">Youth &amp; Education</Link>
              <Link href="/programs" className="footer-link">Economic Development</Link>
              <Link href="/programs" className="footer-link">Housing &amp; Land</Link>
              <Link href="/programs" className="footer-link">Elder Care</Link>
            </div>

            {/* Contact Info */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Contact</h4>
              <div className="footer-contact-item">
                <span className="footer-contact-label">Email</span>
                <span className="footer-contact-val">
                  <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-label">Phone</span>
                <span className="footer-contact-val">
                  <a href="tel:+61800000000">(08) 0000 0000</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-label">Hours</span>
                <span className="footer-contact-val">Mon–Fri: 9am–5pm AWST</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-label">Location</span>
                <span className="footer-contact-val">Country Australia</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Acknowledgement Band */}
      <div className="footer-ack-band">
        <div className="container">
          <div className="footer-ack-inner">
            <div className="footer-ack-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="3" fill="#C9962E" />
                <circle cx="16" cy="16" r="7" stroke="#C9962E" strokeWidth="1" fill="none" opacity="0.6" />
                <circle cx="16" cy="16" r="11" stroke="#C9962E" strokeWidth="0.75" fill="none" opacity="0.35" />
                <circle cx="16" cy="16" r="15" stroke="#C9962E" strokeWidth="0.5" fill="none" opacity="0.2" />
              </svg>
            </div>
            <p className="footer-ack-text">
              <strong style={{ color: 'var(--clr-gold)', fontStyle: 'normal', fontWeight: 500 }}>
                Acknowledgement of Country
              </strong>{' '}
              — Kallipgur Coalition Aboriginal Corporation acknowledges the Traditional Custodians of the lands on which we live, work, and serve our community. We pay our deepest respects to Elders past, present, and emerging, and recognise the continuing and enduring connection Aboriginal and Torres Strait Islander peoples have to Country, culture, spirit, and community. Always was, always will be, Aboriginal land.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container">
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; <span>{year}</span> Kallipgur Coalition Aboriginal Corporation. All rights reserved.
          </p>
          <nav className="footer-legal" aria-label="Legal navigation">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Annual Report</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
