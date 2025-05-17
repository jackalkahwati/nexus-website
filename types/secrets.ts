export interface SecretMetadata {
  description?: string;
  tags?: string[];
  environment?: string;
  application?: string;
  [key: string]: any;
}

export type SecretAccessLevel = 'read' | 'write' | 'admin';

export interface SecretAccess {
  userId: string;
  accessLevel: SecretAccessLevel;
}

export interface SecretVersion {
  id: string;
  version: number;
  createdAt: Date;
  createdBy?: string;
  active: boolean;
  expiresAt?: Date;
}

export interface Secret {
  id: string;
  name: string;
  description?: string;
  metadata?: SecretMetadata;
  rotationSchedule?: string;
  lastRotation?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSecretParams {
  name: string;
  value: string;
  metadata?: SecretMetadata;
  userId: string;
}

export interface RotationConfig {
  schedule: string;  // Cron expression
  generateNewValue?: () => Promise<string>;
  notifyUsers?: string[];
}
