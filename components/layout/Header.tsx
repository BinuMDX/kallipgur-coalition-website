'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isHome = pathname === '/';
  
  const headerClasses = [
    'site-header',
    scrolled ? 'scrolled' : '',
    !isHome ? 'site-header--solid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header id="site-header" className={headerClasses} role="banner">
      <div className="nav-container">
        <Link href="/" className="nav-logo" aria-label="Kallipgur Coalition Aboriginal Corporation — Home">
          <span className="logo-mark" aria-hidden="true"></span>
          <span className="logo-text">
            <span className="logo-primary">Kallipgur Coalition</span>
            <span className="logo-secondary">Aboriginal Corporation</span>
          </span>
        </Link>

        <Navigation />

        <div className="nav-actions">
          <Link href="/donate" className="btn btn-primary" id="nav-cta">
            Donate
          </Link>
          <button
            className="nav-toggle"
            id="nav-toggle"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
