import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from 'lib/prisma'
import { createAuditLog, AuditActions, ResourceTypes } from 'lib/audit-logger'
import { z } from 'zod'

// Role validation schema
const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['USER', 'ADMIN', 'MANAGER']),
})

// Helper function for error responses
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token?.id || token.role !== 'ADMIN') {
      return errorResponse("Unauthorized - Admin access required", 401)
    }

    const body = await request.json()
    
    try {
      const { userId, role } = roleSchema.parse(body)

      // Prevent self-role modification
      if (userId === token.id) {
        return errorResponse("Cannot modify own role", 403)
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
        },
      })

      // Log role update
      await createAuditLog({
        userId: token.id,
        action: AuditActions.ROLE_UPDATE,
        resourceType: ResourceTypes.ROLE,
        resourceId: userId,
        details: {
          targetUserId: userId,
          oldRole: body.currentRole,
          newRole: role,
        }
      })

      return NextResponse.json(updatedUser)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return errorResponse("Invalid input data", 400)
      }
      throw validationError
    }
  } catch (error) {
    console.error('Role update error:', error)
    return errorResponse("Internal server error", 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token?.id || token.role !== 'ADMIN') {
      return errorResponse("Unauthorized - Admin access required", 401)
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('User roles fetch error:', error)
    return errorResponse("Internal server error", 500)
  }
}
