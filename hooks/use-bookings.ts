import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  type: 'single' | 'group' | 'recurring'
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  startTime: Date
  endTime: Date
  location?: string
  participants?: number
  recurringPattern?: string
  price: number
  notes?: string
  user: {
    name: string
    email: string
  }
  vehicle: {
    name: string
    type: string
  }
  payment?: {
    status: string
    amount: number
  }
}

interface BookingFilters {
  status?: Booking['status'][]
  startDate?: Date
  endDate?: Date
  vehicleId?: string
  userId?: string
}

export function useBookings(initialFilters?: BookingFilters) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<BookingFilters>(initialFilters || {})

  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.status?.length) {
        queryParams.set('status', filters.status.join(','))
      }
      if (filters.startDate) {
        queryParams.set('startDate', filters.startDate.toISOString())
      }
      if (filters.endDate) {
        queryParams.set('endDate', filters.endDate.toISOString())
      }
      if (filters.vehicleId) {
        queryParams.set('vehicleId', filters.vehicleId)
      }
      if (filters.userId) {
        queryParams.set('userId', filters.userId)
      }

      const response = await fetch(`/api/bookings?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await response.json()
      setBookings(data.map((booking: any) => ({
        ...booking,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
      })))
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'user' | 'vehicle' | 'payment'>) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })
      if (!response.ok) {
        throw new Error('Failed to create booking')
      }
      const newBooking = await response.json()
      setBookings(prev => [...prev, {
        ...newBooking,
        startTime: new Date(newBooking.startTime),
        endTime: new Date(newBooking.endTime),
      }])
      toast.success('Booking created successfully')
      return newBooking
    } catch (err) {
      toast.error('Failed to create booking')
      throw err
    }
  }

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update booking')
      }
      const updatedBooking = await response.json()
      setBookings(prev =>
        prev.map(booking => booking.id === id ? {
          ...updatedBooking,
          startTime: new Date(updatedBooking.startTime),
          endTime: new Date(updatedBooking.endTime),
        } : booking)
      )
      toast.success('Booking updated successfully')
      return updatedBooking
    } catch (err) {
      toast.error('Failed to update booking')
      throw err
    }
  }

  const cancelBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }
      const updatedBooking = await response.json()
      setBookings(prev =>
        prev.map(booking => booking.id === id ? {
          ...updatedBooking,
          startTime: new Date(updatedBooking.startTime),
          endTime: new Date(updatedBooking.endTime),
        } : booking)
      )
      toast.success('Booking cancelled successfully')
      return updatedBooking
    } catch (err) {
      toast.error('Failed to cancel booking')
      throw err
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete booking')
      }
      setBookings(prev => prev.filter(booking => booking.id !== id))
      toast.success('Booking deleted successfully')
    } catch (err) {
      toast.error('Failed to delete booking')
      throw err
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [JSON.stringify(filters)])

  return {
    bookings,
    isLoading,
    error,
    filters,
    setFilters,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
  }
} 