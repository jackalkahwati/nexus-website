"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from "sonner"

export default function RegenerateKeyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      const response = await fetch('/api/api-keys/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: searchParams.get('id'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate API key')
      }

      const data = await response.json()
      toast.success('API key regenerated successfully')
      
      // Copy new key to clipboard
      await navigator.clipboard.writeText(data.key)
      toast.success('New API key copied to clipboard')
      
      router.push('/api-keys')
    } catch (error) {
      console.error('Error regenerating API key:', error)
      toast.error('Failed to regenerate API key')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/api-keys')}
        className="mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to API Keys
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Regenerate API Key
          </CardTitle>
          <CardDescription>
            Are you sure you want to regenerate this API key? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-lg">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The old API key will be immediately invalidated</li>
                <li>All applications using this key will need to be updated</li>
                <li>There may be a brief service interruption during the key rotation</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isConfirming}
              >
                {isConfirming ? 'Regenerating...' : 'Yes, Regenerate Key'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/api-keys')}
                disabled={isConfirming}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 