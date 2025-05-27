// Export base API client
export * from './api-client';

// Export specialized clients
export * from './clients/vehicle-api-client';
export * from './clients/booking-api-client';

// Create a client factory function to initialize the API client
import { ApiClient, ApiClientConfig } from './api-client';
import { VehicleApiClient } from './clients/vehicle-api-client';
import { BookingApiClient } from './clients/booking-api-client';

/**
 * Nexus API client factory
 */
export interface NexusApiClient {
  api: ApiClient;
  vehicles: VehicleApiClient;
  bookings: BookingApiClient;
}

/**
 * Create a new Nexus API client
 */
export function createApiClient(config: ApiClientConfig): NexusApiClient {
  const api = new ApiClient(config);
  
  return {
    api,
    vehicles: new VehicleApiClient(api),
    bookings: new BookingApiClient(api),
  };
}