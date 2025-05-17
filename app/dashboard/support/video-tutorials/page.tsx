"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tutorials = {
  basics: [
    {
      title: "Getting Started with Fleet Management",
      duration: "5:30",
      thumbnail: "/tutorials/getting-started.jpg",
      description: "Learn the basics of managing your fleet with our platform."
    },
    {
      title: "Setting Up Your First Vehicle",
      duration: "4:15",
      thumbnail: "/tutorials/vehicle-setup.jpg",
      description: "Step-by-step guide to adding and configuring vehicles."
    },
    {
      title: "Understanding the Dashboard",
      duration: "6:45",
      thumbnail: "/tutorials/dashboard.jpg",
      description: "Navigate and understand all dashboard features and metrics."
    }
  ],
  advanced: [
    {
      title: "Route Optimization Strategies",
      duration: "8:20",
      thumbnail: "/tutorials/route-optimization.jpg",
      description: "Advanced techniques for optimizing delivery routes."
    },
    {
      title: "Fleet Analytics Deep Dive",
      duration: "7:10",
      thumbnail: "/tutorials/analytics.jpg",
      description: "Master fleet analytics and reporting features."
    },
    {
      title: "Maintenance Schedule Planning",
      duration: "6:30",
      thumbnail: "/tutorials/maintenance.jpg",
      description: "Learn to create effective maintenance schedules."
    }
  ],
  integrations: [
    {
      title: "API Integration Guide",
      duration: "10:15",
      thumbnail: "/tutorials/api.jpg",
      description: "Complete guide to integrating with our API."
    },
    {
      title: "Setting Up Webhooks",
      duration: "5:45",
      thumbnail: "/tutorials/webhooks.jpg",
      description: "Learn to configure and use webhooks effectively."
    },
    {
      title: "Third-party Integrations",
      duration: "7:30",
      thumbnail: "/tutorials/integrations.jpg",
      description: "Connect with popular third-party services."
    }
  ]
}

function TutorialCard({ tutorial }: { tutorial: typeof tutorials.basics[0] }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{tutorial.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {tutorial.duration}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {tutorial.description}
        </p>
      </div>
    </Card>
  )
}

export default function VideoTutorialsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Video Tutorials</h2>
          <p className="text-muted-foreground">
            Learn how to use our platform with step-by-step video guides
          </p>
        </div>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.basics.map((tutorial, index) => (
              <TutorialCard key={index} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.advanced.map((tutorial, index) => (
              <TutorialCard key={index} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.integrations.map((tutorial, index) => (
              <TutorialCard key={index} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div>
            <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Check out our documentation or contact support for more help.
            </p>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => router.push("/dashboard/support/api-documentation")}
              >
                View Documentation
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/dashboard/support")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 