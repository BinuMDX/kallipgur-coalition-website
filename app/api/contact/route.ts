import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { contactEnquirySchema } from '@/lib/validations/contact';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Strip HTML/script tags from a string to prevent XSS in stored content. */
function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '') // strip all HTML tags
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .trim();
}

/** Phase 9.2 hook — email notification stub. Swallowed silently if it throws. */
async function sendEnquiryNotification(_enquiryId: string): Promise<void> {
  // TODO (Phase 9.2): implement Microsoft Graph email notification
  // Example: await graphClient.sendMail({ to: 'admin@...', subject: 'New enquiry', ... });
}

// ──────────────────────────────────────────────
// POST /api/contact
// ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── 1. Size guard (protect against oversized payloads) ──
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 16_384) {
      return NextResponse.json(
        { success: false, message: 'Request payload is too large.' },
        { status: 413 },
      );
    }

    // ── 2. Parse request body ─────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request. Please try again.' },
        { status: 400 },
      );
    }

    // ── 3. Validate with Zod ──────────────────────────────
    const parsed = contactEnquirySchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.');
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return NextResponse.json(
        {
          success: false,
          message: 'Please check the submitted information.',
          errors: fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // ── 4. Sanitize inputs (XSS protection) ──────────────
    const fullName = sanitizeText(data.fullName);
    const email    = sanitizeText(data.email).toLowerCase();
    const phone    = data.phone ? sanitizeText(data.phone) : null;
    const subject  = sanitizeText(data.subject);
    const message  = sanitizeText(data.message);

    // ── 5. Duplicate submission guard ────────────────────
    // Prevent accidental re-submissions within a 60-second window.
    // We compare email + subject + first 200 chars of message to catch
    // near-identical submissions without blocking legitimate users.
    const sixtySecondsAgo = new Date(Date.now() - 60_000);
    const recentDuplicate = await prisma.contactEnquiry.findFirst({
      where: {
        email,
        subject,
        message: { startsWith: message.substring(0, 200) },
        createdAt: { gte: sixtySecondsAgo },
      },
      select: { id: true },
    });

    if (recentDuplicate) {
      // Return success silently — the user already submitted this enquiry.
      return NextResponse.json(
        {
          success: true,
          message:
            'Thank you for contacting Kallipgur Coalition Aboriginal Corporation. Your enquiry has been received.',
        },
        { status: 200 },
      );
    }

    // ── 6. Store in database ─────────────────────────────
    const enquiry = await prisma.contactEnquiry.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
        status: 'NEW',
      },
      select: {
        id: true,
        status: true,
      },
    });

    // ── 7. Fire email notification (Phase 9.2 hook) ──────
    // Swallow errors — database submission succeeds even if email fails.
    try {
      await sendEnquiryNotification(enquiry.id);
    } catch (emailError) {
      console.warn(
        '[API /api/contact] Email notification failed (non-fatal):',
        emailError instanceof Error ? emailError.message : 'Unknown error',
      );
    }

    // ── 8. Return safe success response ─────────────────
    // Do NOT return enquiry.id or any database detail to the public user.
    return NextResponse.json(
      {
        success: true,
        message:
          'Thank you for contacting Kallipgur Coalition Aboriginal Corporation. Your enquiry has been received.',
      },
      { status: 201 },
    );
  } catch (error) {
    // ── 9. Handle unexpected errors ───────────────────────
    console.error(
      '[API /api/contact] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't submit your enquiry right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
