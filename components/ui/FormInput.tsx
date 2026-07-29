import React, { useRef } from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  id?: string;
}

export default function FormInput({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  error,
  register,
  id,
}: FormInputProps) {
  const inputId = id || `field-${name}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, ...registerRest } = register;

  const handleIconClick = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={inputId}>
        {label}
        {required && <span className="form-required" aria-hidden="true"> *</span>}
      </label>
      {type === 'date' ? (
        <div className="input-date-wrapper" style={{ position: 'relative', width: '100%' }}>
          <input
            id={inputId}
            type="date"
            placeholder={placeholder}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            ref={(e) => {
              registerRef(e);
              inputRef.current = e;
            }}
            {...registerRest}
            className="input-date-field"
          />
          <button
            type="button"
            className="input-date-icon-btn"
            onClick={handleIconClick}
            tabIndex={-1}
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clr-gold)',
              pointerEvents: 'none', // Allow clicks to pass through to the webkit indicator overlay
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
      ) : (
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...register}
        />
      )}
      {error && (
        <span className="form-error" id={`${inputId}-error`} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}

