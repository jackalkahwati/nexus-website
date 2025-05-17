"use client"

import * as React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Code, Book, Terminal, Library, Lock } from 'lucide-react'

// Import components
import { ApiExplorer } from '@/components/api-portal/api-explorer'
import { AuthGuide } from '@/components/api-portal/auth-guide'
import { SDKDocs } from '@/components/api-portal/sdk-docs'

export default function APIPortalPage() {
  return (
    <div className="flex-1">
      {/* Header with icon and title */}
      <div className="flex items-center space-x-2 mb-6">
        <Code className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">API Documentation</h1>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center space-x-4 mb-8">
        <Link 
          href="/api-portal"
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 text-primary">
          <Book className="h-4 w-4" />
          <span>API References</span>
        </Link>
        <Link 
          href="/api-portal/sdk"
          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-muted">
          <Library className="h-4 w-4" />
          <span>SDK Libraries</span>
        </Link>
        <Link 
          href="/api-portal/explorer"
          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-muted">
          <Terminal className="h-4 w-4" />
          <span>API Explorer</span>
        </Link>
        <Link 
          href="/api-portal/auth"
          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-muted">
          <Lock className="h-4 w-4" />
          <span>Authentication</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">API References</h2>
        <p className="text-muted-foreground">Browse and test available API endpoints.</p>
        <Card className="p-6">
          <ApiExplorer />
        </Card>
      </div>
    </div>
  )
} 