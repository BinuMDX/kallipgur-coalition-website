import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'normal' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  href,
  variant = 'primary',
  size = 'normal',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'lg' ? 'btn-lg' : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';
  
  const combinedClasses = `${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

  if (href) {
    // If it's an external link or hash link, use standard <a>, else use Next.js Link
    const isExternalOrHash = href.startsWith('http') || href.startsWith('#');
    if (isExternalOrHash) {
      return (
        <a href={href} className={combinedClasses}>
          {children}
        </a>
      );
    }
    
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
