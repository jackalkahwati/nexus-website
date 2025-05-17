import { NextResponse } from 'next/server'
import type { Vehicle, FleetStats, FleetAlert } from '@/types/fleet'

export const runtime = 'edge'

// Mock data generation functions
function generateMockVehicleUpdate(): Vehicle {
  return {
    id: 'v1',
    name: 'Truck 001',
    type: 'Truck',
    status: 'Active',
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.01,
      lng: -122.4194 + (Math.random() - 0.5) * 0.01,
      address: '123 Main St, San Francisco, CA'
    },
    batteryLevel: 85 - Math.random() * 5,
    mileage: 12500 + Math.random() * 10,
    lastMaintenance: '2024-01-15T00:00:00Z',
    nextMaintenance: '2024-04-15T00:00:00Z',
    telemetry: {
      speed: 30 + Math.random() * 10,
      temperature: 72 + (Math.random() - 0.5) * 5,
      engineStatus: 'Normal',
      fuelEfficiency: 28.5
    },
    driver: {
      id: 'd1',
      name: 'John Smith',
      phone: '+1-555-123-4567',
      rating: 4.8
    }
  }
}

function generateMockStatsUpdate(): FleetStats {
  return {
    total: 50,
    active: 35,
    inactive: 8,
    maintenance: 5,
    charging: 2,
    utilization: 78,
    alerts: {
      high: Math.floor(Math.random() * 3),
      medium: Math.floor(Math.random() * 5),
      low: Math.floor(Math.random() * 8),
    },
    performance: {
      onTime: 92,
      delayed: 6,
      cancelled: 2,
    },
  }
}

function generateMockAlert(): FleetAlert {
  const types: FleetAlert['type'][] = ['info', 'warning', 'error', 'maintenance', 'system']
  const priorities: FleetAlert['priority'][] = ['low', 'medium', 'high', 'critical']
  
  return {
    id: Date.now().toString(),
    vehicleId: 'v1',
    type: types[Math.floor(Math.random() * types.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    message: 'Mock alert message',
    timestamp: new Date().toISOString(),
    status: 'active',
    metadata: {}
  }
}

export async function GET() {
  const encoder = new TextEncoder()
  const customReadable = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode('data: {"type": "connection", "status": "connected"}\n\n')
      )

      // Simulate periodic updates
      const interval = setInterval(() => {
        // Randomly choose what type of update to send
        const rand = Math.random()
        
        let data
        if (rand < 0.6) {
          // 60% chance of vehicle update
          data = {
            type: 'vehicle_update',
            vehicle: generateMockVehicleUpdate(),
          }
        } else if (rand < 0.9) {
          // 30% chance of stats update
          data = {
            type: 'stats_update',
            stats: generateMockStatsUpdate(),
          }
        } else {
          // 10% chance of alert
          data = {
            type: 'alert',
            alert: generateMockAlert(),
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        )
      }, 5000) // Send updates every 5 seconds

      // Cleanup
      return () => {
        clearInterval(interval)
      }
    },
  })

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Accel-Buffering': 'no',
    },
  })
} 