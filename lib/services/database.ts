import { PrismaClient } from '@prisma/client'
import { DatabaseConfig } from '@/types/integration'
import { executeQuery, withTransaction, buildConnectionString, DatabaseError } from '@/lib/db-utils'

// Define our own types since Prisma doesn't export these
type ModelName = string
type InputJsonValue = string | number | boolean | null | { [key: string]: InputJsonValue } | InputJsonValue[]
type SelectSubset<T, U> = {
  [key in keyof U]: key extends keyof T ? T[key] : never
}

export class DatabaseService {
  private prisma: PrismaClient
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
    const connectionString = buildConnectionString(config)
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    })
  }

  // Connection management
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Failed to connect to database: ${error.message}`,
          'CONNECTION_ERROR'
        )
      }
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }

  // Generic CRUD operations
  async create<T>(
    model: ModelName,
    data: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<T> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).create({
        data,
        ...options,
      })
    )
  }

  async findMany<T>(
    model: ModelName,
    where: InputJsonValue = {},
    options: SelectSubset<any, any> = {}
  ): Promise<T[]> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).findMany({
        where,
        ...options,
      })
    )
  }

  async findUnique<T>(
    model: ModelName,
    where: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<T | null> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).findUnique({
        where,
        ...options,
      })
    )
  }

  async update<T>(
    model: ModelName,
    where: InputJsonValue,
    data: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<T> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).update({
        where,
        data,
        ...options,
      })
    )
  }

  async delete<T>(
    model: ModelName,
    where: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<T> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).delete({
        where,
        ...options,
      })
    )
  }

  // Transaction support
  async transaction<T>(
    operation: (tx: PrismaClient) => Promise<T>
  ): Promise<T> {
    return withTransaction(this.prisma, operation)
  }

  // Batch operations
  async createMany<T>(
    model: ModelName,
    data: InputJsonValue[],
    options: SelectSubset<any, any> = {}
  ): Promise<{ count: number }> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).createMany({
        data,
        ...options,
      })
    )
  }

  async updateMany<T>(
    model: ModelName,
    where: InputJsonValue,
    data: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<{ count: number }> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).updateMany({
        where,
        data,
        ...options,
      })
    )
  }

  async deleteMany(
    model: ModelName,
    where: InputJsonValue,
    options: SelectSubset<any, any> = {}
  ): Promise<{ count: number }> {
    return executeQuery(this.prisma, () =>
      (this.prisma[model] as any).deleteMany({
        where,
        ...options,
      })
    )
  }

  // Raw query execution
  async executeRaw(query: string, ...values: any[]): Promise<any> {
    return executeQuery(this.prisma, () =>
      this.prisma.$executeRaw`${query}${values}`
    )
  }

  async queryRaw(query: string, values: unknown[] = []): Promise<any> {
    return executeQuery(this.prisma, () =>
      this.prisma.$queryRaw`${query}${values}`
    )
  }

  // Database information
  async getDatabaseInfo(): Promise<{
    type: string
    host: string
    database: string
    tables: { table_name: string }[]
  }> {
    const tables = await this.queryRaw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    return {
      type: this.config.type,
      host: this.config.host,
      database: this.config.database,
      tables,
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    latency: number
    message?: string
  }> {
    const start = Date.now()
    try {
      await this.queryRaw('SELECT 1')
      const latency = Date.now() - start
      return {
        status: 'healthy',
        latency,
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
} 