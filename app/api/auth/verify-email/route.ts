import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/utils/api-utils'
import crypto from 'crypto'
import { emailService } from '@/lib/services/email'

// Send verification email
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { email } = data

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    if (user.emailVerified) {
      return errorResponse('Email already verified', 400)
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000) // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: verificationTokenExpiry
      }
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`
    await emailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    })

    return successResponse(
      { message: 'Verification email sent' },
      'Please check your email to verify your account'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// Verify email with token
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return errorResponse('Verification token is required', 400)
    }

    // Find valid token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!verificationToken) {
      return errorResponse('Invalid or expired verification token', 400)
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token }
    })

    return successResponse(
      { message: 'Email verified successfully' },
      'Your email has been verified'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
