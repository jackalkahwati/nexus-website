/*
  Warnings:

  - The `type` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MaintenanceTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `availability` column on the `Technician` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `BookingPolicy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `BookingPolicy` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `MaintenanceTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `MaintenanceTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('STANDARD', 'PREMIUM', 'GROUP');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MaintenanceTaskType" AS ENUM ('ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY', 'UPGRADE');

-- CreateEnum
CREATE TYPE "MaintenanceTaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MaintenanceTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TechnicianAvailability" AS ENUM ('AVAILABLE', 'BUSY', 'OFF_DUTY', 'ON_LEAVE');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "rating" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "BookingType" NOT NULL DEFAULT 'STANDARD',
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "BookingPolicy" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceTask" ADD COLUMN     "templateId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "MaintenanceTaskType" NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "MaintenanceTaskPriority" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "MaintenanceTaskStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "refundAmount" INTEGER,
ADD COLUMN     "refundReason" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "availability",
ADD COLUMN     "availability" "TechnicianAvailability" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "MaintenanceTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "MaintenanceTaskType" NOT NULL,
    "steps" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "parts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenancePart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "supplier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenancePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaintenancePartToMaintenanceTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MaintenancePartToMaintenanceTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "MaintenanceTemplate_type_idx" ON "MaintenanceTemplate"("type");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenancePart_partNumber_key" ON "MaintenancePart"("partNumber");

-- CreateIndex
CREATE INDEX "MaintenancePart_partNumber_idx" ON "MaintenancePart"("partNumber");

-- CreateIndex
CREATE INDEX "_MaintenancePartToMaintenanceTask_B_index" ON "_MaintenancePartToMaintenanceTask"("B");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_vehicleId_idx" ON "Booking"("vehicleId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_startTime_idx" ON "Booking"("startTime");

-- CreateIndex
CREATE INDEX "Booking_endTime_idx" ON "Booking"("endTime");

-- CreateIndex
CREATE UNIQUE INDEX "BookingPolicy_name_key" ON "BookingPolicy"("name");

-- CreateIndex
CREATE INDEX "BookingPolicy_isActive_idx" ON "BookingPolicy"("isActive");

-- CreateIndex
CREATE INDEX "MaintenanceTask_status_idx" ON "MaintenanceTask"("status");

-- CreateIndex
CREATE INDEX "MaintenanceTask_priority_idx" ON "MaintenanceTask"("priority");

-- CreateIndex
CREATE INDEX "MaintenanceTask_vehicleId_idx" ON "MaintenanceTask"("vehicleId");

-- CreateIndex
CREATE INDEX "MaintenanceTask_technicianId_idx" ON "MaintenanceTask"("technicianId");

-- CreateIndex
CREATE INDEX "MaintenanceTask_dueDate_idx" ON "MaintenanceTask"("dueDate");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Technician_availability_idx" ON "Technician"("availability");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_type_idx" ON "Vehicle"("type");

-- CreateIndex
CREATE INDEX "Vehicle_fleetId_idx" ON "Vehicle"("fleetId");

-- CreateIndex
CREATE INDEX "Vehicle_zoneId_idx" ON "Vehicle"("zoneId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTask" ADD CONSTRAINT "MaintenanceTask_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MaintenanceTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaintenancePartToMaintenanceTask" ADD CONSTRAINT "_MaintenancePartToMaintenanceTask_A_fkey" FOREIGN KEY ("A") REFERENCES "MaintenancePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaintenancePartToMaintenanceTask" ADD CONSTRAINT "_MaintenancePartToMaintenanceTask_B_fkey" FOREIGN KEY ("B") REFERENCES "MaintenanceTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
