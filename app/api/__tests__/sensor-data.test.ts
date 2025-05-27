import { NextRequest } from 'next/server'
import { POST, GET } from '../fleet/vehicles/[id]/sensor-data/route'
import logger from '@/lib/logger'

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

describe('Sensor Data API', () => {
  const mockVehicleId = 'test-vehicle-1'
  const mockTimestamp = new Date().toISOString()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/fleet/vehicles/[id]/sensor-data', () => {
    it('should accept valid sensor data', async () => {
      const mockSensorData = {
        timestamp: mockTimestamp,
        sensorType: 'lidar',
        data: {
          points: [
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
          ],
          resolution: '1cm',
          scanDuration: '100ms',
        },
      }

      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data', {
        method: 'POST',
        body: JSON.stringify(mockSensorData),
      })

      const response = await POST(request, { params: { id: mockVehicleId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.timestamp).toBeDefined()
      expect(logger.info).toHaveBeenCalledWith(
        'Sensor data received',
        expect.objectContaining({
          vehicleId: mockVehicleId,
          sensorType: 'lidar',
        })
      )
    })

    it('should reject invalid sensor data format', async () => {
      const mockInvalidData = {
        timestamp: 'invalid-date',
        sensorType: 'invalid-sensor',
        data: null,
      }

      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data', {
        method: 'POST',
        body: JSON.stringify(mockInvalidData),
      })

      const response = await POST(request, { params: { id: mockVehicleId } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid sensor data format')
      expect(data.details).toBeDefined()
    })

    it('should handle rate limiting', async () => {
      const mockSensorData = {
        timestamp: mockTimestamp,
        sensorType: 'camera',
        data: { resolution: '1080p', format: 'jpeg' },
      }

      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data', {
        method: 'POST',
        body: JSON.stringify(mockSensorData),
      })

      // Send requests until rate limit is exceeded
      const responses = await Promise.all(
        Array.from({ length: 101 }, () => 
          POST(request, { params: { id: mockVehicleId } })
        )
      )

      const lastResponse = responses[responses.length - 1]
      const data = await lastResponse.json()

      expect(lastResponse.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded')
    })

    it('should handle server errors gracefully', async () => {
      // Mock logger.info to throw an error
      (logger.info as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Simulated error')
      })

      const mockSensorData = {
        timestamp: mockTimestamp,
        sensorType: 'radar',
        data: { range: 100, angle: 45 },
      }

      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data', {
        method: 'POST',
        body: JSON.stringify(mockSensorData),
      })

      const response = await POST(request, { params: { id: mockVehicleId } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
      expect(logger.error).toHaveBeenCalledWith(
        'Error processing sensor data',
        expect.objectContaining({
          error: expect.any(Error),
          vehicleId: mockVehicleId,
        })
      )
    })
  })

  describe('GET /api/fleet/vehicles/[id]/sensor-data', () => {
    it('should return health check information', async () => {
      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data')
      const response = await GET(request, { params: { id: mockVehicleId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        status: 'healthy',
        vehicleId: mockVehicleId,
        timestamp: expect.any(String),
        rateLimit: {
          limit: expect.any(Number),
          remaining: expect.any(Number),
          reset: expect.any(String),
        },
      })
    })

    it('should handle server errors in health check', async () => {
      // Mock logger to throw an error
      (logger.error as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Simulated error')
      })

      const request = new NextRequest('http://localhost/api/fleet/vehicles/test-vehicle-1/sensor-data')
      const response = await GET(request, { params: { id: mockVehicleId } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
}) 