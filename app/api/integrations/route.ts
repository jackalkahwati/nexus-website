import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { integrationService } from '../../../lib/services/integration'
import { z } from 'zod'

const createIntegrationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(['api', 'webhook', 'sdk', 'database', 'custom']),
  category: z.enum([
    'maintenance',
    'payment',
    'analytics',
    'tracking',
    'mapping',
    'notification',
    'authentication',
    'weather',
    'telematics',
    'fleet_management',
  ]),
  config: z.record(z.any()),
  credentials: z.record(z.any()).optional(),
  metadata: z.record(z.any()),
  permissions: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = createIntegrationSchema.parse(body)

    const integration = await integrationService.create({
      ...validatedData,
      userId: session.user.id,
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error('Error creating integration:', error)
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const integrations = await integrationService.listIntegrations(session.user.id)
    return NextResponse.json(integrations)
  } catch (error) {
    console.error('Error listing integrations:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const integration = await integrationService.update(body.id, {
      ...body,
      userId: session.user.id,
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error('Error updating integration:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return new NextResponse('Integration ID is required', { status: 400 })
    }

    await integrationService.delete(id, session.user.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting integration:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
