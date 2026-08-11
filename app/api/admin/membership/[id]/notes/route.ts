import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const adminId = session.user.id || 'unknown';
    const adminName = session.user.name || 'Administrator';
    const { id } = params;

    // ── 2. Parse and Validate Request ─────────
    let body: { note?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const { note } = body;
    if (!note || !note.trim()) {
      return NextResponse.json(
        { success: false, message: 'Note content cannot be empty' },
        { status: 400 }
      );
    }

    // ── 3. Check Application Existence ────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Membership application not found' },
        { status: 404 }
      );
    }

    // ── 4. DB Operations: Transaction ─────────
    const newNote = await prisma.$transaction(async (tx) => {
      // 1. Create the Note
      const createdNote = await tx.membershipNote.create({
        data: {
          applicationId: id,
          adminId,
          adminName,
          note: note.trim(),
        },
      });

      // 2. Add History/Audit Record
      await tx.membershipAuditLog.create({
        data: {
          applicationId: id,
          adminId,
          adminName,
          action: 'NOTE_ADDED',
          reviewNote: note.trim(),
        },
      });

      return createdNote;
    });

    return NextResponse.json({
      success: true,
      message: 'Note added successfully',
      data: newNote,
    });
  } catch (error) {
    console.error(
      `[API POST /api/admin/membership/${params?.id}/notes] Unexpected error:`,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
