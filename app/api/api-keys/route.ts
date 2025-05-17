import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { createAuditLog, AuditActions, ResourceTypes } from '@/lib/audit-logger'
import crypto from 'crypto'
import { z } from 'zod'

const createApiKeySchema = z.object({
  name: z.string().min(1),
})

function generateApiKey(): string {
  return `lnx_${crypto.randomBytes(32).toString('hex')}`
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createApiKeySchema.parse(body)

    const apiKey = await prisma.apiKey.create({
      data: {
        name: validatedData.name,
        key: generateApiKey(),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        key: true,
        createdAt: true,
        isActive: true,
      },
    })

    await createAuditLog({
      action: AuditActions.CREATE,
      userId: token.sub!,
      resourceType: ResourceTypes.API_KEY,
      resourceId: apiKey.id,
      details: { name: apiKey.name },
    })

    return NextResponse.json(apiKey)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        key: true,
        createdAt: true,
        lastRotated: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    const newKey = generateApiKey()
    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: {
        key: newKey,
        lastRotated: new Date(),
      },
      select: {
        id: true,
        name: true,
        key: true,
        createdAt: true,
        lastRotated: true,
        isActive: true,
      },
    })

    await createAuditLog({
      action: AuditActions.UPDATE,
      userId: token.sub!,
      resourceType: ResourceTypes.API_KEY,
      resourceId: apiKey.id,
      details: { name: apiKey.name, action: 'rotate' },
    })

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error('Error rotating API key:', error)
    return NextResponse.json(
      { error: 'Failed to rotate API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })

    await createAuditLog({
      action: AuditActions.DELETE,
      userId: token.sub!,
      resourceType: ResourceTypes.API_KEY,
      resourceId: apiKey.id,
      details: { name: apiKey.name },
    })

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}
