import { jest } from '@jest/globals'
import type { Cipher, Decipher, Hash } from 'crypto'

// Create mock Cipher class
const mockCipher: Partial<Cipher> = {
  update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
  final: jest.fn().mockReturnValue(Buffer.from('')),
  setAutoPadding: jest.fn().mockReturnThis()
}

// Create mock Decipher class
const mockDecipher: Partial<Decipher> = {
  update: jest.fn().mockReturnValue(Buffer.from('decrypted')),
  final: jest.fn().mockReturnValue(Buffer.from('')),
  setAutoPadding: jest.fn().mockReturnThis()
}

// Create mock Hash class
const mockHash: Partial<Hash> = {
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue(Buffer.from('mock-key'))
}

// Actual mocks matching crypto module exports
export const createCipheriv = jest.fn().mockReturnValue(mockCipher as Cipher)
export const createDecipheriv = jest.fn().mockReturnValue(mockDecipher as Decipher)
export const createHash = jest.fn().mockReturnValue(mockHash as Hash)
export const randomBytes = jest.fn().mockReturnValue(Buffer.from('mock-iv'))
export const scrypt = jest.fn().mockImplementation((password, salt, keylen, callback) => {
  callback(null, Buffer.from('mock-key'))
})

// Helper function to set mock behaviors
export function resetMocks() {
  createCipheriv.mockClear()
  createDecipheriv.mockClear()
  createHash.mockClear()
  randomBytes.mockClear()
  scrypt.mockClear()
  
  // Reset behavior for cipher/decipher/hash
  mockCipher.update = jest.fn().mockReturnValue(Buffer.from('encrypted'))
  mockCipher.final = jest.fn().mockReturnValue(Buffer.from(''))
  mockDecipher.update = jest.fn().mockReturnValue(Buffer.from('decrypted'))
  mockDecipher.final = jest.fn().mockReturnValue(Buffer.from(''))
  mockHash.update = jest.fn().mockReturnThis()
  mockHash.digest = jest.fn().mockReturnValue(Buffer.from('mock-key'))
}

// Setup mock implementation for crypto module
export default {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scrypt,
  constants: {
    OPENSSL_VERSION_NUMBER: 0,
  },
}