import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const permissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  resource: z.string(),
  action: z.enum(['create', 'read', 'update', 'delete', 'manage']),
  conditions: z.record(z.any()).optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')
    const action = searchParams.get('action')

    const where = {
      ...(resource && { resource }),
      ...(action && { action }),
    }

    const permissions = await prisma.permission.findMany({
      where,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        resource: 'asc'
      }
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = permissionSchema.parse(body)

    // Check if permission already exists
    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: validatedData.name,
        resource: validatedData.resource,
        action: validatedData.action,
      }
    })

    if (existingPermission) {
      return NextResponse.json(
        { error: 'Permission with these parameters already exists' },
        { status: 400 }
      )
    }

    const permission = await prisma.permission.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        resource: validatedData.resource,
        action: validatedData.action,
        conditions: validatedData.conditions,
      }
    })

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error creating permission:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    )
  }
} 