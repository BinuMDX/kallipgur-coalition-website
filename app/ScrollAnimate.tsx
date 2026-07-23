'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollAnimate() {
  const pathname = usePathname();

  useEffect(() => {
    // Run observer setup on mount and route changes
    const animatedEls = document.querySelectorAll('[data-animate]');
    if (!animatedEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    animatedEls.forEach((el) => {
      // Re-trigger animation if it's already visible but we re-navigated
      el.classList.remove('is-visible');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // Smooth scroll click handler for hash links
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        e.preventDefault();

        const header = document.getElementById('site-header');
        const navHeight = header ? header.offsetHeight : 80;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return null;
}
