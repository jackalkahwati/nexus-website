import {
  bookingRepository,
  vehicleRepository,
  BookingFilter,
  CreateBookingInput,
  UpdateBookingInput,
  Booking,
  BookingStatus,
  BookingWithPayment,
  Vehicle,
  VehicleStatus
} from '@nexus/database';
import { addMinutes, isAfter, isWithinInterval, format } from 'date-fns';

/**
 * Booking request for creating a new booking
 */
export interface BookingRequest {
  userId: string;
  vehicleId: string;
  startTime: Date | string;
  endTime: Date | string;
  location?: string;
  participants?: number;
  recurringPattern?: string;
  notes?: string;
  type?: 'STANDARD' | 'PREMIUM' | 'GROUP';
  usePoints?: boolean;
}

/**
 * Booking result with booking and payment details
 */
export interface BookingResult {
  booking: Booking;
  vehicle: Vehicle;
  paymentRequired: boolean;
  totalPrice: number;
  conflicts?: Booking[];
}

/**
 * Availability result
 */
export interface AvailabilityResult {
  available: boolean;
  vehicle?: Vehicle;
  conflicts?: Booking[];
}

/**
 * Booking service for booking business logic
 */
export class BookingService {
  /**
   * Get all bookings with optional filtering
   */
  async getBookings(filter?: BookingFilter): Promise<Booking[]> {
    return bookingRepository.getBookings(filter);
  }

  /**
   * Get a booking by ID
   */
  async getBookingById(id: string): Promise<BookingWithPayment | null> {
    return bookingRepository.getBookingById(id);
  }

  /**
   * Create a new booking with pricing logic and conflict checking
   */
  async createBooking(request: BookingRequest): Promise<BookingResult> {
    // Convert string dates to Date objects
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    // Check if the booking is valid
    this.validateBookingTimes(startTime, endTime);

    // Get the vehicle
    const vehicle = await vehicleRepository.getVehicleById(request.vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${request.vehicleId} not found`);
    }

    // Check if the vehicle is available
    const availability = await this.checkVehicleAvailability(
      request.vehicleId,
      startTime,
      endTime
    );

    if (!availability.available) {
      return {
        booking: null as any, // This will be caught as an error
        vehicle,
        paymentRequired: false,
        totalPrice: 0,
        conflicts: availability.conflicts,
      };
    }

    // Calculate price
    const totalPrice = await this.calculateBookingPrice(
      vehicle,
      startTime,
      endTime,
      request.type || 'STANDARD'
    );

    // Create the booking
    const bookingData: CreateBookingInput = {
      userId: request.userId,
      vehicleId: request.vehicleId,
      startTime,
      endTime,
      location: request.location,
      participants: request.participants || 1,
      recurringPattern: request.recurringPattern,
      notes: request.notes,
      type: request.type || 'STANDARD',
      price: totalPrice,
      status: 'PENDING',
    };

    const booking = await bookingRepository.createBooking(bookingData);

    return {
      booking,
      vehicle,
      paymentRequired: true,
      totalPrice,
    };
  }

  /**
   * Check if a vehicle is available for booking
   */
  async checkVehicleAvailability(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<AvailabilityResult> {
    // Get the vehicle
    const vehicle = await vehicleRepository.getVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    // Check if the vehicle is available for booking
    if (vehicle.status !== 'AVAILABLE') {
      return {
        available: false,
        vehicle,
        conflicts: [],
      };
    }

    // Check for conflicts with existing bookings
    const conflicts = await bookingRepository.checkVehicleAvailability(
      vehicleId,
      startTime,
      endTime
    );

    return {
      available: conflicts.length === 0,
      vehicle,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  /**
   * Update a booking
   */
  async updateBooking(
    id: string,
    data: Partial<BookingRequest>
  ): Promise<BookingResult> {
    // Get the current booking
    const currentBooking = await bookingRepository.getBookingById(id);
    if (!currentBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    // Get the vehicle
    const vehicle = await vehicleRepository.getVehicleById(
      currentBooking.vehicleId
    );
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${currentBooking.vehicleId} not found`);
    }

    // Calculate the update data
    const updateData: UpdateBookingInput = {};

    // Handle time changes
    let startTime = currentBooking.startTime;
    let endTime = currentBooking.endTime;
    let needsAvailabilityCheck = false;

    if (data.startTime) {
      startTime = new Date(data.startTime);
      updateData.startTime = startTime;
      needsAvailabilityCheck = true;
    }

    if (data.endTime) {
      endTime = new Date(data.endTime);
      updateData.endTime = endTime;
      needsAvailabilityCheck = true;
    }

    // Validate booking times if they changed
    if (needsAvailabilityCheck) {
      this.validateBookingTimes(startTime, endTime);

      // Check for conflicts
      const conflicts = await bookingRepository.checkVehicleAvailability(
        currentBooking.vehicleId,
        startTime,
        endTime,
        id // Exclude the current booking
      );

      if (conflicts.length > 0) {
        return {
          booking: currentBooking,
          vehicle,
          paymentRequired: false,
          totalPrice: currentBooking.price,
          conflicts,
        };
      }
    }

    // Set other properties
    if (data.location !== undefined) updateData.location = data.location;
    if (data.participants !== undefined)
      updateData.participants = data.participants;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.type !== undefined) updateData.type = data.type;

    // Recalculate price if times or type changed
    if (needsAvailabilityCheck || data.type) {
      const newPrice = await this.calculateBookingPrice(
        vehicle,
        startTime,
        endTime,
        data.type || (currentBooking.type as 'STANDARD' | 'PREMIUM' | 'GROUP')
      );
      updateData.price = newPrice;
    }

    // Update the booking
    const updatedBooking = await bookingRepository.updateBooking(id, updateData);

    return {
      booking: updatedBooking,
      vehicle,
      paymentRequired: needsAvailabilityCheck, // Only require payment if times changed
      totalPrice: updatedBooking.price,
    };
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    // Get the current booking
    const currentBooking = await bookingRepository.getBookingById(id);
    if (!currentBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    // Check if the booking can be cancelled
    if (
      currentBooking.status === 'COMPLETED' ||
      currentBooking.status === 'CANCELLED'
    ) {
      throw new Error(`Booking with ID ${id} cannot be cancelled`);
    }

    // If the booking is in progress, also update the vehicle status
    if (currentBooking.status === 'IN_PROGRESS') {
      await vehicleRepository.updateVehicleStatus(
        currentBooking.vehicleId,
        'AVAILABLE'
      );
    }

    // Cancel the booking
    return bookingRepository.cancelBooking(id);
  }

  /**
   * Complete a booking
   */
  async completeBooking(id: string): Promise<Booking> {
    // Get the current booking
    const currentBooking = await bookingRepository.getBookingById(id);
    if (!currentBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    // Check if the booking can be completed
    if (currentBooking.status !== 'IN_PROGRESS') {
      throw new Error(`Booking with ID ${id} is not in progress`);
    }

    // Update the vehicle status
    await vehicleRepository.updateVehicleStatus(
      currentBooking.vehicleId,
      'AVAILABLE'
    );

    // Complete the booking
    return bookingRepository.completeBooking(id);
  }

  /**
   * Start a booking
   */
  async startBooking(id: string): Promise<Booking> {
    // Get the current booking
    const currentBooking = await bookingRepository.getBookingById(id);
    if (!currentBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    // Check if the booking can be started
    if (currentBooking.status !== 'CONFIRMED') {
      throw new Error(`Booking with ID ${id} is not confirmed`);
    }

    // Start the booking - this also updates the vehicle status
    return bookingRepository.startBooking(id);
  }

  /**
   * Add a rating to a booking
   */
  async addBookingRating(
    id: string,
    rating: number,
    feedback?: string
  ): Promise<Booking> {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Get the current booking
    const currentBooking = await bookingRepository.getBookingById(id);
    if (!currentBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    // Check if the booking can be rated
    if (currentBooking.status !== 'COMPLETED') {
      throw new Error(`Only completed bookings can be rated`);
    }

    // Add the rating
    return bookingRepository.addBookingRating(id, rating, feedback);
  }

  /**
   * Get bookings for a user
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    return bookingRepository.getUserBookings(userId);
  }

  /**
   * Get bookings for a vehicle
   */
  async getVehicleBookings(vehicleId: string): Promise<Booking[]> {
    return bookingRepository.getVehicleBookings(vehicleId);
  }

  /**
   * Get upcoming bookings for automatic processing
   */
  async processUpcomingBookings(): Promise<{
    started: number;
    completed: number;
  }> {
    let startedCount = 0;
    let completedCount = 0;

    // Get bookings that should be started
    const bookingsToStart = await bookingRepository.getBookingsToStart();
    for (const booking of bookingsToStart) {
      try {
        await bookingRepository.startBooking(booking.id);
        startedCount++;
      } catch (error) {
        console.error(`Error starting booking ${booking.id}:`, error);
      }
    }

    // Get bookings that should be completed
    const bookingsToComplete = await bookingRepository.getBookingsToComplete();
    for (const booking of bookingsToComplete) {
      try {
        await bookingRepository.completeBooking(booking.id);
        // Update vehicle status
        await vehicleRepository.updateVehicleStatus(
          booking.vehicleId,
          'AVAILABLE'
        );
        completedCount++;
      } catch (error) {
        console.error(`Error completing booking ${booking.id}:`, error);
      }
    }

    return {
      started: startedCount,
      completed: completedCount,
    };
  }

  // PRIVATE METHODS

  /**
   * Validate booking times
   */
  private validateBookingTimes(startTime: Date, endTime: Date): void {
    // Check if the end time is after the start time
    if (!isAfter(endTime, startTime)) {
      throw new Error('End time must be after start time');
    }

    // Check if the start time is in the future
    const now = new Date();
    if (isAfter(now, startTime)) {
      throw new Error('Start time must be in the future');
    }

    // Check if the booking duration is at least 15 minutes
    const minBookingDuration = addMinutes(startTime, 15);
    if (!isAfter(endTime, minBookingDuration)) {
      throw new Error('Booking duration must be at least 15 minutes');
    }

    // Maximum booking duration is 7 days
    const maxBookingDuration = addMinutes(startTime, 10080); // 7 days in minutes
    if (isAfter(endTime, maxBookingDuration)) {
      throw new Error('Booking duration cannot exceed 7 days');
    }
  }

  /**
   * Calculate booking price
   */
  private async calculateBookingPrice(
    vehicle: Vehicle,
    startTime: Date,
    endTime: Date,
    bookingType: 'STANDARD' | 'PREMIUM' | 'GROUP'
  ): Promise<number> {
    // Calculate duration in minutes
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const durationHours = durationMinutes / 60;
    const durationDays = durationHours / 24;

    // Base rates - these would normally be loaded from a database
    const baseRates = {
      STANDARD: {
        perMinute: 0.5,
        perHour: 25,
        perDay: 100,
      },
      PREMIUM: {
        perMinute: 0.75,
        perHour: 40,
        perDay: 150,
      },
      GROUP: {
        perMinute: 1,
        perHour: 50,
        perDay: 200,
      },
    };

    // Get the appropriate rates
    const rates = baseRates[bookingType];

    // Calculate the price based on the most appropriate unit
    let price;
    if (durationDays >= 1) {
      // Price per day for full days
      const fullDays = Math.floor(durationDays);
      const remainingHours = durationHours - fullDays * 24;
      
      price = fullDays * rates.perDay;
      
      // Add the price for remaining hours
      if (remainingHours > 0) {
        price += Math.min(remainingHours * rates.perHour, rates.perDay);
      }
    } else if (durationHours >= 1) {
      // Price per hour for full hours
      const fullHours = Math.floor(durationHours);
      const remainingMinutes = durationMinutes - fullHours * 60;
      
      price = fullHours * rates.perHour;
      
      // Add the price for remaining minutes
      if (remainingMinutes > 0) {
        price += Math.min(remainingMinutes * rates.perMinute, rates.perHour);
      }
    } else {
      // Price per minute for short bookings
      price = durationMinutes * rates.perMinute;
    }

    // Round to the nearest integer (cents)
    return Math.round(price * 100);
  }
}

// Export a singleton instance
export const bookingService = new BookingService();