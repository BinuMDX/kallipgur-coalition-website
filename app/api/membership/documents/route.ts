import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILES_PER_TYPE,
  documentUploadMetadataSchema,
} from '@/lib/validations/upload';

const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';
const MAX_UPLOAD_SIZE_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10);
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── 1. Validate Metadata ──────────────────
    const applicationId = formData.get('applicationId');
    const documentType = formData.get('documentType');

    const metadataParsed = documentUploadMetadataSchema.safeParse({
      applicationId,
      documentType,
    });

    if (!metadataParsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request parameters.',
          errors: metadataParsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      applicationId: validAppId,
      documentType: validDocType,
    } = metadataParsed.data;

    // ── 2. Validate Application Exists ─────────
    const application = await prisma.membershipApplication.findUnique({
      where: { id: validAppId },
      select: { id: true },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Membership application not found.' },
        { status: 404 },
      );
    }

    // ── 3. Validate Files ─────────────────────
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files provided for upload.' },
        { status: 400 },
      );
    }

    const maxAllowed = MAX_FILES_PER_TYPE[validDocType as keyof typeof MAX_FILES_PER_TYPE];

    // Check how many documents of this type already exist for this application
    const existingCount = await prisma.membershipDocument.count({
      where: {
        applicationId: validAppId,
        documentType: validDocType as any,
      },
    });

    if (existingCount + files.length > maxAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum number of files (${maxAllowed}) exceeded for document type ${validDocType}.`,
        },
        { status: 409 },
      );
    }

    const uploadedDocuments = [];

    // Ensure uploads directory exists
    const targetDir = path.join(process.cwd(), UPLOADS_DIR);
    await fs.mkdir(targetDir, { recursive: true });

    // ── 4. Process Each File ──────────────────
    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      // Check file size
      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message: `File ${file.name} exceeds the maximum allowed size of ${MAX_UPLOAD_SIZE_MB}MB.`,
          },
          { status: 400 },
        );
      }

      // Check MIME type against allowed list
      const isValidMime = Object.values(ALLOWED_MIME_TYPES).includes(file.type as any);
      if (!isValidMime) {
        return NextResponse.json(
          {
            success: false,
            message: `File type ${file.type} is not allowed for file ${file.name}.`,
          },
          { status: 400 },
        );
      }

      // Check extension (as a fallback/defense in depth)
      const originalName = file.name || 'unknown';
      const ext = path.extname(originalName).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            message: `File extension ${ext} is not allowed for file ${file.name}.`,
          },
          { status: 400 },
        );
      }

      // Generate secure unique filename
      const uuid = crypto.randomUUID();
      const safeStoredName = `${validAppId}_${validDocType}_${uuid}${ext}`;
      const filePath = path.join(targetDir, safeStoredName);

      // Verify path traversal (redundant because we control the components, but good practice)
      if (!filePath.startsWith(targetDir)) {
        return NextResponse.json(
          { success: false, message: 'Invalid file path.' },
          { status: 400 },
        );
      }

      // Write to disk
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      // Create database record
      const doc = await prisma.membershipDocument.create({
        data: {
          applicationId: validAppId,
          documentType: validDocType as any,
          originalFileName: originalName,
          storedFileName: safeStoredName,
          mimeType: file.type,
          fileSize: file.size,
        },
      });

      uploadedDocuments.push({
        id: doc.id,
        originalFileName: doc.originalFileName,
        documentType: doc.documentType,
      });
    }

    // ── 5. Return Success ─────────────────────
    return NextResponse.json(
      {
        success: true,
        message: 'Documents uploaded successfully.',
        documents: uploadedDocuments,
      },
      { status: 201 },
    );
  } catch (error) {
    // ── 6. Handle unexpected errors ───────────
    console.error(
      '[API /api/membership/documents] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred during file upload.',
      },
      { status: 500 },
    );
  }
}

import { auth } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    // ── 1. Authentication Check ───────────────
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ── 2. Parse Query parameters ─────────────
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing document ID parameter' },
        { status: 400 }
      );
    }

    // ── 3. Find Document in DB ────────────────
    const doc = await prisma.membershipDocument.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    // ── 4. Resolve File Path ──────────────────
    const targetDir = path.join(process.cwd(), UPLOADS_DIR);
    const filePath = path.join(targetDir, doc.storedFileName);

    // Verify path traversal
    if (!filePath.startsWith(targetDir)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 400 }
      );
    }

    // Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, message: 'File not found on storage disk' },
        { status: 404 }
      );
    }

    // ── 5. Serve File Content ─────────────────
    const fileBuffer = await fs.readFile(filePath);
    
    const headers = new Headers();
    headers.set('Content-Type', doc.mimeType || 'application/octet-stream');
    
    // Check if inline view (preview) or attachment (download) is requested
    const isDownload = searchParams.get('download') === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    
    // Use encodeURIComponent for safe filename representation
    headers.set(
      'Content-Disposition', 
      `${disposition}; filename*=UTF-8''${encodeURIComponent(doc.originalFileName)}`
    );

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      '[API GET /api/membership/documents] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
