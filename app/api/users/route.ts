import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  roleId: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const roleId = searchParams.get('role')

    let whereClause = {}

    if (query) {
      whereClause = {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } }
        ]
      }
    }

    if (roleId) {
      whereClause = { ...whereClause, roleId }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        Role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
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
    const validatedData = userSchema.parse(body)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        roleId: validatedData.roleId,
      },
      include: {
        Role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 