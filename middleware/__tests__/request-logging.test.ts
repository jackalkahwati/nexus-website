import { jest } from '@jest/globals'
import { RequestLogger } from '../request-logging'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Logger } from 'lib/utils/logger'
import { waitFor } from '@testing-library/react'
import { flushPromisesAndTimers } from '../../test/setup'

interface LogMetadata {
  method: string
  url: string
  requestId?: string
  userAgent?: string
  statusCode?: number
  duration?: number
  error?: string
}

interface MockRequest extends Partial<NextApiRequest> {
  method: string
  url: string
  headers: Record<string, string>
}

interface MockResponse extends Partial<NextApiResponse> {
  statusCode: number
  getHeader: jest.Mock<string | undefined, [string]>
  on: jest.Mock<MockResponse, [string, ResponseCallback]>
  emit: jest.Mock<boolean, [string, ...any[]]>
  finished: boolean
  writableEnded: boolean
}

type ResponseCallback = (error?: Error) => void
type NextFunction = (error?: Error) => void

describe('Request Logging Middleware', () => {
  let mockReq: MockRequest
  let mockRes: MockResponse
  let mockNext: jest.Mock<void, [error?: Error]>
  let mockLogger: jest.Mocked<Logger>
  let requestLogger: RequestLogger
  let startTime: number
  
  beforeEach(() => {
    jest.clearAllMocks()
    startTime = Date.now()
    
    mockReq = {
      method: 'GET',
      url: '/api/test',
      headers: {
        'x-request-id': 'test-id',
        'user-agent': 'test-agent'
      }
    }
    
    mockRes = {
      statusCode: 200,
      finished: false,
      writableEnded: false,
      getHeader: jest.fn<string | undefined, [string]>().mockReturnValue(undefined),
      on: jest.fn<MockResponse, [string, ResponseCallback]>().mockImplementation((event: string, listener: ResponseCallback) => {
        if (event === 'finish') {
          Promise.resolve().then(() => {
            mockRes.finished = true
            mockRes.writableEnded = true
            listener()
          })
        } else if (event === 'error') {
          // Store error listener for later use
          mockRes.emit.mockImplementationOnce((eventName: string, error: Error) => {
            if (eventName === 'error' && listener) {
              listener(error)
            }
            return true
          })
        }
        return mockRes
      }),
      emit: jest.fn<boolean, [string, ...any[]]>().mockReturnValue(true)
    }
    
    mockNext = jest.fn<void, [error?: Error]>()
    
    mockLogger = {
      info: jest.fn<Promise<void>, [string, LogMetadata]>().mockResolvedValue(undefined),
      error: jest.fn<Promise<void>, [string, LogMetadata]>().mockResolvedValue(undefined),
      debug: jest.fn<Promise<void>, [string, LogMetadata]>().mockResolvedValue(undefined),
      warn: jest.fn<Promise<void>, [string, LogMetadata]>().mockResolvedValue(undefined)
    }

    requestLogger = new RequestLogger(mockLogger)
  })

  describe('Request Handling', () => {
    it('should log request details', async () => {
      await requestLogger.handle(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext)
      
      await waitFor(() => {
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining('GET /api/test'),
          expect.objectContaining<LogMetadata>({
            method: 'GET',
            url: '/api/test',
            requestId: 'test-id',
            userAgent: 'test-agent'
          })
        )
      })
      
      expect(mockNext).toHaveBeenCalled()
    })

    it('should handle missing request headers', async () => {
      mockReq.headers = {}
      
      await requestLogger.handle(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext)
      
      await waitFor(() => {
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining('GET /api/test'),
          expect.objectContaining<LogMetadata>({
            method: 'GET',
            url: '/api/test',
            requestId: expect.any(String),
            userAgent: 'unknown'
          })
        )
      })
    })
  })

  describe('Response Handling', () => {
    it('should log response completion', async () => {
      await requestLogger.handle(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext)
      
      // Get and call the finish listener
      const finishListeners = mockRes.on.mock.calls
        .filter(([event]) => event === 'finish') as [string, ResponseCallback][]
      
      expect(finishListeners).toHaveLength(1)
      const [, finishCallback] = finishListeners[0]
      
      await finishCallback()
      await flushPromisesAndTimers()
      
      await waitFor(() => {
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining('Request completed'),
          expect.objectContaining<LogMetadata>({
            statusCode: 200,
            duration: expect.any(Number)
          })
        )
      })
    })

    it('should handle response errors', async () => {
      const error = new Error('Test error')
      mockRes.statusCode = 500
      
      await requestLogger.handle(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext)
      
      // Get and call the error listener
      const errorListeners = mockRes.on.mock.calls
        .filter(([event]) => event === 'error') as [string, ResponseCallback][]
      
      expect(errorListeners).toHaveLength(1)
      const [, errorCallback] = errorListeners[0]
      
      await errorCallback(error)
      await flushPromisesAndTimers()
      
      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Request error'),
          expect.objectContaining<LogMetadata>({
            error: error.message,
            statusCode: 500
          })
        )
      })
    })
  })
})
