"use client"

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle2 } from 'lucide-react'

const AUTH_METHODS = [
  {
    type: 'API Key',
    description: 'Use your API key in the Authorization header',
    example: 'Authorization: Bearer your-api-key'
  },
  {
    type: 'OAuth 2.0',
    description: 'OAuth 2.0 authentication for secure access',
    flows: [
      { name: 'Authorization Code', description: 'For web applications' },
      { name: 'Client Credentials', description: 'For server-to-server' }
    ]
  },
  {
    type: 'JWT',
    description: 'JSON Web Token authentication',
    example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...'
  }
]

const SCOPES = [
  { name: 'read:vehicles', description: 'Read vehicle information' },
  { name: 'write:vehicles', description: 'Modify vehicle information' },
  { name: 'read:users', description: 'Read user information' },
  { name: 'write:users', description: 'Modify user information' },
  { name: 'admin', description: 'Full administrative access' }
]

export function AuthGuide() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Methods</CardTitle>
          <CardDescription>Available authentication methods and setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {AUTH_METHODS.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <h3 className="font-semibold">{method.type}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                {method.example && (
                  <div className="bg-muted p-2 rounded font-mono text-sm">
                    {method.example}
                  </div>
                )}
                {method.flows && (
                  <div className="space-y-2">
                    {method.flows.map((flow, flowIndex) => (
                      <div key={flowIndex} className="flex items-center justify-between border rounded p-2">
                        <span className="font-medium">{flow.name}</span>
                        <span className="text-sm text-muted-foreground">{flow.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Available Scopes</CardTitle>
            <CardDescription>Permission scopes for API access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SCOPES.map((scope, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-mono text-sm">{scope.name}</p>
                    <p className="text-sm text-muted-foreground">{scope.description}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Get API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Generate an API key from your dashboard settings
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">2. Include in Requests</h3>
                <div className="bg-muted p-2 rounded font-mono text-sm">
                  Authorization: Bearer your-api-key
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">3. Handle Responses</h3>
                <p className="text-sm text-muted-foreground">
                  Check response status and handle errors appropriately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 