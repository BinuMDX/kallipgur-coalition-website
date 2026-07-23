/* =============================================
   MAIN.JS
   Kallipgur Coalition Aboriginal Corporation
   ============================================= */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroAnimation();
  initScrollAnimations();
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  setYear();
});

// ===== YEAR =====
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== NAVIGATION (scroll behaviour) =====
function initNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const mobileLinks = menu.querySelectorAll('.mobile-link, .mobile-cta');

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
    }
  });

  // Close when a link is clicked
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ===== HERO ANIMATION =====
function initHeroAnimation() {
  const heroContent = document.querySelector('.hero-content');
  const heroStats   = document.querySelector('.hero-stats');

  // Small delay to allow fonts to load
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (heroContent) heroContent.classList.add('is-visible');
      if (heroStats)   heroStats.classList.add('is-visible');
    }, 150);
  });
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
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

  animatedEls.forEach(el => observer.observe(el));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('#form-submit');
    const originalText = submitBtn.textContent;

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value;
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormFeedback(form, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    await delay(1800);

    submitBtn.textContent = '✓ Message Sent';
    showFormFeedback(form, 'Thank you for reaching out. We will be in touch shortly.', 'success');
    form.reset();

    await delay(3000);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    clearFormFeedback(form);
  });
}

function showFormFeedback(form, message, type) {
  clearFormFeedback(form);

  const feedback = document.createElement('div');
  feedback.className = `form-feedback form-feedback--${type}`;
  feedback.textContent = message;
  feedback.setAttribute('role', 'alert');

  Object.assign(feedback.style, {
    marginTop: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    lineHeight: '1.5',
    border: `1px solid ${type === 'success' ? 'rgba(201,150,46,0.5)' : 'rgba(168,67,30,0.5)'}`,
    background: type === 'success' ? 'rgba(201,150,46,0.08)' : 'rgba(168,67,30,0.1)',
    color: type === 'success' ? '#E7B856' : '#e87d5c',
  });

  form.appendChild(feedback);
}

function clearFormFeedback(form) {
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== PARALLAX SUBTLE (hero bg) =====
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.25;
        heroBg.style.transform = `translateY(${rate}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
