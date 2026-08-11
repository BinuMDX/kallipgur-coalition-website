import React from 'react';

type AdminCardProps = {
  icon?: React.ReactNode;
  title?: string;
  metric?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdminCard({
  icon,
  title,
  metric,
  subtitle,
  footer,
  interactive = false,
  children,
  className = '',
  style,
}: AdminCardProps) {
  return (
    <div className={`admin-card${interactive ? ' admin-card--interactive' : ''} ${className}`} style={style}>
      {(icon || title) && (
        <div className="admin-card__header">
          {icon && <div className="admin-card__icon">{icon}</div>}
          {title && <span className="admin-card__title">{title}</span>}
        </div>
      )}
      {metric && <div className="admin-card__metric">{metric}</div>}
      {subtitle && <div className="admin-card__subtitle">{subtitle}</div>}
      {children}
      {footer && <div className="admin-card__footer">{footer}</div>}
    </div>
  );
}
