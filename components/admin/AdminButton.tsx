import React from 'react';

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
};

export default function AdminButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: AdminButtonProps) {
  const classes = [
    'admin-btn',
    `admin-btn--${variant}`,
    size !== 'md' ? `admin-btn--${size}` : '',
    fullWidth ? 'admin-btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="admin-spinner admin-spinner--sm" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
