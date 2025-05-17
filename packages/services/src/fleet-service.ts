import {
  fleetRepository,
  FleetFilter,
  CreateFleetInput,
  Fleet,
  Vehicle,
  Zone,
  vehicleRepository,
  VehicleFilter
} from '@nexus/database';

/**
 * Fleet service for fleet management logic
 */
export class FleetService {
  /**
   * Get all fleets with optional filtering
   */
  async getFleets(filter?: FleetFilter): Promise<Fleet[]> {
    return fleetRepository.getFleets(filter);
  }

  /**
   * Get a fleet by ID
   */
  async getFleetById(id: string): Promise<Fleet | null> {
    return fleetRepository.getFleetById(id);
  }

  /**
   * Create a new fleet
   */
  async createFleet(data: CreateFleetInput): Promise<Fleet> {
    return fleetRepository.createFleet(data);
  }

  /**
   * Update a fleet
   */
  async updateFleet(id: string, data: Partial<CreateFleetInput>): Promise<Fleet> {
    return fleetRepository.updateFleet(id, data);
  }

  /**
   * Delete a fleet
   */
  async deleteFleet(id: string): Promise<Fleet> {
    return fleetRepository.deleteFleet(id);
  }

  /**
   * Get vehicles in a fleet
   */
  async getFleetVehicles(fleetId: string): Promise<Vehicle[]> {
    return vehicleRepository.getVehicles({ fleetId });
  }

  /**
   * Get zones in a fleet
   */
  async getFleetZones(fleetId: string): Promise<Zone[]> {
    return fleetRepository.getFleetZones(fleetId);
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
    return fleetRepository.getFleetStatistics(fleetId);
  }

  /**
   * Add a vehicle to a fleet
   */
  async addVehicleToFleet(vehicleId: string, fleetId: string): Promise<Vehicle> {
    // Verify that the fleet exists
    const fleet = await fleetRepository.getFleetById(fleetId);
    if (!fleet) {
      throw new Error(`Fleet with ID ${fleetId} not found`);
    }

    // Verify that the vehicle exists
    const vehicle = await vehicleRepository.getVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    // Add the vehicle to the fleet
    return vehicleRepository.assignVehicleToFleet(vehicleId, fleetId);
  }

  /**
   * Remove a vehicle from a fleet
   */
  async removeVehicleFromFleet(vehicleId: string): Promise<Vehicle> {
    // Verify that the vehicle exists
    const vehicle = await vehicleRepository.getVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    // Remove the vehicle from the fleet
    return vehicleRepository.removeVehicleFromFleet(vehicleId);
  }

  /**
   * Get fleet utilization statistics
   * This is a more complex business logic function that showcases
   * the kind of functionality the service layer can provide
   */
  async getFleetUtilizationStatistics(
    fleetId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    utilizationRate: number;
    totalVehicleHours: number;
    usedVehicleHours: number;
    vehicleUtilization: Array<{
      vehicleId: string;
      vehicleName: string;
      utilizationRate: number;
    }>;
  }> {
    // Get all vehicles in the fleet
    const vehicles = await this.getFleetVehicles(fleetId);
    
    if (vehicles.length === 0) {
      return {
        utilizationRate: 0,
        totalVehicleHours: 0,
        usedVehicleHours: 0,
        vehicleUtilization: [],
      };
    }

    // For each vehicle, calculate its utilization
    const vehicleUtilizationPromises = vehicles.map(async (vehicle) => {
      // Get all bookings for this vehicle in the date range
      const bookings = await vehicleRepository.getVehicleBookings(vehicle.id);
      
      // Filter bookings to include only those within the date range and that are completed
      const relevantBookings = bookings.filter(
        (booking) =>
          booking.status === 'COMPLETED' &&
          new Date(booking.startTime) >= startDate &&
          new Date(booking.endTime) <= endDate
      );

      // Calculate total hours of usage
      let usedMinutes = 0;
      for (const booking of relevantBookings) {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        usedMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
      }
      const usedHours = usedMinutes / 60;

      // Calculate total available hours in the date range
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const totalHours = totalDays * 24;

      // Calculate utilization rate
      const utilizationRate = totalHours > 0 ? usedHours / totalHours : 0;

      return {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        utilizationRate,
        usedHours,
        totalHours,
      };
    });

    const vehicleUtilizations = await Promise.all(vehicleUtilizationPromises);

    // Calculate fleet-wide statistics
    const totalVehicleHours = vehicleUtilizations.reduce(
      (total, vehicle) => total + vehicle.totalHours,
      0
    );
    const usedVehicleHours = vehicleUtilizations.reduce(
      (total, vehicle) => total + vehicle.usedHours,
      0
    );
    const fleetUtilizationRate =
      totalVehicleHours > 0 ? usedVehicleHours / totalVehicleHours : 0;

    return {
      utilizationRate: fleetUtilizationRate,
      totalVehicleHours,
      usedVehicleHours,
      vehicleUtilization: vehicleUtilizations.map((v) => ({
        vehicleId: v.vehicleId,
        vehicleName: v.vehicleName,
        utilizationRate: v.utilizationRate,
      })),
    };
  }
}

// Export a singleton instance
export const fleetService = new FleetService();