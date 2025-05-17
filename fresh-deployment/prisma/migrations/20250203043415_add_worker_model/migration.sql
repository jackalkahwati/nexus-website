-- CreateEnum
CREATE TYPE "StationType" AS ENUM ('DOCKING', 'VIRTUAL', 'HUB');

-- CreateEnum
CREATE TYPE "RebalancingPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RebalancingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StationType" NOT NULL DEFAULT 'DOCKING',
    "location" JSONB NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "minThreshold" INTEGER NOT NULL DEFAULT 2,
    "maxThreshold" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "zoneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RebalancingTask" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "priority" "RebalancingPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RebalancingStatus" NOT NULL DEFAULT 'PENDING',
    "requiredCount" INTEGER NOT NULL,
    "currentCount" INTEGER NOT NULL,
    "vehicleId" TEXT,
    "assignedTo" TEXT,
    "startTime" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RebalancingTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandForecast" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "predictedDemand" INTEGER NOT NULL,
    "actualDemand" INTEGER,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "factors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherData" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "precipitation" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "conditions" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "expectedAttendance" INTEGER,
    "impact" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "lastHeartbeat" TIMESTAMP(3),
    "taskId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Station_type_idx" ON "Station"("type");

-- CreateIndex
CREATE INDEX "Station_zoneId_idx" ON "Station"("zoneId");

-- CreateIndex
CREATE INDEX "Station_isActive_idx" ON "Station"("isActive");

-- CreateIndex
CREATE INDEX "RebalancingTask_stationId_idx" ON "RebalancingTask"("stationId");

-- CreateIndex
CREATE INDEX "RebalancingTask_status_idx" ON "RebalancingTask"("status");

-- CreateIndex
CREATE INDEX "RebalancingTask_priority_idx" ON "RebalancingTask"("priority");

-- CreateIndex
CREATE INDEX "RebalancingTask_vehicleId_idx" ON "RebalancingTask"("vehicleId");

-- CreateIndex
CREATE INDEX "DemandForecast_stationId_idx" ON "DemandForecast"("stationId");

-- CreateIndex
CREATE INDEX "DemandForecast_timestamp_idx" ON "DemandForecast"("timestamp");

-- CreateIndex
CREATE INDEX "WeatherData_timestamp_idx" ON "WeatherData"("timestamp");

-- CreateIndex
CREATE INDEX "Event_startTime_idx" ON "Event"("startTime");

-- CreateIndex
CREATE INDEX "Event_endTime_idx" ON "Event"("endTime");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_taskId_key" ON "Worker"("taskId");

-- CreateIndex
CREATE INDEX "Worker_type_idx" ON "Worker"("type");

-- CreateIndex
CREATE INDEX "Worker_status_idx" ON "Worker"("status");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RebalancingTask" ADD CONSTRAINT "RebalancingTask_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RebalancingTask" ADD CONSTRAINT "RebalancingTask_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandForecast" ADD CONSTRAINT "DemandForecast_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
