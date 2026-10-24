/*
  Warnings:

  - You are about to drop the column `recipientId` on the `notifications` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `pricings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - Added the required column `requestId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'FREE';

-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "templateId" UUID;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipientId";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "requestId" UUID NOT NULL,
ALTER COLUMN "certificateId" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "currency" SET DEFAULT 'XAF',
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "pricings" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "currency" VARCHAR(10) NOT NULL DEFAULT 'XAF',
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "qrData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_hash_key" ON "Document"("hash");

-- CreateIndex
CREATE INDEX "certificate_templates_universityId_idx" ON "certificate_templates"("universityId");

-- CreateIndex
CREATE INDEX "certificates_studentId_idx" ON "certificates"("studentId");

-- CreateIndex
CREATE INDEX "files_certificateId_idx" ON "files"("certificateId");

-- CreateIndex
CREATE INDEX "files_requestId_idx" ON "files"("requestId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "payments_requestId_idx" ON "payments"("requestId");

-- CreateIndex
CREATE INDEX "payments_certificateId_idx" ON "payments"("certificateId");

-- CreateIndex
CREATE INDEX "payments_studentId_idx" ON "payments"("studentId");

-- CreateIndex
CREATE INDEX "pricings_serviceId_idx" ON "pricings"("serviceId");

-- CreateIndex
CREATE INDEX "pricings_universityId_idx" ON "pricings"("universityId");

-- CreateIndex
CREATE INDEX "requests_studentId_idx" ON "requests"("studentId");

-- CreateIndex
CREATE INDEX "requests_serviceId_idx" ON "requests"("serviceId");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "students_universityId_idx" ON "students"("universityId");

-- CreateIndex
CREATE INDEX "students_programId_idx" ON "students"("programId");

-- CreateIndex
CREATE INDEX "verification_logs_certificateId_idx" ON "verification_logs"("certificateId");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "certificate_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
