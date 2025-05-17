import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { availability } = await req.json()

    if (!['available', 'busy', 'off-duty'].includes(availability)) {
      return new NextResponse('Invalid availability status', { status: 400 })
    }

    const technician = await prisma.technician.update({
      where: { id: params.id },
      data: { availability }
    })

    // If technician is not available, reassign their pending tasks
    if (availability !== 'available') {
      const pendingTasks = await prisma.maintenanceTask.findMany({
        where: {
          technicianId: params.id,
          status: 'pending'
        }
      })

      // Find available technicians
      const availableTechnicians = await prisma.technician.findMany({
        where: {
          availability: 'available',
          NOT: {
            id: params.id
          }
        }
      })

      // Reassign tasks if there are available technicians
      if (availableTechnicians.length > 0) {
        for (const task of pendingTasks) {
          // Simple round-robin assignment
          const assignedTechnician = availableTechnicians[Math.floor(Math.random() * availableTechnicians.length)]
          await prisma.maintenanceTask.update({
            where: { id: task.id },
            data: { technicianId: assignedTechnician.id }
          })
        }
      }
    }

    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error updating technician availability:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 