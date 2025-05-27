const { EventEmitter } = require('events')

class MockStream extends EventEmitter {
  constructor() {
    super()
    this.writable = true
    this.writableEnded = false
    this.writableFinished = false
    this.destroyed = false
  }

  on = jest.fn().mockImplementation((event, callback) => {
    super.on(event, callback)
    return this
  })

  write = jest.fn().mockImplementation((chunk) => {
    if (!this.writable || this.destroyed) return false
    this.emit('data', chunk)
    return true
  })

  end = jest.fn().mockImplementation(() => {
    if (!this.writable || this.destroyed) return
    this.writableEnded = true
    this.writableFinished = true
    this.emit('finish')
    this.emit('end')
    return this
  })

  destroy = jest.fn().mockImplementation(() => {
    if (this.destroyed) return
    this.destroyed = true
    this.writable = false
    this.writableEnded = true
    this.writableFinished = true
    this.emit('close')
    return this
  })

  cork = jest.fn()
  uncork = jest.fn()
  setDefaultEncoding = jest.fn()
  _write = jest.fn()
  _writev = jest.fn()
  _destroy = jest.fn()
  _final = jest.fn()
}

class MockTransport extends EventEmitter {
  constructor(opts = {}) {
    super()
    this.name = opts.name || 'mock'
    this.level = opts.level || 'info'
    this.handleExceptions = opts.handleExceptions || false
    this.silent = opts.silent || false
    this.options = opts
    this._stream = new MockStream()
    this._stream.on('error', (err) => this.emit('error', err))
  }
  
  log = jest.fn().mockImplementation((info, callback) => {
    if (this.silent) {
      callback()
      return
    }
    setImmediate(() => {
      this.emit('logged', info)
      callback()
    })
  })

  close = jest.fn().mockImplementation(() => {
    this._stream.end()
  })

  options
  _stream
}

const format = {
  combine: jest.fn().mockImplementation((...args) => ({
    transform: jest.fn().mockReturnValue(args[0])
  })),
  timestamp: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue({ timestamp: new Date().toISOString() })
  })),
  errors: jest.fn().mockImplementation(({ stack }) => ({
    transform: jest.fn().mockReturnValue({ stack })
  })),
  metadata: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue({})
  })),
  json: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue({})
  })),
  printf: jest.fn().mockImplementation((fn) => ({
    transform: jest.fn().mockReturnValue(fn({ message: 'test', level: 'info' }))
  })),
  colorize: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue({})
  })),
  simple: jest.fn().mockImplementation(() => ({
    transform: jest.fn().mockReturnValue('test message')
  }))
}

const transports = {
  File: MockTransport,
  Console: MockTransport
}

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  on: jest.fn(),
  end: jest.fn()
}

const createLogger = jest.fn().mockReturnValue(mockLogger)

module.exports = {
  format,
  transports,
  createLogger,
  MockTransport,
  MockStream
} 