import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            maintenanceTasks: true
          }
        }
      }
    })
    return NextResponse.json(technicians)
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Validate email uniqueness
    const existingTechnician = await prisma.technician.findUnique({
      where: { email: data.email }
    })

    if (existingTechnician) {
      return new NextResponse('Email already exists', { status: 400 })
    }

    const technician = await prisma.technician.create({
      data: {
        name: data.name,
        email: data.email,
        specialties: data.specialties || [],
        certification: data.certification,
        status: data.status || 'active',
        availability: data.availability || 'available'
      }
    })
    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error creating technician:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 