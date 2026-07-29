'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ProgressIndicator from '../ui/ProgressIndicator';
import FormButtons from '../ui/FormButtons';
import PersonalInformationSection from './PersonalInformationSection';
import AddressSection from './AddressSection';
import MembershipDetailsSection from './MembershipDetailsSection';
import AboutSection from './AboutSection';
import EmergencyContactSection from './EmergencyContactSection';
import DocumentsSection from './DocumentsSection';
import DeclarationSection from './DeclarationSection';

export interface MembershipFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  // Address
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  // Membership Details
  membershipType: string;
  occupation: string;
  traditionalCountry: string;
  aboriginalOrTorresStraitIslander: string;
  // About
  reasonForJoining: string;
  skillsAndExperience: string;
  areasOfInterest: string[];
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  // Declaration
  informationDeclarationAccepted: boolean;
  privacyPolicyAccepted: boolean;
  membershipTermsAccepted: boolean;
}

const sectionSteps = [
  'Personal',
  'Address',
  'Membership',
  'About You',
  'Emergency',
  'Documents',
  'Declaration',
];

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MembershipFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      preferredContactMethod: '',
      streetAddress: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      membershipType: '',
      occupation: '',
      traditionalCountry: '',
      aboriginalOrTorresStraitIslander: '',
      reasonForJoining: '',
      skillsAndExperience: '',
      areasOfInterest: [],
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      informationDeclarationAccepted: false,
      privacyPolicyAccepted: false,
      membershipTermsAccepted: false,
    },
  });

  // Track active section on scroll
  React.useEffect(() => {
    const sections = [
      'section-personal',
      'section-address',
      'section-membership',
      'section-about',
      'section-emergency',
      'section-documents',
      'section-declaration',
    ];

    const handleScroll = () => {
      const offset = 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setCurrentStep(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = () => {
    // Frontend only — no API call
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    reset();
    setSubmitted(false);
    setCurrentStep(0);
  };

  if (submitted) {
    return (
      <div className="membership-form-wrap" data-animate="fade-up">
        <div className="form-success">
          <div className="form-success-icon" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="#C9962E" strokeWidth="2" fill="rgba(201, 150, 46, 0.08)" />
              <path d="M20 32l8 8 16-16" stroke="#C9962E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="form-success-title">Application Submitted</h3>
          <p className="form-success-desc">
            Thank you for your interest in becoming a member of Kallipgur Coalition Aboriginal Corporation. 
            Your application has been received and will be reviewed by our Membership Committee. 
            We will be in touch within 10 business days.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClear}
            style={{ marginTop: '1.5rem' }}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-form-wrap" data-animate="fade-up">
      <ProgressIndicator steps={sectionSteps} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <PersonalInformationSection register={register} errors={errors} />
        <AddressSection register={register} errors={errors} />
        <MembershipDetailsSection register={register} errors={errors} />
        <AboutSection register={register} errors={errors} />
        <EmergencyContactSection register={register} errors={errors} />
        <DocumentsSection />
        <DeclarationSection register={register} errors={errors} />
        <FormButtons onClear={handleClear} isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}
