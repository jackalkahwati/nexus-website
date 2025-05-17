-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "metadata" JSONB DEFAULT '{}';

-- CreateIndex
CREATE INDEX "Activity_action_idx" ON "Activity"("action");
