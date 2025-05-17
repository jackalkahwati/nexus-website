import { jest } from '@jest/globals'

export interface SecretMetadata {
  type: 'api-key' | 'password' | 'token'
  [key: string]: unknown
}

export interface SecretValue {
  value: string
  metadata: SecretMetadata
}

export interface SecretOptions {
  expiresIn?: number // seconds
}

export interface StorageProvider {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

export interface EncryptionProvider {
  encrypt(value: string): Promise<string>
  decrypt(value: string): Promise<string>
}

export class SecretsManager {
  private secrets: Map<string, string>
  private secretsPath: string
  private saveSecrets: jest.Mock
  private encrypt: jest.Mock
  private decrypt: jest.Mock

  constructor(secretsPath: string) {
    this.secrets = new Map()
    this.secretsPath = secretsPath
    this.saveSecrets = jest.fn().mockResolvedValue(undefined)
    this.encrypt = jest.fn().mockImplementation(value => Promise.resolve(value))
    this.decrypt = jest.fn().mockImplementation(value => Promise.resolve(value))
  }

  async getSecret(name: string): Promise<string | null> {
    return this.secrets.get(name) || null
  }

  async setSecret(name: string, value: string): Promise<void> {
    if (!this.validateSecretName(name)) {
      throw new Error('Invalid secret name')
    }
    if (!this.validateSecretValue(value)) {
      throw new Error('Invalid secret value')
    }
    const encrypted = await this.encrypt(value)
    this.secrets.set(name, encrypted)
    await this.saveSecrets()
  }

  async deleteSecret(name: string): Promise<void> {
    this.secrets.delete(name)
    await this.saveSecrets()
  }

  async rotateSecret(name: string, newValue: string): Promise<void> {
    const oldValue = await this.getSecret(name)
    if (!oldValue) {
      throw new Error('Secret not found')
    }
    await this.setSecret(name, newValue)
  }

  private validateSecretName(name: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(name)
  }

  private validateSecretValue(value: string): boolean {
    return value.length >= 1 && value.length <= 10000
  }
}

// Create mock instance for testing
export const mockSecretsManager = new SecretsManager('/test/secrets')

// Mock implementations
jest.spyOn(mockSecretsManager, 'getSecret').mockImplementation(async (name) => {
  return mockSecretsManager['secrets'].get(name) || null
})

jest.spyOn(mockSecretsManager, 'setSecret').mockImplementation(async (name, value) => {
  if (!mockSecretsManager['validateSecretName'](name)) {
    throw new Error('Invalid secret name')
  }
  if (!mockSecretsManager['validateSecretValue'](value)) {
    throw new Error('Invalid secret value')
  }
  const encrypted = await mockSecretsManager['encrypt'](value)
  mockSecretsManager['secrets'].set(name, encrypted)
  await mockSecretsManager['saveSecrets']()
}) 