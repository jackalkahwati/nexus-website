import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const vehicle = await prisma.vehicle.create({
      data
    })
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 