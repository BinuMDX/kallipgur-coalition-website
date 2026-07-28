import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import SectionCard from '../ui/SectionCard';

interface MembershipDetailsSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function MembershipDetailsSection({
  register,
  errors,
}: MembershipDetailsSectionProps) {
  return (
    <SectionCard
      number={3}
      title="Membership Details"
      description="Tell us about the type of membership you are applying for."
      id="section-membership"
    >
      <FormSelect
        name="membershipType"
        label="Membership Type"
        required
        register={register('membershipType', {
          required: 'Please select a membership type',
        })}
        options={[
          { value: 'general', label: 'General Member' },
          { value: 'community', label: 'Community Member' },
          { value: 'youth', label: 'Youth Member' },
          { value: 'elder', label: 'Elder' },
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'supporter', label: 'Supporter' },
        ]}
        placeholder="Select membership type"
        error={errors.membershipType}
      />
      <FormInput
        name="occupation"
        label="Current Occupation"
        placeholder="Enter your current occupation"
        register={register('occupation')}
      />
      <FormInput
        name="traditionalCountry"
        label="Traditional Country / Community"
        placeholder="e.g. Yabaru Country, Noongar Nation"
        register={register('traditionalCountry')}
      />
      <FormSelect
        name="isIndigenous"
        label="Aboriginal and/or Torres Strait Islander"
        required
        register={register('isIndigenous', {
          required: 'This field is required',
        })}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        placeholder="Select an option"
        error={errors.isIndigenous}
      />
    </SectionCard>
  );
}
