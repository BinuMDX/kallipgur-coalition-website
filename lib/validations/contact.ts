import { z } from 'zod';

// ──────────────────────────────────────────────
// Schema (Zod v4 syntax)
// ──────────────────────────────────────────────

export const contactEnquirySchema = z.object({
  fullName: z
    .string({ error: 'Full name is required' })
    .trim()
    .min(1, 'Full name is required')
    .max(200, 'Full name must be 200 characters or less'),

  email: z
    .string({ error: 'Email address is required' })
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  phone: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .regex(/^[\d\s+\-().]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),

  subject: z
    .string({ error: 'Subject is required' })
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be 200 characters or less'),

  message: z
    .string({ error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message must be 3000 characters or less'),
});

// ──────────────────────────────────────────────
// Type export
// ──────────────────────────────────────────────

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
