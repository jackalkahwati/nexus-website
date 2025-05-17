import crypto from 'crypto'

// Generate a random recovery code
export function generateRecoveryCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

// Generate a set of recovery codes
export function generateRecoveryCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () => generateRecoveryCode())
}

// Validate a recovery code format
export function isValidRecoveryCode(code: string): boolean {
  return /^[0-9A-F]{8}$/.test(code)
}

// Hash a recovery code for storage
export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

// Compare a recovery code with its hash
export function verifyRecoveryCode(code: string, hash: string): boolean {
  return hashRecoveryCode(code) === hash
}
