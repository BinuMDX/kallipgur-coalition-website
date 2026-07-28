import React from 'react';
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

  return (
    <div className="form-group">
      <label htmlFor={inputId}>
        {label}
        {required && <span className="form-required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...register}
      />
      {error && (
        <span className="form-error" id={`${inputId}-error`} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
