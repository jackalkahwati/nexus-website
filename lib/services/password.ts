import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const SALT_ROUNDS = 10

export class PasswordService {
  /**
   * Hash a password using bcrypt
   */
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return bcrypt.hash(password, salt)
  }

  /**
   * Compare a password against a hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Check if a password was recently used by a user
   */
  static async wasRecentlyUsed(userId: string, password: string, limit: number = 5): Promise<boolean> {
    const recentPasswords = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    for (const historicPassword of recentPasswords) {
      if (await this.compare(password, historicPassword.hash)) {
        return true
      }
    }

    return false
  }

  /**
   * Store a new password hash in the history
   */
  static async addToHistory(userId: string, password: string): Promise<void> {
    const hash = await this.hash(password)
    await prisma.passwordHistory.create({
      data: {
        userId,
        hash,
      },
    })
  }

  /**
   * Update a user's password and store it in history
   */
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hash = await this.hash(newPassword)
    
    await prisma.$transaction([
      // Update the user's password
      prisma.user.update({
        where: { id: userId },
        data: {
          password: hash,
          passwordUpdatedAt: new Date(),
        },
      }),
      // Add to password history
      prisma.passwordHistory.create({
        data: {
          userId,
          hash,
        },
      }),
    ])
  }

  /**
   * Check if a password needs to be updated based on age
   */
  static async needsUpdate(userId: string, maxAge: number = 90): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordUpdatedAt: true },
    })

    if (!user?.passwordUpdatedAt) {
      return true
    }

    const ageInDays = Math.floor(
      (Date.now() - user.passwordUpdatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    return ageInDays >= maxAge
  }

  /**
   * Validate password complexity requirements
   */
  static validateComplexity(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
