import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormTextarea from '../ui/FormTextarea';
import CheckboxGroup from '../ui/CheckboxGroup';
import SectionCard from '../ui/SectionCard';
import { MEMBERSHIP_AREAS_OF_INTEREST_OPTIONS } from '@/lib/constants/membership';

interface AboutSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}


export default function AboutSection({
  register,
  errors,
}: AboutSectionProps) {
  return (
    <SectionCard
      number={4}
      title="About You"
      description="Help us understand your interests and what you can bring to our community."
      id="section-about"
    >
      <FormTextarea
        name="reasonForJoining"
        label="Why would you like to become a member?"
        placeholder="Tell us what motivates you to join Kallipgur Coalition Aboriginal Corporation and how you'd like to contribute to our community."
        rows={5}
        register={register('reasonForJoining')}
        error={errors.reasonForJoining}
      />
      <FormTextarea
        name="skillsAndExperience"
        label="Skills & Experience"
        placeholder="Describe any relevant skills, qualifications, or experience you have that could benefit the community."
        rows={4}
        register={register('skillsAndExperience')}
        error={errors.skillsAndExperience}
      />
      <CheckboxGroup
        name="areasOfInterest"
        label="Areas of Interest"
        options={Array.from(MEMBERSHIP_AREAS_OF_INTEREST_OPTIONS)}
        register={register('areasOfInterest')}
      />
    </SectionCard>
  );
}
