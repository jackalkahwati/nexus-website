"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/app/client-layout"

export default function DemoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const startDemo = async () => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true)
    try {
      // Create demo account and sign in
      const response = await fetch("/api/demo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Demo User",
          workEmail: `demo_${Date.now()}@demo.lattis.com`,
          company: "Demo Company",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create demo account")
      }

      // Sign in with the new credentials using our custom login
      login({
        id: 'demo-user-id',
        name: 'Demo User',
        email: data.credentials.email,
        role: 'DEMO'
      })

      // Show success message
      toast({
        title: "Welcome to Lattis Nexus!",
        description: "Redirecting you to your demo dashboard...",
      })

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 500) // Small delay to ensure state is updated
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Lattis Nexus Demo</h1>
          <p className="text-muted-foreground">
            Experience our powerful fleet management platform
          </p>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={startDemo} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing your demo...
            </>
          ) : (
            "Start Demo"
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Sample Data Included</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
