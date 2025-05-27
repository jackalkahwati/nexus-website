import { PrismaClient } from '@prisma/client'

// Check if DATABASE_URL is valid
const isValidDatabaseUrl = () => {
  return process.env.DATABASE_URL && 
         process.env.DATABASE_URL.startsWith('postgresql://');
}

// Create database client with fault tolerance
function createDbClient() {
  // If DATABASE_URL is invalid in production, log warning but continue
  if (!isValidDatabaseUrl()) {
    console.warn('Warning: Invalid DATABASE_URL. Some database features may not work properly.');
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    throw e; // Re-throw to be caught by application error handlers
  }
}

// Use a global variable to prevent multiple instances during hot reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createDbClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 