'use client';

import React, { useState } from 'react';

const faqItems = [
  {
    question: 'How long does the membership application process take?',
    answer:
      'Applications are typically reviewed within 10 business days. The Membership Committee meets regularly to consider new applications. You will receive confirmation by email or phone once a decision has been made.',
  },
  {
    question: 'Is there a membership fee?',
    answer:
      'Kallipgur Coalition Aboriginal Corporation does not currently charge a membership fee. Membership is free and open to all eligible applicants. We believe cost should never be a barrier to community connection.',
  },
  {
    question: 'Do I need to be Aboriginal or Torres Strait Islander to become a member?',
    answer:
      'While our General Member and Elder categories are reserved for Aboriginal and Torres Strait Islander people, we welcome all individuals who support our mission. Supporter and Volunteer membership categories are open to everyone.',
  },
  {
    question: 'What are my responsibilities as a member?',
    answer:
      'Members are expected to uphold the values and objectives of the Corporation, attend General Meetings where possible, and contribute positively to our community. Active participation strengthens us all.',
  },
  {
    question: 'Can I change my membership type after joining?',
    answer:
      'Yes. If your circumstances change or you wish to transition to a different membership category, you can submit a request to the Membership Committee. Changes are considered on a case-by-case basis.',
  },
  {
    question: 'How do I cancel my membership?',
    answer:
      'Members may withdraw at any time by submitting a written request to the Corporation. We encourage members to speak with us before making this decision — we are always here to listen and support.',
  },
];

export default function MembershipFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-accordion" data-animate="fade-up" data-delay="100">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`faq-accordion-item ${isOpen ? 'faq-accordion-item--open' : ''}`}
          >
            <button
              type="button"
              className="faq-accordion-trigger"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-trigger-${index}`}
            >
              <span className="faq-accordion-q">{item.question}</span>
              <span className="faq-accordion-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 8l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              className="faq-accordion-panel"
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-trigger-${index}`}
              hidden={!isOpen}
            >
              <p className="faq-accordion-a">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
