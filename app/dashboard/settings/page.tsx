"use client"

import React from 'react'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Palette, Bell, Shield, Key } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-16">
      <main className="container mx-auto py-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="space-y-6">
            <TabsContent value="appearance" className="mt-0 space-y-6">
              <Card className="p-6">
                <ThemeSelector />
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <p className="text-muted-foreground">
                  Configure your notification settings here (coming soon).
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <p className="text-muted-foreground">
                  Manage your security preferences here (coming soon).
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-0">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">API Key Management</h2>
                    <p className="text-muted-foreground">
                      Securely manage and rotate your API keys. Keep your keys safe and never share them publicly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Production API Keys</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use these keys for your production environment. Rotate them periodically for security.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">No production keys generated yet.</div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Test API Keys</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use these keys for testing and development. They only work in test mode.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">No test keys generated yet.</div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Webhook Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure endpoints to receive real-time updates about your fleet.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">No webhooks configured yet.</div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">API Usage</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Monitor your API usage and rate limits.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">No API usage data available.</div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Documentation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access comprehensive API documentation and guides.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">Documentation coming soon.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
} 