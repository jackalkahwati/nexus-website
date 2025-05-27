"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Camera,
  Box,
  Eye,
  Glasses,
  Layers,
  MapPin,
  Navigation,
  PackageSearch,
  Route,
  Smartphone,
  Truck,
  LineChart,
  Shield,
  Zap,
  Settings,
  Users,
  Wrench,
  AlertCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
  comingSoon?: boolean
  progress?: number
}

function FeatureCard({ title, description, icon: Icon, comingSoon, progress }: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {progress !== undefined && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Integration Progress: {progress}%</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const turnkeySolutions = [
  {
    title: "Vehicle Health & Predictive Maintenance",
    description: "Pre-configured maintenance intervals and predictive models for common parts with built-in alerts.",
    icon: Wrench,
    progress: 100,
  },
  {
    title: "Fleet Tracking & Dashboards",
    description: "Ready-made dashboard with real-time vehicle status, maintenance tickets, and driver metrics.",
    icon: LineChart,
    progress: 100,
  },
  {
    title: "User Access Management",
    description: "Pre-set user roles and simple login workflows for immediate team onboarding.",
    icon: Users,
    progress: 100,
  },
  {
    title: "ADAS Integration",
    description: "Drop-in Mobileye feeds with automatic correlation to maintenance and driver behavior.",
    icon: Eye,
    progress: 85,
  },
  {
    title: "Automated Reports & Analytics",
    description: "Out-of-the-box KPIs and standard reports for immediate insights.",
    icon: LineChart,
    progress: 90,
  },
  {
    title: "Compliance & Security",
    description: "GDPR compliance and secure data handling enabled by default.",
    icon: Shield,
    progress: 100,
  },
]

const integrationSteps = [
  {
    title: "Quick Setup",
    description: "Complete our setup wizard with basic fleet information.",
    icon: Settings,
  },
  {
    title: "Device Connection",
    description: "Connect your existing telematics devices with one click.",
    icon: Zap,
  },
  {
    title: "Team Access",
    description: "Add team members with pre-configured roles.",
    icon: Users,
  },
  {
    title: "Start Monitoring",
    description: "Access your branded dashboard immediately.",
    icon: LineChart,
  },
]

const arFeatures = [
  {
    title: "Live Fleet Visualization",
    description: "View your entire fleet in augmented reality with real-time location and status updates.",
    icon: Truck,
  },
  {
    title: "Route Optimization",
    description: "Visualize and optimize delivery routes in 3D with real-time traffic and weather data.",
    icon: Route,
  },
  {
    title: "Package Tracking",
    description: "Track packages in real-time with AR markers and get instant status updates.",
    icon: PackageSearch,
  },
  {
    title: "Navigation Assist",
    description: "AR-powered navigation assistance for drivers with turn-by-turn directions.",
    icon: Navigation,
  },
  {
    title: "Spatial Mapping",
    description: "Create and manage detailed 3D maps of delivery zones and warehouses.",
    icon: Layers,
  },
  {
    title: "Smart Glasses Integration",
    description: "Hands-free operation with smart glasses for drivers and warehouse staff.",
    icon: Glasses,
    comingSoon: true,
  },
]

export default function VisionPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vision & AR Platform</h2>
          <p className="text-muted-foreground">
            Turnkey solutions for fleet management with advanced AR capabilities.
          </p>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Quick Integration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get started in minutes with our turnkey solution. No complex setup required.
            </p>
            <div className="mt-4 space-x-4">
              <Button>Start Integration</Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="turnkey" className="space-y-4">
        <TabsList>
          <TabsTrigger value="turnkey">Turnkey Solution</TabsTrigger>
          <TabsTrigger value="ar">AR Features</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="turnkey" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turnkeySolutions.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pre-Integrated Components</CardTitle>
              <CardDescription>
                Ready-to-use features that work right out of the box.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Maintenance Automation</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Pre-configured maintenance schedules</li>
                    <li>Automated alerts and notifications</li>
                    <li>Mobile app for technicians</li>
                    <li>Integration with common parts databases</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Real-time Monitoring</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Vehicle health monitoring</li>
                    <li>Driver behavior analysis</li>
                    <li>Fuel/battery efficiency tracking</li>
                    <li>Automated reporting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {arFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AR Integration Benefits</CardTitle>
              <CardDescription>
                Enhanced operational efficiency through augmented reality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Operational Benefits</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>30% reduction in training time</li>
                    <li>25% improvement in task completion</li>
                    <li>40% fewer errors in maintenance</li>
                    <li>Real-time decision support</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">ROI Metrics</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Reduced maintenance costs</li>
                    <li>Improved fleet utilization</li>
                    <li>Enhanced safety compliance</li>
                    <li>Faster issue resolution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {integrationSteps.map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="pl-8">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Support</CardTitle>
              <CardDescription>
                Comprehensive support for smooth deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Documentation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Quick start guides</li>
                    <li>API references</li>
                    <li>Best practices</li>
                    <li>Video tutorials</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Technical Support</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>24/7 support team</li>
                    <li>Integration specialists</li>
                    <li>Regular check-ins</li>
                    <li>Custom solutions</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Training</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Admin training</li>
                    <li>User workshops</li>
                    <li>Certification program</li>
                    <li>Regular updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule a demo to see how our turnkey solution can transform your fleet operations.
            </p>
            <div className="mt-4 space-x-4">
              <Button>Schedule Demo</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
