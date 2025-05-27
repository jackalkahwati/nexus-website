import { PrismaClient } from '@prisma/client'
import { addHours, startOfHour, endOfHour, eachHourOfInterval } from 'date-fns'

const prisma = new PrismaClient()

interface DemandFactors {
  timeOfDay: number // 0-23
  dayOfWeek: number // 0-6
  isHoliday: boolean
  weatherCondition: string
  temperature: number
  precipitation: number
  nearbyEvents: number
}

export async function generateDemandForecast(
  stationId: string,
  startTime: Date,
  endTime: Date,
  factors: DemandFactors[]
) {
  // Get historical data for the station
  const historicalData = await getHistoricalDemand(stationId, startTime, endTime)
  
  // Calculate base demand using historical patterns
  const baseDemand = calculateBaseDemand(historicalData)
  
  // Generate hourly forecasts
  const forecasts = factors.map(factor => {
    const adjustedDemand = adjustDemandForFactors(baseDemand, factor)
    return {
      stationId,
      timestamp: startOfHour(new Date(startTime)),
      predictedDemand: Math.max(0, Math.round(adjustedDemand)),
      confidence: calculateConfidence(historicalData, factor),
      factors: factor,
    }
  })

  // Save forecasts to database
  return prisma.demandForecast.createMany({
    data: forecasts,
  })
}

async function getHistoricalDemand(
  stationId: string,
  startTime: Date,
  endTime: Date
) {
  // Get rental history for similar time periods
  const rentalHistory = await prisma.rental.findMany({
    where: {
      OR: [
        { pickupStationId: stationId },
        { dropoffStationId: stationId },
      ],
      startTime: {
        gte: startOfHour(startTime),
        lte: endOfHour(endTime),
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  // Group rentals by hour
  const hourlyDemand = new Map<string, number>()
  
  rentalHistory.forEach(rental => {
    const hour = startOfHour(rental.startTime).toISOString()
    hourlyDemand.set(
      hour,
      (hourlyDemand.get(hour) || 0) + 1
    )
  })

  return Array.from(hourlyDemand.entries()).map(([hour, count]) => ({
    hour: new Date(hour),
    count,
  }))
}

function calculateBaseDemand(historicalData: Array<{ hour: Date, count: number }>) {
  if (historicalData.length === 0) return 0
  
  // Calculate average hourly demand
  const totalDemand = historicalData.reduce((sum, data) => sum + data.count, 0)
  return totalDemand / historicalData.length
}

function adjustDemandForFactors(baseDemand: number, factors: DemandFactors): number {
  let adjustedDemand = baseDemand

  // Time of day adjustment (peak hours)
  if (factors.timeOfDay >= 7 && factors.timeOfDay <= 9) {
    adjustedDemand *= 1.5 // Morning peak
  } else if (factors.timeOfDay >= 16 && factors.timeOfDay <= 18) {
    adjustedDemand *= 1.4 // Evening peak
  } else if (factors.timeOfDay >= 23 || factors.timeOfDay <= 4) {
    adjustedDemand *= 0.3 // Night hours
  }

  // Day of week adjustment
  if (factors.dayOfWeek === 0 || factors.dayOfWeek === 6) {
    adjustedDemand *= 0.7 // Weekend reduction
  }

  // Weather adjustments
  if (factors.weatherCondition === 'RAIN') {
    adjustedDemand *= 0.6
  } else if (factors.weatherCondition === 'SNOW') {
    adjustedDemand *= 0.3
  }

  // Temperature adjustment
  if (factors.temperature < 5) {
    adjustedDemand *= 0.5
  } else if (factors.temperature > 30) {
    adjustedDemand *= 0.7
  }

  // Precipitation adjustment
  if (factors.precipitation > 0) {
    adjustedDemand *= Math.max(0.3, 1 - factors.precipitation * 0.2)
  }

  // Nearby events boost
  if (factors.nearbyEvents > 0) {
    adjustedDemand *= (1 + factors.nearbyEvents * 0.1)
  }

  // Holiday adjustment
  if (factors.isHoliday) {
    adjustedDemand *= 0.6
  }

  return adjustedDemand
}

function calculateConfidence(
  historicalData: Array<{ hour: Date, count: number }>,
  factors: DemandFactors
): number {
  // Base confidence based on historical data volume
  let confidence = Math.min(0.9, historicalData.length / 100)

  // Reduce confidence for extreme weather
  if (factors.weatherCondition === 'SNOW' || factors.precipitation > 0.5) {
    confidence *= 0.8
  }

  // Reduce confidence for extreme temperatures
  if (factors.temperature < 0 || factors.temperature > 35) {
    confidence *= 0.9
  }

  // Reduce confidence for late night hours
  if (factors.timeOfDay >= 23 || factors.timeOfDay <= 4) {
    confidence *= 0.9
  }

  return Math.max(0.3, confidence) // Minimum 30% confidence
}

export async function updateForecastAccuracy(
  stationId: string,
  timestamp: Date,
  actualDemand: number
) {
  const forecast = await prisma.demandForecast.findFirst({
    where: {
      stationId,
      timestamp: {
        gte: startOfHour(timestamp),
        lt: addHours(startOfHour(timestamp), 1),
      },
    },
  })

  if (!forecast) return null

  const accuracy = calculateForecastAccuracy(
    actualDemand,
    forecast.predictedDemand
  )

  return prisma.demandForecast.update({
    where: { id: forecast.id },
    data: {
      actualDemand,
      accuracy,
    },
  })
}

function calculateForecastAccuracy(actual: number, predicted: number): number {
  if (actual === predicted) return 1
  if (actual === 0) return predicted === 0 ? 1 : 0

  const percentageError = Math.abs(actual - predicted) / actual
  return Math.max(0, 1 - percentageError)
}

export async function getForecastMetrics(
  stationId: string,
  startTime: Date,
  endTime: Date
) {
  const forecasts = await prisma.demandForecast.findMany({
    where: {
      stationId,
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
      actualDemand: { not: null },
      accuracy: { not: null },
    },
  })

  if (forecasts.length === 0) {
    return null
  }

  const totalForecasts = forecasts.length
  const accuracySum = forecasts.reduce((sum, f) => sum + (f.accuracy || 0), 0)
  const averageAccuracy = accuracySum / totalForecasts

  const mape = forecasts.reduce((sum, f) => {
    if (!f.actualDemand) return sum
    return sum + Math.abs((f.actualDemand - f.predictedDemand) / f.actualDemand)
  }, 0) / totalForecasts

  return {
    totalForecasts,
    averageAccuracy,
    mape,
    timeRange: {
      start: startTime,
      end: endTime,
    },
  }
} 