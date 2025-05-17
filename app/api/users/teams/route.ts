import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const teamSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  members: z.array(z.string()).optional(), // User IDs
  leaderId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const where = query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    } : {}

    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
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
    const validatedData = teamSchema.parse(body)

    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        members: validatedData.members ? {
          connect: validatedData.members.map(id => ({ id }))
        } : undefined,
        leaderId: validatedData.leaderId,
        permissions: validatedData.permissions,
      },
      include: {
        members: true,
        leader: true,
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error creating team:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
} 