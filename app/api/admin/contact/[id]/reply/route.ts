import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { sendMimeEmail } from '@/lib/email/microsoftGraph';

export const dynamic = 'force-dynamic';

// Helper to check if MS Graph env vars exist
function isGraphConfigured(): boolean {
  return Boolean(
    process.env.MICROSOFT_TENANT_ID &&
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.MICROSOFT_SENDER_EMAIL,
  );
}

// Simple MIME string builder for RFC 822 emails
function createRawMime(to: string, subject: string, textBody: string): string {
  const senderEmail = process.env.MICROSOFT_SENDER_EMAIL || 'info@kallipgurcoalition.org.au';
  const boundary = '----=_Part_' + Date.now().toString(16);

  const raw = [
    `From: Kallipgur Coalition Aboriginal Corporation <${senderEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    textBody,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    `<div style="font-family: sans-serif; font-size: 15px; color: #333; line-height: 1.6;">${textBody.replace(/\n/g, '<br/>')}</div>`,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  return Buffer.from(raw).toString('base64');
}

export async function POST(
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
    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 },
      );
    }

    let body: { message?: string; subject?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON payload' },
        { status: 400 },
      );
    }

    const replyMessage = body.message?.trim();
    const replySubject = body.subject?.trim() || `Re: ${enquiry.subject}`;

    if (!replyMessage) {
      return NextResponse.json(
        { success: false, message: 'Reply message cannot be empty' },
        { status: 400 },
      );
    }

    if (!isGraphConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          message:
            'Microsoft Graph email integration is not configured in environment settings.',
        },
        { status: 400 },
      );
    }

    const mimeBase64 = createRawMime(enquiry.email, replySubject, replyMessage);
    await sendMimeEmail(mimeBase64);

    // Optionally update enquiry status to IN_PROGRESS if it's currently READ or NEW
    if (enquiry.status === 'NEW' || enquiry.status === 'READ') {
      await prisma.contactEnquiry.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Reply email successfully sent to ${enquiry.email}.`,
    });
  } catch (error) {
    console.error(
      '[API /api/admin/contact/[id]/reply] Error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send reply email via Microsoft Graph API.',
      },
      { status: 500 },
    );
  }
}
