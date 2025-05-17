import { PrismaClient, Prisma } from '@prisma/client';
import type { 
  Secret, 
  SecretMetadata, 
  SecretAccess, 
  SecretVersion,
  CreateSecretParams,
  RotationConfig
} from '../../types/secrets';
import { SecretsManagerBase } from './secrets-base';
import { auditLogger, AuditAction, ResourceTypes } from '../audit-logger';

const prisma = new PrismaClient();
const DEFAULT_USER_ID = 'system';

interface DBSecret {
  id: string;
  name: string;
  description?: string;
  metadata: Prisma.JsonObject;
  rotationSchedule?: string;
  lastRotation?: Date;
  createdAt: Date;
  updatedAt: Date;
  value?: string;
}

export class SecretsManager extends SecretsManagerBase {
  private static instance: SecretsManager;

  protected constructor() {
    super();
  }

  public static getInstance(): SecretsManager {
    if (!SecretsManager.instance) {
      SecretsManager.instance = new SecretsManager();
    }
    return SecretsManager.instance;
  }

  private mapToSecret(dbSecret: DBSecret): Secret {
    return {
      id: dbSecret.id,
      name: dbSecret.name,
      description: dbSecret.description || undefined,
      metadata: dbSecret.metadata as SecretMetadata,
      rotationSchedule: dbSecret.rotationSchedule || undefined,
      lastRotation: dbSecret.lastRotation || undefined,
      createdAt: dbSecret.createdAt,
      updatedAt: dbSecret.updatedAt
    };
  }

  protected async handleError<T>(error: unknown, userId: string, resourceId: string, resourceName: string): Promise<T> {
    await this.logAuditEvent(
      auditLogger.actions.ERROR,
      userId,
      resourceId,
      { error: error instanceof Error ? error.message : String(error) }
    );
    throw error;
  }

  protected async logAuditEvent(
    action: AuditAction,
    userId: string,
    resourceId: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await auditLogger.log({
      action,
      userId,
      resourceType: ResourceTypes.SECRET,
      resourceId,
      details
    });
  }

  public async setSecret(name: string, value: string, metadata?: SecretMetadata): Promise<Secret> {
    try {
      const encrypted = this.encrypt(value);

      const result = await prisma.$transaction(async (tx) => {
        const [secret] = await tx.$queryRaw<DBSecret[]>`
          INSERT INTO secrets (name, metadata)
          VALUES (${name}, ${metadata || {}})
          ON CONFLICT (name) DO UPDATE
          SET metadata = COALESCE(${metadata ? metadata as Prisma.JsonObject : null}, secrets.metadata)
          RETURNING *`;

        await tx.$executeRaw`
          INSERT INTO secret_access (user_id, secret_id, access_level)
          VALUES (${DEFAULT_USER_ID}, ${secret.id}, 'admin')
          ON CONFLICT DO NOTHING`;

        const [latestVersion] = await tx.$queryRaw<Array<{ id: string; version: number }>>`
          SELECT id, version FROM secret_versions 
          WHERE secret_id = ${secret.id}
          ORDER BY version DESC
          LIMIT 1`;

        const newVersion = (latestVersion?.version || 0) + 1;

        await tx.$executeRaw`
          INSERT INTO secret_versions (secret_id, value, version, created_by, active)
          VALUES (${secret.id}, ${encrypted}, ${newVersion}, ${DEFAULT_USER_ID}, true)`;

        if (latestVersion) {
          await tx.$executeRaw`
            UPDATE secret_versions 
            SET active = false 
            WHERE id = ${latestVersion.id}`;
        }

        return secret;
      });

      const mappedResult = this.mapToSecret(result);

      await this.logAuditEvent(
        auditLogger.actions.UPDATE,
        DEFAULT_USER_ID,
        mappedResult.id,
        { name, metadata }
      );

      return mappedResult;
    } catch (error) {
      return this.handleError<Secret>(error, DEFAULT_USER_ID, name, name);
    }
  }

  public async getSecret(name: string): Promise<string | null> {
    try {
      const [result] = await prisma.$queryRaw<DBSecret[]>`
        SELECT s.*, sv.value
        FROM secrets s
        LEFT JOIN secret_versions sv ON sv.secret_id = s.id AND sv.active = true
        WHERE s.name = ${name}
        LIMIT 1`;

      if (!result?.value) return null;

      await this.logAuditEvent(
        auditLogger.actions.READ,
        DEFAULT_USER_ID,
        result.id,
        { name }
      );

      return this.decrypt(result.value);
    } catch (error) {
      return this.handleError<string | null>(error, DEFAULT_USER_ID, name, name);
    }
  }

  public async deleteSecret(name: string): Promise<boolean> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const [secret] = await tx.$queryRaw<DBSecret[]>`
          SELECT * FROM secrets WHERE name = ${name} LIMIT 1`;
        
        if (!secret) return false;

        await tx.$executeRaw`
          DELETE FROM secret_versions WHERE secret_id = ${secret.id}`;
        await tx.$executeRaw`
          DELETE FROM secret_access WHERE secret_id = ${secret.id}`;
        await tx.$executeRaw`
          DELETE FROM secrets WHERE id = ${secret.id}`;

        return secret;
      });

      if (result) {
        await this.logAuditEvent(
          auditLogger.actions.DELETE,
          DEFAULT_USER_ID,
          result.id,
          { name }
        );
      }

      return !!result;
    } catch (error) {
      return this.handleError<boolean>(error, DEFAULT_USER_ID, name, name);
    }
  }

  public async listSecrets(): Promise<string[]> {
    try {
      const secrets = await prisma.$queryRaw<Array<{ name: string }>>`
        SELECT name FROM secrets`;

      return secrets.map(secret => secret.name);
    } catch (error) {
      return this.handleError<string[]>(error, DEFAULT_USER_ID, 'list', 'list');
    }
  }

  public async getSecretMetadata(name: string): Promise<SecretMetadata | null> {
    try {
      const [result] = await prisma.$queryRaw<Array<{ metadata: Prisma.JsonObject }>>`
        SELECT metadata FROM secrets WHERE name = ${name} LIMIT 1`;

      if (!result) return null;

      return result.metadata as SecretMetadata;
    } catch (error) {
      return this.handleError<SecretMetadata | null>(error, DEFAULT_USER_ID, name, name);
    }
  }

  public async updateSecretMetadata(name: string, metadata: SecretMetadata): Promise<void> {
    try {
      const [result] = await prisma.$queryRaw<DBSecret[]>`
        UPDATE secrets
        SET metadata = ${metadata as Prisma.JsonObject}
        WHERE name = ${name}
        RETURNING *`;

      if (!result) throw new Error(`Secret ${name} not found`);

      await this.logAuditEvent(
        auditLogger.actions.UPDATE,
        DEFAULT_USER_ID,
        result.id,
        { name, metadata }
      );
    } catch (error) {
      return this.handleError<void>(error, DEFAULT_USER_ID, name, name);
    }
  }

  public async rotateSecret(name: string, newValue: string): Promise<void> {
    try {
      const [secret] = await prisma.$queryRaw<DBSecret[]>`
        SELECT * FROM secrets WHERE name = ${name} LIMIT 1`;

      if (!secret) throw new Error(`Secret ${name} not found`);

      await this.setSecret(name, newValue);

      await this.logAuditEvent(
        auditLogger.actions.UPDATE,
        DEFAULT_USER_ID,
        secret.id,
        { name, metadata: { rotated: true } }
      );
    } catch (error) {
      return this.handleError<void>(error, DEFAULT_USER_ID, name, name);
    }
  }
}

// Create singleton instance
export const secretsManager = SecretsManager.getInstance();
