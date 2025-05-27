import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Vehicle as FleetVehicle } from '@/types/fleet'

// Re-export the Vehicle type from fleet.ts
export type Vehicle = FleetVehicle

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }
      const data = await response.json()
      setVehicles(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load vehicles')
    } finally {
      setIsLoading(false)
    }
  }

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      })
      if (!response.ok) {
        throw new Error('Failed to add vehicle')
      }
      const newVehicle = await response.json()
      setVehicles(prev => [...prev, newVehicle])
      toast.success('Vehicle added successfully')
      return newVehicle
    } catch (err) {
      toast.error('Failed to add vehicle')
      throw err
    }
  }

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update vehicle')
      }
      const updatedVehicle = await response.json()
      setVehicles(prev =>
        prev.map(vehicle => (vehicle.id === id ? updatedVehicle : vehicle))
      )
      toast.success('Vehicle updated successfully')
      return updatedVehicle
    } catch (err) {
      toast.error('Failed to update vehicle')
      throw err
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete vehicle')
      }
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
      toast.success('Vehicle deleted successfully')
    } catch (err) {
      toast.error('Failed to delete vehicle')
      throw err
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return {
    vehicles,
    isLoading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  }
} 