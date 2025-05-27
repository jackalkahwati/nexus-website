"use client"

import { useState, useEffect } from 'react'
import type { 
  Vehicle, 
  MaintenanceRecord, 
  Route, 
  Analytics,
  FleetData 
} from '@/types/fleet'

interface UseFleetOperationsReturn {
  data: FleetData | null
  isLoading: boolean
  error: Error | null
  vehicles: Vehicle[]
  routes: Route[]
  maintenance: MaintenanceRecord[]
  analytics: Analytics | null
  fetchVehicles: (vehicleId?: string) => Promise<void>
  fetchRoutes: (vehicleId?: string) => Promise<void>
  fetchMaintenance: (vehicleId?: string) => Promise<void>
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>
  createMaintenanceRecord: (data: Omit<MaintenanceRecord, 'id'>) => Promise<MaintenanceRecord>
  updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => Promise<MaintenanceRecord>
  createRoute: (data: Omit<Route, 'id'>) => Promise<Route>
  updateRoute: (id: string, updates: Partial<Route>) => Promise<Route>
  refresh: () => Promise<void>
}

const initialFleetData: FleetData = {
  vehicles: [],
  routes: [],
  maintenance: [],
  analytics: {
    fleetUtilization: 0,
    activeVehicles: 0,
    totalRoutes: 0,
    completedRoutes: 0,
    averageRouteTime: 0,
    fuelEfficiency: 0,
    maintenanceMetrics: {
      scheduled: 0,
      completed: 0,
      pending: 0
    },
    safetyMetrics: {
      incidents: 0,
      warnings: 0,
      safetyScore: 0
    },
    costMetrics: {
      fuelCosts: 0,
      maintenanceCosts: 0,
      totalOperatingCosts: 0
    },
    timeRange: {
      start: new Date().toISOString(),
      end: new Date().toISOString()
    }
  }
}

export function useFleetOperations(): UseFleetOperationsReturn {
  const [data, setData] = useState<FleetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (type: string, vehicleId?: string, startDate?: string, endDate?: string) => {
    try {
      let url = `/api/fleet/operations?type=${type}`
      if (vehicleId) url += `&vehicleId=${vehicleId}`
      if (startDate) url += `&startDate=${startDate}`
      if (endDate) url += `&endDate=${endDate}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch ${type}`)
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  const fetchVehicles = async (vehicleId?: string) => {
    setIsLoading(true)
    try {
      const vehicles = await fetchData('vehicles', vehicleId)
      setData(prev => ({
        ...prev || initialFleetData,
        vehicles
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRoutes = async (vehicleId?: string) => {
    setIsLoading(true)
    try {
      const routes = await fetchData('routes', vehicleId)
      setData(prev => ({
        ...prev || initialFleetData,
        routes
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMaintenance = async (vehicleId?: string) => {
    setIsLoading(true)
    try {
      const maintenance = await fetchData('maintenance', vehicleId)
      setData(prev => ({
        ...prev || initialFleetData,
        maintenance
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async (startDate?: string, endDate?: string) => {
    setIsLoading(true)
    try {
      const analytics = await fetchData('analytics', undefined, startDate, endDate)
      setData(prev => ({
        ...prev || initialFleetData,
        analytics
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const createMaintenanceRecord = async (data: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> => {
    try {
      const response = await fetch('/api/fleet/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'maintenance',
          data,
        }),
      })

      if (!response.ok) throw new Error('Failed to create maintenance record')
      const newRecord = await response.json()
      setData(prev => ({
        ...prev || initialFleetData,
        maintenance: [...(prev?.maintenance || []), newRecord],
      }))
      return newRecord
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create maintenance record'))
      throw err
    }
  }

  const updateMaintenanceRecord = async (
    id: string,
    updates: Partial<MaintenanceRecord>
  ): Promise<MaintenanceRecord> => {
    try {
      const response = await fetch('/api/fleet/operations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'maintenance',
          id,
          updates,
        }),
      })

      if (!response.ok) throw new Error('Failed to update maintenance record')
      const updatedRecord = await response.json()
      setData(prev => ({
        ...prev || initialFleetData,
        maintenance: (prev?.maintenance || []).map(record =>
          record.id === id ? updatedRecord : record
        ),
      }))
      return updatedRecord
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update maintenance record'))
      throw err
    }
  }

  const createRoute = async (data: Omit<Route, 'id'>): Promise<Route> => {
    try {
      const response = await fetch('/api/fleet/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'route',
          data,
        }),
      })

      if (!response.ok) throw new Error('Failed to create route')
      const newRoute = await response.json()
      setData(prev => ({
        ...prev || initialFleetData,
        routes: [...(prev?.routes || []), newRoute],
      }))
      return newRoute
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create route'))
      throw err
    }
  }

  const updateRoute = async (id: string, updates: Partial<Route>): Promise<Route> => {
    try {
      const response = await fetch('/api/fleet/operations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'route',
          id,
          updates,
        }),
      })

      if (!response.ok) throw new Error('Failed to update route')
      const updatedRoute = await response.json()
      setData(prev => ({
        ...prev || initialFleetData,
        routes: (prev?.routes || []).map(route =>
          route.id === id ? updatedRoute : route
        ),
      }))
      return updatedRoute
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update route'))
      throw err
    }
  }

  const refresh = async () => {
    setIsLoading(true)
    try {
      const [vehicles, routes, maintenance, analytics] = await Promise.all([
        fetchData('vehicles'),
        fetchData('routes'),
        fetchData('maintenance'),
        fetchData('analytics'),
      ])
      setData({ vehicles, routes, maintenance, analytics })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    data,
    isLoading,
    error,
    vehicles: data?.vehicles || [],
    routes: data?.routes || [],
    maintenance: data?.maintenance || [],
    analytics: data?.analytics || null,
    fetchVehicles,
    fetchRoutes,
    fetchMaintenance,
    fetchAnalytics,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    createRoute,
    updateRoute,
    refresh,
  }
} 