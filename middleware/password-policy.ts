import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import bcrypt from 'bcryptjs'

interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxAge: number // in days
  preventReuse: number // number of previous passwords to check
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // 90 days
  preventReuse: 5, // prevent reuse of last 5 passwords
}

export function validatePassword(password: string, requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS): { 
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`)
  }

  // Check for uppercase letters
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  // Check for lowercase letters
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  // Check for numbers
  if (requirements.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  // Check for special characters
  if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export async function middleware(request: NextRequest) {
  // Only apply to password-related endpoints
  if (!request.nextUrl.pathname.match(/^\/api\/auth\/(register|login|reset-password|change-password)/)) {
    return NextResponse.next()
  }

  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password against requirements
    const validation = validatePassword(password)
    if (!validation.valid) {
      soc2Logger.audit(SOC2Actions.PASSWORD_CHANGE, 'failure', {
        resourceType: SOC2ResourceTypes.USER,
        details: {
          reason: 'Password policy violation',
          errors: validation.errors,
        },
      })

      return NextResponse.json(
        { error: 'Password does not meet requirements', details: validation.errors },
        { status: 400 }
      )
    }

    // For password changes and resets, check password history
    if (request.nextUrl.pathname.match(/\/(change-password|reset-password)/)) {
      const userId = request.headers.get('x-user-id')
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        )
      }

      // Check if password was used recently
      const recentPasswords = await prisma.passwordHistory.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: DEFAULT_PASSWORD_REQUIREMENTS.preventReuse,
      })

      // Hash the new password for comparison
      const salt = await bcrypt.genSalt(10)
      const hashedNewPassword = await bcrypt.hash(password, salt)

      // Check against recent passwords
      for (const historicPassword of recentPasswords) {
        const matches = await bcrypt.compare(password, historicPassword.hash)
        if (matches) {
          soc2Logger.audit(SOC2Actions.PASSWORD_CHANGE, 'failure', {
            resourceType: SOC2ResourceTypes.USER,
            details: {
              reason: 'Password reuse violation',
              userId,
            },
          })

          return NextResponse.json(
            { error: 'Password was used recently. Please choose a different password.' },
            { status: 400 }
          )
        }
      }

      // Check password age
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          passwordUpdatedAt: true,
        },
      })

      if (user?.passwordUpdatedAt) {
        const passwordAge = Math.floor(
          (Date.now() - user.passwordUpdatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (passwordAge > DEFAULT_PASSWORD_REQUIREMENTS.maxAge) {
          soc2Logger.audit(SOC2Actions.PASSWORD_CHANGE, 'failure', {
            resourceType: SOC2ResourceTypes.USER,
            details: {
              reason: 'Password expired',
              userId,
              passwordAge,
            },
          })

          return NextResponse.json(
            { error: 'Password has expired. Please choose a new password.' },
            { status: 400 }
          )
        }
      }

      // Store the new password hash in history
      await prisma.passwordHistory.create({
        data: {
          userId,
          hash: hashedNewPassword,
        },
      })

      // Update the password updated timestamp
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordUpdatedAt: new Date(),
        },
      })
    }

    // Log successful password validation
    soc2Logger.audit(SOC2Actions.PASSWORD_CHANGE, 'success', {
      resourceType: SOC2ResourceTypes.USER,
      details: {
        action: request.nextUrl.pathname.split('/').pop(),
      },
    })

    return NextResponse.next()
  } catch (error) {
    console.error('Password policy middleware error:', error)
    
    soc2Logger.audit(SOC2Actions.PASSWORD_CHANGE, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/reset-password',
    '/api/auth/change-password',
  ],
}
