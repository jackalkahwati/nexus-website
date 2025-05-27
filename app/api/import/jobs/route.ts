import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { ImportJob } from '@/lib/services/export-import'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/api-utils'
import { Task, Prisma } from '@prisma/client'

interface TaskData {
  format?: 'json' | 'csv'
  validationErrors?: Array<{
    row: number
    errors: string[]
  }>
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return unauthorizedResponse()
    }

    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Cap at 50 items per page
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalCount = await prisma.task.count({
      where: {
        type: 'data-import',
        userId: session.user.id
      }
    })

    // Get paginated tasks
    const tasks = await prisma.task.findMany({
      where: {
        type: 'data-import',
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Map tasks to ImportJob format
    const jobs: ImportJob[] = tasks.map(task => {
      const taskData = task.data as TaskData
      return {
        id: task.id,
        status: task.status as ImportJob['status'],
        progress: task.progress,
        totalRecords: task.totalRecords,
        createdAt: task.createdAt.toISOString(),
        error: task.error || undefined,
        format: taskData.format || 'json',
        validationErrors: taskData.validationErrors,
      }
    })

    // Return paginated response
    return successResponse({
      jobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching import jobs:', error)
    return errorResponse('Failed to fetch import jobs', 500)
  }
} 