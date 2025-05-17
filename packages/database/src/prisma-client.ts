import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as { prisma?: PrismaClient };

// Create Prisma Client instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Set global prisma instance in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Execute a Prisma operation with timeout and automatic cleanup
 */
export async function withPrisma<T>(operation: (client: PrismaClient) => Promise<T>, timeoutMs: number = 30000): Promise<T> {
  try {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Database operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Race between the actual operation and the timeout
    const result = await Promise.race([
      operation(prisma),
      timeoutPromise
    ]);

    return result;
  } catch (error) {
    // Log database errors
    console.error('Database operation failed:', {
      error,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
    throw error;
  } finally {
    // Cleanup connections in serverless environment
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      try {
        await Promise.race([
          prisma.$disconnect(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Disconnect timed out')), 5000);
          }),
        ]);
      } catch (disconnectError) {
        console.error('Error during Prisma disconnect:', disconnectError);
      }
    }
  }
}

/**
 * Explicitly disconnect Prisma client
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await Promise.race([
      prisma.$disconnect(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Disconnect timed out')), 5000);
      }),
    ]);
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}

export default prisma;