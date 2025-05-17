import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

// Get a single integration
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const integration = await prisma.integration.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(integration)
  } catch (error) {
    console.error('Get integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update an integration
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, type, config, status } = await req.json()

    const integration = await prisma.integration.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    const updatedIntegration = await prisma.integration.update({
      where: {
        id: params.id
      },
      data: {
        name,
        type,
        config,
        status: status as any
      }
    })

    return NextResponse.json(updatedIntegration)
  } catch (error) {
    console.error('Update integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete an integration
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const integration = await prisma.integration.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    await prisma.integration.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 