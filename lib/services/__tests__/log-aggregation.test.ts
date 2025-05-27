import { jest } from '@jest/globals'
import { LogAggregator } from '../log-aggregation'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

jest.mock('../../logger', () => ({
  __esModule: true,
  default: mockLogger,
}))

describe('LogAggregator', () => {
  let logAggregator: LogAggregator

  beforeEach(() => {
    jest.clearAllMocks()
    logAggregator = new LogAggregator({
      flushInterval: 100,
      maxQueueSize: 5,
    })
  })

  afterEach(async () => {
    await logAggregator.close()
  })

  describe('Log Aggregation', () => {
    it('should aggregate logs and flush periodically', async () => {
      const message = 'Test message'
      const metadata = { test: true }

      logAggregator.info(message, metadata)
      
      // Wait for flush interval
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockLogger.info).toHaveBeenCalledWith(message, expect.objectContaining(metadata))
    })

    it('should flush when queue size exceeds limit', async () => {
      // Add more logs than maxQueueSize
      for (let i = 0; i < 6; i++) {
        logAggregator.info(`Message ${i}`)
      }

      // Wait for flush
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(mockLogger.info).toHaveBeenCalled()
      expect(mockLogger.info.mock.calls.length).toBeGreaterThan(0)
    })

    it('should handle different log levels', async () => {
      logAggregator.info('Info message')
      logAggregator.error('Error message')
      logAggregator.warn('Warning message')
      logAggregator.debug('Debug message')

      // Wait for flush
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockLogger.info).toHaveBeenCalledWith('Info message', expect.any(Object))
      expect(mockLogger.error).toHaveBeenCalledWith('Error message', expect.any(Object))
      expect(mockLogger.warn).toHaveBeenCalledWith('Warning message', expect.any(Object))
      expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', expect.any(Object))
    })

    it('should handle context properly', async () => {
      const context = { service: 'test-service' }
      logAggregator.setContext(context)

      logAggregator.info('Test message')

      // Wait for flush
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining(context)
      )
    })
  })

  describe('Child Loggers', () => {
    it('should create child loggers with inherited context', async () => {
      const parentContext = { service: 'parent' }
      const childContext = { component: 'child' }

      logAggregator.setContext(parentContext)
      const childLogger = logAggregator.child(childContext)

      childLogger.info('Child message')

      // Wait for flush
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Child message',
        expect.objectContaining({
          ...parentContext,
          ...childContext,
        })
      )
    })
  })

  describe('Cleanup', () => {
    it('should flush remaining logs on close', async () => {
      logAggregator.info('Final message')
      
      await logAggregator.close()

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Final message',
        expect.any(Object)
      )
    }, 1000) // Increase timeout for cleanup
  })
})
