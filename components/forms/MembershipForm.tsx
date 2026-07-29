'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
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

/** All field names in MembershipFormData — used for safe setError mapping */
const VALID_FIELD_NAMES: ReadonlySet<string> = new Set<FieldPath<MembershipFormData>>([
  'firstName',
  'lastName',
  'dateOfBirth',
  'gender',
  'email',
  'phone',
  'preferredContactMethod',
  'streetAddress',
  'suburb',
  'state',
  'postcode',
  'country',
  'membershipType',
  'occupation',
  'traditionalCountry',
  'aboriginalOrTorresStraitIslander',
  'reasonForJoining',
  'skillsAndExperience',
  'areasOfInterest',
  'emergencyContactName',
  'emergencyContactRelationship',
  'emergencyContactPhone',
  'informationDeclarationAccepted',
  'privacyPolicyAccepted',
  'membershipTermsAccepted',
]);

const sectionSteps = [
  'Personal',
  'Address',
  'Membership',
  'About You',
  'Emergency',
  'Documents',
  'Declaration',
];

interface SubmissionResult {
  applicationId: string;
}

export default function MembershipForm() {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const formTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
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

  const onSubmit = async (formData: MembershipFormData) => {
    // Clear any previous general error
    setGeneralError(null);

    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 201 && result.success) {
        // ── Success ──
        setSubmissionResult({ applicationId: result.applicationId });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (response.status === 400 && result.errors) {
        // ── Validation errors — map back to form fields ──
        const serverErrors = result.errors as Record<string, string>;
        let mappedCount = 0;

        for (const [field, message] of Object.entries(serverErrors)) {
          if (VALID_FIELD_NAMES.has(field)) {
            setError(field as FieldPath<MembershipFormData>, {
              type: 'server',
              message,
            });
            mappedCount++;
          }
        }

        if (mappedCount > 0) {
          // Scroll to the first field with an error
          const firstErrorField = Object.keys(serverErrors).find((f) =>
            VALID_FIELD_NAMES.has(f),
          );
          if (firstErrorField) {
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              if (el instanceof HTMLElement) el.focus();
            }
          }
        } else {
          // Server returned 400 but no mappable field errors
          setGeneralError(
            result.message || 'Please check the submitted information and try again.',
          );
          formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // ── Other server errors (500, etc.) ──
      setGeneralError(
        'Unable to submit your application at this time. Please try again.',
      );
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      // ── Network failure or unexpected error ──
      setGeneralError(
        "We couldn't submit your application right now. Please check your connection and try again.",
      );
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    reset();
    setSubmissionResult(null);
    setGeneralError(null);
    setCurrentStep(0);
  };

  const handleReturnToForm = () => {
    reset();
    setSubmissionResult(null);
    setGeneralError(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Success State ──
  if (submissionResult) {
    return (
      <div className="membership-form-wrap" data-animate="fade-up">
        <div className="form-success" role="status" aria-live="polite">
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
          <p className="form-success-ref">
            Your application reference is: <strong>{submissionResult.applicationId}</strong>
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReturnToForm}
            style={{ marginTop: '1.5rem' }}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  // ── Form State ──
  return (
    <div className="membership-form-wrap" data-animate="fade-up" ref={formTopRef}>
      <ProgressIndicator steps={sectionSteps} currentStep={currentStep} />

      {/* General error banner */}
      {generalError && (
        <div className="form-banner form-banner--error" role="alert" aria-live="assertive">
          <p>{generalError}</p>
          <button
            type="button"
            className="form-banner-dismiss"
            onClick={() => setGeneralError(null)}
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}

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
