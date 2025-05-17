import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';
import nodeFetch, { Request as NodeRequest, Response as NodeResponse, Headers as NodeHeaders } from 'node-fetch';

// Explicitly mock the canvas module very early
jest.mock('canvas');

// Extend the global Window interface
declare global {
  interface Window {
    __selectCallback?: (value: string) => void;
    matchMedia: (query: string) => MediaQueryList;
  }
}

// Extend the global NodeJS namespace
declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder;
      TextDecoder: typeof TextDecoder;
      fetch: typeof nodeFetch;
      Request: typeof NodeRequest;
      Response: typeof NodeResponse;
      Headers: typeof NodeHeaders;
      requestAnimationFrame: (callback: FrameRequestCallback) => number;
      ResizeObserver: typeof ResizeObserver;
      matchMedia: (query: string) => MediaQueryList;
      setImmediate: typeof setImmediate;
    }
  }
}

// Setup TextEncoder/TextDecoder globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Setup fetch globals
global.fetch = nodeFetch;
global.Request = NodeRequest;
global.Response = NodeResponse;
global.Headers = NodeHeaders;

// Setup requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0);
};

// Setup ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    // Implementation not needed for tests
  }
  observe(target: Element): void {}
  unobserve(target: Element): void {}
  disconnect(): void {}
};

// Setup window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup setImmediate
global.setImmediate = (callback: () => void): NodeJS.Immediate => {
  return setTimeout(callback, 0) as unknown as NodeJS.Immediate;
};

// Helper for flushing promises and timers
export const flushPromisesAndTimers = async (): Promise<void> => {
  jest.advanceTimersByTime(1000);
  await Promise.resolve();
  await Promise.resolve(); // Double flush for nested microtasks
};

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledAfter: (mock: jest.Mock) => R;
    }
  }
}

expect.extend({
  toHaveBeenCalledAfter(received: jest.Mock, expected: jest.Mock) {
    const receivedCalls = received.mock.invocationCallOrder;
    const expectedCalls = expected.mock.invocationCallOrder;

    if (receivedCalls.length === 0) {
      return {
        message: () => `expected mock to have been called after ${expected.getMockName()}`,
        pass: false,
      };
    }

    if (expectedCalls.length === 0) {
      return {
        message: () => `${expected.getMockName()} was never called`,
        pass: false,
      };
    }

    const pass = Math.min(...receivedCalls) > Math.max(...expectedCalls);

    return {
      message: () =>
        pass
          ? `expected mock not to have been called after ${expected.getMockName()}`
          : `expected mock to have been called after ${expected.getMockName()}`,
      pass,
    };
  },
});

// Configure Jest hooks
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});
