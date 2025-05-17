import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const insurancePolicySchema = z.object({
  vehicleId: z.string(),
  provider: z.string(),
  policyNumber: z.string(),
  type: z.enum(['liability', 'comprehensive', 'collision', 'personal_injury']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  coverage: z.number().positive(),
  deductible: z.number().min(0),
  premium: z.number().positive(),
  status: z.enum(['active', 'expired', 'cancelled', 'pending']),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).optional(),
  claims: z.array(z.object({
    date: z.string().datetime(),
    description: z.string(),
    amount: z.number().positive(),
    status: z.enum(['pending', 'approved', 'denied', 'settled']),
  })).optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')

    const where = {
      ...(vehicleId && { vehicleId }),
      ...(status && { status }),
      ...(provider && { provider }),
    }

    const policies = await prisma.insurancePolicy.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc',
      }
    })

    return NextResponse.json(policies)
  } catch (error) {
    console.error('Error fetching insurance policies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insurance policies' },
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
    const validatedData = insurancePolicySchema.parse(body)

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: validatedData.vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Create insurance policy with proper JSON handling
    const policy = await prisma.insurancePolicy.create({
      data: {
        vehicleId: validatedData.vehicleId,
        provider: validatedData.provider,
        policyNumber: validatedData.policyNumber,
        type: validatedData.type,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        coverage: validatedData.coverage,
        deductible: validatedData.deductible,
        premium: validatedData.premium,
        status: validatedData.status,
        documents: validatedData.documents as Prisma.InputJsonValue,
        claims: validatedData.claims ? {
          claims: validatedData.claims.map(claim => ({
            ...claim,
            date: new Date(claim.date).toISOString(),
          }))
        } as Prisma.InputJsonValue : undefined,
      },
      include: {
        vehicle: true
      }
    })

    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error creating insurance policy:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create insurance policy' },
      { status: 500 }
    )
  }
} 