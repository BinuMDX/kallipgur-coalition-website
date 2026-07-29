import { z } from 'zod';

export const ALLOWED_MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg', // alias for jpeg mime
  png: 'image/png',
} as const;

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];

export const MAX_FILES_PER_TYPE = {
  IDENTITY: 1,
  PROFILE_PHOTO: 1,
  SUPPORTING_DOCUMENT: 5,
} as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[keyof typeof ALLOWED_MIME_TYPES];

// The actual file object in a browser environment or next API request will be checked manually
// because FormData provides File objects which Zod handles via `z.instanceof(File)` or `z.any()`.
// This schema is for metadata validating.

export const documentUploadMetadataSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  documentType: z.enum(['IDENTITY', 'SUPPORTING_DOCUMENT', 'PROFILE_PHOTO'], {
    error: 'Invalid document type',
  }),
});
