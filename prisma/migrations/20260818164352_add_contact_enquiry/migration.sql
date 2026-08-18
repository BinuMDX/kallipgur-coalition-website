-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipNote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "MembershipNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousStatus" TEXT,
    "newStatus" TEXT,
    "reviewNote" TEXT,

    CONSTRAINT "MembershipAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactEnquiry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "ContactEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "MembershipNote_applicationId_idx" ON "MembershipNote"("applicationId");

-- CreateIndex
CREATE INDEX "MembershipAuditLog_applicationId_idx" ON "MembershipAuditLog"("applicationId");

-- CreateIndex
CREATE INDEX "MembershipAuditLog_createdAt_idx" ON "MembershipAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ContactEnquiry_status_idx" ON "ContactEnquiry"("status");

-- CreateIndex
CREATE INDEX "ContactEnquiry_createdAt_idx" ON "ContactEnquiry"("createdAt");

-- CreateIndex
CREATE INDEX "ContactEnquiry_email_idx" ON "ContactEnquiry"("email");

-- AddForeignKey
ALTER TABLE "MembershipNote" ADD CONSTRAINT "MembershipNote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "MembershipApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAuditLog" ADD CONSTRAINT "MembershipAuditLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "MembershipApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
