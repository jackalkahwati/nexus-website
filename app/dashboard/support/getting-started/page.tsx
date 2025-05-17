"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = [
  {
    title: "Set Up Your Account",
    content: [
      "Complete your profile information",
      "Configure your organization settings",
      "Invite team members",
      "Set up roles and permissions"
    ]
  },
  {
    title: "Fleet Management",
    content: [
      "Add your vehicles to the fleet",
      "Set up vehicle profiles and details",
      "Configure maintenance schedules",
      "Set up tracking and monitoring"
    ]
  },
  {
    title: "Route Optimization",
    content: [
      "Learn about route planning features",
      "Set up delivery zones",
      "Configure routing preferences",
      "Optimize delivery schedules"
    ]
  },
  {
    title: "Analytics & Reporting",
    content: [
      "Understand key metrics and KPIs",
      "Set up custom reports",
      "Configure alerts and notifications",
      "Track fleet performance"
    ]
  }
]

export default function GettingStartedPage() {
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
          <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
          <p className="text-muted-foreground">
            Follow these steps to get started with our platform
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{step.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {step.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push("/dashboard/support/video-tutorials")}
          >
            Watch Video Tutorials
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push("/dashboard/support/api-documentation")}
          >
            Read API Documentation
          </Button>
        </div>
      </div>
    </div>
  )
} 