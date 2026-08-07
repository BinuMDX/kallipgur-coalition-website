import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { ApplicationStatus, Prisma } from '@prisma/client';

// ──────────────────────────────────────────────
// GET /api/admin/membership
// Lists membership applications with pagination,
// search, filters, and sorting.
// ──────────────────────────────────────────────

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // ── 1. Authentication ─────────────────────
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    // ── 2. Parse query parameters ─────────────
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';
    const membershipType = searchParams.get('membershipType') || '';
    const sort = searchParams.get('sort') || 'newest';

    // ── 3. Build Prisma where clause ──────────
    const conditions: Prisma.MembershipApplicationWhereInput[] = [];

    // Search filter: across ID, first name, last name, email, phone
    if (search) {
      conditions.push({
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Status filter
    if (status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      conditions.push({ status: status as ApplicationStatus });
    }

    // Membership type filter
    if (membershipType) {
      conditions.push({ membershipType });
    }

    const where: Prisma.MembershipApplicationWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // ── 4. Build sort order ───────────────────
    let orderBy: Prisma.MembershipApplicationOrderByWithRelationInput;
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name-asc':
        orderBy = { firstName: 'asc' };
        break;
      case 'name-desc':
        orderBy = { firstName: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // ── 5. Execute queries ────────────────────
    const [data, total] = await Promise.all([
      prisma.membershipApplication.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          membershipType: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.membershipApplication.count({ where }),
    ]);

    // ── 6. Return response ────────────────────
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error(
      '[API /api/admin/membership] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
