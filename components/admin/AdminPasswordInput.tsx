'use client';

import React, { useState } from 'react';

type AdminPasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  error?: string;
  required?: boolean;
};

const AdminPasswordInput = React.forwardRef<HTMLInputElement, AdminPasswordInputProps>(
  ({ label, error, required, id, className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || 'password';

    return (
      <div className="admin-field">
        {label && (
          <label
            htmlFor={inputId}
            className={`admin-label${required ? ' admin-label--required' : ''}`}
          >
            {label}
          </label>
        )}
        <div className="admin-input-wrapper">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={`admin-input${error ? ' admin-input--error' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            required={required}
            {...props}
          />
          <button
            type="button"
            className="admin-input-icon"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? (
              /* Eye-off icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <span id={`${inputId}-error`} className="admin-field-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AdminPasswordInput.displayName = 'AdminPasswordInput';
export default AdminPasswordInput;
