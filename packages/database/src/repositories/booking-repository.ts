import { Booking, BookingStatus, BookingType, Prisma, Payment } from '@prisma/client';
import { prisma, withPrisma } from '../prisma-client';

/**
 * Booking filter parameters
 */
export interface BookingFilter {
  userId?: string;
  vehicleId?: string;
  status?: BookingStatus;
  type?: BookingType;
  startAfter?: Date | string;
  endBefore?: Date | string;
  search?: string;
}

/**
 * Create booking input
 */
export type CreateBookingInput = Omit<
  Prisma.BookingCreateInput,
  'user' | 'vehicle' | 'payment' | 'loyaltyTransactions'
> & {
  userId: string;
  vehicleId: string;
};

/**
 * Update booking input
 */
export type UpdateBookingInput = Omit<
  Prisma.BookingUpdateInput,
  'user' | 'vehicle' | 'payment' | 'loyaltyTransactions'
>;

/**
 * Booking with payment information
 */
export type BookingWithPayment = Booking & {
  payment: Payment | null;
};

/**
 * Booking repository for managing bookings
 */
export class BookingRepository {
  /**
   * Get all bookings with optional filtering
   */
  async getBookings(filter?: BookingFilter): Promise<Booking[]> {
    return withPrisma(async (client) => {
      const where: Prisma.BookingWhereInput = {
        deletedAt: null,
      };

      if (filter?.userId) {
        where.userId = filter.userId;
      }

      if (filter?.vehicleId) {
        where.vehicleId = filter.vehicleId;
      }

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.type) {
        where.type = filter.type;
      }

      if (filter?.startAfter) {
        const startDate = typeof filter.startAfter === 'string'
          ? new Date(filter.startAfter)
          : filter.startAfter;
        
        where.startTime = { gte: startDate };
      }

      if (filter?.endBefore) {
        const endDate = typeof filter.endBefore === 'string'
          ? new Date(filter.endBefore)
          : filter.endBefore;
        
        where.endTime = { lte: endDate };
      }

      if (filter?.search) {
        where.OR = [
          { notes: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      return client.booking.findMany({
        where,
        orderBy: { startTime: 'desc' },
      });
    });
  }

  /**
   * Get a booking by ID
   */
  async getBookingById(id: string): Promise<BookingWithPayment | null> {
    return withPrisma(async (client) => {
      return client.booking.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          payment: true,
        },
      });
    });
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingInput): Promise<Booking> {
    return withPrisma(async (client) => {
      // Check for any conflicts with existing bookings
      const conflictingBookings = await this.checkVehicleAvailability(
        data.vehicleId,
        new Date(data.startTime as string | Date),
        new Date(data.endTime as string | Date)
      );

      if (conflictingBookings.length > 0) {
        throw new Error('Vehicle is not available during the requested time period');
      }

      // Create the booking
      return client.booking.create({
        data: {
          ...data,
          user: {
            connect: { id: data.userId },
          },
          vehicle: {
            connect: { id: data.vehicleId },
          },
        },
      });
    });
  }

  /**
   * Update a booking
   */
  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    return withPrisma(async (client) => {
      // Get the current booking
      const currentBooking = await client.booking.findUnique({
        where: { id },
      });

      if (!currentBooking) {
        throw new Error(`Booking with ID ${id} not found`);
      }

      // Check if time period is changing, and if so, check for conflicts
      if (
        (data.startTime && currentBooking.startTime.toString() !== data.startTime.toString()) ||
        (data.endTime && currentBooking.endTime.toString() !== data.endTime.toString())
      ) {
        const startTime = data.startTime
          ? new Date(data.startTime as string | Date)
          : currentBooking.startTime;
        const endTime = data.endTime
          ? new Date(data.endTime as string | Date)
          : currentBooking.endTime;

        const conflictingBookings = await this.checkVehicleAvailability(
          currentBooking.vehicleId,
          startTime,
          endTime,
          id // Exclude the current booking from the check
        );

        if (conflictingBookings.length > 0) {
          throw new Error('Vehicle is not available during the requested time period');
        }
      }

      // Update the booking
      return client.booking.update({
        where: { id },
        data,
      });
    });
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    return withPrisma(async (client) => {
      return client.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
        },
      });
    });
  }

  /**
   * Complete a booking
   */
  async completeBooking(id: string): Promise<Booking> {
    return withPrisma(async (client) => {
      return client.booking.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
      });
    });
  }

  /**
   * Start a booking
   */
  async startBooking(id: string): Promise<Booking> {
    return withPrisma(async (client) => {
      const booking = await client.booking.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
        },
      });

      // Update vehicle status to IN_USE
      await client.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'IN_USE' },
      });

      return booking;
    });
  }

  /**
   * Delete a booking (soft delete)
   */
  async deleteBooking(id: string): Promise<Booking> {
    return withPrisma(async (client) => {
      return client.booking.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    });
  }

  /**
   * Add a rating to a booking
   */
  async addBookingRating(
    id: string,
    rating: number,
    feedback?: string
  ): Promise<Booking> {
    return withPrisma(async (client) => {
      return client.booking.update({
        where: { id },
        data: {
          rating,
          feedback,
        },
      });
    });
  }

  /**
   * Get bookings for a user
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.getBookings({ userId });
  }

  /**
   * Get bookings for a vehicle
   */
  async getVehicleBookings(vehicleId: string): Promise<Booking[]> {
    return this.getBookings({ vehicleId });
  }

  /**
   * Check vehicle availability for a time period
   */
  async checkVehicleAvailability(
    vehicleId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<Booking[]> {
    return withPrisma(async (client) => {
      const where: Prisma.BookingWhereInput = {
        vehicleId,
        deletedAt: null,
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
        OR: [
          {
            // Case 1: Booking starts during the requested period
            startTime: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            // Case 2: Booking ends during the requested period
            endTime: {
              gt: startTime,
              lte: endTime,
            },
          },
          {
            // Case 3: Booking encompasses the requested period
            startTime: {
              lte: startTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
      };

      // Exclude the current booking if updating
      if (excludeBookingId) {
        where.id = {
          not: excludeBookingId,
        };
      }

      return client.booking.findMany({
        where,
      });
    });
  }

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(): Promise<Booking[]> {
    return withPrisma(async (client) => {
      return client.booking.findMany({
        where: {
          deletedAt: null,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          startTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    });
  }

  /**
   * Get active bookings
   */
  async getActiveBookings(): Promise<Booking[]> {
    return withPrisma(async (client) => {
      const now = new Date();
      return client.booking.findMany({
        where: {
          deletedAt: null,
          status: 'IN_PROGRESS',
          startTime: {
            lte: now,
          },
          endTime: {
            gte: now,
          },
        },
      });
    });
  }

  /**
   * Get bookings that should be started
   */
  async getBookingsToStart(): Promise<Booking[]> {
    return withPrisma(async (client) => {
      const now = new Date();
      return client.booking.findMany({
        where: {
          deletedAt: null,
          status: 'CONFIRMED',
          startTime: {
            lte: now,
          },
          endTime: {
            gte: now,
          },
        },
      });
    });
  }

  /**
   * Get bookings that should be completed
   */
  async getBookingsToComplete(): Promise<Booking[]> {
    return withPrisma(async (client) => {
      const now = new Date();
      return client.booking.findMany({
        where: {
          deletedAt: null,
          status: 'IN_PROGRESS',
          endTime: {
            lte: now,
          },
        },
      });
    });
  }
}

// Export a singleton instance
export const bookingRepository = new BookingRepository();