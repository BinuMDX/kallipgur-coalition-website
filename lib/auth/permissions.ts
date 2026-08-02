import { AdminRole } from '@prisma/client';

export type UserSession = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
};

/**
 * Checks if a user has SUPER_ADMIN privileges.
 */
export function isSuperAdmin(user?: UserSession | null): boolean {
  if (!user) return false;
  return user.role === AdminRole.SUPER_ADMIN;
}

/**
 * Checks if a user has at least ADMIN privileges.
 */
export function isAdmin(user?: UserSession | null): boolean {
  if (!user) return false;
  return user.role === AdminRole.ADMIN || user.role === AdminRole.SUPER_ADMIN;
}

/**
 * Validates if the given user can manage membership application statuses.
 * Currently, both ADMIN and SUPER_ADMIN can manage statuses.
 */
export function canManageStatus(user?: UserSession | null): boolean {
  return isAdmin(user);
}
