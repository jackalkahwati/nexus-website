import { createRotatingLogger } from './utils/log-rotation/examples/logger-integration'
import path from 'path'
import { LogStats } from './utils/log-rotation/types'

// Create rotating logger instance
const logger = createRotatingLogger({
  logDir: path.join(process.cwd(), 'logs'),
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
})

// Export logger instance as default
export default logger

// Export createRotatingLogger for testing
export { createRotatingLogger }

// Export monitoring utilities with proper typing
export const logMonitor = {
  /**
   * Get current log file statistics
   */
  getStats: async (): Promise<LogStats> => {
    return logger.monitor.getStats()
  },

  /**
   * Force a log rotation check
   */
  checkRotation: async (): Promise<void> => {
    return logger.monitor.checkRotation()
  },

  /**
   * Stop scheduled rotation
   */
  stopRotation: (): void => {
    logger.monitor.stopRotation()
  }
}

// Export logger types for convenience
export type { LogStats }

// Handle cleanup on process exit
process.on('beforeExit', () => {
  logMonitor.stopRotation()
})

// Example usage:
/*
import logger, { logMonitor } from './logger'

// Logging
logger.info('Application started')
logger.error('An error occurred', { error: new Error('Test error') })

// Monitoring
const stats = await logMonitor.getStats()
console.log(`Total log size: ${stats.totalSize} bytes`)

// Manual rotation if needed
await logMonitor.checkRotation()
*/
