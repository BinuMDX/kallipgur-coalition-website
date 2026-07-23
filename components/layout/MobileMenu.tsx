'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Programs' },
    { href: '/news', label: 'News & Updates' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div
      className={`mobile-menu ${isOpen ? 'is-open' : ''}`.trim()}
      id="mobile-menu"
      aria-hidden={!isOpen}
    >
      <nav aria-label="Mobile navigation">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-link ${isActive ? 'mobile-link--active' : ''}`.trim()}
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/donate"
          className="btn btn-primary mobile-cta"
          onClick={onClose}
        >
          Donate
        </Link>
      </nav>
    </div>
  );
}
