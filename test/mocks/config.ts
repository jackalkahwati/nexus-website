import { jest } from '@jest/globals'

// Setup mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test_secret_key_1234567890abcdefghijklmnop'
process.env.APP_SECRET_KEY = 'test-app-secret-key-for-encryption-and-security'
process.env.NODE_ENV = 'test'

// Mock the env config
const env = {
  app: {
    name: 'test-app',
    environment: 'test',
    secretKey: 'test-app-secret-key-for-encryption-and-security'
  },
  elasticsearch: {
    node: 'http://localhost:9200',
    username: 'elastic',
    password: 'changeme',
    index: 'test-index'
  },
  aws: {
    region: 'us-east-1',
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key'
  },
  logging: {
    level: 'info',
    directory: '/test/logs',
    maxSize: '10m',
    maxFiles: 5
  },
  security: {
    encryption: {
      algorithm: 'aes-256-cbc',
      secretKey: 'test-app-secret-key-for-encryption-and-security'
    }
  }
}

// Mock validateEnv function to avoid validation errors in tests
jest.mock('../../lib/env-check', () => ({
  validateEnv: jest.fn().mockImplementation(() => true),
  getAppEnv: jest.fn().mockReturnValue('test'),
  isProduction: jest.fn().mockReturnValue(false),
  isDevelopment: jest.fn().mockReturnValue(false),
  isTest: jest.fn().mockReturnValue(true)
}))

// Mock the prisma module
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  prisma: require('../mocks/prisma').PrismaClient()
}))

export default env 