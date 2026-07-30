-- AlterTable
ALTER TABLE "MembershipApplication" ADD COLUMN     "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "applicantEmailSent" BOOLEAN NOT NULL DEFAULT false;
