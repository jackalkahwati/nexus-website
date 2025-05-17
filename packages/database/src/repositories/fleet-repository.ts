import { Fleet, Vehicle, Zone, Prisma } from '@prisma/client';
import { prisma, withPrisma } from '../prisma-client';

/**
 * Fleet filter parameters
 */
export interface FleetFilter {
  status?: string;
  search?: string;
}

/**
 * Create fleet input
 */
export type CreateFleetInput = Omit<Prisma.FleetCreateInput, 'vehicles' | 'zones'>;

/**
 * Fleet repository for managing fleets
 */
export class FleetRepository {
  /**
   * Get all fleets with optional filtering
   */
  async getFleets(filter?: FleetFilter): Promise<Fleet[]> {
    return withPrisma(async (client) => {
      const where: Prisma.FleetWhereInput = {};
      
      if (filter?.status) {
        where.status = filter.status;
      }
      
      if (filter?.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
      
      return client.fleet.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });
    });
  }

  /**
   * Get a fleet by ID
   */
  async getFleetById(id: string): Promise<Fleet | null> {
    return withPrisma(async (client) => {
      return client.fleet.findUnique({
        where: { id },
      });
    });
  }

  /**
   * Get vehicles in a fleet
   */
  async getFleetVehicles(fleetId: string): Promise<Vehicle[]> {
    return withPrisma(async (client) => {
      return client.vehicle.findMany({
        where: {
          fleetId,
          deletedAt: null,
        },
        orderBy: { updatedAt: 'desc' },
      });
    });
  }

  /**
   * Get zones in a fleet
   */
  async getFleetZones(fleetId: string): Promise<Zone[]> {
    return withPrisma(async (client) => {
      return client.zone.findMany({
        where: { fleetId },
        orderBy: { name: 'asc' },
      });
    });
  }

  /**
   * Create a new fleet
   */
  async createFleet(data: CreateFleetInput): Promise<Fleet> {
    return withPrisma(async (client) => {
      return client.fleet.create({
        data,
      });
    });
  }

  /**
   * Update a fleet
   */
  async updateFleet(id: string, data: Partial<CreateFleetInput>): Promise<Fleet> {
    return withPrisma(async (client) => {
      return client.fleet.update({
        where: { id },
        data,
      });
    });
  }

  /**
   * Delete a fleet
   */
  async deleteFleet(id: string): Promise<Fleet> {
    return withPrisma(async (client) => {
      // First, get vehicles and zones to handle them
      const fleet = await client.fleet.findUnique({
        where: { id },
        include: {
          vehicles: true,
          zones: true,
        },
      });

      if (!fleet) {
        throw new Error(`Fleet with ID ${id} not found`);
      }

      // Update fleet status to "deleted"
      return client.fleet.update({
        where: { id },
        data: {
          status: 'deleted',
          // Set vehicle fleet IDs to null to detach them from this fleet
          vehicles: {
            updateMany: {
              where: { fleetId: id },
              data: { fleetId: null },
            },
          },
        },
      });
    });
  }

  /**
   * Get fleet statistics
   */
  async getFleetStatistics(fleetId: string): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    inUseVehicles: number;
    maintenanceVehicles: number;
    zones: number;
  }> {
    return withPrisma(async (client) => {
      const [
        totalVehicles,
        availableVehicles,
        inUseVehicles,
        maintenanceVehicles,
        zones,
      ] = await Promise.all([
        client.vehicle.count({
          where: { fleetId, deletedAt: null },
        }),
        client.vehicle.count({
          where: { fleetId, status: 'AVAILABLE', deletedAt: null },
        }),
        client.vehicle.count({
          where: { fleetId, status: 'IN_USE', deletedAt: null },
        }),
        client.vehicle.count({
          where: { fleetId, status: 'MAINTENANCE', deletedAt: null },
        }),
        client.zone.count({
          where: { fleetId },
        }),
      ]);

      return {
        totalVehicles,
        availableVehicles,
        inUseVehicles,
        maintenanceVehicles,
        zones,
      };
    });
  }
}

// Export a singleton instance
export const fleetRepository = new FleetRepository();