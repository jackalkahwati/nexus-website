import { PrismaClient, RebalancingPriority, StationType } from '@prisma/client'
import { getDistance } from 'geolib'

const prisma = new PrismaClient()

interface GeoPoint {
  latitude: number
  longitude: number
}

interface RebalancingRoute {
  stations: {
    id: string
    location: GeoPoint
    requiredAction: 'pickup' | 'dropoff'
    count: number
  }[]
  totalDistance: number
  estimatedDuration: number
}

export async function checkStationStatus(stationId: string) {
  const station = await prisma.station.findUnique({
    where: { id: stationId },
    include: {
      demandForecasts: {
        where: {
          timestamp: {
            gte: new Date(),
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
        take: 1,
      },
    },
  })

  if (!station) {
    throw new Error('Station not found')
  }

  // Calculate imbalance
  const currentImbalance = station.currentCount - station.minThreshold
  const maxImbalance = station.maxThreshold 
    ? station.currentCount - station.maxThreshold
    : 0

  // Get predicted demand
  const predictedDemand = station.demandForecasts[0]?.predictedDemand || 0

  // Calculate priority based on current state and predicted demand
  let priority: RebalancingPriority = 'LOW'
  
  if (currentImbalance < 0) {
    // Station needs bikes
    const shortage = Math.abs(currentImbalance)
    if (shortage >= 5 || predictedDemand > station.currentCount * 2) {
      priority = 'CRITICAL'
    } else if (shortage >= 3 || predictedDemand > station.currentCount * 1.5) {
      priority = 'HIGH'
    } else if (shortage >= 1) {
      priority = 'MEDIUM'
    }
  } else if (maxImbalance > 0) {
    // Station has too many bikes
    if (maxImbalance >= 5) {
      priority = 'HIGH'
    } else if (maxImbalance >= 3) {
      priority = 'MEDIUM'
    }
  }

  return {
    station,
    currentImbalance,
    maxImbalance,
    predictedDemand,
    priority,
  }
}

export async function createRebalancingTask(
  stationId: string,
  requiredCount: number,
  priority: RebalancingPriority,
  notes?: string
) {
  return prisma.rebalancingTask.create({
    data: {
      stationId,
      requiredCount,
      currentCount: 0,
      priority,
      notes,
    },
    include: {
      station: true,
    },
  })
}

export async function optimizeRebalancingRoutes(
  tasks: string[],
  vehicleLocation: GeoPoint
): Promise<RebalancingRoute[]> {
  // Get all tasks with their stations
  const rebalancingTasks = await prisma.rebalancingTask.findMany({
    where: {
      id: { in: tasks },
      status: 'PENDING',
    },
    include: {
      station: true,
    },
  })

  // Separate pickup and dropoff stations
  const pickupStations = rebalancingTasks.filter(
    task => task.requiredCount < 0
  ).map(task => ({
    id: task.station.id,
    location: task.station.location as GeoPoint,
    requiredAction: 'pickup' as const,
    count: Math.abs(task.requiredCount),
  }))

  const dropoffStations = rebalancingTasks.filter(
    task => task.requiredCount > 0
  ).map(task => ({
    id: task.station.id,
    location: task.station.location as GeoPoint,
    requiredAction: 'dropoff' as const,
    count: task.requiredCount,
  }))

  // Simple greedy algorithm for route optimization
  const routes: RebalancingRoute[] = []
  let currentLocation = vehicleLocation
  let currentRoute: RebalancingRoute = {
    stations: [],
    totalDistance: 0,
    estimatedDuration: 0,
  }
  let remainingCapacity = 20 // Assume vehicle capacity

  // Process pickups first
  while (pickupStations.length > 0) {
    // Find nearest pickup station
    const nearest = findNearestStation(currentLocation, pickupStations)
    if (!nearest) break

    // Add to route
    currentRoute.stations.push(nearest.station)
    currentRoute.totalDistance += nearest.distance
    currentRoute.estimatedDuration += (nearest.distance / 1000) * 3 // Rough estimate: 3 minutes per km

    // Update state
    currentLocation = nearest.station.location
    remainingCapacity -= nearest.station.count
    pickupStations.splice(nearest.index, 1)

    // Start new route if capacity reached
    if (remainingCapacity <= 0) {
      routes.push(currentRoute)
      currentRoute = {
        stations: [],
        totalDistance: 0,
        estimatedDuration: 0,
      }
      remainingCapacity = 20
    }
  }

  // Process dropoffs
  while (dropoffStations.length > 0) {
    // Find nearest dropoff station
    const nearest = findNearestStation(currentLocation, dropoffStations)
    if (!nearest) break

    // Add to route
    currentRoute.stations.push(nearest.station)
    currentRoute.totalDistance += nearest.distance
    currentRoute.estimatedDuration += (nearest.distance / 1000) * 3

    // Update state
    currentLocation = nearest.station.location
    remainingCapacity += nearest.station.count
    dropoffStations.splice(nearest.index, 1)

    // Start new route if empty
    if (remainingCapacity >= 20) {
      routes.push(currentRoute)
      currentRoute = {
        stations: [],
        totalDistance: 0,
        estimatedDuration: 0,
      }
      remainingCapacity = 20
    }
  }

  // Add final route if not empty
  if (currentRoute.stations.length > 0) {
    routes.push(currentRoute)
  }

  return routes
}

function findNearestStation(
  currentLocation: GeoPoint,
  stations: Array<{
    id: string
    location: GeoPoint
    requiredAction: 'pickup' | 'dropoff'
    count: number
  }>
) {
  let minDistance = Infinity
  let nearestIndex = -1

  stations.forEach((station, index) => {
    const distance = getDistance(
      currentLocation,
      station.location
    )
    if (distance < minDistance) {
      minDistance = distance
      nearestIndex = index
    }
  })

  if (nearestIndex === -1) return null

  return {
    station: stations[nearestIndex],
    distance: minDistance,
    index: nearestIndex,
  }
}

export async function updateRebalancingTask(
  taskId: string,
  updates: {
    status?: string
    currentCount?: number
    notes?: string
    completedAt?: Date
  }
) {
  return prisma.rebalancingTask.update({
    where: { id: taskId },
    data: updates,
    include: {
      station: true,
    },
  })
}

export async function getRebalancingMetrics(zoneId?: string) {
  const where = zoneId ? { station: { zoneId } } : {}

  const [
    totalTasks,
    completedTasks,
    criticalTasks,
    averageCompletionTime,
  ] = await Promise.all([
    prisma.rebalancingTask.count({ where }),
    prisma.rebalancingTask.count({
      where: {
        ...where,
        status: 'COMPLETED',
      },
    }),
    prisma.rebalancingTask.count({
      where: {
        ...where,
        priority: 'CRITICAL',
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.rebalancingTask.aggregate({
      where: {
        ...where,
        status: 'COMPLETED',
        startTime: { not: null },
        completedAt: { not: null },
      },
      _avg: {
        completedAt: true,
        startTime: true,
      },
    }),
  ])

  return {
    totalTasks,
    completedTasks,
    criticalTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    averageCompletionTime: averageCompletionTime._avg.completedAt && averageCompletionTime._avg.startTime
      ? (averageCompletionTime._avg.completedAt.getTime() - averageCompletionTime._avg.startTime.getTime()) / (1000 * 60) // in minutes
      : null,
  }
} 