"use client"

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/contexts/NotificationContext'

const SDKS = [
  {
    language: 'JavaScript',
    version: '2.1.0',
    installCommand: 'npm install @lattis/sdk',
    example: `import { LattisSDK } from '@lattis/sdk';

const sdk = new LattisSDK({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get fleet status
const status = await sdk.fleet.getStatus();`
  },
  {
    language: 'Python',
    version: '1.8.0',
    installCommand: 'pip install lattis-sdk',
    example: `from lattis_sdk import LattisSDK

sdk = LattisSDK(
    api_key='your-api-key',
    environment='production'
)

# Get fleet status
status = sdk.fleet.get_status()`
  },
  {
    language: 'Java',
    version: '1.5.0',
    installCommand: 'maven: com.lattis:sdk:1.5.0',
    example: `import com.lattis.sdk.LattisSDK;

LattisSDK sdk = new LattisSDK.Builder()
    .apiKey("your-api-key")
    .environment("production")
    .build();

// Get fleet status
FleetStatus status = sdk.fleet().getStatus();`
  }
]

export function SDKDocs() {
  const [selectedSDK, setSelectedSDK] = React.useState(SDKS[0])
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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Available SDKs</CardTitle>
          <CardDescription>Official SDK libraries for different languages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SDKS.map((sdk, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer hover:border-primary",
                  selectedSDK === sdk && "border-primary"
                )}
                onClick={() => setSelectedSDK(sdk)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{sdk.language}</h3>
                  <Badge>v{sdk.version}</Badge>
                </div>
                <div className="font-mono text-sm bg-muted p-2 rounded">
                  {sdk.installCommand}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SDK Example</CardTitle>
          <CardDescription>Code example for the selected SDK</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg font-mono text-sm">
              {selectedSDK.example}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => handleCopyCode(selectedSDK.example)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 