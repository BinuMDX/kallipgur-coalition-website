import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import SectionCard from '../ui/SectionCard';

interface PersonalInformationSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function PersonalInformationSection({
  register,
  errors,
}: PersonalInformationSectionProps) {
  return (
    <SectionCard
      number={1}
      title="Personal Information"
      description="Please provide your personal details. All required fields are marked with an asterisk."
      id="section-personal"
    >
      <div className="form-row form-row--2">
        <FormInput
          name="firstName"
          label="First Name"
          required
          placeholder="Enter your first name"
          register={register('firstName', {
            required: 'First name is required',
          })}
          error={errors.firstName}
        />
        <FormInput
          name="lastName"
          label="Last Name"
          required
          placeholder="Enter your last name"
          register={register('lastName', {
            required: 'Last name is required',
          })}
          error={errors.lastName}
        />
      </div>
      <div className="form-row form-row--2">
        <FormInput
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          register={register('dateOfBirth', {
            required: 'Date of birth is required',
          })}
          error={errors.dateOfBirth}
        />
        <FormSelect
          name="gender"
          label="Gender"
          required
          register={register('gender', {
            required: 'Please select your gender',
          })}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'non-binary', label: 'Non-binary' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ]}
          error={errors.gender}
        />
      </div>
      <div className="form-row form-row--2">
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          required
          placeholder="your@email.com"
          register={register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email}
        />
        <FormInput
          name="phone"
          label="Phone Number"
          type="tel"
          required
          placeholder="04XX XXX XXX"
          register={register('phone', {
            required: 'Phone number is required',
          })}
          error={errors.phone}
        />
      </div>
      <FormSelect
        name="preferredContact"
        label="Preferred Contact Method"
        register={register('preferredContact')}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'either', label: 'No preference' },
        ]}
        placeholder="Select preferred contact method"
      />
    </SectionCard>
  );
}
