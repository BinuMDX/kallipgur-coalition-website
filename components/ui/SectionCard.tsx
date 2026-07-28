import React from 'react';

interface SectionCardProps {
  number: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}

export default function SectionCard({
  number,
  title,
  description,
  children,
  id,
}: SectionCardProps) {
  return (
    <fieldset className="membership-form-section" id={id}>
      <legend className="sr-only">{title}</legend>
      <div className="form-section-header">
        <span className="form-section-number" aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <div>
          <h3 className="form-section-title">{title}</h3>
          {description && (
            <p className="form-section-desc">{description}</p>
          )}
        </div>
      </div>
      <div className="form-section-body">{children}</div>
    </fieldset>
  );
}
