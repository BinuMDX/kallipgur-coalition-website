import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  heading: React.ReactNode;
  id?: string;
  className?: string;
}

export default function SectionHeading({ eyebrow, heading, id, className = '' }: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      <h2 id={id} className="section-heading">
        {heading}
      </h2>
    </div>
  );
}
