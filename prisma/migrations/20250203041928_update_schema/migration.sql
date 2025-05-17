/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `BookingPolicy` table. All the data in the column will be lost.
  - You are about to alter the column `pricePerMinute` on the `BookingPolicy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `pricePerHour` on the `BookingPolicy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `pricePerDay` on the `BookingPolicy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `lateFee` on the `BookingPolicy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cancellationFee` on the `BookingPolicy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `metadata` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `certification` on the `Technician` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Technician` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `failedLoginAttempts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mfaEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordUpdatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `price` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bookingId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_paymentId_fkey";

-- DropIndex
DROP INDEX "Booking_endTime_idx";

-- DropIndex
DROP INDEX "Booking_paymentId_key";

-- DropIndex
DROP INDEX "Booking_startTime_idx";

-- DropIndex
DROP INDEX "Booking_status_idx";

-- DropIndex
DROP INDEX "Booking_userId_idx";

-- DropIndex
DROP INDEX "Booking_vehicleId_idx";

-- DropIndex
DROP INDEX "MaintenanceTask_technicianId_idx";

-- DropIndex
DROP INDEX "MaintenanceTask_vehicleId_idx";

-- DropIndex
DROP INDEX "Vehicle_fleetId_idx";

-- DropIndex
DROP INDEX "Vehicle_zoneId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentId",
ALTER COLUMN "type" SET DEFAULT 'standard',
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "BookingPolicy" DROP COLUMN "name",
ALTER COLUMN "pricePerMinute" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pricePerHour" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pricePerDay" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lateFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cancellationFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "isActive" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "metadata",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'usd';

-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "certification",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "failedLoginAttempts",
DROP COLUMN "isActive",
DROP COLUMN "mfaEnabled",
DROP COLUMN "password",
DROP COLUMN "passwordUpdatedAt",
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "currentLocation",
DROP COLUMN "location",
ADD COLUMN     "lastMaintenanceMileage" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'available';

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
