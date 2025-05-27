import { EventEmitter } from 'events'
import logger from '@/lib/logger'
import type { MaintenancePrediction } from '@/types/autonomy'

interface ComponentData {
  vehicleId: string
  componentId: string
  componentType: string
  telemetryData: {
    timestamp: string
    measurements: Record<string, number>
  }[]
}

interface MLPredictionResponse {
  failureProbability: number
  timeToFailure: number
  confidenceScore: number
}

interface MaintenanceRule {
  componentType: string
  thresholds: {
    warning: number
    critical: number
  }
  parameters: string[]
  weights: Record<string, number>
}

export class PredictiveMaintenanceService extends EventEmitter {
  private componentData: Map<string, ComponentData>
  private maintenanceRules: MaintenanceRule[]
  private mlEndpoint: string
  private predictionCache: Map<string, MaintenancePrediction>
  private lastPredictionTime: Map<string, number>
  private predictionInterval: number // milliseconds

  constructor(config: {
    mlEndpoint?: string
    predictionInterval?: number
    rules?: MaintenanceRule[]
  } = {}) {
    super()
    this.componentData = new Map()
    this.predictionCache = new Map()
    this.lastPredictionTime = new Map()
    this.mlEndpoint = config.mlEndpoint || 'http://localhost:5000/predict'
    this.predictionInterval = config.predictionInterval || 3600000 // 1 hour
    this.maintenanceRules = config.rules || [
      {
        componentType: 'battery',
        thresholds: { warning: 0.7, critical: 0.9 },
        parameters: ['voltage', 'temperature', 'cycleCount'],
        weights: { voltage: 0.4, temperature: 0.3, cycleCount: 0.3 }
      },
      {
        componentType: 'brake',
        thresholds: { warning: 0.6, critical: 0.8 },
        parameters: ['padThickness', 'temperature', 'usage'],
        weights: { padThickness: 0.5, temperature: 0.3, usage: 0.2 }
      },
      {
        componentType: 'motor',
        thresholds: { warning: 0.65, critical: 0.85 },
        parameters: ['temperature', 'vibration', 'current'],
        weights: { temperature: 0.4, vibration: 0.4, current: 0.2 }
      }
    ]
  }

  public async addTelemetryData(
    vehicleId: string,
    componentId: string,
    componentType: string,
    measurements: Record<string, number>
  ): Promise<void> {
    const key = `${vehicleId}_${componentId}`
    const existingData = this.componentData.get(key) || {
      vehicleId,
      componentId,
      componentType,
      telemetryData: []
    }

    existingData.telemetryData.push({
      timestamp: new Date().toISOString(),
      measurements
    })

    // Keep only last 24 hours of data
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000
    existingData.telemetryData = existingData.telemetryData.filter(
      data => new Date(data.timestamp).getTime() > twentyFourHoursAgo
    )

    this.componentData.set(key, existingData)

    // Check if we need to update prediction
    const lastPrediction = this.lastPredictionTime.get(key) || 0
    if (Date.now() - lastPrediction > this.predictionInterval) {
      await this.updatePrediction(key)
    }
  }

  public async getPrediction(
    vehicleId: string,
    componentId: string
  ): Promise<MaintenancePrediction | null> {
    const key = `${vehicleId}_${componentId}`
    return this.predictionCache.get(key) || null
  }

  public getAllPredictions(): MaintenancePrediction[] {
    return Array.from(this.predictionCache.values())
  }

  private async updatePrediction(key: string): Promise<void> {
    try {
      const componentData = this.componentData.get(key)
      if (!componentData) return

      // Get rule for component type
      const rule = this.maintenanceRules.find(
        r => r.componentType === componentData.componentType
      )
      if (!rule) {
        logger.warn('No maintenance rule found for component type', {
          componentType: componentData.componentType
        })
        return
      }

      // Prepare data for ML model
      const latestData = componentData.telemetryData[componentData.telemetryData.length - 1]
      if (!latestData) return

      // In production, this would call an actual ML service
      // For now, we'll use a simple heuristic-based prediction
      const prediction = await this.getSimulatedPrediction(latestData.measurements, rule)

      const maintenancePrediction: MaintenancePrediction = {
        vehicleId: componentData.vehicleId,
        componentId: componentData.componentId,
        componentType: componentData.componentType,
        predictionTimestamp: new Date().toISOString(),
        failureProbability: prediction.failureProbability,
        estimatedTimeToFailure: prediction.timeToFailure,
        confidenceScore: prediction.confidenceScore,
        recommendedAction: this.getRecommendedAction(
          prediction.failureProbability,
          rule.thresholds
        ),
        severity: this.getSeverityLevel(
          prediction.failureProbability,
          rule.thresholds
        )
      }

      this.predictionCache.set(key, maintenancePrediction)
      this.lastPredictionTime.set(key, Date.now())
      this.emit('predictionUpdated', maintenancePrediction)

      logger.info('Updated maintenance prediction', {
        vehicleId: componentData.vehicleId,
        componentId: componentData.componentId,
        failureProbability: prediction.failureProbability,
        severity: maintenancePrediction.severity
      })
    } catch (error) {
      logger.error('Error updating maintenance prediction', {
        error,
        key
      })
    }
  }

  private async getSimulatedPrediction(
    measurements: Record<string, number>,
    rule: MaintenanceRule
  ): Promise<MLPredictionResponse> {
    // Simulate ML model prediction using weighted average of parameters
    let weightedSum = 0
    let totalWeight = 0

    for (const [param, weight] of Object.entries(rule.weights)) {
      if (measurements[param] !== undefined) {
        // Normalize measurement to 0-1 range (simplified)
        const normalizedValue = measurements[param] / 100
        weightedSum += normalizedValue * weight
        totalWeight += weight
      }
    }

    const failureProbability = weightedSum / totalWeight
    
    return {
      failureProbability,
      timeToFailure: (1 - failureProbability) * 168, // hours until failure
      confidenceScore: 0.8 - Math.random() * 0.2 // Simulated confidence score
    }
  }

  private getRecommendedAction(
    probability: number,
    thresholds: { warning: number; critical: number }
  ): string {
    if (probability >= thresholds.critical) {
      return 'Immediate maintenance required'
    } else if (probability >= thresholds.warning) {
      return 'Schedule maintenance within next 48 hours'
    } else {
      return 'Monitor condition'
    }
  }

  private getSeverityLevel(
    probability: number,
    thresholds: { warning: number; critical: number }
  ): MaintenancePrediction['severity'] {
    if (probability >= thresholds.critical) {
      return 'critical'
    } else if (probability >= thresholds.warning) {
      return 'high'
    } else if (probability >= thresholds.warning * 0.7) {
      return 'medium'
    } else {
      return 'low'
    }
  }
} 