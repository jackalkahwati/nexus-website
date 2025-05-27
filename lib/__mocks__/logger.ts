import { EventEmitter } from 'events'

class MockLogger extends EventEmitter {
  info = jest.fn()
  error = jest.fn()
  warn = jest.fn()
  debug = jest.fn()
  end = jest.fn(() => {
    this.emit('finish')
    return this
  })
}

const mockLogger = new MockLogger()

export default mockLogger
