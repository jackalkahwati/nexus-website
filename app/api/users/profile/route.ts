import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from 'lib/prisma'
import { createAuditLog, AuditActions, ResourceTypes } from 'lib/audit-logger'
import { sanitizeObject } from 'lib/utils/sanitize'

// Helper function for error responses
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return errorResponse("Internal server error", 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()
    const sanitizedData = sanitizeObject(body)

    // Validate allowed fields
    const allowedFields = ['name', 'image']
    const updates = Object.keys(sanitizedData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = sanitizedData[key]
        return obj
      }, {} as Record<string, any>)

    if (Object.keys(updates).length === 0) {
      return errorResponse("No valid fields to update", 400)
    }

    const updatedUser = await prisma.user.update({
      where: { id: token.id },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    })

    // Log the profile update
    await createAuditLog({
      userId: token.id,
      action: AuditActions.PROFILE_UPDATE,
      resourceType: ResourceTypes.PROFILE,
      resourceId: token.id,
      details: {
        updates: updates,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return errorResponse("Internal server error", 500)
  }
}
