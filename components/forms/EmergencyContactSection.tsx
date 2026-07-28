import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import SectionCard from '../ui/SectionCard';

interface EmergencyContactSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function EmergencyContactSection({
  register,
  errors,
}: EmergencyContactSectionProps) {
  return (
    <SectionCard
      number={5}
      title="Emergency Contact"
      description="Please provide the details of someone we can contact in case of an emergency."
      id="section-emergency"
    >
      <FormInput
        name="emergencyName"
        label="Full Name"
        placeholder="Emergency contact full name"
        register={register('emergencyName')}
        error={errors.emergencyName}
      />
      <div className="form-row form-row--2">
        <FormInput
          name="emergencyRelationship"
          label="Relationship"
          placeholder="e.g. Parent, Sibling, Partner"
          register={register('emergencyRelationship')}
          error={errors.emergencyRelationship}
        />
        <FormInput
          name="emergencyPhone"
          label="Phone Number"
          type="tel"
          placeholder="04XX XXX XXX"
          register={register('emergencyPhone')}
          error={errors.emergencyPhone}
        />
      </div>
    </SectionCard>
  );
}
