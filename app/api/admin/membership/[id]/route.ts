import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ── 1. Authentication Check ───────────────
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // ── 2. Query Database ─────────────────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'asc' },
        },
        auditLogs: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Membership application not found' },
        { status: 404 }
      );
    }

    // ── 3. Return Successful Response ─────────
    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      `[API GET /api/admin/membership/${params?.id}] Unexpected error:`,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
