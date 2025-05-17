import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { PrismaClient, Prisma } from '@prisma/client';
import { auditLogger, AuditAction, ResourceTypes } from '../audit-logger';
import type { 
  Secret, 
  SecretMetadata, 
  SecretAccess, 
  SecretVersion,
  CreateSecretParams,
  RotationConfig,
  SecretAccessLevel
} from '../../types/secrets';

const prisma = new PrismaClient();

export class SecretsManagerBase {
  protected encryptionKey: Buffer;
  protected algorithm = 'aes-256-cbc';

  constructor() {
    const baseKey = process.env.APP_SECRET_KEY || 'default-secret-key';
    this.encryptionKey = createHash('sha256').update(baseKey).digest();
  }

  protected encrypt(value: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  protected decrypt(encrypted: string): string {
    const [ivHex, encryptedText] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  protected async checkAccess(
    name: string,
    userId: string,
    requiredLevel: SecretAccessLevel
  ): Promise<boolean> {
    const secret = await prisma.secret.findUnique({
      where: { name },
      include: {
        access: {
          where: { userId },
        },
      },
    });

    if (!secret) return false;

    const userAccess = secret.access[0];
    if (!userAccess) return false;

    const accessLevels = {
      read: 1,
      write: 2,
      admin: 3,
    } as const;

    type AccessLevel = keyof typeof accessLevels;
    const userLevel = accessLevels[userAccess.accessLevel as AccessLevel];
    const requiredLevelValue = accessLevels[requiredLevel as AccessLevel];

    return userLevel >= requiredLevelValue;
  }

  protected async logAuditEvent(
    action: AuditAction,
    userId: string,
    resourceId: string,
    details: { name: string; metadata?: Record<string, any>; error?: string; stack?: string }
  ): Promise<void> {
    try {
      await auditLogger.log({
        action,
        userId,
        resourceType: ResourceTypes.SECRET,
        resourceId,
        details,
        timestamp: new Date()
      });
    } catch (error) {
      // Log to console if audit logging fails
      console.error('Failed to create audit log entry:', error);
    }
  }

  protected async handleError<T>(
    error: unknown,
    userId: string,
    resourceId: string,
    name: string
  ): Promise<T> {
    const errorDetails = {
      name,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };

    try {
      await this.logAuditEvent(
        auditLogger.actions.ERROR,
        userId,
        resourceId,
        errorDetails
      );
    } catch (loggingError) {
      // If audit logging fails, log to console
      console.error('Failed to log error:', loggingError);
    }

    // Re-throw the original error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(errorDetails.error);
  }
}
