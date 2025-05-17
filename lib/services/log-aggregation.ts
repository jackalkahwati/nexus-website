import winston, { format } from 'winston'
import { CloudWatchTransport } from '../logging/cloudwatch-transport'
import { Logger, LogLevel, WinstonLoggerInstance } from 'types/logging'

export class LogAggregator implements Logger {
  private static instance: LogAggregator | undefined
  private winstonLogger: WinstonLoggerInstance
  private context: Record<string, any> = {}
  private closed: boolean = false
  private writeQueue: Array<() => void> = []
  private processingQueue: boolean = false

  constructor() {
    const env = process.env.NODE_ENV || 'development'
    const appName = process.env.APP_NAME || 'nexus'

    // Create Winston logger with multiple transports
    this.winstonLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.metadata(),
        format.json()
      ),
      defaultMeta: {
        service: appName,
        environment: env
      },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, metadata }) => {
              const meta = metadata && Object.keys(metadata).length ? 
                `\n${JSON.stringify(metadata, null, 2)}` : ''
              return `${timestamp} [${level}]: ${message}${meta}`
            })
          )
        }),

        // File transport for persistent local logs
        new winston.transports.File({
          filename: `logs/${env}-error.log`,
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          tailable: true
        }),
        new winston.transports.File({
          filename: `logs/${env}-combined.log`,
          maxsize: 5242880,
          maxFiles: 5,
          tailable: true
        }),

        // CloudWatch transport for production
        ...(env === 'production' ? [
          new CloudWatchTransport({
            logGroupName: `/nexus/${env}`,
            logStreamName: `${appName}-${new Date().toISOString().split('T')[0]}`,
            region: process.env.AWS_REGION
          })
        ] : [])
      ]
    })
  }

  public static getInstance(): LogAggregator {
    if (!LogAggregator.instance) {
      LogAggregator.instance = new LogAggregator()
    }
    return LogAggregator.instance
  }

  public static resetInstance(): void {
    LogAggregator.instance = undefined
  }

  /**
   * Set global context that will be included with all log entries
   */
  public setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * Clear global context
   */
  public clearContext(): void {
    this.context = {}
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.closed) return
    this.processingQueue = true

    while (this.writeQueue.length > 0) {
      const task = this.writeQueue.shift()
      if (task) {
        try {
          task()
        } catch (error) {
          // Ignore errors from closed logger
          if (!this.closed) {
            console.error('Error processing log:', error)
          }
        }
      }
      // Allow other operations to interleave
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    this.processingQueue = false
  }

  private enqueueLog(logFn: () => void): void {
    this.writeQueue.push(logFn)
    void this.processQueue()
  }

  /**
   * Log a message with optional metadata
   */
  public log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    if (this.closed) return // Silently ignore logs after close

    this.enqueueLog(() => {
      try {
        const cleanMetadata = metadata ? JSON.parse(JSON.stringify(metadata)) : {}
        this.winstonLogger.log({
          level,
          message,
          ...this.context,
          ...cleanMetadata
        })
      } catch (error) {
        // Handle circular references or other JSON stringification errors
        this.winstonLogger.log({
          level,
          message,
          ...this.context,
          metadata: '[Circular or Invalid Metadata]'
        })
      }
    })
  }

  /**
   * Log an error with stack trace
   */
  public error(error: Error | string, metadata?: Record<string, any>): void {
    if (this.closed) return

    const errorMessage = error instanceof Error ? error.message : error
    const errorStack = error instanceof Error ? error.stack : undefined

    this.enqueueLog(() => {
      try {
        const cleanMetadata = metadata ? JSON.parse(JSON.stringify(metadata)) : {}
        this.winstonLogger.error(errorMessage, {
          stack: errorStack,
          ...this.context,
          ...cleanMetadata
        })
      } catch (error) {
        this.winstonLogger.error(errorMessage, {
          stack: errorStack,
          ...this.context,
          metadata: '[Circular or Invalid Metadata]'
        })
      }
    })
  }

  /**
   * Log an informational message
   */
  public info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, metadata)
  }

  /**
   * Log a warning message
   */
  public warn(message: string, metadata?: Record<string, any>): void {
    this.log('warn', message, metadata)
  }

  /**
   * Log a debug message
   */
  public debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', message, metadata)
  }

  /**
   * Create a child logger with additional context
   */
  public child(context: Record<string, any>): LogAggregator {
    const child = new LogAggregator()
    child.setContext({ ...this.context, ...context })
    return child
  }

  /**
   * Create a request-scoped logger
   */
  public forRequest(requestId: string, method: string, url: string): LogAggregator {
    return this.child({
      requestId,
      method,
      url,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Gracefully shut down the logger
   */
  public async close(): Promise<void> {
    if (this.closed) return

    this.closed = true

    // Wait for queued logs to finish
    while (this.writeQueue.length > 0 || this.processingQueue) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    await new Promise<void>((resolve) => {
      this.winstonLogger.on('finish', resolve)
      this.winstonLogger.end()
    })
  }

  /**
   * Check if logger is closed
   */
  public isClosed(): boolean {
    return this.closed
  }
}

// Create singleton instance
export const logAggregator = LogAggregator.getInstance()
