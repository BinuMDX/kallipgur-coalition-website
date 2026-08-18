import React from 'react';

export type ContactStats = {
  total: number;
  new: number;
  read: number;
  inProgress: number;
  resolved: number;
};

type ContactSummaryCardsProps = {
  stats: ContactStats;
  loading?: boolean;
};

export default function ContactSummaryCards({
  stats,
  loading = false,
}: ContactSummaryCardsProps) {
  const cards = [
    {
      title: 'Total Enquiries',
      value: stats.total,
      badge: 'All',
      color: 'var(--admin-gold)',
    },
    {
      title: 'New',
      value: stats.new,
      badge: 'Unread',
      color: 'var(--admin-gold)',
    },
    {
      title: 'Read',
      value: stats.read,
      badge: 'Opened',
      color: 'var(--admin-info)',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      badge: 'Active',
      color: 'var(--admin-warning)',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      badge: 'Closed',
      color: 'var(--admin-success)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="admin-card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '3px',
              height: '100%',
              background: card.color,
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--admin-text-secondary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {card.title}
            </span>
            <span
              className="admin-badge admin-badge--muted"
              style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
            >
              {card.badge}
            </span>
          </div>

          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              color: 'var(--admin-text)',
              lineHeight: 1,
              marginTop: '0.25rem',
            }}
          >
            {loading ? '—' : card.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
