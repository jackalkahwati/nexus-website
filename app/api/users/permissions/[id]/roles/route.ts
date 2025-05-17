import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const roleAssignmentSchema = z.object({
  roleId: z.string(),
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { roleId } = roleAssignmentSchema.parse(body)

    // Check if permission exists
    const permission = await prisma.permission.findUnique({
      where: { id: params.id }
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Add permission to role
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: { id: params.id }
        }
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error assigning permission to role:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to assign permission to role' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; roleId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove permission from role
    await prisma.role.update({
      where: { id: params.roleId },
      data: {
        permissions: {
          disconnect: { id: params.id }
        }
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing permission from role:', error)
    return NextResponse.json(
      { error: 'Failed to remove permission from role' },
      { status: 500 }
    )
  }
} 