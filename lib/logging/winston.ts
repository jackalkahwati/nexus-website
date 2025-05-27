import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

// Custom format for browser environment
const browserFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} ${level}: ${message}`
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`
  }
  return msg
})

// Create browser-compatible logger
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    browserFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        timestamp(),
        browserFormat
      )
    })
  ]
})

// Export configured logger
export { logger }
