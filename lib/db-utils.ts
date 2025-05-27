import { PrismaClient, Prisma } from '@prisma/client'
import { DatabaseConfig } from '@/types/integration'

// Error types for database operations
export class DatabaseError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Connection management
export async function testConnection(config: DatabaseConfig): Promise<boolean> {
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    throw new DatabaseError(
      `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CONNECTION_ERROR'
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Query error handling wrapper
export async function executeQuery<T>(
  prisma: PrismaClient,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    throw new DatabaseError(
      `Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'QUERY_ERROR'
    )
  }
}

// Transaction wrapper
export async function withTransaction<T>(
  prisma: PrismaClient,
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await operation(tx)
    })
  } catch (error) {
    throw new DatabaseError(
      `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'TRANSACTION_ERROR'
    )
  }
}

// Connection string builder
export function buildConnectionString(config: DatabaseConfig): string {
  const { type, host, port, database, username, password, ssl } = config
  
  switch (type) {
    case 'postgresql':
      return `postgresql://${username}:${password}@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`
    case 'mysql':
      return `mysql://${username}:${password}@${host}:${port}/${database}${ssl ? '?ssl=true' : ''}`
    case 'mongodb':
      return `mongodb://${username}:${password}@${host}:${port}/${database}${ssl ? '?ssl=true' : ''}`
    default:
      throw new DatabaseError(
        `Unsupported database type: ${type}`,
        'INVALID_DB_TYPE'
      )
  }
} 