import React from 'react'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Extend the global namespace for React
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      React: typeof React
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledAfter: (mock: jest.Mock) => R
    }
  }
}

// Add React to global scope
global.React = React

// Configure cleanup
if (typeof window !== 'undefined') {
  afterEach(() => {
    cleanup()
  })
}

// Configure Jest hooks
beforeEach(() => {
  jest.clearAllMocks()
  jest.clearAllTimers()
})

afterEach(() => {
  jest.clearAllTimers()
}) 