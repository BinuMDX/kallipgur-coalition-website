import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: string[];
  register: UseFormRegisterReturn;
  id?: string;
}

export default function CheckboxGroup({
  name,
  label,
  options,
  register,
  id,
}: CheckboxGroupProps) {
  const groupId = id || `field-${name}`;

  return (
    <div className="form-group">
      <label id={`${groupId}-label`}>{label}</label>
      <div className="checkbox-group" role="group" aria-labelledby={`${groupId}-label`}>
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`;
          return (
            <label key={option} htmlFor={optionId} className="form-checkbox">
              <input
                type="checkbox"
                id={optionId}
                value={option}
                {...register}
              />
              <span className="checkbox-visual" aria-hidden="true"></span>
              <span className="checkbox-label-text">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
