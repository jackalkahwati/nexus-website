import crypto from 'crypto'

/**
 * Verifies the signature of a webhook payload
 * @param payload The raw webhook payload
 * @param signature The signature from the webhook header
 * @param secret The webhook secret used to sign the payload
 * @returns boolean indicating if the signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    if (!payload || !signature || !secret) {
      return false
    }

    // Create HMAC
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const expectedSignature = hmac.digest('hex')

    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

/**
 * Generates a webhook secret
 * @returns A random string to use as a webhook secret
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Signs a webhook payload
 * @param payload The payload to sign
 * @param secret The secret to use for signing
 * @returns The signature
 */
export function signWebhookPayload(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  return hmac.digest('hex')
}

/**
 * Validates webhook configuration
 * @param config The webhook configuration to validate
 * @returns An object containing validation results
 */
export function validateWebhookConfig(config: {
  url: string
  events: string[]
  headers?: Record<string, string>
  method?: string
  retryCount?: number
  timeout?: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate URL
  try {
    new URL(config.url)
  } catch {
    errors.push('Invalid webhook URL')
  }

  // Validate events
  if (!Array.isArray(config.events) || config.events.length === 0) {
    errors.push('At least one event must be specified')
  }

  // Validate method
  const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  if (config.method && !validMethods.includes(config.method)) {
    errors.push('Invalid HTTP method')
  }

  // Validate retry count
  if (config.retryCount !== undefined && (
    !Number.isInteger(config.retryCount) ||
    config.retryCount < 0 ||
    config.retryCount > 10
  )) {
    errors.push('Retry count must be between 0 and 10')
  }

  // Validate timeout
  if (config.timeout !== undefined && (
    !Number.isInteger(config.timeout) ||
    config.timeout < 1000 ||
    config.timeout > 30000
  )) {
    errors.push('Timeout must be between 1000 and 30000 milliseconds')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
} 