ALTER TYPE "RequestStatus" ADD VALUE 'CANCELLED';

ALTER TABLE "requests"
ADD COLUMN "adminNotes" TEXT,
ADD COLUMN "enrollmentId" UUID;

CREATE INDEX "requests_enrollmentId_idx" ON "requests"("enrollmentId");

ALTER TABLE "requests"
ADD CONSTRAINT "requests_enrollmentId_fkey"
FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "stripe_webhook_events" (
    "id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stripe_webhook_events_pkey" PRIMARY KEY ("id")
);
