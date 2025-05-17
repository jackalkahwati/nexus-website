// Reset all mocks between tests
beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

// Clean up any timers
afterEach(() => {
  jest.useRealTimers()
})

// Clean up any pending timeouts or intervals
afterEach(() => {
  jest.runOnlyPendingTimers()
})

// Reset any document modifications
afterEach(() => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = ''
    
    // Clean up any added event listeners
    const listeners: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = []

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    addEventListenerSpy.mockImplementation((type, listener, options) => {
      listeners.push({ type: type.toString(), listener })
    })

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    removeEventListenerSpy.mockImplementation((type, listener, options) => {
      const index = listeners.findIndex(
        l => l.type === type.toString() && l.listener === listener
      )
      if (index > -1) {
        listeners.splice(index, 1)
      }
    })

    // Remove all listeners after each test
    listeners.forEach(({ type, listener }) => {
      window.removeEventListener(type, listener)
    })

    // Restore original implementations
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  }
})

// Reset any modifications to the window object
afterEach(() => {
  if (typeof window !== 'undefined') {
    // Reset any window properties that might have been modified
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

    // Reset animation frame functions
    window.requestAnimationFrame = jest.fn().mockImplementation(() => 0)
    window.cancelAnimationFrame = jest.fn()

    // Reset any other window properties that might have been modified
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null
      readonly rootMargin: string = '0px'
      readonly thresholds: ReadonlyArray<number> = [0]
      
      observe = jest.fn()
      unobserve = jest.fn()
      disconnect = jest.fn()
      takeRecords = jest.fn().mockReturnValue([])

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        // Constructor implementation not needed for mock
      }
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver
    })

    class MockResizeObserver implements ResizeObserver {
      observe = jest.fn()
      unobserve = jest.fn()
      disconnect = jest.fn()

      constructor(callback: ResizeObserverCallback) {
        // Constructor implementation not needed for mock
      }
    }

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: MockResizeObserver
    })
  }
})

// Clean up MSW handlers
afterEach(() => {
  if (typeof window !== 'undefined') {
    const { server } = require('../mocks/server')
    server.resetHandlers()
  }
})
