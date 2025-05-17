import crypto from 'crypto'

// Generate a single recovery code
export function generateCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

// Generate a set of recovery codes
export function generateCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () => generateCode())
}

// Hash a recovery code for storage
export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

// Verify a recovery code against its hash
export function verifyCode(code: string, hash: string): boolean {
  return hashCode(code) === hash
}
