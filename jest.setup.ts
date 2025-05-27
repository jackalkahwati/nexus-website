import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { EventEmitter } from 'events'
import { LogLevel } from './types/logging'

// Define custom Immediate type for our test environment
interface CustomImmediate {
  _onImmediate: Function;
  hasRef(): boolean;
  ref(): this;
  unref(): this;
}

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock fetch
const mockFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({}),
  text: async () => '',
  headers: new Headers()
})
global.fetch = jest.fn(mockFetch) as jest.Mock

// Mock Winston with proper event emitter functionality
class MockWinstonLogger extends EventEmitter {
  private closed = false;
  [key: string]: any; // Add index signature for dynamic property access

  log = jest.fn((info: { level: LogLevel; message: string; [key: string]: any }) => {
    if (!this.closed) {
      const { level, message, ...meta } = info;
      const logMethod = this[level] as ((message: string, meta: any) => void) | undefined;
      if (logMethod) {
        logMethod(message, meta);
      }
    }
  });

  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
  
  end = jest.fn(() => {
    this.closed = true;
    this.emit('finish');
    return Promise.resolve();
  });

  close = jest.fn(() => {
    this.closed = true;
    this.emit('finish');
    return Promise.resolve();
  });
}

jest.mock('winston', () => ({
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    errors: jest.fn(),
    metadata: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn()
  },
  createLogger: jest.fn(() => new MockWinstonLogger()),
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  }
}))

// Mock fs/promises
const mockFs = {
  writeFile: jest.fn(),
  readFile: jest.fn(),
  unlink: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn()
}

jest.mock('fs/promises', () => mockFs)

// Setup default mock implementations
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks()
  
  // Setup fs mock implementations
  mockFs.writeFile.mockResolvedValue(undefined)
  mockFs.readFile.mockResolvedValue(Buffer.from(''))
  mockFs.unlink.mockResolvedValue(undefined)
  mockFs.readdir.mockResolvedValue([])
  mockFs.stat.mockResolvedValue({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mtime: new Date(),
    atime: new Date(),
    ctime: new Date(),
    birthtime: new Date()
  })

  // Increase Jest timeout for all tests
  jest.setTimeout(30000)
})

// Handle act() warnings
const originalError = console.error
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && /Warning.*not wrapped in act/.test(args[0])) {
    return
  }
  originalError.call(console, ...args)
}

// Setup browser environment mocks
const setupBrowserMocks = () => {
  // Create setImmediate implementation
  const createImmediate = (callback: Function): CustomImmediate => ({
    _onImmediate: callback,
    hasRef: () => true,
    ref: function() { return this; },
    unref: function() { return this; }
  });

  // Assign setImmediate implementation
  (global as any).setImmediate = function setImmediate(callback: Function, ...args: any[]) {
    const timeoutId = setTimeout(() => callback(...args), 0);
    return createImmediate(callback);
  };

  // Assign clearImmediate implementation
  (global as any).clearImmediate = function clearImmediate(immediate: CustomImmediate) {
    if (immediate && immediate._onImmediate) {
      // Clear any pending timeout
      for (const timer of (setTimeout as any)._timers || []) {
        if (timer._onTimeout === immediate._onImmediate) {
          clearTimeout(timer);
          break;
        }
      }
    }
  };

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
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

  // Mock requestAnimationFrame and cancelAnimationFrame
  const rAF = (callback: FrameRequestCallback): number => {
    return setTimeout(() => callback(Date.now()), 0) as unknown as number
  }
  const cAF = (handle: number): void => {
    clearTimeout(handle)
  }

  global.requestAnimationFrame = jest.fn(rAF)
  global.cancelAnimationFrame = jest.fn(cAF)

  // Mock IntersectionObserver
  class MockIntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]
    
    constructor(private callback: IntersectionObserverCallback) {}
    
    observe = jest.fn()
    unobserve = jest.fn()
    disconnect = jest.fn()
    takeRecords = jest.fn().mockReturnValue([])
  }

  global.IntersectionObserver = MockIntersectionObserver as any

  // Mock ResizeObserver
  class MockResizeObserver {
    constructor(private callback: ResizeObserverCallback) {}
    
    observe = jest.fn()
    unobserve = jest.fn()
    disconnect = jest.fn()
  }

  global.ResizeObserver = MockResizeObserver as any

  // Add hasPointerCapture mock to HTMLElement prototype
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: jest.fn().mockReturnValue(false)
  })

  // Add setPointerCapture mock to HTMLElement prototype
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: jest.fn()
  })

  // Add releasePointerCapture mock to HTMLElement prototype
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: jest.fn()
  })

  // Enhance ARIA role handling
  const originalGetAttribute = HTMLElement.prototype.getAttribute
  HTMLElement.prototype.getAttribute = function(name: string) {
    if (name === 'role') {
      // Ensure role attribute is properly handled
      const role = originalGetAttribute.call(this, name)
      return role || this.getAttribute('data-role') || null
    }
    return originalGetAttribute.call(this, name)
  }
}

// Setup browser mocks
setupBrowserMocks()

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks()
  
  // Clear any fake timers
  jest.useRealTimers()
  
  // Clear document body
  document.body.innerHTML = ''

  // Restore real timers
  jest.useRealTimers()

  // Clear any pending timers
  jest.runOnlyPendingTimers()
})

// Mock toast
jest.mock('components/ui/use-toast', () => ({
  toast: jest.fn()
}))
