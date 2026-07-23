'use client';

import React, { useState } from 'react';
import Card from '../ui/Card';

interface Tier {
  id: string;
  badge: string;
  amount: number;
  label: string;
  desc: string;
  popular?: boolean;
}

export default function DonationCTA() {
  const [selectedTierId, setSelectedTierId] = useState<string>('2'); // default to Monthly $100
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('monthly');

  const tiers: Tier[] = [
    {
      id: '1',
      badge: 'One-Time',
      amount: 50,
      label: 'Cultural Supplies',
      desc: 'Provides art supplies and materials for youth participating in our after-school cultural programs.',
    },
    {
      id: '2',
      badge: 'Monthly',
      amount: 100,
      label: 'Elders Support',
      desc: 'Helps fund transport and meals for Elders to attend community gatherings and health appointments.',
      popular: true,
    },
    {
      id: '3',
      badge: 'One-Time',
      amount: 500,
      label: 'Education Scholarship',
      desc: 'Contributes to a term scholarship for a young Aboriginal student covering books, uniform, and excursions.',
    },
  ];

  const handleTierClick = (id: string) => {
    setSelectedTierId(id);
    setCustomAmount(''); // clear custom input
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedTierId(''); // unselect tiers
  };

  const getDonationDetails = () => {
    let amount = 0;
    let freq = frequency;

    if (selectedTierId) {
      const tier = tiers.find((t) => t.id === selectedTierId);
      if (tier) {
        amount = tier.amount;
        freq = tier.badge.toLowerCase();
      }
    } else {
      amount = parseFloat(customAmount) || 0;
    }

    return { amount, freq };
  };

  const handlePayment = (method: 'Stripe' | 'PayPal') => {
    const { amount, freq } = getDonationDetails();
    if (amount <= 0) {
      alert('Please select or enter a valid donation amount.');
      return;
    }
    alert(`Redirecting to ${method} secure checkout for a $${amount} (${freq}) contribution. Thank you for your support!`);
  };

  return (
    <div>
      <div className="donate-grid" data-animate="fade-up" data-delay="100">
        {tiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const tierClasses = [
            'donate-tier',
            tier.popular ? 'donate-tier--popular' : '',
            isSelected ? 'is-selected' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={tier.id}
              className={tierClasses}
              onClick={() => handleTierClick(tier.id)}
              aria-label={`Donate $${tier.amount} ${tier.badge}`}
            >
              <span className="donate-tier-badge">{tier.badge}</span>
              <div className="donate-tier-amount">${tier.amount}</div>
              <div className="donate-tier-label">{tier.label}</div>
              <p className="donate-tier-desc">{tier.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="donate-custom" data-animate="fade-up" data-delay="200">
        <h3 className="donate-custom-title">Custom Amount</h3>
        <div className="donate-amount-row">
          <div className="donate-prefix">$</div>
          <input
            type="number"
            className="donate-amount-input"
            placeholder="Enter amount"
            min="5"
            step="5"
            value={customAmount}
            onChange={handleCustomChange}
            aria-label="Custom donation amount"
          />
          <select
            className="newsletter-input"
            style={{ flex: '0 1 200px' }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            aria-label="Donation Frequency"
          >
            <option value="once">One-time</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annually</option>
          </select>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div
        className="payment-methods"
        data-animate="fade-up"
        data-delay="300"
        style={{ marginTop: '2rem', borderTop: '1px solid var(--clr-border)', paddingTop: '2rem' }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--clr-sand)', fontWeight: 400, marginBottom: '1.5rem' }}>
          Select Payment Method
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }} onClick={() => handlePayment('Stripe')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            Pay with Stripe
          </button>
          <button className="btn btn-outline" style={{ flex: 1, minWidth: '200px' }} onClick={() => handlePayment('PayPal')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            Pay with PayPal
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)', marginTop: '1.5rem', textAlign: 'center' }}>
          All transactions are secure and encrypted. Donations over $2 are tax-deductible.
        </p>
      </div>
    </div>
  );
}
