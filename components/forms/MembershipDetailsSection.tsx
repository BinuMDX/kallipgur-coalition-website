import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import SectionCard from '../ui/SectionCard';
import { MEMBERSHIP_TYPES, MEMBERSHIP_INDIGENOUS_OPTIONS } from '@/lib/constants/membership';

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
        options={MEMBERSHIP_TYPES}
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
        name="aboriginalOrTorresStraitIslander"
        label="Aboriginal and/or Torres Strait Islander"
        required
        register={register('aboriginalOrTorresStraitIslander', {
          required: 'This field is required',
        })}
        options={MEMBERSHIP_INDIGENOUS_OPTIONS}
        placeholder="Select an option"
        error={errors.aboriginalOrTorresStraitIslander}
      />
    </SectionCard>
  );
}
