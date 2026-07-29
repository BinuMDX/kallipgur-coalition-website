-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY', 'SUPPORTING_DOCUMENT', 'PROFILE_PHOTO');

-- CreateTable
CREATE TABLE "MembershipDocument" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storedFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,

    CONSTRAINT "MembershipDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembershipDocument_storedFileName_key" ON "MembershipDocument"("storedFileName");

-- CreateIndex
CREATE INDEX "MembershipDocument_applicationId_idx" ON "MembershipDocument"("applicationId");

-- CreateIndex
CREATE INDEX "MembershipDocument_documentType_idx" ON "MembershipDocument"("documentType");

-- AddForeignKey
ALTER TABLE "MembershipDocument" ADD CONSTRAINT "MembershipDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "MembershipApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
