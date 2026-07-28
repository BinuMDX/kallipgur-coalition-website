import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import SectionCard from '../ui/SectionCard';

interface DeclarationSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function DeclarationSection({
  register,
  errors,
}: DeclarationSectionProps) {
  return (
    <SectionCard
      number={7}
      title="Declaration"
      description="Please read and agree to the following declarations before submitting your application."
      id="section-declaration"
    >
      <div className="declaration-checkboxes">
        <label className="form-checkbox form-checkbox--declaration">
          <input
            type="checkbox"
            {...register('declareTruth', {
              required: 'You must declare the information is true and correct',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I declare that the information provided is true and correct.
          </span>
        </label>
        {errors.declareTruth && (
          <span className="form-error" role="alert">
            {errors.declareTruth.message}
          </span>
        )}

        <label className="form-checkbox form-checkbox--declaration">
          <input
            type="checkbox"
            {...register('agreePrivacy', {
              required: 'You must agree to the Privacy Policy',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I agree to the <a href="#" className="form-inline-link">Privacy Policy</a>.
          </span>
        </label>
        {errors.agreePrivacy && (
          <span className="form-error" role="alert">
            {errors.agreePrivacy.message}
          </span>
        )}

        <label className="form-checkbox form-checkbox--declaration">
          <input
            type="checkbox"
            {...register('agreeTerms', {
              required: 'You must agree to the Membership Terms',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I agree to the <a href="#" className="form-inline-link">Membership Terms</a>.
          </span>
        </label>
        {errors.agreeTerms && (
          <span className="form-error" role="alert">
            {errors.agreeTerms.message}
          </span>
        )}
      </div>
    </SectionCard>
  );
}
