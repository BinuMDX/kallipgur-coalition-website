import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  sendMembershipApplicantConfirmation,
  sendMembershipAdminNotification,
} from '@/lib/email/membershipEmails';

export async function POST(request: NextRequest) {
  let applicationId: string | undefined;

  try {
    // ── 1. Parse request body ─────────────────
    let body: any;
    try {
      body = await request.json();
      applicationId = body.applicationId;
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body.' },
        { status: 400 },
      );
    }

    if (!applicationId || typeof applicationId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid applicationId.' },
        { status: 400 },
      );
    }

    // ── 2. Retrieve application ───────────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Membership application not found.' },
        { status: 404 },
      );
    }

    // ── 3. Retrieve document count ────────────
    const documentCount = await prisma.membershipDocument.count({
      where: { applicationId },
    });

    // ── 4. Send applicant confirmation ────────
    let applicantEmailSent = application.applicantEmailSent;
    if (!applicantEmailSent) {
      try {
        await sendMembershipApplicantConfirmation(application);
        applicantEmailSent = true;
        await prisma.membershipApplication.update({
          where: { id: applicationId },
          data: { applicantEmailSent: true },
        });
      } catch (err) {
        console.error(
          `[Email System] Failed to send applicant confirmation for application ID: ${applicationId}. Error:`,
          err instanceof Error ? err.message : 'Unknown error',
        );
      }
    }

    // ── 5. Send admin notification ────────────
    let adminEmailSent = application.adminEmailSent;
    if (!adminEmailSent) {
      try {
        await sendMembershipAdminNotification(application, documentCount);
        adminEmailSent = true;
        await prisma.membershipApplication.update({
          where: { id: applicationId },
          data: { adminEmailSent: true },
        });
      } catch (err) {
        console.error(
          `[Email System] Failed to send admin notification for application ID: ${applicationId}. Error:`,
          err instanceof Error ? err.message : 'Unknown error',
        );
      }
    }

    // ── 6. Return response ────────────────────
    // If either email failed, we do NOT return an HTTP error or roll back the application.
    // The user should still receive a clear application submission result.
    const emailsSuccess = applicantEmailSent && adminEmailSent;

    return NextResponse.json({
      success: true,
      message: emailsSuccess
        ? 'Membership notifications processed successfully.'
        : 'Membership application saved, but notifications are pending retry.',
      notificationsSent: {
        applicant: applicantEmailSent,
        admin: adminEmailSent,
      },
    });
  } catch (error) {
    // Log unexpected errors on the server side
    console.error(
      '[API /api/membership/notify] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    // Never expose internal errors or credential issues to the client
    return NextResponse.json({
      success: true,
      message: 'Membership application saved. Notifications will be retried.',
      notificationsSent: {
        applicant: false,
        admin: false,
      },
    });
  }
}
