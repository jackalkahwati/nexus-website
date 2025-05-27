import { createLogger, format, transports } from 'winston'
import { CloudWatchTransport } from '../logging/cloudwatch-transport'
import { createHash } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { SOC2Context, SOC2LogEntry, SOC2LogLevel } from '../../types/soc2'

// Sensitive data patterns to mask
const SENSITIVE_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
  /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
  /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/, // SSN
  /password["']?\s*[:=]\s*["']?[^"'\s]+["']?/i, // Passwords
  /token["']?\s*[:=]\s*["']?[^"'\s]+["']?/i, // API tokens
  /key["']?\s*[:=]\s*["']?[^"'\s]+["']?/i, // API keys
]

export class SOC2Logger {
  private logger: any
  private context?: SOC2Context
  private logGroupName: string
  private logStreamName: string

  constructor(serviceName: string, context?: SOC2Context) {
    this.context = context
    this.logGroupName = `soc2-logs-${process.env.NODE_ENV}`
    this.logStreamName = `${serviceName}-${new Date().toISOString().split('T')[0]}`

    // Create Winston logger with CloudWatch transport
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        // Console transport for development
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
        }),
        // CloudWatch transport for secure storage
        new CloudWatchTransport({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          createLogGroup: true,
          createLogStream: true,
        })
      ],
    })
  }

  private maskSensitiveData(data: any): any {
    if (typeof data === 'string') {
      let maskedData = data
      SENSITIVE_PATTERNS.forEach(pattern => {
        maskedData = maskedData.replace(pattern, '[REDACTED]')
      })
      return maskedData
    } else if (typeof data === 'object' && data !== null) {
      const maskedObj: any = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip masking for specific fields
        if (['userId', 'sessionId', 'traceId'].includes(key)) {
          maskedObj[key] = value
        } else {
          maskedObj[key] = this.maskSensitiveData(value)
        }
      }
      return maskedObj
    }
    return data
  }

  private createLogHash(entry: Omit<SOC2LogEntry, 'hash'>): string {
    const stringToHash = JSON.stringify({
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      context: this.context,
    })
    return createHash('sha256').update(stringToHash).digest('hex')
  }

  private createLogEntry(level: SOC2LogLevel, message: string, meta?: Record<string, any>): SOC2LogEntry {
    const timestamp = new Date().toISOString()
    const requestId = this.context?.requestId || uuidv4()

    const baseEntry: SOC2LogEntry = {
      timestamp,
      level,
      message,
      requestId,
      environment: process.env.NODE_ENV || 'development',
      hash: '', // Will be set after creating hash
      ipAddress: this.context?.ipAddress || null,
      userAgent: this.context?.userAgent || null,
      ...this.context,
      ...meta,
    }

    // Create hash before masking sensitive data
    baseEntry.hash = this.createLogHash(baseEntry)

    // Mask sensitive data
    return this.maskSensitiveData(baseEntry) as SOC2LogEntry
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(this.createLogEntry('info', message, meta))
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(this.createLogEntry('error', message, meta))
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(this.createLogEntry('warn', message, meta))
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(this.createLogEntry('debug', message, meta))
  }

  audit(action: string, status: 'success' | 'failure', details: {
    userId?: string
    resourceId?: string
    resourceType?: string
    reason?: string
    [key: string]: any
  }) {
    const meta = {
      action,
      status,
      ...details,
      timestamp: new Date().toISOString(),
    }

    this.info(`Audit: ${action}`, meta)
  }

  setContext(context: SOC2Context) {
    this.context = {
      ...this.context,
      ...context,
    }
  }

  getContext(): SOC2Context | undefined {
    return this.context
  }

  child(serviceName: string, context?: SOC2Context): SOC2Logger {
    return new SOC2Logger(serviceName, {
      ...this.context,
      ...context,
    })
  }
}

// Create and export a default logger instance
export const soc2Logger = new SOC2Logger('App')

// Export a function to create new logger instances
export const createSOC2Logger = (serviceName: string, context?: SOC2Context) => {
  return new SOC2Logger(serviceName, context)
}
