"use client"

import { useState, useEffect } from 'react'
import type { Driver } from '@/types/driver'

interface UseDriversReturn {
  drivers: Driver[]
  isLoading: boolean
  error: Error | null
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<Driver>
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<Driver>
  deleteDriver: (id: string) => Promise<boolean>
  refreshDrivers: () => Promise<void>
}

export function useDrivers(): UseDriversReturn {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers')
      if (!response.ok) throw new Error('Failed to fetch drivers')
      const data = await response.json()
      setDrivers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const addDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driver),
      })

      if (!response.ok) throw new Error('Failed to add driver')
      const newDriver = await response.json()
      setDrivers(current => [...current, newDriver])
      return newDriver
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add driver')
      setError(error)
      throw error
    }
  }

  const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
    try {
      const response = await fetch('/api/drivers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) throw new Error('Failed to update driver')
      const updatedDriver = await response.json()
      setDrivers(current =>
        current.map(driver =>
          driver.id === id ? { ...driver, ...updatedDriver } : driver
        )
      )
      return updatedDriver
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update driver')
      setError(error)
      throw error
    }
  }

  const deleteDriver = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/drivers?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete driver')
      setDrivers(current => current.filter(driver => driver.id !== id))
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete driver')
      setError(error)
      throw error
    }
  }

  const refreshDrivers = async () => {
    setIsLoading(true)
    await fetchDrivers()
  }

  return {
    drivers,
    isLoading,
    error,
    addDriver,
    updateDriver,
    deleteDriver,
    refreshDrivers,
  }
} 