'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  onItemClick?: () => void;
}

export default function Navigation({ onItemClick }: NavigationProps) {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Programs' },
    { href: '/news', label: 'News' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="nav-links" aria-label="Main navigation">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${isActive ? 'nav-link--active' : ''}`.trim()}
            onClick={onItemClick}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
