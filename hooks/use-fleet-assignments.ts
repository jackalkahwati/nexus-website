import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface GeoPoint {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export interface GeoPolygon {
  type: 'Polygon'
  coordinates: [number, number][][] // Array of linear rings
}

export interface Fleet {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  zones: Zone[]
  vehicleCount: number
}

export interface Zone {
  id: string
  name: string
  description?: string
  coordinates: GeoPolygon
  fleetId: string
  vehicleCount: number
}

export interface VehicleAssignment {
  vehicleId: string
  fleetId?: string
  zoneId?: string
  currentLocation?: GeoPoint
}

interface FleetFilters {
  status?: Fleet['status']
  search?: string
}

export function useFleetAssignments(initialFilters?: FleetFilters) {
  const [fleets, setFleets] = useState<Fleet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<FleetFilters>(initialFilters || {})

  const fetchFleets = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.status) {
        queryParams.set('status', filters.status)
      }
      if (filters.search) {
        queryParams.set('search', filters.search)
      }

      const response = await fetch(`/api/fleets?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch fleets')
      }
      const data = await response.json()
      setFleets(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load fleets')
    } finally {
      setIsLoading(false)
    }
  }

  const createFleet = async (fleet: Omit<Fleet, 'id' | 'zones' | 'vehicleCount'>) => {
    try {
      const response = await fetch('/api/fleets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fleet),
      })
      if (!response.ok) {
        throw new Error('Failed to create fleet')
      }
      const newFleet = await response.json()
      setFleets(prev => [...prev, newFleet])
      toast.success('Fleet created successfully')
      return newFleet
    } catch (err) {
      toast.error('Failed to create fleet')
      throw err
    }
  }

  const createZone = async (zone: Omit<Zone, 'id' | 'vehicleCount'>) => {
    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zone),
      })
      if (!response.ok) {
        throw new Error('Failed to create zone')
      }
      const newZone = await response.json()
      setFleets(prev =>
        prev.map(fleet =>
          fleet.id === zone.fleetId
            ? { ...fleet, zones: [...fleet.zones, newZone] }
            : fleet
        )
      )
      toast.success('Zone created successfully')
      return newZone
    } catch (err) {
      toast.error('Failed to create zone')
      throw err
    }
  }

  const assignVehicle = async (assignment: VehicleAssignment) => {
    try {
      const response = await fetch(`/api/vehicles/${assignment.vehicleId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      })
      if (!response.ok) {
        throw new Error('Failed to assign vehicle')
      }
      const updatedVehicle = await response.json()
      
      // Update fleet vehicle counts
      if (assignment.fleetId) {
        setFleets(prev =>
          prev.map(fleet => {
            if (fleet.id === assignment.fleetId) {
              return { ...fleet, vehicleCount: fleet.vehicleCount + 1 }
            }
            return fleet
          })
        )
      }

      toast.success('Vehicle assigned successfully')
      return updatedVehicle
    } catch (err) {
      toast.error('Failed to assign vehicle')
      throw err
    }
  }

  const updateVehicleLocation = async (vehicleId: string, location: GeoPoint) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      })
      if (!response.ok) {
        throw new Error('Failed to update vehicle location')
      }
      const updatedVehicle = await response.json()
      toast.success('Vehicle location updated')
      return updatedVehicle
    } catch (err) {
      toast.error('Failed to update vehicle location')
      throw err
    }
  }

  const checkZoneViolation = async (vehicleId: string, location: GeoPoint) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/check-zone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      })
      if (!response.ok) {
        throw new Error('Failed to check zone violation')
      }
      const result = await response.json()
      if (result.violation) {
        toast.error(`Vehicle is outside its assigned zone: ${result.zoneName}`)
      }
      return result
    } catch (err) {
      toast.error('Failed to check zone violation')
      throw err
    }
  }

  useEffect(() => {
    fetchFleets()
  }, [JSON.stringify(filters)])

  return {
    fleets,
    isLoading,
    error,
    filters,
    setFilters,
    fetchFleets,
    createFleet,
    createZone,
    assignVehicle,
    updateVehicleLocation,
    checkZoneViolation,
  }
} 