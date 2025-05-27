import { createLogger, format, transports } from 'winston'
import { v4 as uuidv4 } from 'uuid'

interface LogContext {
  traceId?: string
  userId?: string
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  traceId: string
  userId?: string
  [key: string]: any
}

export class Logger {
  private logger: any
  private prefix: string
  private context?: LogContext

  constructor(prefix: string, context?: LogContext) {
    this.prefix = prefix
    this.context = context

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
        }),
      ],
    })
  }

  private createLogEntry(level: string, message: string, meta?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.prefix}] ${message}`,
      traceId: this.context?.traceId || uuidv4(),
      userId: this.context?.userId,
      ...meta,
    }
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

  setContext(context: LogContext) {
    this.context = {
      ...this.context,
      ...context,
    }
  }

  getContext(): LogContext | undefined {
    return this.context
  }

  child(prefix: string, context?: LogContext): Logger {
    return new Logger(`${this.prefix}:${prefix}`, {
      ...this.context,
      ...context,
    })
  }
}

// Create and export a default logger instance
export const logger = new Logger('App') 