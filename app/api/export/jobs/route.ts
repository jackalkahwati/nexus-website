import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { ExportJob } from '@/lib/services/export-import'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/api-utils'
import { Task } from '@prisma/client'

interface ExportTaskData {
  format?: 'json' | 'csv';
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
        type: 'data-export',
        userId: session.user.id
      }
    })

    // Get paginated tasks
    const tasks = await prisma.task.findMany({
      where: {
        type: 'export',
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        worker: true
      }
    })

    // Map tasks to ExportJob format
    const jobs: ExportJob[] = tasks.map((task) => {
      const taskData = task.data as ExportTaskData | null;
      const format = taskData?.format || 'json';
      return {
        id: task.id,
        status: task.status as ExportJob['status'],
        progress: task.progress || 0,
        totalRecords: task.totalRecords || 0,
        createdAt: task.createdAt.toISOString(),
        error: task.error || undefined,
        format: format as 'json' | 'csv',
        url: task.result && typeof task.result === 'object' && 'fileName' in task.result
          ? `/api/export/download/${task.result.fileName}`
          : undefined,
      };
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
    console.error('Error fetching export jobs:', error)
    return errorResponse('Failed to fetch export jobs', 500)
  }
} 