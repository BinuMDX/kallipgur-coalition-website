import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MembershipFormData } from './MembershipForm';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import SectionCard from '../ui/SectionCard';

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
          name="city"
          label="City / Suburb"
          required
          placeholder="Enter your city or suburb"
          register={register('city', {
            required: 'City or suburb is required',
          })}
          error={errors.city}
        />
        <FormSelect
          name="state"
          label="State"
          required
          register={register('state', {
            required: 'State is required',
          })}
          options={[
            { value: 'WA', label: 'Western Australia' },
            { value: 'NSW', label: 'New South Wales' },
            { value: 'VIC', label: 'Victoria' },
            { value: 'QLD', label: 'Queensland' },
            { value: 'SA', label: 'South Australia' },
            { value: 'TAS', label: 'Tasmania' },
            { value: 'ACT', label: 'Australian Capital Territory' },
            { value: 'NT', label: 'Northern Territory' },
          ]}
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
          options={[
            { value: 'AU', label: 'Australia' },
            { value: 'NZ', label: 'New Zealand' },
            { value: 'other', label: 'Other' },
          ]}
          error={errors.country}
        />
      </div>
    </SectionCard>
  );
}
