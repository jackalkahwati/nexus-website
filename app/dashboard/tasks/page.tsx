import { Metadata } from 'next'
import { useTaskQueue } from '@/contexts/TaskQueueContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Loader2, Plus, RefreshCw, Play, Pause, Trash2, RotateCcw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Task Queue | Lattis Fleet',
  description: 'Monitor and manage background tasks and workers'
}

export default function TaskQueuePage() {
  const {
    queues,
    tasks,
    workers,
    metrics,
    isLoading,
    error,
    createQueue,
    updateQueue,
    deleteQueue,
    addTask,
    cancelTask,
    retryTask,
    refreshQueues,
    refreshTasks,
    refreshWorkers
  } = useTaskQueue()

  const handleRefresh = () => {
    refreshQueues()
    refreshTasks()
    refreshWorkers()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'retrying':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Queue</h1>
          <p className="text-muted-foreground">
            Monitor and manage background tasks and workers
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Queue
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <Progress
              value={(metrics.completedTasks / metrics.totalTasks) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter(w => w.status === 'busy').length}
            </div>
            <Progress
              value={(workers.filter(w => w.status === 'busy').length / workers.length) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {workers.length} total workers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.successRate.toFixed(1)}%
            </div>
            <Progress
              value={metrics.successRate}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.failedTasks} failed tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.averageProcessingTime / 1000).toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.processingTasks} tasks in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queues">Queues</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>

        <TabsContent value="queues" className="space-y-4">
          {queues.map(queue => (
            <Card key={queue.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{queue.name}</CardTitle>
                  <CardDescription>{queue.type}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQueue(queue.id, {
                      status: queue.status === 'active' ? 'paused' : 'active'
                    })}
                  >
                    {queue.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQueue(queue.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Concurrency: {queue.concurrency}</span>
                    <span>Max Retries: {queue.maxRetries}</span>
                    <span>Retry Delay: {queue.retryDelay}ms</span>
                  </div>
                  <ScrollArea className="h-[200px]">
                    {queue.tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                      >
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.type}
                          </div>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-accent"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.type} • Queue: {task.queueId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created {formatDistanceToNow(new Date(task.createdAt))} ago
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      {task.status === 'failed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryTask(task.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workers.map(worker => (
              <Card key={worker.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Worker {worker.id}</CardTitle>
                  <CardDescription>{worker.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className={getStatusColor(worker.status)}>
                        {worker.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed Tasks</span>
                      <span>{worker.processedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed Tasks</span>
                      <span>{worker.failedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Heartbeat</span>
                      <span>
                        {formatDistanceToNow(new Date(worker.lastHeartbeat))} ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 