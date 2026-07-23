import React from 'react';

interface CardProps {
  as?: 'article' | 'div' | 'button';
  className?: string;
  animate?: string;
  delay?: string;
  id?: string;
  onClick?: () => void;
  'aria-label'?: string;
  children: React.ReactNode;
}

export default function Card({
  as: Component = 'div',
  className = '',
  animate,
  delay,
  id,
  onClick,
  'aria-label': ariaLabel,
  children,
}: CardProps) {
  const animationProps = animate
    ? {
        'data-animate': animate,
        ...(delay ? { 'data-delay': delay } : {}),
      }
    : {};

  // For buttons, onClick might be passed. If it is a button, prevent default type issues.
  const extraProps = Component === 'button' ? { type: 'button' as const, onClick } : { onClick };

  return (
    <Component
      id={id}
      className={className}
      aria-label={ariaLabel}
      {...animationProps}
      {...extraProps}
    >
      {children}
    </Component>
  );
}
