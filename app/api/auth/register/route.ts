import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { validateRequiredFields, successResponse, errorResponse, serverErrorResponse } from '@/lib/utils/api-utils'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    validateRequiredFields(data, ['email', 'password'])
    
    const { email, password, name } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse('User already exists', 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        Role: {
          select: {
            name: true,
            permissions: true
          }
        }
      }
    })

    return successResponse(user, 'User registered successfully')
  } catch (error) {
    return serverErrorResponse(error)
  }
}