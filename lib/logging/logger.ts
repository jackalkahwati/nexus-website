type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private static instance: Logger
  
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaString = meta ? ` ${JSON.stringify(meta)}` : ''
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaString}`
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage('info', message, meta))
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('warn', message, meta))
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage('error', message, meta))
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta))
    }
  }
}

export const logger = Logger.getInstance()
