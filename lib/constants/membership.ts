// Canonical Enum Values for Membership Form
// These values are shared between the frontend UI, Zod validation, and the backend.

// ── Canonical String Values (for Zod/Backend) ──

export const VALID_GENDERS = ['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'] as const;
export const VALID_CONTACT_METHODS = ['EMAIL', 'PHONE', 'EITHER'] as const;
export const VALID_MEMBERSHIP_TYPES = [
  'GENERAL_MEMBER',
  'COMMUNITY_MEMBER',
  'YOUTH_MEMBER',
  'ELDER',
  'VOLUNTEER',
  'SUPPORTER',
] as const;
export const VALID_COUNTRIES = ['AUSTRALIA', 'NEW_ZEALAND', 'OTHER'] as const;
export const VALID_INDIGENOUS_OPTIONS = ['YES', 'NO'] as const;
export const VALID_STATES = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'ACT', 'NT'] as const;
export const VALID_AREAS_OF_INTEREST = [
  'Community Programs',
  'Youth Programs',
  'Culture',
  'Education',
  'Events',
  'Fundraising',
  'Volunteering',
  'Administration',
] as const;

// ── Options Objects (for Frontend Select Components) ──

export const MEMBERSHIP_GENDERS = [
  { value: VALID_GENDERS[0], label: 'Male' },
  { value: VALID_GENDERS[1], label: 'Female' },
  { value: VALID_GENDERS[2], label: 'Non-binary' },
  { value: VALID_GENDERS[3], label: 'Prefer not to say' },
];

export const MEMBERSHIP_CONTACT_METHODS = [
  { value: VALID_CONTACT_METHODS[0], label: 'Email' },
  { value: VALID_CONTACT_METHODS[1], label: 'Phone' },
  { value: VALID_CONTACT_METHODS[2], label: 'No preference' },
];

export const MEMBERSHIP_TYPES = [
  { value: VALID_MEMBERSHIP_TYPES[0], label: 'General Member' },
  { value: VALID_MEMBERSHIP_TYPES[1], label: 'Community Member' },
  { value: VALID_MEMBERSHIP_TYPES[2], label: 'Youth Member' },
  { value: VALID_MEMBERSHIP_TYPES[3], label: 'Elder' },
  { value: VALID_MEMBERSHIP_TYPES[4], label: 'Volunteer' },
  { value: VALID_MEMBERSHIP_TYPES[5], label: 'Supporter' },
];

export const MEMBERSHIP_COUNTRIES = [
  { value: VALID_COUNTRIES[0], label: 'Australia' },
  { value: VALID_COUNTRIES[1], label: 'New Zealand' },
  { value: VALID_COUNTRIES[2], label: 'Other' },
];

export const MEMBERSHIP_INDIGENOUS_OPTIONS = [
  { value: VALID_INDIGENOUS_OPTIONS[0], label: 'Yes' },
  { value: VALID_INDIGENOUS_OPTIONS[1], label: 'No' },
];

export const MEMBERSHIP_STATES = [
  { value: VALID_STATES[0], label: 'Western Australia' },
  { value: VALID_STATES[1], label: 'New South Wales' },
  { value: VALID_STATES[2], label: 'Victoria' },
  { value: VALID_STATES[3], label: 'Queensland' },
  { value: VALID_STATES[4], label: 'South Australia' },
  { value: VALID_STATES[5], label: 'Tasmania' },
  { value: VALID_STATES[6], label: 'Australian Capital Territory' },
  { value: VALID_STATES[7], label: 'Northern Territory' },
];

export const MEMBERSHIP_AREAS_OF_INTEREST_OPTIONS = VALID_AREAS_OF_INTEREST;
