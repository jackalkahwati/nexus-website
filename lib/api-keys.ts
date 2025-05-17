import crypto from 'crypto'

export function generateApiKey(length: number = 32): string {
  // Generate a random buffer of bytes
  const buffer = crypto.randomBytes(length)
  
  // Convert to base64 and remove non-alphanumeric characters
  return buffer.toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length)
}

export function validateApiKey(apiKey: string): boolean {
  // Validate the API key format
  const validKeyRegex = /^[A-Za-z0-9]{32}$/
  return validKeyRegex.test(apiKey)
}

export function hashApiKey(apiKey: string): string {
  // Create a hash of the API key for storage
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex')
}

export function generateKeyPair() {
  // Generate a key pair for asymmetric encryption
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })
} 