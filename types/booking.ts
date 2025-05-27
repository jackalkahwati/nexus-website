export interface Booking {
  id: string
  customerName: string
  type: 'single' | 'recurring' | 'group'
  status: 'confirmed' | 'pending' | 'cancelled'
  startTime: string
  endTime: string
  location: string
  participants?: number
  vehicleType: 'standard' | 'premium' | 'luxury'
  notes?: string
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  recurringEndDate?: string
}

export interface BookingFormData extends Omit<Booking, 'id' | 'status'> {
  isRecurring?: boolean
}

export interface BookingFilters {
  status?: Booking['status']
  type?: Booking['type']
  date?: string
  search?: string
}

export interface BookingStats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  byType: {
    single: number
    recurring: number
    group: number
  }
} 