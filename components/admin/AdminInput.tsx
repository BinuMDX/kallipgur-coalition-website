import React from 'react';

type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, hint, required, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

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
        <input
          ref={ref}
          id={inputId}
          className={`admin-input${error ? ' admin-input--error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          required={required}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="admin-field-error" role="alert">
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className="admin-field-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
export default AdminInput;
