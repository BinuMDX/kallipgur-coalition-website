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
            {...register('informationDeclarationAccepted', {
              required: 'You must declare the information is true and correct',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I declare that the information provided is true and correct.
          </span>
        </label>
        {errors.informationDeclarationAccepted && (
          <span className="form-error" role="alert">
            {errors.informationDeclarationAccepted.message}
          </span>
        )}

        <label className="form-checkbox form-checkbox--declaration">
          <input
            type="checkbox"
            {...register('privacyPolicyAccepted', {
              required: 'You must agree to the Privacy Policy',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I agree to the <a href="#" className="form-inline-link">Privacy Policy</a>.
          </span>
        </label>
        {errors.privacyPolicyAccepted && (
          <span className="form-error" role="alert">
            {errors.privacyPolicyAccepted.message}
          </span>
        )}

        <label className="form-checkbox form-checkbox--declaration">
          <input
            type="checkbox"
            {...register('membershipTermsAccepted', {
              required: 'You must agree to the Membership Terms',
            })}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className="checkbox-label-text">
            I agree to the <a href="#" className="form-inline-link">Membership Terms</a>.
          </span>
        </label>
        {errors.membershipTermsAccepted && (
          <span className="form-error" role="alert">
            {errors.membershipTermsAccepted.message}
          </span>
        )}
      </div>
    </SectionCard>
  );
}
