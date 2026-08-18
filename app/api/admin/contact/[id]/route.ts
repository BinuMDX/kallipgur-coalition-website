import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { EnquiryStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// ──────────────────────────────────────────────
// GET /api/admin/contact/[id]
// Returns a single enquiry by ID.
// If current status is NEW, automatically updates it to READ.
// ──────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid enquiry ID' },
        { status: 400 },
      );
    }

    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Contact enquiry not found' },
        { status: 404 },
      );
    }

    // Auto-mark NEW as READ when viewed by admin
    if (enquiry.status === 'NEW') {
      const updated = await prisma.contactEnquiry.update({
        where: { id },
        data: { status: 'READ' },
      });
      return NextResponse.json({
        success: true,
        data: updated,
      });
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error(
      '[API /api/admin/contact/[id]] GET error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────
// PATCH /api/admin/contact/[id]
// Updates the status of a contact enquiry.
// ──────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid enquiry ID' },
        { status: 400 },
      );
    }

    let body: { status?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { status } = body;
    if (!status || !Object.values(EnquiryStatus).includes(status as EnquiryStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status value. Allowed: NEW, READ, IN_PROGRESS, RESOLVED, ARCHIVED',
        },
        { status: 400 },
      );
    }

    const existing = await prisma.contactEnquiry.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Contact enquiry not found' },
        { status: 404 },
      );
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status: status as EnquiryStatus },
    });

    return NextResponse.json({
      success: true,
      message: `Enquiry status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    console.error(
      '[API /api/admin/contact/[id]] PATCH error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { success: false, message: 'Failed to update enquiry status.' },
      { status: 500 },
    );
  }
}
