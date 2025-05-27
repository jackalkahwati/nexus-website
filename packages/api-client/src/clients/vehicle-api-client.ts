'use client';

import { ApiClient, RequestOptions } from '../api-client';

// Vehicle interfaces
export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: VehicleStatus;
  fleetId?: string;
  lastMaintenance?: string;
  mileage: number;
  nextMaintenanceDue?: string;
  zoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface VehicleFilter {
  type?: string;
  status?: VehicleStatus;
  fleetId?: string;
  zoneId?: string;
  minMileage?: number;
  maxMileage?: number;
}

export interface CreateVehiclePayload {
  name: string;
  type: string;
  fleetId?: string;
  mileage?: number;
  zoneId?: string;
}

export interface UpdateVehiclePayload {
  name?: string;
  type?: string;
  status?: VehicleStatus;
  fleetId?: string;
  mileage?: number;
  zoneId?: string;
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
}

/**
 * Vehicle API client
 */
export class VehicleApiClient {
  private apiClient: ApiClient;
  private basePath: string = '/api/vehicles';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get all vehicles with optional filtering
   */
  async getVehicles(filter?: VehicleFilter, options?: RequestOptions): Promise<Vehicle[]> {
    const params: Record<string, string> = {};
    
    if (filter) {
      if (filter.type) params.type = filter.type;
      if (filter.status) params.status = filter.status;
      if (filter.fleetId) params.fleetId = filter.fleetId;
      if (filter.zoneId) params.zoneId = filter.zoneId;
      if (filter.minMileage !== undefined) params.minMileage = filter.minMileage.toString();
      if (filter.maxMileage !== undefined) params.maxMileage = filter.maxMileage.toString();
    }

    return this.apiClient.get<Vehicle[]>(this.basePath, params, options);
  }

  /**
   * Get a vehicle by ID
   */
  async getVehicle(id: string, options?: RequestOptions): Promise<Vehicle> {
    return this.apiClient.get<Vehicle>(`${this.basePath}/${id}`, undefined, options);
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(data: CreateVehiclePayload, options?: RequestOptions): Promise<Vehicle> {
    return this.apiClient.post<Vehicle>(this.basePath, data, options);
  }

  /**
   * Update a vehicle
   */
  async updateVehicle(id: string, data: UpdateVehiclePayload, options?: RequestOptions): Promise<Vehicle> {
    return this.apiClient.put<Vehicle>(`${this.basePath}/${id}`, data, options);
  }

  /**
   * Delete a vehicle
   */
  async deleteVehicle(id: string, options?: RequestOptions): Promise<void> {
    return this.apiClient.delete<void>(`${this.basePath}/${id}`, options);
  }

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(id: string, status: VehicleStatus, options?: RequestOptions): Promise<Vehicle> {
    return this.apiClient.patch<Vehicle>(`${this.basePath}/${id}/status`, { status }, options);
  }

  /**
   * Get vehicle maintenance history
   */
  async getVehicleMaintenanceHistory(id: string, options?: RequestOptions): Promise<any[]> {
    return this.apiClient.get<any[]>(`${this.basePath}/${id}/maintenance-history`, undefined, options);
  }

  /**
   * Get vehicles in a specific fleet
   */
  async getFleetVehicles(fleetId: string, options?: RequestOptions): Promise<Vehicle[]> {
    return this.apiClient.get<Vehicle[]>(`/api/fleets/${fleetId}/vehicles`, undefined, options);
  }

  /**
   * Get vehicles in a specific zone
   */
  async getZoneVehicles(zoneId: string, options?: RequestOptions): Promise<Vehicle[]> {
    return this.apiClient.get<Vehicle[]>(`/api/zones/${zoneId}/vehicles`, undefined, options);
  }
}