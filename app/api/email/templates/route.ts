import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/services/email'
import { z } from 'zod'

const templateSchema = z.object({
  name: z.string(),
  subject: z.string(),
  body: z.string(),
  variables: z.array(z.string()),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = templateSchema.parse(body)

    const template = await emailService.createTemplate(validatedData)
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const templates = await emailService.listTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error listing templates:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const templateId = searchParams.get('id')
    if (!templateId) {
      return new NextResponse('Template ID is required', { status: 400 })
    }

    const body = await req.json()
    const validatedData = templateSchema.partial().parse(body)

    const template = await emailService.updateTemplate(templateId, validatedData)
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const templateId = searchParams.get('id')
    if (!templateId) {
      return new NextResponse('Template ID is required', { status: 400 })
    }

    await emailService.deleteTemplate(templateId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting template:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
