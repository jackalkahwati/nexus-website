"use client"

import * as React from 'react'
import type { Vehicle, VehicleStatus } from '@prisma/client'
import type { FleetStats, FleetAlert } from '@/types/fleet'
import { useToast } from '@/components/ui/use-toast'

interface FleetContextType {
  vehicles: Vehicle[]
  stats: FleetStats
  alerts: FleetAlert[]
  isLoading: boolean
  error: string | null
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  refreshFleet: () => Promise<void>
  acknowledgeAlert: (alertId: string) => Promise<void>
  resolveAlert: (alertId: string) => Promise<void>
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => Promise<void>
}

const FleetContext = React.createContext<FleetContextType | undefined>(undefined)

// Mock data for development
const mockVehicles: Partial<Vehicle>[] = [
  {
    id: 'v1',
    name: 'Truck 001',
    type: 'Truck',
    status: 'AVAILABLE',
    mileage: 12500,
    lastMaintenance: new Date('2024-01-15T00:00:00Z'),
    nextMaintenanceDue: new Date('2024-04-15T00:00:00Z'),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockStats: FleetStats = {
  total: 50,
  active: 35,
  inactive: 8,
  maintenance: 5,
  charging: 2,
  utilization: 78,
  alerts: {
    high: 2,
    medium: 5,
    low: 8,
  },
  performance: {
    onTime: 92,
    delayed: 6,
    cancelled: 2,
  },
}

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(mockVehicles as Vehicle[])
  const [stats, setStats] = React.useState<FleetStats>(mockStats)
  const [alerts, setAlerts] = React.useState<FleetAlert[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null)
  const { toast } = useToast()

  // Set up SSE connection for real-time updates
  React.useEffect(() => {
    let eventSource: EventSource

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/fleet/stream')

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          
          if (data.type === 'vehicle_update') {
            setVehicles(prev => 
              prev.map(vehicle => 
                vehicle.id === data.vehicle.id 
                  ? { ...vehicle, ...data.vehicle }
                  : vehicle
              )
            )
          } else if (data.type === 'stats_update') {
            setStats(data.stats)
          } else if (data.type === 'alert') {
            setAlerts(prev => [data.alert, ...prev])
            toast({
              title: 'New Fleet Alert',
              description: data.alert.message,
              variant: data.alert.priority === 'high' ? 'destructive' : 'default',
            })
          }
        }

        eventSource.onerror = (error) => {
          console.error('Fleet SSE Error:', error)
          eventSource.close()
          setTimeout(connectSSE, 5000)
        }
      } catch (error) {
        console.error('Error connecting to Fleet SSE:', error)
        setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [toast])

  const refreshFleet = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/fleet')
      const data = await response.json()
      setVehicles(data.vehicles)
      setStats(data.stats)
      setError(null)
    } catch (error) {
      setError('Failed to refresh fleet data')
      console.error('Error refreshing fleet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/fleet/alerts/${alertId}/acknowledge`, {
        method: 'POST',
      })
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, status: 'acknowledged' }
            : alert
        )
      )
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      })
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/fleet/alerts/${alertId}/resolve`, {
        method: 'POST',
      })
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, status: 'resolved' }
            : alert
        )
      )
    } catch (error) {
      console.error('Error resolving alert:', error)
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      })
    }
  }

  const updateVehicleStatus = async (vehicleId: string, status: VehicleStatus) => {
    try {
      await fetch(`/api/fleet/vehicles/${vehicleId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      setVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === vehicleId
            ? { ...vehicle, status }
            : vehicle
        )
      )
      toast({
        title: 'Status Updated',
        description: `Vehicle ${vehicleId} status updated to ${status}`,
      })
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update vehicle status',
        variant: 'destructive',
      })
    }
  }

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        stats,
        alerts,
        isLoading,
        error,
        selectedVehicle,
        setSelectedVehicle,
        refreshFleet,
        acknowledgeAlert,
        resolveAlert,
        updateVehicleStatus,
      }}
    >
      {children}
    </FleetContext.Provider>
  )
}

export function useFleet() {
  const context = React.useContext(FleetContext)
  if (context === undefined) {
    throw new Error('useFleet must be used within a FleetProvider')
  }
  return context
} 