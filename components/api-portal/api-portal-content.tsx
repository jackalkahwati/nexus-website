"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiExplorer } from "./api-explorer"
import { AuthGuide } from "./auth-guide"
import { WebhookDocs } from "./webhook-docs"
import { SDKDocs } from "./sdk-docs"

export default function ApiPortalContent() {
  return (
    <Card className="p-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reference">API Reference</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AuthGuide />
        </TabsContent>
        <TabsContent value="reference" className="space-y-4">
          <ApiExplorer />
        </TabsContent>
        <TabsContent value="sdks" className="space-y-4">
          <SDKDocs />
        </TabsContent>
        <TabsContent value="webhooks" className="space-y-4">
          <WebhookDocs />
        </TabsContent>
      </Tabs>
    </Card>
  )
} 