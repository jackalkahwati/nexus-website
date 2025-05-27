import { secretsManager } from '../secrets'

/**
 * Example usage of the SecretsManager
 */
async function secretsExample() {
  try {
    // Store API keys with metadata
    await secretsManager.setSecret(
      'stripe-api-key',
      'sk_test_123456789',
      {
        service: 'stripe',
        environment: 'test',
        createdBy: 'system',
        rotationSchedule: '90days'
      }
    )

    // Store database credentials
    await secretsManager.setSecret(
      'db-password',
      'super-secure-password',
      {
        service: 'postgres',
        environment: 'production',
        lastRotated: new Date().toISOString()
      }
    )

    // Retrieve a secret
    const stripeKey = await secretsManager.getSecret('stripe-api-key')
    if (stripeKey) {
      console.log('Retrieved Stripe API key')
    }

    // Update metadata
    await secretsManager.updateSecretMetadata('db-password', {
      lastHealthCheck: new Date().toISOString(),
      status: 'healthy'
    })

    // Rotate a secret
    await secretsManager.rotateSecret(
      'db-password',
      'new-super-secure-password'
    )

    // List all secrets
    const secrets = await secretsManager.listSecrets()
    console.log('Available secrets:', secrets)

    // Get metadata for a specific secret
    const metadata = await secretsManager.getSecretMetadata('stripe-api-key')
    if (metadata) {
      console.log('Stripe API key metadata:', metadata)
    }

    // Delete a secret when it's no longer needed
    await secretsManager.deleteSecret('old-api-key')

  } catch (error) {
    console.error('Error managing secrets:', error)
  }
}

/**
 * Example of using secrets in a service
 */
class PaymentService {
  private stripeKey: string | null = null

  async initialize() {
    // Load the API key when the service starts
    this.stripeKey = await secretsManager.getSecret('stripe-api-key')
    if (!this.stripeKey) {
      throw new Error('Stripe API key not found')
    }
  }

  async processPayment(amount: number) {
    if (!this.stripeKey) {
      await this.initialize()
    }

    // Ensure stripeKey is not null after initialization
    if (!this.stripeKey) {
      throw new Error('Failed to initialize Stripe API key')
    }

    // Use the secret in the payment processing logic
    const maskedKey = this.stripeKey.substring(0, 8) + '...'
    console.log('Processing payment with Stripe key:', maskedKey)
  }
}

/**
 * Example of secret rotation
 */
async function rotateSecrets() {
  try {
    // Get all secrets that need rotation
    const secrets = await secretsManager.listSecrets()
    for (const secretName of secrets) {
      const metadata = await secretsManager.getSecretMetadata(secretName)
      
      if (metadata?.rotationSchedule) {
        const lastRotated = new Date(metadata.lastRotated || 0)
        const daysSinceRotation = (Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24)

        if (daysSinceRotation >= 90) {
          // Generate a new secret value (implementation depends on the secret type)
          const newValue = generateNewSecretValue()
          
          // Rotate the secret
          await secretsManager.rotateSecret(secretName, newValue)
          
          // Update the rotation metadata
          await secretsManager.updateSecretMetadata(secretName, {
            lastRotated: new Date().toISOString(),
            rotatedBy: 'system'
          })
        }
      }
    }
  } catch (error) {
    console.error('Error rotating secrets:', error)
  }
}

// Helper function to generate new secret values
function generateNewSecretValue(): string {
  const length = 32
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

export { secretsExample, PaymentService, rotateSecrets }
