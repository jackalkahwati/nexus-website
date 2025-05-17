import winston from 'winston'
import { LogRotator } from '../index'
import path from 'path'

interface LoggerConfig {
  logDir: string
  maxSize?: number
  maxFiles?: number
  level?: string
  compress?: boolean
}

interface LogMonitor {
  stopRotation: () => void
  checkRotation: () => Promise<void>
  cleanup: () => void
}

// Extend the Winston Logger type with our custom methods
type RotatingLogger = winston.Logger & {
  monitor: LogMonitor
  close: () => Promise<void>
}

/**
 * Create a Winston logger with log rotation
 */
export function createRotatingLogger(config: LoggerConfig): RotatingLogger {
  const {
    logDir,
    maxSize = 5 * 1024 * 1024, // 5MB default
    maxFiles = 5,
    level = 'info',
    compress = true
  } = config

  // Create log directory if it doesn't exist
  const logPath = path.join(logDir, 'app.log')

  // Create log rotator
  const rotator = new LogRotator({
    maxSize,
    maxFiles,
    compress,
    logDir,
    filePattern: /^.*\.log$/
  })

  // Create Winston logger
  const logger = winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: logPath,
        maxsize: maxSize
      })
    ]
  })

  // Schedule log rotation checks
  rotator.scheduleRotation(60000) // Check every minute

  // Add close method to cleanup resources
  const close = async () => {
    rotator.cleanup()
    return new Promise<void>((resolve) => {
      // Use Winston's built-in finish event
      logger.on('finish', resolve)
      logger.end()
    })
  }

  // Create monitor object with rotation methods
  const monitor: LogMonitor = {
    stopRotation: () => rotator.stopRotation(),
    checkRotation: () => rotator.checkAndRotate(),
    cleanup: () => rotator.cleanup()
  }

  // Add monitor and close method to logger
  const rotatingLogger = Object.assign(logger, { monitor, close }) as RotatingLogger
  
  // Ensure file transport is properly initialized
  rotatingLogger.info('Logger initialized')

  return rotatingLogger
}
