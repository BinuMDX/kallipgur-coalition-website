import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import SectionCard from '../ui/SectionCard';
import { MEMBERSHIP_STATES, MEMBERSHIP_COUNTRIES } from '@/lib/constants/membership';

interface AddressSectionProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function AddressSection({
  register,
  errors,
}: AddressSectionProps) {
  return (
    <SectionCard
      number={2}
      title="Residential Address"
      description="Your current residential address."
      id="section-address"
    >
      <FormInput
        name="streetAddress"
        label="Street Address"
        required
        placeholder="123 Example Street"
        register={register('streetAddress', {
          required: 'Street address is required',
        })}
        error={errors.streetAddress}
      />
      <div className="form-row form-row--2">
        <FormInput
          name="suburb"
          label="City / Suburb"
          required
          placeholder="Enter your city or suburb"
          register={register('suburb', {
            required: 'City or suburb is required',
          })}
          error={errors.suburb}
        />
        <FormSelect
          name="state"
          label="State"
          required
          register={register('state', {
            required: 'State is required',
          })}
          options={MEMBERSHIP_STATES}
          error={errors.state}
        />
      </div>
      <div className="form-row form-row--2">
        <FormInput
          name="postcode"
          label="Postcode"
          required
          placeholder="6000"
          register={register('postcode', {
            required: 'Postcode is required',
            pattern: {
              value: /^\d{4}$/,
              message: 'Please enter a valid 4-digit postcode',
            },
          })}
          error={errors.postcode}
        />
        <FormSelect
          name="country"
          label="Country"
          required
          register={register('country', {
            required: 'Country is required',
          })}
          options={MEMBERSHIP_COUNTRIES}
          error={errors.country}
        />
      </div>
    </SectionCard>
  );
}
