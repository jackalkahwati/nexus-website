import { jest } from '@jest/globals'

// Define common interfaces for Prisma models
interface AnalyticsEvent {
  id: string
  userId: string
  metricName: string
  value: number
  timestamp: Date
  metadata: Record<string, any>
}

interface User {
  id: string
  email: string
  name: string
  hashedPassword: string
  role: string
  createdAt: Date
  updatedAt: Date
}

interface SecretVersion {
  id: string
  secretId: string
  version: number
  value: string
  active: boolean
  createdBy: string
  createdAt: Date
  expiresAt?: Date
}

interface SecretAccess {
  id: string
  secretId: string
  userId: string
  accessLevel: string
  createdAt: Date
}

interface Secret {
  id: string
  name: string
  description?: string
  metadata: Record<string, any>
  rotationSchedule?: string
  lastRotation?: Date
  createdAt: Date
  updatedAt: Date
  versions?: SecretVersion[]
  access?: SecretAccess[]
}

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  status: string
  location: any
  userId: string
}

interface ApiKey {
  id: string
  key: string
  name: string
  userId: string
  createdAt: Date
  expiresAt: Date | null
  lastUsed: Date | null
}

// Define types for mocked Prisma models
type MockedModel<T> = {
  create: jest.Mock<Promise<T>, [data: any]>
  findUnique: jest.Mock<Promise<T | null>, [params: any]>
  findFirst: jest.Mock<Promise<T | null>, [params: any]>
  findMany: jest.Mock<Promise<T[]>, [params: any]>
  update: jest.Mock<Promise<T>, [params: any]>
  upsert: jest.Mock<Promise<T>, [params: any]>
  delete: jest.Mock<Promise<T>, [params: any]>
  deleteMany: jest.Mock<Promise<{count: number}>, [params: any]>
  count: jest.Mock<Promise<number>, [params: any]>
}

// Define AuditLog model
interface AuditLog {
  id: string
  action: string
  userId: string
  resourceType: string
  resourceId: string
  details: Record<string, any>
  timestamp: Date
  createdAt: Date
}

// Define the full client type
type MockedPrismaClient = {
  analyticsEvent: MockedModel<AnalyticsEvent>
  user: MockedModel<User>
  secret: MockedModel<Secret>
  secretVersion: MockedModel<SecretVersion>
  secretAccess: MockedModel<SecretAccess>
  auditLog: MockedModel<AuditLog>
  vehicle: MockedModel<Vehicle>
  apiKey: MockedModel<ApiKey>
  $connect: jest.Mock
  $disconnect: jest.Mock
  $transaction: jest.Mock
  $queryRaw: jest.Mock
  $executeRaw: jest.Mock
}

// Create a factory function for mock models
const createMockModel = <T>(defaultData: T | T[]): MockedModel<T> => {
  const mockSingle = Array.isArray(defaultData) ? defaultData[0] : defaultData;
  const mockArray = Array.isArray(defaultData) ? defaultData : [defaultData];
  
  return {
    create: jest.fn().mockResolvedValue(mockSingle),
    findUnique: jest.fn().mockResolvedValue(mockSingle),
    findFirst: jest.fn().mockResolvedValue(mockSingle),
    findMany: jest.fn().mockResolvedValue(mockArray),
    update: jest.fn().mockResolvedValue(mockSingle),
    upsert: jest.fn().mockResolvedValue(mockSingle),
    delete: jest.fn().mockResolvedValue(mockSingle),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(mockArray.length)
  };
};

// Mock PrismaClient constructor
const PrismaClient = jest.fn(() => {
  // Create sample data for different models
  const mockAnalyticsEvents: AnalyticsEvent[] = [
    {
      id: 'ae-1',
      userId: 'user-1',
      metricName: 'page_view',
      value: 1,
      timestamp: new Date(),
      metadata: { page: '/dashboard' }
    },
    {
      id: 'ae-2',
      userId: 'user-1',
      metricName: 'button_click',
      value: 1,
      timestamp: new Date(),
      metadata: { button: 'submit' }
    }
  ];

  const mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      hashedPassword: '$2a$12$K8GpYeWkzrhLzc/UfrG4u.9QG0aRZ9uvWre/Fu.Z/WNlGNjDL0EP6', // hashed 'password'
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'user-2',
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: '$2a$12$K8GpYeWkzrhLzc/UfrG4u.9QG0aRZ9uvWre/Fu.Z/WNlGNjDL0EP6', // hashed 'password'
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockSecretVersions: SecretVersion[] = [
    {
      id: 'version-1',
      secretId: 'secret-1',
      version: 1,
      value: 'encrypted-value-1',
      active: true,
      createdBy: 'system',
      createdAt: new Date()
    },
    {
      id: 'version-2',
      secretId: 'secret-1',
      version: 2,
      value: 'encrypted-value-2',
      active: false,
      createdBy: 'system',
      createdAt: new Date()
    }
  ];

  const mockSecretAccess: SecretAccess[] = [
    {
      id: 'access-1',
      secretId: 'secret-1',
      userId: 'system',
      accessLevel: 'admin',
      createdAt: new Date()
    }
  ];

  const mockSecrets: Secret[] = [
    {
      id: 'secret-1',
      name: 'API_KEY',
      description: 'API Key for external service',
      metadata: { 
        application: 'test-app',
        environment: 'test' 
      },
      rotationSchedule: '0 0 1 * *', // Monthly
      lastRotation: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: mockSecretVersions,
      access: mockSecretAccess
    }
  ];

  const mockVehicles: Vehicle[] = [
    {
      id: 'vehicle-1',
      make: 'Tesla',
      model: 'Model Y',
      year: 2023,
      licensePlate: 'ABC123',
      status: 'ACTIVE',
      location: { lat: 37.7749, lng: -122.4194 },
      userId: 'user-1'
    }
  ];

  const mockApiKeys: ApiKey[] = [
    {
      id: 'apikey-1',
      key: 'test-api-key-1',
      name: 'Test API Key',
      userId: 'user-1',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lastUsed: new Date()
    }
  ];

  // Create sample audit log data
  const mockAuditLogs: AuditLog[] = [
    {
      id: 'audit-1',
      action: 'read',
      userId: 'user-1',
      resourceType: 'secret',
      resourceId: 'secret-1',
      details: { name: 'API_KEY' },
      timestamp: new Date(),
      createdAt: new Date()
    }
  ];

  // Create the client with all mock models
  const client: MockedPrismaClient = {
    analyticsEvent: createMockModel<AnalyticsEvent>(mockAnalyticsEvents),
    user: createMockModel<User>(mockUsers),
    secret: createMockModel<Secret>(mockSecrets),
    secretVersion: createMockModel<SecretVersion>(mockSecretVersions),
    secretAccess: createMockModel<SecretAccess>(mockSecretAccess),
    auditLog: createMockModel<AuditLog>(mockAuditLogs),
    vehicle: createMockModel<Vehicle>(mockVehicles),
    apiKey: createMockModel<ApiKey>(mockApiKeys),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $transaction: jest.fn().mockImplementation((fn) => {
      if (typeof fn === 'function') {
        // Create a transaction context that is similar to the client
        const txContext = {
          ...client,
          $executeRaw: client.$executeRaw,
          $queryRaw: client.$queryRaw
        };
        return Promise.resolve(fn(txContext));
      }
      return Promise.resolve(fn);
    }),
    $queryRaw: jest.fn().mockImplementation((strings, ...values) => {
      // Basic parsing of the mock SQL query to determine what to return
      const queryString = strings.join('?');
      
      if (queryString.includes('SELECT') && queryString.includes('FROM secrets')) {
        // For getSecret queries
        if (queryString.includes('WHERE s.name =') && queryString.includes('LIMIT 1')) {
          const secret = { ...mockSecrets[0], value: mockSecretVersions[0].value };
          return Promise.resolve([secret]);
        }
        
        // For listSecrets queries
        if (queryString.includes('SELECT name FROM')) {
          return Promise.resolve(mockSecrets.map(s => ({ name: s.name })));
        }
        
        return Promise.resolve(mockSecrets);
      }
      
      if (queryString.includes('INSERT INTO secrets')) {
        return Promise.resolve([mockSecrets[0]]);
      }
      
      if (queryString.includes('SELECT id, version FROM secret_versions')) {
        return Promise.resolve([{ id: mockSecretVersions[0].id, version: mockSecretVersions[0].version }]);
      }
      
      if (queryString.includes('UPDATE secrets')) {
        return Promise.resolve([mockSecrets[0]]);
      }
      
      // Default fallback
      return Promise.resolve([]);
    }),
    $executeRaw: jest.fn().mockResolvedValue(1) // 1 row affected
  };

  return client;
});

module.exports = { PrismaClient } 