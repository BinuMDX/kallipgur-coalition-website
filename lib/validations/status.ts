import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

export const statusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const, {
    message: 'Invalid membership application status.',
  }),
});

/**
 * Validates whether a transition from currentStatus to newStatus is allowed.
 * Allowed transitions:
 * - PENDING -> UNDER_REVIEW
 * - PENDING -> REJECTED
 * - UNDER_REVIEW -> APPROVED
 * - UNDER_REVIEW -> REJECTED
 * Self-transitions (no change) are also considered valid.
 */
export function validateStatusTransition(
  currentStatus: ApplicationStatus,
  newStatus: ApplicationStatus
): boolean {
  if (currentStatus === newStatus) {
    return true;
  }

  if (currentStatus === 'PENDING') {
    return newStatus === 'UNDER_REVIEW' || newStatus === 'REJECTED';
  }

  if (currentStatus === 'UNDER_REVIEW') {
    return newStatus === 'APPROVED' || newStatus === 'REJECTED';
  }

  return false;
}
