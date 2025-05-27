import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/api-keys'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return new NextResponse('API key ID is required', { status: 400 })
    }

    // Get the existing API key
    const existingKey = await prisma.apiKey.findUnique({
      where: { id }
    })

    if (!existingKey) {
      return new NextResponse('API key not found', { status: 404 })
    }

    // Generate a new API key
    const newKey = generateApiKey()

    // Update the API key in the database
    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: {
        key: newKey,
        lastRotated: new Date(),
      }
    })

    return NextResponse.json({
      message: 'API key regenerated successfully',
      key: newKey
    })
  } catch (error) {
    console.error('Error regenerating API key:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 