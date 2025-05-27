import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/services/email'
import { z } from 'zod'

const sendEmailSchema = z.object({
  to: z.union([z.string(), z.array(z.string())]),
  subject: z.string(),
  html: z.string().optional(),
  text: z.string().optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
})

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
    const validatedData = sendEmailSchema.parse(body)

    const success = await emailService.sendEmail(validatedData)
    if (!success) {
      return new NextResponse('Failed to send email', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error sending email:', error)
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
