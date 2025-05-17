import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { integrationService } from '@/lib/services/integration'
import { z } from 'zod'

const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.string().datetime(),
  signature: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { event, data, timestamp, signature } = webhookSchema.parse(body)

    // Get integration ID from URL
    const url = new URL(req.url)
    const integrationId = url.searchParams.get('id')
    if (!integrationId) {
      return new NextResponse('Integration ID is required', { status: 400 })
    }

    // Verify webhook signature if provided
    if (signature) {
      // Implement signature verification logic
      const isValid = true // Replace with actual verification
      if (!isValid) {
        await integrationService.createLog({
          integrationId,
          type: 'error',
          message: 'Invalid webhook signature',
          details: { event, timestamp }
        })
        return new NextResponse('Invalid signature', { status: 401 })
      }
    }

    // Log the webhook event
    await integrationService.createLog({
      integrationId,
      type: 'info',
      message: `Received webhook event: ${event}`,
      details: { event, timestamp, data }
    })

    // Process the webhook based on event type
    switch (event) {
      case 'integration.status':
        const status = data.status
        if (!status) {
          await integrationService.createLog({
            integrationId,
            type: 'error',
            message: 'Missing status in webhook data',
            details: { event, data }
          })
          return new NextResponse('Missing status', { status: 400 })
        }

        // Update integration status
        await integrationService.update(integrationId, {
          status: status as any,
          userId: 'system'
        })

        await integrationService.createLog({
          integrationId,
          type: 'info',
          message: `Integration status updated to: ${status}`,
        })
        break

      case 'integration.error':
        await integrationService.createLog({
          integrationId,
          type: 'error',
          message: data.message || 'Unknown error',
          details: data
        })
        break

      case 'integration.sync':
        // Update integration metadata
        await integrationService.update(integrationId, {
          status: 'active',
          config: {
            lastSync: timestamp,
            nextSync: data.nextSync,
            ...data.metadata
          },
          userId: 'system'
        })

        await integrationService.createLog({
          integrationId,
          type: 'info',
          message: 'Integration sync completed',
          details: data
        })
        break

      default:
        await integrationService.createLog({
          integrationId,
          type: 'warning',
          message: `Unhandled webhook event: ${event}`,
          details: { event, data }
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new NextResponse(
      'Webhook processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    )
  }
} 