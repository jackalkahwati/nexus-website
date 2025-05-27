"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface Route {
  id: string
  name: string
  startLocation: Location
  endLocation: Location
  waypoints: Location[]
  distance: number
  duration: number
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
}

interface OptimizationParams {
  priorityLocations?: string[]
  timeWindows?: {
    start: Date
    end: Date
  }[]
  vehicleCapacity?: number
  maxDistance?: number
}

interface RouteOptimizationContextType {
  routes: Route[]
  isOptimizing: boolean
  error: string | null
  optimizeRoute: (locations: Location[], params?: OptimizationParams) => Promise<Route>
  updateRoute: (routeId: string, updates: Partial<Route>) => Promise<void>
  deleteRoute: (routeId: string) => Promise<void>
  getRouteById: (routeId: string) => Route | undefined
  calculateRouteMetrics: (route: Route) => { totalDistance: number; estimatedDuration: number }
}

const RouteOptimizationContext = createContext<RouteOptimizationContextType | undefined>(undefined)

export function RouteOptimizationProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const optimizeRoute = useCallback(async (locations: Location[], params?: OptimizationParams) => {
    try {
      setIsOptimizing(true)
      setError(null)

      // Here you would typically make an API call to your route optimization service
      // For example:
      // const response = await fetch('/api/routes/optimize', {
      //   method: 'POST',
      //   body: JSON.stringify({ locations, params })
      // })
      // const optimizedRoute = await response.json()

      // For now, we'll create a simple route
      const newRoute: Route = {
        id: Date.now().toString(),
        name: `Route ${routes.length + 1}`,
        startLocation: locations[0],
        endLocation: locations[locations.length - 1],
        waypoints: locations.slice(1, -1),
        distance: 0, // This would be calculated by the optimization service
        duration: 0, // This would be calculated by the optimization service
        status: 'planned',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setRoutes(prev => [...prev, newRoute])
      console.log('Route optimized:', newRoute)
      return newRoute
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize route')
      throw err
    } finally {
      setIsOptimizing(false)
    }
  }, [routes])

  const updateRoute = useCallback(async (routeId: string, updates: Partial<Route>) => {
    try {
      setIsOptimizing(true)
      setError(null)

      // Here you would typically make an API call to update the route
      // await fetch(`/api/routes/${routeId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // })

      setRoutes(prev =>
        prev.map(route =>
          route.id === routeId
            ? { ...route, ...updates, updatedAt: new Date() }
            : route
        )
      )
      console.log('Route updated:', routeId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update route')
      throw err
    } finally {
      setIsOptimizing(false)
    }
  }, [])

  const deleteRoute = useCallback(async (routeId: string) => {
    try {
      setIsOptimizing(true)
      setError(null)

      // Here you would typically make an API call to delete the route
      // await fetch(`/api/routes/${routeId}`, { method: 'DELETE' })

      setRoutes(prev => prev.filter(route => route.id !== routeId))
      console.log('Route deleted:', routeId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route')
      throw err
    } finally {
      setIsOptimizing(false)
    }
  }, [])

  const getRouteById = useCallback(
    (routeId: string) => routes.find(route => route.id === routeId),
    [routes]
  )

  const calculateRouteMetrics = useCallback((route: Route) => {
    // This is a simplified calculation. In a real application,
    // you would use a mapping service to calculate actual distances and durations
    const totalDistance = route.distance || 0
    const estimatedDuration = route.duration || 0

    return {
      totalDistance,
      estimatedDuration
    }
  }, [])

  return (
    <RouteOptimizationContext.Provider
      value={{
        routes,
        isOptimizing,
        error,
        optimizeRoute,
        updateRoute,
        deleteRoute,
        getRouteById,
        calculateRouteMetrics
      }}
    >
      {children}
    </RouteOptimizationContext.Provider>
  )
}

export function useRouteOptimization() {
  const context = useContext(RouteOptimizationContext)
  if (context === undefined) {
    throw new Error('useRouteOptimization must be used within a RouteOptimizationProvider')
  }
  return context
} 