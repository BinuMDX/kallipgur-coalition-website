import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { membershipApplicationSchema } from '@/lib/validations/membership';

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse request body ─────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body. Please send valid JSON.',
        },
        { status: 400 },
      );
    }

    // ── 2. Validate with Zod ──────────────────
    const parsed = membershipApplicationSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.');
        // Only keep the first error per field
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

    // ── 3. Create database record ─────────────
    const application = await prisma.membershipApplication.create({
      data: {
        // Personal Information
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        preferredContactMethod: data.preferredContactMethod ?? null,

        // Address
        streetAddress: data.streetAddress,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        country: data.country,

        // Membership
        membershipType: data.membershipType,
        traditionalCountry: data.traditionalCountry ?? null,
        aboriginalOrTorresStraitIslander: data.aboriginalOrTorresStraitIslander,

        // About
        occupation: data.occupation ?? null,
        reasonForJoining: data.reasonForJoining ?? null,
        skillsAndExperience: data.skillsAndExperience ?? null,
        areasOfInterest: data.areasOfInterest,

        // Emergency Contact
        emergencyContactName: data.emergencyContactName ?? null,
        emergencyContactRelationship: data.emergencyContactRelationship ?? null,
        emergencyContactPhone: data.emergencyContactPhone ?? null,

        // Documents
        identityDocumentUrl: data.identityDocumentUrl ?? null,
        supportingDocumentUrl: data.supportingDocumentUrl ?? null,
        profilePhotoUrl: data.profilePhotoUrl ?? null,

        // Declarations (cast from z.literal(true) to boolean for Prisma)
        informationDeclarationAccepted: Boolean(data.informationDeclarationAccepted),
        privacyPolicyAccepted: Boolean(data.privacyPolicyAccepted),
        membershipTermsAccepted: Boolean(data.membershipTermsAccepted),

        // Status defaults to PENDING via Prisma schema default
      },
      select: {
        id: true,
      },
    });

    // ── 4. Return success ─────────────────────
    return NextResponse.json(
      {
        success: true,
        message: 'Membership application submitted successfully.',
        applicationId: application.id,
      },
      { status: 201 },
    );
  } catch (error) {
    // ── 5. Handle unexpected errors ───────────
    // Log only non-sensitive context for debugging
    console.error(
      '[API /api/membership] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 },
    );
  }
}
