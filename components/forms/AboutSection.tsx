import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormTextarea from '../ui/FormTextarea';
import CheckboxGroup from '../ui/CheckboxGroup';
import SectionCard from '../ui/SectionCard';

interface AboutSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

const interestOptions = [
  'Community Programs',
  'Youth Programs',
  'Culture',
  'Education',
  'Events',
  'Fundraising',
  'Volunteering',
  'Administration',
];

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
        name="whyJoin"
        label="Why would you like to become a member?"
        placeholder="Tell us what motivates you to join Kallipgur Coalition Aboriginal Corporation and how you'd like to contribute to our community."
        rows={5}
        register={register('whyJoin')}
        error={errors.whyJoin}
      />
      <FormTextarea
        name="skillsExperience"
        label="Skills & Experience"
        placeholder="Describe any relevant skills, qualifications, or experience you have that could benefit the community."
        rows={4}
        register={register('skillsExperience')}
        error={errors.skillsExperience}
      />
      <CheckboxGroup
        name="areasOfInterest"
        label="Areas of Interest"
        options={interestOptions}
        register={register('areasOfInterest')}
      />
    </SectionCard>
  );
}
