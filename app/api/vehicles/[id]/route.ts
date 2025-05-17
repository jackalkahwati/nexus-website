import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id }
    })

    if (!vehicle) {
      return new NextResponse('Vehicle not found', { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const data = await req.json()
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data
    })
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await prisma.vehicle.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 