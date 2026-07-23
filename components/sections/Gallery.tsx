'use client';

import React, { useState } from 'react';
import Card from '../ui/Card';

interface GalleryItem {
  id: string;
  src?: string;
  placeholder?: boolean;
  alt: string;
  category: string;
  caption: string;
  span?: 'wide' | 'tall' | 'normal';
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filters = ['All', 'Community Events', 'Youth Programs', 'Culture & Art', 'Country'];

  const items: GalleryItem[] = [
    {
      id: '1',
      src: '/assets/gallery_1.png',
      alt: 'Community gathering in the outback',
      category: 'Community Events',
      caption: "Elders' cultural gathering on Country, 2026",
      span: 'wide',
    },
    {
      id: '2',
      src: '/assets/gallery_2.png',
      alt: 'Dot painting artwork',
      category: 'Culture & Art',
      caption: 'Youth art workshop creations',
      span: 'tall',
    },
    {
      id: '3',
      placeholder: true,
      alt: 'Community health clinic opening',
      category: 'Community Events',
      caption: 'Community health clinic opening',
    },
    {
      id: '4',
      placeholder: true,
      alt: 'Language revival program',
      category: 'Culture & Art',
      caption: 'Language revival program',
    },
    {
      id: '5',
      placeholder: true,
      alt: 'NAIDOC Week celebrations',
      category: 'Community Events',
      caption: 'NAIDOC Week celebrations',
      span: 'wide',
    },
    {
      id: '6',
      placeholder: true,
      alt: 'Youth leadership summit',
      category: 'Youth Programs',
      caption: 'Youth leadership summit',
    },
  ];

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter((item) => item.category === activeFilter);

  return (
    <div>
      <div className="gallery-filters" data-animate="fade-up">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`.trim()}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="gallery-grid" data-animate="fade-up" data-delay="100">
        {filteredItems.map((item) => {
          let spanClass = '';
          if (item.span === 'wide') spanClass = 'gallery-item--wide';
          if (item.span === 'tall') spanClass = 'gallery-item--tall';

          return (
            <div
              key={item.id}
              className={`gallery-item ${spanClass}`.trim()}
              onClick={() => setLightboxItem(item)}
            >
              {item.placeholder ? (
                <div className="gallery-art-placeholder">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--clr-gold)"
                    strokeWidth="1.5"
                    opacity="0.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              ) : (
                <img src={item.src} alt={item.alt} />
              )}
              <div className="gallery-item-overlay">
                <span className="gallery-item-caption">{item.caption}</span>
              </div>
            </div>
          );
        })}
      </div>

      {lightboxItem && (
        <div className="lightbox is-open" onClick={() => setLightboxItem(null)}>
          <button
            className="lightbox-close"
            onClick={() => setLightboxItem(null)}
            aria-label="Close lightbox"
          >
            &times;
          </button>
          {lightboxItem.placeholder ? (
            <div
              className="lightbox-img gallery-art-placeholder"
              style={{ width: '90vw', height: '85vh', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="96"
                height="96"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--clr-gold)"
                strokeWidth="1.5"
                opacity="0.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          ) : (
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="lightbox-caption">{lightboxItem.caption}</div>
        </div>
      )}
    </div>
  );
}
