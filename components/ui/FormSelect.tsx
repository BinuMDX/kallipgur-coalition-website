import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  id?: string;
  placeholder?: string;
}

export default function FormSelect({
  name,
  label,
  options,
  required = false,
  error,
  register,
  id,
  placeholder = 'Select an option',
}: FormSelectProps) {
  const selectId = id || `field-${name}`;

  return (
    <div className="form-group">
      <label htmlFor={selectId}>
        {label}
        {required && <span className="form-required" aria-hidden="true"> *</span>}
      </label>
      <select
        id={selectId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...register}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="form-error" id={`${selectId}-error`} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
