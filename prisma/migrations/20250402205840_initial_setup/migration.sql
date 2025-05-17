-- CreateTable
CREATE TABLE "SOC2AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceId" TEXT,
    "resourceType" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOC2AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SOC2AuditLog_action_idx" ON "SOC2AuditLog"("action");

-- CreateIndex
CREATE INDEX "SOC2AuditLog_resourceType_idx" ON "SOC2AuditLog"("resourceType");

-- CreateIndex
CREATE INDEX "SOC2AuditLog_createdAt_idx" ON "SOC2AuditLog"("createdAt");
