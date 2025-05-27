'use client';

import { ApiClient, RequestOptions } from '../api-client';

// Booking interfaces
export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  location?: string;
  participants: number;
  recurringPattern?: string;
  price: number;
  notes?: string;
  feedback?: string;
  rating?: number;
  type: BookingType;
  status: BookingStatus;
  pointsEarned?: number;
  pointsRedeemed?: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type BookingType = 'STANDARD' | 'PREMIUM' | 'GROUP';

export interface BookingFilter {
  userId?: string;
  vehicleId?: string;
  status?: BookingStatus;
  type?: BookingType;
  startAfter?: string;
  endBefore?: string;
}

export interface CreateBookingPayload {
  vehicleId: string;
  startTime: string;
  endTime: string;
  location?: string;
  participants?: number;
  recurringPattern?: string;
  notes?: string;
  type?: BookingType;
  usePoints?: boolean;
}

export interface UpdateBookingPayload {
  startTime?: string;
  endTime?: string;
  location?: string;
  participants?: number;
  notes?: string;
  type?: BookingType;
}

export interface BookingRatingPayload {
  rating: number;
  feedback?: string;
}

/**
 * Booking API client
 */
export class BookingApiClient {
  private apiClient: ApiClient;
  private basePath: string = '/api/bookings';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get all bookings with optional filtering
   */
  async getBookings(filter?: BookingFilter, options?: RequestOptions): Promise<Booking[]> {
    const params: Record<string, string> = {};
    
    if (filter) {
      if (filter.userId) params.userId = filter.userId;
      if (filter.vehicleId) params.vehicleId = filter.vehicleId;
      if (filter.status) params.status = filter.status;
      if (filter.type) params.type = filter.type;
      if (filter.startAfter) params.startAfter = filter.startAfter;
      if (filter.endBefore) params.endBefore = filter.endBefore;
    }

    return this.apiClient.get<Booking[]>(this.basePath, params, options);
  }

  /**
   * Get a booking by ID
   */
  async getBooking(id: string, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.get<Booking>(`${this.basePath}/${id}`, undefined, options);
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingPayload, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.post<Booking>(this.basePath, data, options);
  }

  /**
   * Update a booking
   */
  async updateBooking(id: string, data: UpdateBookingPayload, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.put<Booking>(`${this.basePath}/${id}`, data, options);
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string, reason?: string, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.patch<Booking>(`${this.basePath}/${id}/cancel`, { reason }, options);
  }

  /**
   * Complete a booking
   */
  async completeBooking(id: string, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.patch<Booking>(`${this.basePath}/${id}/complete`, {}, options);
  }

  /**
   * Rate a booking
   */
  async rateBooking(id: string, data: BookingRatingPayload, options?: RequestOptions): Promise<Booking> {
    return this.apiClient.post<Booking>(`${this.basePath}/${id}/rating`, data, options);
  }

  /**
   * Get bookings for a specific user
   */
  async getUserBookings(userId: string, options?: RequestOptions): Promise<Booking[]> {
    return this.apiClient.get<Booking[]>(`/api/users/${userId}/bookings`, undefined, options);
  }

  /**
   * Get bookings for a specific vehicle
   */
  async getVehicleBookings(vehicleId: string, options?: RequestOptions): Promise<Booking[]> {
    return this.apiClient.get<Booking[]>(`/api/vehicles/${vehicleId}/bookings`, undefined, options);
  }

  /**
   * Check vehicle availability
   */
  async checkAvailability(vehicleId: string, startTime: string, endTime: string, options?: RequestOptions): Promise<{ available: boolean; conflictingBookings?: Booking[] }> {
    const params = {
      startTime,
      endTime
    };
    
    return this.apiClient.get<{ available: boolean; conflictingBookings?: Booking[] }>(
      `/api/vehicles/${vehicleId}/availability`,
      params,
      options
    );
  }
}