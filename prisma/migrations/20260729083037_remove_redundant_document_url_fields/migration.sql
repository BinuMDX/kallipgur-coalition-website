/*
  Warnings:

  - You are about to drop the column `identityDocumentUrl` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhotoUrl` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `supportingDocumentUrl` on the `MembershipApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MembershipApplication" DROP COLUMN "identityDocumentUrl",
DROP COLUMN "profilePhotoUrl",
DROP COLUMN "supportingDocumentUrl";
