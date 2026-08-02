import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { statusUpdateSchema, validateStatusTransition } from '@/lib/validations/status';

/**
 * PATCH /api/membership/[applicationId]/status
 * 
 * ADMIN-ONLY Endpoint:
 * This endpoint allows updating the status of a membership application.
 * Admin authentication and authorization will be fully implemented before this endpoint is exposed in production.
 * A temporary development guard is enabled for non-development environments.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const { applicationId } = params;

    // ── 1. NextAuth Authorization ─────────────────
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Admin authentication required.',
        },
        { status: 401 }
      );
    }

    // ── 2. Parse request body ───────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body. Please send valid JSON.',
        },
        { status: 400 }
      );
    }

    // ── 3. Validate status value ─────────────────────
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid membership application status.',
        },
        { status: 400 }
      );
    }

    const { status: newStatus } = parsed.data;

    // ── 4. Retrieve existing application ────────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true },
    });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: 'Membership application not found.',
        },
        { status: 404 }
      );
    }

    // ── 5. Validate status transition ───────────────
    const isValidTransition = validateStatusTransition(application.status, newStatus);
    if (!isValidTransition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid membership application status transition.',
        },
        { status: 400 }
      );
    }

    // ── 6. Update database record ───────────────────
    const updatedApplication = await prisma.membershipApplication.update({
      where: { id: applicationId },
      data: { status: newStatus },
      select: { id: true, status: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully.',
      status: updatedApplication.status,
    });

  } catch (error) {
    // Never expose database or internal credentials to the client
    console.error(
      `[API /api/membership/[id]/status] Unexpected error for ID ${params.applicationId}:`,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
