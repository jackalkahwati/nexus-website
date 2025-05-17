const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
] as const

export function validateEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    envVar => !process.env[envVar]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and Vercel project settings.'
    )
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl?.startsWith('postgresql://')) {
    throw new Error(
      'DATABASE_URL must be a valid PostgreSQL connection string.\n' +
      'Format: postgresql://user:password@host:port/database'
    )
  }

  // Validate NEXTAUTH_URL format
  const authUrl = process.env.NEXTAUTH_URL
  try {
    new URL(authUrl!)
  } catch {
    throw new Error(
      'NEXTAUTH_URL must be a valid URL.\n' +
      'Example: https://your-domain.com'
    )
  }

  // Validate NEXTAUTH_SECRET length
  const secret = process.env.NEXTAUTH_SECRET
  if (secret && secret.length < 32) {
    throw new Error(
      'NEXTAUTH_SECRET should be at least 32 characters long for security.'
    )
  }
} 