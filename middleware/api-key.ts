import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function validateApiKey(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key')
    
    if (!apiKey) {
      return new NextResponse('API key is required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'ApiKey'
        }
      })
    }

    // Hash the provided API key
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

    // Find and validate API key
    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: {
        key: hashedKey,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            role: true
          }
        }
      }
    })

    if (!apiKeyRecord) {
      return new NextResponse('Invalid API key', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'ApiKey'
        }
      })
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsed: new Date() }
    })

    // Attach user and API key info to request
    req.headers.set('x-user-id', apiKeyRecord.user.id)
    req.headers.set('x-user-role', apiKeyRecord.user.role)
    req.headers.set('x-api-key-id', apiKeyRecord.id)
    req.headers.set('x-api-key-scopes', apiKeyRecord.scopes.join(','))

    return NextResponse.next({
      headers: req.headers
    })
  } catch (error) {
    console.error('API key validation error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
} 