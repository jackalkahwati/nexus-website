import { authenticator } from 'otplib'
import { toDataURL } from 'qrcode'
import { createHash, randomBytes } from 'crypto'
import { prisma } from '../prisma'
import { soc2Logger } from './soc2-logging'
import {
  SOC2AuthConfig,
  DEFAULT_SOC2_CONFIG,
  MFASetupResult,
  PasswordValidationResult,
  SessionValidationResult,
  SOC2Actions,
  SOC2ResourceTypes,
} from '../../types/soc2'

export class SOC2Auth {
  private config: SOC2AuthConfig

  constructor(config: Partial<SOC2AuthConfig> = {}) {
    this.config = {
      ...DEFAULT_SOC2_CONFIG,
      ...config,
    }
  }

  async validatePassword(password: string): Promise<PasswordValidationResult> {
    const reasons: string[] = []

    if (password.length < this.config.passwordMinLength) {
      reasons.push(`Password must be at least ${this.config.passwordMinLength} characters long`)
    }

    if (this.config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      reasons.push('Password must contain at least one uppercase letter')
    }

    if (this.config.passwordRequireLowercase && !/[a-z]/.test(password)) {
      reasons.push('Password must contain at least one lowercase letter')
    }

    if (this.config.passwordRequireNumbers && !/\d/.test(password)) {
      reasons.push('Password must contain at least one number')
    }

    if (this.config.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      reasons.push('Password must contain at least one special character')
    }

    return {
      valid: reasons.length === 0,
      reason: reasons.join('; '),
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex')
    const hash = createHash('sha256')
      .update(password + salt)
      .digest('hex')
    return `${salt}:${hash}`
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':')
    const computedHash = createHash('sha256')
      .update(password + salt)
      .digest('hex')
    return hash === computedHash
  }

  async setupMFA(userId: string, email: string): Promise<MFASetupResult> {
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(email, 'Your App Name', secret)
    const qrCode = await toDataURL(otpauth)

    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: secret,
        mfaEnabled: false, // Will be enabled after verification
      },
    })

    soc2Logger.audit(SOC2Actions.MFA_SETUP, 'success', {
      userId,
      resourceType: SOC2ResourceTypes.USER,
    })

    return {
      secret,
      qrCode,
    }
  }

  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.mfaSecret) {
      return false
    }

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    })

    if (isValid && !user.mfaEnabled) {
      // Enable MFA after first successful verification
      await prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true },
      })
    }

    soc2Logger.audit(SOC2Actions.MFA_VERIFY, isValid ? 'success' : 'failure', {
      userId,
      resourceType: SOC2ResourceTypes.USER,
    })

    return isValid
  }

  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + this.config.sessionTimeout * 60 * 1000)

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress,
        userAgent,
      },
    })

    soc2Logger.audit(SOC2Actions.SESSION_CREATE, 'success', {
      userId,
      sessionId: session.id,
      resourceType: SOC2ResourceTypes.SESSION,
    })

    return token
  }

  async validateSession(token: string): Promise<SessionValidationResult> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) {
      return {
        valid: false,
        reason: 'Session not found',
      }
    }

    if (session.expiresAt < new Date()) {
      await this.invalidateSession(token)
      return {
        valid: false,
        reason: 'Session expired',
      }
    }

    if (!session.user.isActive) {
      await this.invalidateSession(token)
      return {
        valid: false,
        reason: 'User account inactive',
      }
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    })

    return {
      valid: true,
      session,
    }
  }

  async invalidateSession(token: string): Promise<void> {
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (session) {
      await prisma.session.delete({
        where: { id: session.id },
      })

      soc2Logger.audit(SOC2Actions.SESSION_INVALIDATE, 'success', {
        userId: session.userId,
        sessionId: session.id,
        resourceType: SOC2ResourceTypes.SESSION,
      })
    }
  }

  async handleFailedLogin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return false
    }

    const failedAttempts = user.failedLoginAttempts + 1
    const shouldLock = failedAttempts >= this.config.maxLoginAttempts

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: shouldLock ? 0 : failedAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + this.config.lockoutDuration * 60 * 1000)
          : null,
      },
    })

    if (shouldLock) {
      soc2Logger.audit(SOC2Actions.USER_LOCK, 'success', {
        userId,
        reason: 'Max login attempts exceeded',
        resourceType: SOC2ResourceTypes.USER,
      })
    }

    return shouldLock
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    })
  }
}

// Export a default instance
export const soc2Auth = new SOC2Auth()
