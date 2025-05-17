import { jest } from '@jest/globals'
import type { PrismaClient, Secret, SecretVersion, SecretAccess } from '@prisma/client'
import type { Cipher, Decipher, Hash } from 'crypto'

interface MockPrismaClient extends Partial<PrismaClient> {
  $transaction: jest.Mock;
  secret: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create?: jest.Mock;
    update?: jest.Mock;
    delete?: jest.Mock;
  };
}

interface MockTransactionClient {
  secret: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  secretVersion: {
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    deleteMany: jest.Mock;
  };
  secretAccess: {
    create: jest.Mock;
    deleteMany: jest.Mock;
  };
}

// Mock Prisma
const mockPrismaClient: MockPrismaClient = {
  $transaction: jest.fn(async (callback) => {
    if (typeof callback === 'function') {
      const mockTransaction: MockTransactionClient = {
        secret: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'test-id',
            name: 'test-secret',
            metadata: {},
            versions: [{ value: 'encrypted-value' }]
          } as Secret),
          create: jest.fn().mockResolvedValue({
            id: 'test-id',
            name: 'test-secret',
            metadata: {}
          } as Secret),
          update: jest.fn().mockResolvedValue({
            id: 'test-id',
            name: 'test-secret',
            metadata: {}
          } as Secret),
          delete: jest.fn().mockResolvedValue(true)
        },
        secretVersion: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'version-id',
            version: 1,
            value: 'encrypted-value'
          } as SecretVersion),
          update: jest.fn().mockResolvedValue(true),
          deleteMany: jest.fn().mockResolvedValue({ count: 1 })
        },
        secretAccess: {
          create: jest.fn().mockResolvedValue({
            id: 'access-id',
            secretId: 'test-id',
            userId: 'system',
            accessLevel: 'admin'
          } as SecretAccess),
          deleteMany: jest.fn().mockResolvedValue({ count: 1 })
        }
      }
      return callback(mockTransaction)
    }
    return callback
  }),
  secret: {
    findUnique: jest.fn().mockResolvedValue({
      id: 'test-id',
      name: 'test-secret',
      metadata: {},
      versions: [{ value: 'encrypted-value' }]
    } as Secret),
    findMany: jest.fn().mockResolvedValue([
      { name: 'secret1' },
      { name: 'secret2' }
    ] as Secret[])
  }
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}))

// Mock audit logger
jest.mock('../../audit-logger', () => ({
  auditLogger: {
    log: jest.fn().mockResolvedValue(undefined),
    actions: {
      UPDATE: 'update',
      READ: 'read',
      DELETE: 'delete',
      ERROR: 'error'
    }
  }
}))

jest.mock('fs/promises')
jest.mock('crypto')

import { secretsManager } from '../secrets'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'
import { auditLogger } from '../../audit-logger'

const mockedFs = jest.mocked(fs)
const mockedCrypto = jest.mocked(crypto)

describe('SecretsManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock implementations
    mockedFs.readFile.mockResolvedValue(Buffer.from(''))
    mockedFs.writeFile.mockResolvedValue(undefined)
    mockedFs.unlink.mockResolvedValue(undefined)

    mockedCrypto.scrypt.mockImplementation((password, salt, keylen, callback) => {
      callback(null, Buffer.from('mock-key'))
    })
    mockedCrypto.randomBytes.mockReturnValue(Buffer.from('mock-iv'))
    
    const mockCipher: Partial<Cipher> = {
      update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
      final: jest.fn().mockReturnValue(Buffer.from(''))
    }
    const mockDecipher: Partial<Decipher> = {
      update: jest.fn().mockReturnValue(Buffer.from('decrypted')),
      final: jest.fn().mockReturnValue(Buffer.from(''))
    }
    
    mockedCrypto.createCipheriv.mockReturnValue(mockCipher as Cipher)
    mockedCrypto.createDecipheriv.mockReturnValue(mockDecipher as Decipher)

    const mockHash: Partial<Hash> = {
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(Buffer.from('mock-key'))
    }
    mockedCrypto.createHash.mockReturnValue(mockHash as Hash)

    // Setup environment variables
    process.env.APP_SECRET_KEY = 'test-secret-key'
  })

  afterEach(() => {
    delete process.env.APP_SECRET_KEY
  })

  describe('Secret Storage', () => {
    it('should store and retrieve secrets', async () => {
      const secretName = 'test-secret'
      const secretValue = 'test-value'

      await secretsManager.setSecret(secretName, secretValue)
      const retrievedValue = await secretsManager.getSecret(secretName)

      expect(retrievedValue).toBe(secretValue)
      expect(auditLogger.log).toHaveBeenCalledTimes(2)
    })

    it('should handle missing secrets', async () => {
      mockPrismaClient.secret.findUnique.mockResolvedValueOnce(null)

      const result = await secretsManager.getSecret('non-existent')
      expect(result).toBeNull()
    })

    it('should delete secrets', async () => {
      await secretsManager.deleteSecret('test-secret')
      expect(auditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'delete',
          resourceId: 'test-id'
        })
      )
    })

    it('should handle database errors', async () => {
      const error = new Error('Database error')
      mockPrismaClient.secret.findUnique.mockRejectedValueOnce(error)

      await expect(
        secretsManager.setSecret('test', 'value')
      ).rejects.toThrow('Database error')
      expect(auditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'error'
        })
      )
    })

    it('should handle encryption/decryption errors', async () => {
      const error = new Error('Encryption error')
      mockedCrypto.createCipheriv.mockImplementationOnce(() => {
        throw error
      })

      await expect(
        secretsManager.setSecret('test', 'value')
      ).rejects.toThrow('Encryption error')
      expect(auditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'error'
        })
      )
    })
  })

  describe('Secret Rotation', () => {
    it('should rotate secrets', async () => {
      const secretName = 'test-secret'
      const oldValue = 'old-value'
      const newValue = 'new-value'

      await secretsManager.setSecret(secretName, oldValue)
      await secretsManager.rotateSecret(secretName, newValue)

      const rotatedValue = await secretsManager.getSecret(secretName)
      expect(rotatedValue).toBe(newValue)
      expect(auditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'update',
          details: expect.objectContaining({
            metadata: { rotated: true }
          })
        })
      )
    })

    it('should handle rotation of non-existent secrets', async () => {
      mockPrismaClient.secret.findUnique.mockResolvedValueOnce(null)

      await expect(
        secretsManager.rotateSecret('non-existent', 'new-value')
      ).rejects.toThrow('Secret not found')
    })
  })

  describe('Secret Validation', () => {
    it('should validate secret names', async () => {
      await expect(
        secretsManager.setSecret('', 'value')
      ).rejects.toThrow('Invalid secret name')
    })

    it('should validate secret values', async () => {
      await expect(
        secretsManager.setSecret('test', '')
      ).rejects.toThrow('Invalid secret value')
    })
  })
})
