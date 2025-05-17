"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Key, 
  Plus, 
  Copy, 
  RefreshCw, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'expired' | 'revoked'
  environment: 'development' | 'production'
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Development Key',
      key: 'lnx_dev_123456789',
      createdAt: '2024-02-01',
      lastUsed: '2024-02-03',
      status: 'active',
      environment: 'development'
    },
    {
      id: '2',
      name: 'Production Key',
      key: 'lnx_prod_987654321',
      createdAt: '2024-01-15',
      lastUsed: '2024-02-03',
      status: 'active',
      environment: 'production'
    }
  ])
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [isProduction, setIsProduction] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('API key copied to clipboard')
  }

  const createNewKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: `lnx_${isProduction ? 'prod' : 'dev'}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      status: 'active',
      environment: isProduction ? 'production' : 'development'
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
    setShowNewKeyForm(false)
    toast.success('New API key created')
  }

  const regenerateKey = (id: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return {
          ...key,
          key: `lnx_${key.environment}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString().split('T')[0]
        }
      }
      return key
    }))
    toast.success('API key regenerated')
  }

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return { ...key, status: 'revoked' }
      }
      return key
    }))
    toast.success('API key revoked')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys for accessing the Lattis - Nexus API
          </p>
        </div>
        <Button onClick={() => setShowNewKeyForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {showNewKeyForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Development API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="production"
                  checked={isProduction}
                  onCheckedChange={setIsProduction}
                />
                <Label htmlFor="production">Production Environment</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={createNewKey}>Create Key</Button>
                <Button variant="outline" onClick={() => setShowNewKeyForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card key={key.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{key.name}</h3>
                    <Badge variant={key.environment === 'production' ? 'default' : 'secondary'}>
                      {key.environment}
                    </Badge>
                    <Badge variant={
                      key.status === 'active' ? 'default' :
                      key.status === 'revoked' ? 'destructive' : 'secondary'
                    }>
                      {key.status}
                    </Badge>
                  </div>
                  <div className="font-mono bg-muted p-2 rounded-md flex items-center gap-2">
                    {key.key}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key.key)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateKey(key.id)}
                    disabled={key.status === 'revoked'}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokeKey(key.id)}
                    disabled={key.status === 'revoked'}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Revoke
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Created: {key.createdAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Last used: {key.lastUsed}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Never share your API keys in public repositories or client-side code</li>
            <li>• Use different API keys for development and production environments</li>
            <li>• Rotate your API keys regularly for enhanced security</li>
            <li>• Revoke unused or compromised API keys immediately</li>
            <li>• Store API keys securely in environment variables or secure vaults</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 