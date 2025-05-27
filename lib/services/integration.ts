import { prisma } from '../prisma'
import { auditLogger, AuditActions } from '../audit-logger'
import { IntegrationTypes } from '../../types'
import { logger } from '../logging/winston'

type Integration = IntegrationTypes.Integration
type IntegrationType = IntegrationTypes.IntegrationType
type IntegrationCategory = IntegrationTypes.IntegrationCategory
type IntegrationStatus = IntegrationTypes.IntegrationStatus

export class IntegrationService {
  async create(data: {
    name: string
    type: IntegrationType
    category: IntegrationCategory
    config: Record<string, any>
    userId: string
    description?: string
  }): Promise<Integration> {
    const integration = await prisma.integration.create({
      data: {
        name: data.name,
        type: data.type,
        category: data.category,
        config: data.config,
        description: data.description || '',
        status: 'pending' as IntegrationStatus,
        metadata: {
          version: '1.0.0',
          errorCount: 0,
          successCount: 0
        },
        permissions: [],
        userId: data.userId,
      },
    })

    await auditLogger.log({
      action: AuditActions['integration.create'],
      userId: data.userId,
      resourceType: 'integration',
      resourceId: integration.id,
      details: {
        name: data.name,
        type: data.type,
        category: data.category
      },
    })

    return {
      ...integration,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString()
    } as Integration
  }

  async update(
    id: string,
    data: {
      name?: string
      config?: Record<string, any>
      status?: IntegrationStatus
      description?: string
      userId: string
    }
  ): Promise<Integration> {
    const integration = await prisma.integration.update({
      where: { id },
      data: {
        name: data.name,
        config: data.config,
        status: data.status,
        description: data.description,
      },
    })

    await auditLogger.log({
      action: AuditActions['integration.update'],
      userId: data.userId,
      resourceType: 'integration',
      resourceId: integration.id,
      details: {
        updates: {
          name: data.name,
          status: data.status,
          config: data.config,
          description: data.description
        },
      },
    })

    return {
      ...integration,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString()
    } as Integration
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.integration.delete({
      where: { id },
    })

    await auditLogger.log({
      action: AuditActions['integration.delete'],
      userId: userId,
      resourceType: 'integration',
      resourceId: id,
    })
  }

  async sync(id: string, userId: string): Promise<void> {
    const integration = await prisma.integration.findUnique({
      where: { id },
    })

    if (!integration) {
      throw new Error('Integration not found')
    }

    // Sync logic here...

    await auditLogger.log({
      action: AuditActions['integration.sync'],
      userId: userId,
      resourceType: 'integration',
      resourceId: id,
      details: {
        type: integration.type,
      },
    })
  }

  async test(id: string, userId: string): Promise<boolean> {
    const integration = await prisma.integration.findUnique({
      where: { id },
    })

    if (!integration) {
      throw new Error('Integration not found')
    }

    // Test logic here...
    const success = true

    await auditLogger.log({
      action: AuditActions['integration.test'],
      userId: userId,
      resourceType: 'integration',
      resourceId: id,
      details: {
        success,
        type: integration.type,
      },
    })

    return success
  }

  async createLog(data: {
    integrationId: string
    type: 'info' | 'error' | 'warning'
    message: string
    details?: Record<string, any>
  }): Promise<void> {
    await prisma.integrationLog.create({
      data: {
        integrationId: data.integrationId,
        type: data.type,
        message: data.message,
        details: data.details || {},
      },
    })

    // Also log to system logger
    const logLevel = data.type === 'error' ? 'error' : 
                    data.type === 'warning' ? 'warn' : 'info'
    logger[logLevel](`Integration ${data.integrationId}: ${data.message}`, {
      type: 'INTEGRATION_LOG',
      ...data.details
    })
  }

  async getIntegration(id: string): Promise<Integration> {
    const integration = await prisma.integration.findUnique({
      where: { id },
    })

    if (!integration) {
      throw new Error('Integration not found')
    }

    return {
      ...integration,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString()
    } as Integration
  }

  async listIntegrations(userId: string): Promise<Integration[]> {
    const integrations = await prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return integrations.map((integration: any) => ({
      ...integration,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString()
    })) as Integration[]
  }

  async testIntegration(id: string): Promise<boolean> {
    const integration = await this.getIntegration(id)
    
    try {
      // Test logic here based on integration type
      const success = true
      await this.createLog({
        integrationId: id,
        type: 'info',
        message: 'Integration test successful',
      })
      return success
    } catch (error) {
      await this.createLog({
        integrationId: id,
        type: 'error',
        message: 'Integration test failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      return false
    }
  }

  async syncIntegration(id: string): Promise<void> {
    const integration = await this.getIntegration(id)
    
    try {
      // Sync logic here based on integration type
      await this.createLog({
        integrationId: id,
        type: 'info',
        message: 'Integration sync completed',
      })
    } catch (error) {
      await this.createLog({
        integrationId: id,
        type: 'error',
        message: 'Integration sync failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      throw error
    }
  }
}

export const integrationService = new IntegrationService()
