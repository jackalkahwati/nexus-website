"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseForm } from "@/components/integrations/database-form"
import { DatabaseMonitor } from "@/components/integrations/database-monitor"
import { DatabaseQuery } from "@/components/integrations/database-query"
import { DatabaseConfig } from "@/types/integration"
import { useToast } from "@/components/ui/use-toast"

export default function DatabaseIntegrationPage() {
  const { toast } = useToast()
  const [config, setConfig] = useState<DatabaseConfig | null>(null)

  const handleConfigSubmit = async (newConfig: DatabaseConfig) => {
    try {
      // Save config to backend if needed
      setConfig(newConfig)
      toast({
        title: "Configuration Saved",
        description: "Database configuration has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save database configuration",
        variant: "destructive",
      })
    }
  }

  const handleConfigCancel = () => {
    // Handle cancellation if needed
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Database Integration</h1>
        <p className="text-muted-foreground">
          Connect and manage your database integration
        </p>
      </div>

      {!config ? (
        <Card>
          <CardHeader>
            <CardTitle>Database Configuration</CardTitle>
            <CardDescription>
              Configure your database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseForm
              onSubmit={handleConfigSubmit}
              onCancel={handleConfigCancel}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="monitor" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Monitor</CardTitle>
                <CardDescription>
                  Real-time database health and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseMonitor config={config} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Query Interface</CardTitle>
                <CardDescription>
                  Execute and analyze database queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseQuery config={config} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>
                  Update your database configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseForm
                  onSubmit={handleConfigSubmit}
                  onCancel={handleConfigCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 