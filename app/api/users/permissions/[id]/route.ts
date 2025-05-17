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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error fetching permission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permission' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = permissionSchema.partial().parse(body)

    const permission = await prisma.permission.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error updating permission:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to update permission' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.permission.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    )
  }
} 