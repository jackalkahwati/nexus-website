-- CreateTable
CREATE TABLE "RecoveryCodes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryCodes_userId_key" ON "RecoveryCodes"("userId");

-- AddForeignKey
ALTER TABLE "RecoveryCodes" ADD CONSTRAINT "RecoveryCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
