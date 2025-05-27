-- AlterTable
ALTER TABLE "DemoRequest" ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "referralSource" TEXT;

-- CreateIndex
CREATE INDEX "DemoRequest_email_idx" ON "DemoRequest"("email");

-- CreateIndex
CREATE INDEX "DemoRequest_status_idx" ON "DemoRequest"("status");
