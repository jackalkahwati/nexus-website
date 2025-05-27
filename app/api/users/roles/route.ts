import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const roleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  isSystem: z.boolean().default(false),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeSystem = searchParams.get('includeSystem') === 'true'

    const where = includeSystem ? {} : { isSystem: false }

    const roles = await prisma.role.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
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
    const validatedData = roleSchema.parse(body)

    // Check if role already exists
    const existingRole = await prisma.role.findFirst({
      where: { name: validatedData.name }
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 400 }
      )
    }

    const role = await prisma.role.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        permissions: validatedData.permissions,
        isSystem: validatedData.isSystem,
      }
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Error creating role:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
  }
} 