import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormTextareaProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  error?: FieldError;
  register: UseFormRegisterReturn;
  id?: string;
}

export default function FormTextarea({
  name,
  label,
  required = false,
  placeholder,
  rows = 5,
  error,
  register,
  id,
}: FormTextareaProps) {
  const textareaId = id || `field-${name}`;

  return (
    <div className="form-group">
      <label htmlFor={textareaId}>
        {label}
        {required && <span className="form-required" aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...register}
      />
      {error && (
        <span className="form-error" id={`${textareaId}-error`} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
