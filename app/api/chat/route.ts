import { NextResponse } from 'next/server'
import { PrismaClient, MaintenanceTaskStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { message, history } = await req.json()

    // Process the message to determine intent
    const intent = await determineIntent(message.toLowerCase())
    
    // Get relevant data based on intent
    const response = await generateResponse(intent, message, session)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

async function determineIntent(message: string): Promise<string> {
  // Simple intent matching based on keywords
  if (message.includes('user') || message.includes('users')) {
    return 'users'
  }
  if (message.includes('permission') || message.includes('permissions')) {
    return 'permissions'
  }
  if (message.includes('role') || message.includes('roles')) {
    return 'roles'
  }
  if (message.includes('fleet') || message.includes('vehicle') || message.includes('vehicles')) {
    return 'fleet'
  }
  if (message.includes('maintenance') || message.includes('repair')) {
    return 'maintenance'
  }
  if (message.includes('analytics') || message.includes('stats') || message.includes('statistics')) {
    return 'analytics'
  }
  return 'general'
}

async function generateResponse(intent: string, message: string, session: any) {
  switch (intent) {
    case 'users':
      const userCount = await prisma.user.count()
      return `There are currently ${userCount} users in the system. What specific information about users would you like to know?`

    case 'permissions':
      const permissionCount = await prisma.permission.count()
      return `There are ${permissionCount} permissions configured in the system. I can help you find specific permissions or explain their purposes.`

    case 'roles':
      const roleCount = await prisma.role.count()
      return `The system has ${roleCount} roles defined. Would you like to know more about specific roles or their permissions?`

    case 'fleet':
      const vehicleCount = await prisma.vehicle.count()
      return `Your fleet consists of ${vehicleCount} vehicles. I can provide details about specific vehicles, their status, or maintenance history.`

    case 'maintenance':
      const pendingTasks = await prisma.maintenanceTask.count({
        where: { status: MaintenanceTaskStatus.PENDING }
      })
      const inProgressTasks = await prisma.maintenanceTask.count({
        where: { status: MaintenanceTaskStatus.IN_PROGRESS }
      })
      return `There are currently ${pendingTasks} pending and ${inProgressTasks} in-progress maintenance tasks. Would you like to know more about specific maintenance items?`

    case 'analytics':
      // Here you would integrate with your analytics system
      return `I can help you with various analytics and statistics. What specific metrics would you like to know about?`

    default:
      return `I'm here to help you with information about users, permissions, roles, fleet management, maintenance, and analytics. What would you like to know?`
  }
} 