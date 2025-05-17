import { Vehicle, VehicleStatus, Prisma, VehicleStatusHistory } from '@prisma/client';
import { prisma, withPrisma } from '../prisma-client';

/**
 * Vehicle filter parameters
 */
export interface VehicleFilter {
  status?: VehicleStatus;
  type?: string;
  fleetId?: string;
  zoneId?: string;
  search?: string;
  minMileage?: number;
  maxMileage?: number;
}

/**
 * Create vehicle input
 */
export type CreateVehicleInput = Omit<
  Prisma.VehicleCreateInput,
  'VehicleStatusHistory' | 'bookings' | 'maintenanceSchedules' | 'maintenanceTasks' | 'waitlistEntries'
>;

/**
 * Vehicle update input
 */
export type UpdateVehicleInput = Omit<
  Prisma.VehicleUpdateInput,
  'VehicleStatusHistory' | 'bookings' | 'maintenanceSchedules' | 'maintenanceTasks' | 'waitlistEntries'
>;

/**
 * Vehicle repository for managing vehicles
 */
export class VehicleRepository {
  /**
   * Get all vehicles with optional filtering
   */
  async getVehicles(filter?: VehicleFilter): Promise<Vehicle[]> {
    return withPrisma(async (client) => {
      const where: Prisma.VehicleWhereInput = {
        deletedAt: null,
      };

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.type) {
        where.type = filter.type;
      }

      if (filter?.fleetId) {
        where.fleetId = filter.fleetId;
      }

      if (filter?.zoneId) {
        where.zoneId = filter.zoneId;
      }

      if (filter?.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { type: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.minMileage !== undefined) {
        where.mileage = { gte: filter.minMileage };
      }

      if (filter?.maxMileage !== undefined) {
        where.mileage = { ...(where.mileage as any), lte: filter.maxMileage };
      }

      return client.vehicle.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });
    });
  }

  /**
   * Get a vehicle by ID
   */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    return withPrisma(async (client) => {
      return client.vehicle.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });
    });
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    return withPrisma(async (client) => {
      const vehicle = await client.vehicle.create({
        data: {
          ...data,
          // Create the initial status history entry
          VehicleStatusHistory: {
            create: {
              status: data.status?.toString() || 'AVAILABLE',
            },
          },
        },
      });

      return vehicle;
    });
  }

  /**
   * Update a vehicle
   */
  async updateVehicle(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    return withPrisma(async (client) => {
      // Get the current vehicle to check for status changes
      const currentVehicle = await client.vehicle.findUnique({
        where: { id },
      });

      const updatedVehicle = await client.vehicle.update({
        where: { id },
        data,
      });

      // If status changed, create a history entry
      if (
        currentVehicle &&
        data.status &&
        currentVehicle.status !== data.status
      ) {
        await client.vehicleStatusHistory.create({
          data: {
            vehicleId: id,
            status: data.status.toString(),
          },
        });
      }

      return updatedVehicle;
    });
  }

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(
    id: string,
    status: VehicleStatus
  ): Promise<Vehicle> {
    return withPrisma(async (client) => {
      // Get the current vehicle to check if status actually changed
      const currentVehicle = await client.vehicle.findUnique({
        where: { id },
      });

      if (!currentVehicle) {
        throw new Error(`Vehicle with ID ${id} not found`);
      }

      // Only update if status changed
      if (currentVehicle.status !== status) {
        const updatedVehicle = await client.vehicle.update({
          where: { id },
          data: { status },
        });

        // Create a history entry
        await client.vehicleStatusHistory.create({
          data: {
            vehicleId: id,
            status: status.toString(),
          },
        });

        return updatedVehicle;
      }

      return currentVehicle;
    });
  }

  /**
   * Delete a vehicle (soft delete)
   */
  async deleteVehicle(id: string): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'OUT_OF_SERVICE',
        },
      });
    });
  }

  /**
   * Get vehicle status history
   */
  async getVehicleStatusHistory(vehicleId: string): Promise<VehicleStatusHistory[]> {
    return withPrisma(async (client) => {
      return client.vehicleStatusHistory.findMany({
        where: { vehicleId },
        orderBy: { timestamp: 'desc' },
      });
    });
  }

  /**
   * Assign vehicle to a fleet
   */
  async assignVehicleToFleet(
    vehicleId: string,
    fleetId: string
  ): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id: vehicleId },
        data: { fleetId },
      });
    });
  }

  /**
   * Remove vehicle from a fleet
   */
  async removeVehicleFromFleet(vehicleId: string): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id: vehicleId },
        data: { fleetId: null },
      });
    });
  }

  /**
   * Assign vehicle to a zone
   */
  async assignVehicleToZone(
    vehicleId: string,
    zoneId: string
  ): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id: vehicleId },
        data: { zoneId },
      });
    });
  }

  /**
   * Remove vehicle from a zone
   */
  async removeVehicleFromZone(vehicleId: string): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id: vehicleId },
        data: { zoneId: null },
      });
    });
  }

  /**
   * Update vehicle mileage
   */
  async updateVehicleMileage(
    vehicleId: string,
    mileage: number
  ): Promise<Vehicle> {
    return withPrisma(async (client) => {
      return client.vehicle.update({
        where: { id: vehicleId },
        data: { mileage },
      });
    });
  }
}

// Export a singleton instance
export const vehicleRepository = new VehicleRepository();