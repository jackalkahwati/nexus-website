"use client"

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/contexts/NotificationContext'

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface Response {
  status: number
  description: string
  example: string
}

interface RequestBody {
  type: string
  example: string
}

interface Endpoint {
  method: HttpMethod
  endpoint: string
  description: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    endpoint: "/v1/fleet",
    description: "List all vehicles in your fleet",
    parameters: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter vehicles by status (active, parked, maintenance)"
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "Maximum number of vehicles to return"
      }
    ],
    responses: [
      {
        status: 200,
        description: "List of vehicles",
        example: JSON.stringify({
          data: [
            {
              id: "veh_123",
              name: "Bike #123",
              status: "active",
              battery: 85,
              lastLocation: {
                lat: 37.7749,
                lng: -122.4194
              }
            }
          ],
          hasMore: false,
          total: 1
        }, null, 2)
      }
    ]
  },
  {
    method: "POST",
    endpoint: "/v1/fleet",
    description: "Add a new vehicle to your fleet",
    requestBody: {
      type: "application/json",
      example: JSON.stringify({
        name: "Bike #123",
        model: "Premium",
        type: "electric",
        serialNumber: "SN123456"
      }, null, 2)
    },
    responses: [
      {
        status: 201,
        description: "Vehicle created successfully",
        example: JSON.stringify({
          id: "veh_123",
          name: "Bike #123",
          model: "Premium",
          type: "electric",
          serialNumber: "SN123456",
          status: "active",
          createdAt: "2024-01-20T08:00:00Z"
        }, null, 2)
      }
    ]
  }
]

export function ApiExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<Endpoint>(ENDPOINTS[0])
  const { addNotification } = useNotifications()

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      addNotification({
        id: Date.now().toString(),
        title: "Copied to clipboard",
        description: "Code snippet has been copied to your clipboard",
        type: "success",
        time: new Date().toISOString(),
        read: false
      })
    }).catch(() => {
      addNotification({
        id: Date.now().toString(),
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        type: "warning",
        time: new Date().toISOString(),
        read: false
      })
    })
  }

  const handleTryEndpoint = () => {
    addNotification({
      id: Date.now().toString(),
      title: "Request sent",
      description: `Sent ${selectedEndpoint.method} request to ${selectedEndpoint.endpoint}`,
      type: "info",
      time: new Date().toISOString(),
      read: false
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Browse available API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {ENDPOINTS.map((endpoint, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg cursor-pointer hover:bg-accent border mb-2",
                  selectedEndpoint === endpoint && "border-primary bg-accent"
                )}
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      variant={endpoint.method === 'GET' ? 'default' :
                        endpoint.method === 'POST' ? 'destructive' :
                        endpoint.method === 'PUT' ? 'secondary' :
                        'secondary'}
                      className="mr-2"
                    >
                      {endpoint.method}
                    </Badge>
                    <span className="font-mono text-sm">{endpoint.endpoint}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Endpoint Details</CardTitle>
          <CardDescription>Request and response information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedEndpoint.method === 'GET' ? 'default' :
                    selectedEndpoint.method === 'POST' ? 'destructive' :
                    selectedEndpoint.method === 'PUT' ? 'secondary' :
                    'secondary'}>
                    {selectedEndpoint.method}
                  </Badge>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {selectedEndpoint.endpoint}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">{selectedEndpoint.description}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleTryEndpoint}>
                <Send className="mr-2 h-4 w-4" />
                Try it
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Request</h3>
              <div className="relative">
                <div className="absolute right-2 top-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyCode(`curl -X ${selectedEndpoint.method} \\
  https://api.lattis.com${selectedEndpoint.endpoint} \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json"`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="text-sm">{`curl -X ${selectedEndpoint.method} \\
  https://api.lattis.com${selectedEndpoint.endpoint} \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json"`}</code>
                </pre>
              </div>
            </div>

            {selectedEndpoint.requestBody && (
              <div>
                <h3 className="text-sm font-medium mb-2">Request Body</h3>
                <div className="relative">
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyCode(selectedEndpoint.requestBody!.example)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4">
                    <code className="text-sm">{selectedEndpoint.requestBody.example}</code>
                  </pre>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Response</h3>
              {selectedEndpoint.responses.map((response, index) => (
                <div key={index} className="relative">
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyCode(response.example)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Status: {response.status}</Badge>
                    <span className="text-sm text-muted-foreground">{response.description}</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4">
                    <code className="text-sm">{response.example}</code>
                  </pre>
                </div>
              ))}
            </div>

            {selectedEndpoint.parameters && (
              <div>
                <h3 className="text-sm font-medium mb-2">Parameters</h3>
                <div className="rounded-lg border divide-y">
                  {selectedEndpoint.parameters.map((param, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{param.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 