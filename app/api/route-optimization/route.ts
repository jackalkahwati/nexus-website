import { NextResponse } from "next/server"
import { OptimizationRequest, OptimizationResult, Stop, Vehicle } from "types/route-optimization"
import { v4 as uuidv4 } from "uuid"
import { generateRoute } from '@/lib/mock/fleet-data'

// In-memory storage for optimization requests (replace with database in production)
const optimizationRequests = new Map<string, OptimizationRequest>()
const optimizationResults = new Map<string, OptimizationResult>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.startLocation || !body.endLocation) {
      return NextResponse.json(
        { error: 'Missing required fields: startLocation and endLocation' },
        { status: 400 }
      )
    }

    // Generate an optimized route
    const optimizedRoute = {
      ...generateRoute(),
      startLocation: body.startLocation,
      endLocation: body.endLocation,
      waypoints: body.waypoints || [],
      vehicleId: body.vehicleId,
      driverId: body.driverId,
      scheduledAt: body.scheduledAt || new Date().toISOString(),
    }

    return NextResponse.json(optimizedRoute, { status: 201 })
  } catch (error) {
    console.error('Error creating route:', error)
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Generate 10 routes
    const routes = Array.from({ length: 10 }, generateRoute)
    return NextResponse.json(routes)
  } catch (error) {
    console.error('Error generating routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}

// Helper function to process optimization request
async function processOptimizationRequest(requestId: string) {
  try {
    const request = optimizationRequests.get(requestId)
    if (!request) return

    // Update status to processing
    request.status = "processing"
    request.updatedAt = new Date().toISOString()
    optimizationRequests.set(requestId, request)

    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Generate optimized routes
    const result = generateOptimizedRoutes(request)

    // Store result
    optimizationResults.set(requestId, result)

    // Update request status
    request.status = "completed"
    request.updatedAt = new Date().toISOString()
    optimizationRequests.set(requestId, request)
  } catch (error) {
    console.error("Error processing optimization request:", error)
    const request = optimizationRequests.get(requestId)
    if (request) {
      request.status = "failed"
      request.updatedAt = new Date().toISOString()
      optimizationRequests.set(requestId, request)
    }
  }
}

// Helper function to generate optimized routes (replace with actual optimization algorithm)
function generateOptimizedRoutes(request: OptimizationRequest): OptimizationResult {
  const { vehicles, stops } = request
  const routes = vehicles.map((vehicle, vehicleIndex) => {
    const vehicleStops = stops.slice(
      (vehicleIndex * stops.length) / vehicles.length,
      ((vehicleIndex + 1) * stops.length) / vehicles.length
    )

    const routeStops = vehicleStops.map((stop, index) => ({
      ...stop,
      arrivalTime: new Date(
        new Date(request.date).getTime() + index * 30 * 60000
      ).toISOString(),
      departureTime: new Date(
        new Date(request.date).getTime() + (index * 30 + 15) * 60000
      ).toISOString()
    }))

    const segments = generateRouteSegments(routeStops)

    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0)
    const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0)

    return {
      vehicleId: vehicle.id,
      stops: routeStops,
      segments,
      metrics: {
        totalDistance,
        totalDuration,
        totalStops: routeStops.length,
        totalLoad: routeStops.reduce((sum, stop) => sum + (stop.load || 0), 0),
        utilization: Math.random() * 0.4 + 0.4 // Random utilization between 40% and 80%
      }
    }
  })

  return {
    id: request.id,
    routes,
    metrics: {
      totalDistance: routes.reduce((sum, route) => sum + route.metrics.totalDistance, 0),
      totalDuration: routes.reduce((sum, route) => sum + route.metrics.totalDuration, 0),
      totalStops: routes.reduce((sum, route) => sum + route.metrics.totalStops, 0),
      totalVehicles: routes.length,
      averageUtilization: routes.reduce((sum, route) => sum + route.metrics.utilization, 0) / routes.length
    },
    status: "success"
  }
}

// Helper function to generate route segments between stops
function generateRouteSegments(stops: Stop[]) {
  return stops.slice(0, -1).map((stop, index) => {
    const nextStop = stops[index + 1]
    const distance = calculateDistance(
      stop.lat,
      stop.lng,
      nextStop.lat,
      nextStop.lng
    )

    // Explicitly type the trafficLevel to match the union type
    const trafficLevel: 'low' | 'medium' | 'high' = 
      Math.random() > 0.7 ? 'high' : 
      Math.random() > 0.4 ? 'medium' : 
      'low'

    return {
      start: {
        lat: stop.lat,
        lng: stop.lng
      },
      end: {
        lat: nextStop.lat,
        lng: nextStop.lng
      },
      distance: distance,
      duration: distance / 30, // Assume average speed of 30 m/s
      polyline: generatePolyline(
        [stop.lat, stop.lng],
        [nextStop.lat, nextStop.lng]
      ),
      trafficLevel
    }
  })
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Helper function to generate a simple polyline between two points
function generatePolyline(start: [number, number], end: [number, number]) {
  const numPoints = 10
  const points: [number, number][] = []

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1)
    points.push([
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t
    ])
  }

  return encodePolyline(points)
}

// Helper function to encode polyline
function encodePolyline(points: [number, number][]) {
  let result = ""
  let lastLat = 0
  let lastLng = 0

  points.forEach(([lat, lng]) => {
    const flatLat = Math.round(lat * 1e5)
    const flatLng = Math.round(lng * 1e5)
    const diffLat = flatLat - lastLat
    const diffLng = flatLng - lastLng

    result += encodeNumber(diffLat) + encodeNumber(diffLng)

    lastLat = flatLat
    lastLng = flatLng
  })

  return result
}

// Helper function to encode a single number for polyline
function encodeNumber(num: number) {
  num = num < 0 ? ~(num << 1) : num << 1
  let result = ""

  while (num >= 0x20) {
    result += String.fromCharCode((0x20 | (num & 0x1f)) + 63)
    num >>= 5
  }
  result += String.fromCharCode(num + 63)

  return result
}
