import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import {
  sendMembershipStatusUnderReview,
  sendMembershipStatusApproved,
  sendMembershipStatusRejected,
} from '@/lib/email/membershipEmails';

export const dynamic = 'force-dynamic';

export async function PATCH(
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
    let body: { status?: string; reviewNote?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const { status, reviewNote } = body;
    if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing application status' },
        { status: 400 }
      );
    }

    // ── 3. Retrieve Application ───────────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Membership application not found' },
        { status: 404 }
      );
    }

    const previousStatus = application.status;
    const newStatus = status as ApplicationStatus;

    // Avoid redundant status updates if status is unchanged and no note is added
    if (previousStatus === newStatus && !reviewNote) {
      return NextResponse.json({
        success: true,
        message: 'Status is already set to this value.',
      });
    }

    // ── 4. Transaction: DB Updates ────────────
    const updatedApplication = await prisma.$transaction(async (tx) => {
      // Create Note if provided
      if (reviewNote?.trim()) {
        await tx.membershipNote.create({
          data: {
            applicationId: id,
            adminId,
            adminName,
            note: reviewNote.trim(),
          },
        });
      }

      // Record in Audit History
      await tx.membershipAuditLog.create({
        data: {
          applicationId: id,
          adminId,
          adminName,
          action: 'STATUS_CHANGE',
          previousStatus,
          newStatus,
          reviewNote: reviewNote?.trim() || null,
        },
      });

      // Update Application Status
      return await tx.membershipApplication.update({
        where: { id },
        data: {
          status: newStatus,
        },
      });
    });

    // ── 5. Email Notification ─────────────────
    try {
      const emailData = {
        id: updatedApplication.id,
        firstName: updatedApplication.firstName,
        lastName: updatedApplication.lastName,
        email: updatedApplication.email,
        phone: updatedApplication.phone,
        membershipType: updatedApplication.membershipType,
        traditionalCountry: updatedApplication.traditionalCountry,
        createdAt: updatedApplication.createdAt,
        status: updatedApplication.status,
      };

      if (newStatus === ApplicationStatus.UNDER_REVIEW) {
        await sendMembershipStatusUnderReview(emailData, reviewNote);
      } else if (newStatus === ApplicationStatus.APPROVED) {
        await sendMembershipStatusApproved(emailData, reviewNote);
      } else if (newStatus === ApplicationStatus.REJECTED) {
        await sendMembershipStatusRejected(emailData, reviewNote);
      }

      // Record email event in Audit Log (non-blocking / auxiliary log)
      await prisma.membershipAuditLog.create({
        data: {
          applicationId: id,
          adminId: 'system',
          adminName: 'System Email',
          action: 'EMAIL_SENT',
          newStatus,
          reviewNote: `Status update email sent to ${updatedApplication.email}`,
        },
      }).catch(console.error);

    } catch (emailError) {
      console.error(
        `[API PATCH /api/admin/membership/${id}/status] Failed to send status email notification:`,
        emailError
      );
      // We don't fail the whole request if email fails, but we register it
    }

    return NextResponse.json({
      success: true,
      message: `Status updated successfully to ${newStatus}`,
      data: updatedApplication,
    });
  } catch (error) {
    console.error(
      `[API PATCH /api/admin/membership/${params?.id}/status] Unexpected error:`,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
