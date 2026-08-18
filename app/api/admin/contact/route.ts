import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { EnquiryStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

// ──────────────────────────────────────────────
// GET /api/admin/contact
// Lists contact enquiries with search, status filtering,
// sorting, pagination, and real summary statistics.
// ──────────────────────────────────────────────

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
    const sort = searchParams.get('sort') || 'newest';

    // ── 3. Build Prisma where clause ──────────
    const conditions: Prisma.ContactEnquiryWhereInput[] = [];

    // Search filter across fullName, email, subject, message
    if (search) {
      conditions.push({
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Status filter
    if (status && Object.values(EnquiryStatus).includes(status as EnquiryStatus)) {
      conditions.push({ status: status as EnquiryStatus });
    }

    const where: Prisma.ContactEnquiryWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // ── 4. Build sort order ───────────────────
    let orderBy: Prisma.ContactEnquiryOrderByWithRelationInput;
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name-asc':
        orderBy = { fullName: 'asc' };
        break;
      case 'name-desc':
        orderBy = { fullName: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // ── 5. Real database stats & listing queries ──
    const [data, total, totalAll, countNew, countRead, countInProgress, countResolved] = await Promise.all([
      prisma.contactEnquiry.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          subject: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.contactEnquiry.count({ where }),
      prisma.contactEnquiry.count(),
      prisma.contactEnquiry.count({ where: { status: 'NEW' } }),
      prisma.contactEnquiry.count({ where: { status: 'READ' } }),
      prisma.contactEnquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contactEnquiry.count({ where: { status: 'RESOLVED' } }),
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
      stats: {
        total: totalAll,
        new: countNew,
        read: countRead,
        inProgress: countInProgress,
        resolved: countResolved,
      },
    });
  } catch (error) {
    console.error(
      '[API /api/admin/contact] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
