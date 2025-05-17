import { jest } from '@jest/globals'
import { PredictiveMaintenanceService } from '../predictive-maintenance'
import type { MaintenancePrediction } from '@/types/autonomy'

// Mock logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

describe('PredictiveMaintenanceService', () => {
  let maintenanceService: PredictiveMaintenanceService

  beforeEach(() => {
    jest.useFakeTimers()
    maintenanceService = new PredictiveMaintenanceService({
      predictionInterval: 1000, // 1 second for testing
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Telemetry Data Management', () => {
    it('should accept and store telemetry data', async () => {
      const measurements = {
        temperature: 75,
        voltage: 12.5,
        cycleCount: 1000,
      }

      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        measurements
      )

      const prediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')
      expect(prediction).toBeDefined()
      expect(prediction?.componentType).toBe('battery')
    })

    it('should maintain data window of 24 hours', async () => {
      const measurements = {
        temperature: 75,
        voltage: 12.5,
        cycleCount: 1000,
      }

      // Add data points across different times
      for (let i = 0; i < 5; i++) {
        jest.setSystemTime(Date.now() - (25 - i) * 60 * 60 * 1000) // Spread over 25 hours
        await maintenanceService.addTelemetryData(
          'vehicle-1',
          'battery-1',
          'battery',
          measurements
        )
      }

      // Fast forward to current time
      jest.setSystemTime(Date.now())

      // Add one more data point
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        measurements
      )

      // Get internal state for testing (using any to access private property)
      const componentData = (maintenanceService as any).componentData.get('vehicle-1_battery-1')
      
      // Should only contain data points from last 24 hours
      expect(componentData.telemetryData.length).toBeLessThan(6)
    })
  })

  describe('Prediction Generation', () => {
    it('should generate predictions based on telemetry data', async () => {
      const measurements = {
        temperature: 90, // High temperature
        voltage: 10.5,   // Low voltage
        cycleCount: 5000, // High cycle count
      }

      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        measurements
      )

      const prediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')
      
      expect(prediction).toBeDefined()
      expect(prediction?.failureProbability).toBeGreaterThan(0.5) // Should indicate high risk
      expect(prediction?.severity).toBe('high')
    })

    it('should update predictions periodically', async () => {
      const initialMeasurements = {
        temperature: 75,
        voltage: 12.5,
        cycleCount: 1000,
      }

      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        initialMeasurements
      )

      const initialPrediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')

      // Update measurements after prediction interval
      const updatedMeasurements = {
        temperature: 85,
        voltage: 11.5,
        cycleCount: 1200,
      }

      jest.advanceTimersByTime(1100) // Just over prediction interval

      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        updatedMeasurements
      )

      const updatedPrediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')

      expect(updatedPrediction?.predictionTimestamp).not.toBe(initialPrediction?.predictionTimestamp)
      expect(updatedPrediction?.failureProbability).toBeGreaterThan(initialPrediction?.failureProbability || 0)
    })

    it('should emit events when predictions are updated', async () => {
      const predictionUpdateSpy = jest.fn()
      maintenanceService.on('predictionUpdated', predictionUpdateSpy)

      const measurements = {
        temperature: 80,
        voltage: 12.0,
        cycleCount: 2000,
      }

      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        measurements
      )

      expect(predictionUpdateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: 'vehicle-1',
          componentId: 'battery-1',
          componentType: 'battery',
        })
      )
    })
  })

  describe('Maintenance Recommendations', () => {
    it('should provide appropriate maintenance recommendations based on severity', async () => {
      // Test critical condition
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        {
          temperature: 95,
          voltage: 10.0,
          cycleCount: 8000,
        }
      )

      const criticalPrediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')
      expect(criticalPrediction?.severity).toBe('critical')
      expect(criticalPrediction?.recommendedAction).toContain('Immediate maintenance')

      // Test warning condition
      await maintenanceService.addTelemetryData(
        'vehicle-2',
        'battery-2',
        'battery',
        {
          temperature: 85,
          voltage: 11.0,
          cycleCount: 5000,
        }
      )

      const warningPrediction = await maintenanceService.getPrediction('vehicle-2', 'battery-2')
      expect(warningPrediction?.severity).toBe('high')
      expect(warningPrediction?.recommendedAction).toContain('Schedule maintenance')
    })

    it('should handle multiple component types', async () => {
      // Add battery data
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        {
          temperature: 80,
          voltage: 12.0,
          cycleCount: 2000,
        }
      )

      // Add brake data
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'brake-1',
        'brake',
        {
          padThickness: 8,
          temperature: 150,
          usage: 5000,
        }
      )

      const predictions = maintenanceService.getAllPredictions()
      expect(predictions.length).toBe(2)
      expect(predictions.map(p => p.componentType)).toContain('battery')
      expect(predictions.map(p => p.componentType)).toContain('brake')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing maintenance rules gracefully', async () => {
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'unknown-1',
        'unknown-component',
        {
          someMetric: 100,
        }
      )

      const prediction = await maintenanceService.getPrediction('vehicle-1', 'unknown-1')
      expect(prediction).toBeNull()
    })

    it('should handle invalid measurements gracefully', async () => {
      await maintenanceService.addTelemetryData(
        'vehicle-1',
        'battery-1',
        'battery',
        {
          temperature: NaN,
          voltage: Infinity,
          cycleCount: -1,
        }
      )

      const prediction = await maintenanceService.getPrediction('vehicle-1', 'battery-1')
      expect(prediction?.confidenceScore).toBeLessThan(0.5) // Low confidence due to invalid data
    })
  })
}) 