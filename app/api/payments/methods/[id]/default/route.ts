import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = params
    if (!id) {
      return new NextResponse('Payment method ID required', { status: 400 })
    }

    // Mock updating default payment method
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error updating default payment method:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 