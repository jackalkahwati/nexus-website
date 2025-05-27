// First, let's create the missing types
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