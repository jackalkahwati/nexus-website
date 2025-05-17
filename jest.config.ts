import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig: Config = {
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/test/setup.ts',
    '<rootDir>/jest-setup-react.ts'
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^app/login/page$': '<rootDir>/test/mocks/login-page.tsx',
    '^components/ui/(.*)$': '<rootDir>/test/mocks/ui.tsx',
    '^lib/auth$': '<rootDir>/test/mocks/auth.ts',
    '^config/env$': '<rootDir>/test/mocks/config.ts',
    '^@prisma/client$': '<rootDir>/test/mocks/prisma.ts',
    '^@elastic/elasticsearch$': '<rootDir>/test/mocks/elasticsearch.ts',
    '^lib/secrets$': '<rootDir>/test/mocks/secrets.ts',
    '^lib/log-aggregation$': '<rootDir>/test/mocks/log-aggregation.ts',
    '^lib/utils/log-rotation$': '<rootDir>/test/mocks/log-rotator.ts',
    '^uuid$': require.resolve('uuid'),
    '^@aws-sdk/(.*)$': '<rootDir>/test/mocks/aws-sdk.ts',
    '^nanoid$': '<rootDir>/test/mocks/nanoid.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowJs: true,
        lib: ['dom', 'dom.iterable', 'esnext'],
        module: 'commonjs',
        isolatedModules: true
      }
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@aws-sdk|uuid|@smithy|nanoid)/)'
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  },
  testTimeout: 60000,
  slowTestThreshold: 30000,
  maxConcurrency: 1,
  maxWorkers: 1,
  fakeTimers: {
    enableGlobally: true,
    now: 1483228800000,
    doNotFake: ['nextTick', 'setImmediate']
  },
  testPathIgnorePatterns: [
    '<rootDir>/e2e/'
  ],
  verbose: true,
  injectGlobals: true,
  testRunner: 'jest-circus/runner'
}

export default createJestConfig(customJestConfig)
