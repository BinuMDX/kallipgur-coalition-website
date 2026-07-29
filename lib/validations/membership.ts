import { z } from 'zod';

import {
  VALID_GENDERS,
  VALID_CONTACT_METHODS,
  VALID_MEMBERSHIP_TYPES,
  VALID_STATES,
  VALID_COUNTRIES,
  VALID_INDIGENOUS_OPTIONS,
  VALID_AREAS_OF_INTEREST,
} from '@/lib/constants/membership';

// ──────────────────────────────────────────────
// Schema (Zod v4 syntax)
// ──────────────────────────────────────────────

export const membershipApplicationSchema = z.object({
  // ── Personal Information ──────────────────
  firstName: z
    .string({ error: 'First name is required' })
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),

  lastName: z
    .string({ error: 'Last name is required' })
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less'),

  dateOfBirth: z
    .string({ error: 'Date of birth is required' })
    .trim()
    .min(1, 'Date of birth is required')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Please provide a valid date' },
    )
    .refine(
      (val) => {
        const date = new Date(val);
        return date < new Date();
      },
      { message: 'Date of birth must be in the past' },
    ),

  gender: z.enum(VALID_GENDERS, {
    error: 'Please select a valid gender option',
  }),

  email: z
    .string({ error: 'Email address is required' })
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  phone: z
    .string({ error: 'Phone number is required' })
    .trim()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number is too long')
    .regex(/^[\d\s+\-()]+$/, 'Please enter a valid phone number'),

  preferredContactMethod: z
    .enum(VALID_CONTACT_METHODS, {
      error: 'Please select a valid contact method',
    })
    .nullable()
    .optional(),

  // ── Address ───────────────────────────────
  streetAddress: z
    .string({ error: 'Street address is required' })
    .trim()
    .min(1, 'Street address is required')
    .max(255, 'Street address must be 255 characters or less'),

  suburb: z
    .string({ error: 'City or suburb is required' })
    .trim()
    .min(1, 'City or suburb is required')
    .max(100, 'City or suburb must be 100 characters or less'),

  state: z.enum(VALID_STATES, {
    error: 'Please select a valid state',
  }),

  postcode: z
    .string({ error: 'Postcode is required' })
    .trim()
    .min(1, 'Postcode is required')
    .regex(/^\d{4}$/, 'Please enter a valid 4-digit postcode'),

  country: z.enum(VALID_COUNTRIES, {
    error: 'Please select a valid country',
  }),

  // ── Membership ────────────────────────────
  membershipType: z.enum(VALID_MEMBERSHIP_TYPES, {
    error: 'Please select a valid membership type',
  }),

  traditionalCountry: z
    .string()
    .trim()
    .max(200, 'Traditional country must be 200 characters or less')
    .nullable()
    .optional(),

  aboriginalOrTorresStraitIslander: z.enum(VALID_INDIGENOUS_OPTIONS, {
    error: 'This field is required',
  }),

  occupation: z
    .string()
    .trim()
    .max(200, 'Occupation must be 200 characters or less')
    .nullable()
    .optional(),

  // ── About ─────────────────────────────────
  reasonForJoining: z
    .string()
    .trim()
    .max(2000, 'Response must be 2000 characters or less')
    .nullable()
    .optional(),

  skillsAndExperience: z
    .string()
    .trim()
    .max(2000, 'Response must be 2000 characters or less')
    .nullable()
    .optional(),

  areasOfInterest: z
    .array(z.string().trim().max(100))
    .default([]),

  // ── Emergency Contact ─────────────────────
  emergencyContactName: z
    .string()
    .trim()
    .max(200, 'Name must be 200 characters or less')
    .nullable()
    .optional(),

  emergencyContactRelationship: z
    .string()
    .trim()
    .max(100, 'Relationship must be 100 characters or less')
    .nullable()
    .optional(),

  emergencyContactPhone: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .nullable()
    .optional(),

  // ── Documents ─────────────────────────────
  identityDocumentUrl: z
    .string()
    .url('Please provide a valid URL')
    .nullable()
    .optional(),

  supportingDocumentUrl: z
    .string()
    .url('Please provide a valid URL')
    .nullable()
    .optional(),

  profilePhotoUrl: z
    .string()
    .url('Please provide a valid URL')
    .nullable()
    .optional(),

  // ── Declarations ──────────────────────────
  informationDeclarationAccepted: z.literal(true, {
    error: 'You must declare the information is true and correct',
  }),

  privacyPolicyAccepted: z.literal(true, {
    error: 'You must agree to the Privacy Policy',
  }),

  membershipTermsAccepted: z.literal(true, {
    error: 'You must agree to the Membership Terms',
  }),
});

// ──────────────────────────────────────────────
// Type export
// ──────────────────────────────────────────────

export type MembershipApplicationInput = z.infer<typeof membershipApplicationSchema>;
