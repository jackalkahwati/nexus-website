import { PrismaClient } from '@prisma/client'
import { validateEnv } from './env-check'

// Validate environment variables before initializing Prisma
validateEnv()

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as { prisma?: PrismaClient }

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper function to handle Prisma operations with proper cleanup and timeout
export async function withPrisma<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
  const timeout = 20000 // 20 seconds timeout
  
  try {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database operation timed out'))
      }, timeout)
    })

    // Race between the actual operation and the timeout
    const result = await Promise.race([
      operation(prisma),
      timeoutPromise
    ]) as T

    return result
  } catch (error) {
    // Log any database errors with more context
    console.error('Database operation failed:', {
      error,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL
    })
    throw error
  } finally {
    // Cleanup connections in serverless environment
    if (process.env.VERCEL) {
      try {
        await Promise.race([
          prisma.$disconnect(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Disconnect timed out')), 5000)
          })
        ])
      } catch (error) {
        console.error('Error during disconnect:', error)
      }
    }
  }
}

// Export a function to explicitly disconnect when needed
export async function disconnectPrisma() {
  try {
    await Promise.race([
      prisma.$disconnect(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Disconnect timed out')), 5000)
      })
    ])
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}

// Export the prisma instance as both default and named export
export { prisma as default } 