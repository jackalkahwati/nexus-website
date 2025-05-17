import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface Technician {
  id: string
  name: string
  email: string
  specialties: string[]
  certification?: string
  status: 'active' | 'inactive'
  availability: 'available' | 'busy' | 'off-duty'
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians')
      if (!response.ok) {
        throw new Error('Failed to fetch technicians')
      }
      const data = await response.json()
      setTechnicians(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load technicians')
    } finally {
      setIsLoading(false)
    }
  }

  const addTechnician = async (technician: Omit<Technician, 'id'>) => {
    try {
      const response = await fetch('/api/technicians', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(technician),
      })
      if (!response.ok) {
        throw new Error('Failed to add technician')
      }
      const newTechnician = await response.json()
      setTechnicians(prev => [...prev, newTechnician])
      toast.success('Technician added successfully')
      return newTechnician
    } catch (err) {
      toast.error('Failed to add technician')
      throw err
    }
  }

  const updateTechnician = async (id: string, updates: Partial<Technician>) => {
    try {
      const response = await fetch(`/api/technicians/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update technician')
      }
      const updatedTechnician = await response.json()
      setTechnicians(prev =>
        prev.map(tech => (tech.id === id ? updatedTechnician : tech))
      )
      toast.success('Technician updated successfully')
      return updatedTechnician
    } catch (err) {
      toast.error('Failed to update technician')
      throw err
    }
  }

  const updateTechnicianAvailability = async (id: string, availability: Technician['availability']) => {
    try {
      const response = await fetch(`/api/technicians/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability }),
      })
      if (!response.ok) {
        throw new Error('Failed to update technician availability')
      }
      const updatedTechnician = await response.json()
      setTechnicians(prev =>
        prev.map(tech => (tech.id === id ? updatedTechnician : tech))
      )
      return updatedTechnician
    } catch (err) {
      toast.error('Failed to update technician availability')
      throw err
    }
  }

  const deleteTechnician = async (id: string) => {
    try {
      const response = await fetch(`/api/technicians/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete technician')
      }
      setTechnicians(prev => prev.filter(tech => tech.id !== id))
      toast.success('Technician deleted successfully')
    } catch (err) {
      toast.error('Failed to delete technician')
      throw err
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  return {
    technicians,
    isLoading,
    error,
    fetchTechnicians,
    addTechnician,
    updateTechnician,
    updateTechnicianAvailability,
    deleteTechnician,
  }
} 