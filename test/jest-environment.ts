import JSDOMEnvironment from 'jest-environment-jsdom'
import { jest } from '@jest/globals'

class CustomTestEnvironment extends JSDOMEnvironment {
  constructor(config: any, context: any) {
    super(config, context)
    this.global.jest = jest
    this.global.TextEncoder = TextEncoder
    this.global.TextDecoder = TextDecoder as any
    this.global.requestAnimationFrame = (callback) => {
      return setTimeout(callback, 0)
    }
    this.global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(this.global, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  }
}

export default CustomTestEnvironment 