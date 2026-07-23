import React from 'react';

interface QuoteProps {
  quote: string;
  attributionName?: string;
  attributionTitle?: string;
  animate?: string;
  delay?: string;
}

export default function Quote({
  quote,
  attributionName,
  attributionTitle,
  animate,
  delay,
}: QuoteProps) {
  const animationProps = animate
    ? {
        'data-animate': animate,
        ...(delay ? { 'data-delay': delay } : {}),
      }
    : {};

  return (
    <figure className="quote-figure" {...animationProps}>
      <div className="quote-mark" aria-hidden="true">
        &ldquo;
      </div>
      <blockquote className="quote-text">{quote}</blockquote>
      {(attributionName || attributionTitle) && (
        <figcaption className="quote-attribution">
          {attributionName && (
            <span className="attribution-name">{attributionName}</span>
          )}
          {attributionTitle && (
            <span className="attribution-title">{attributionTitle}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
