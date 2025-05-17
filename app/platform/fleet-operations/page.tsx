"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Activity,
  AlertCircle,
  Car,
  Clock,
  Cog,
  Command,
  FileText,
  GitBranch,
  Globe,
  LayoutDashboard,
  Map,
  Shield,
  Users,
  Wrench,
  Zap
} from 'lucide-react'

export default function FleetOperationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              Comprehensive Fleet Operations
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Streamline your autonomous fleet management with real-time monitoring, predictive maintenance, and intelligent operational controls.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Start Managing
                <Command className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
                <Globe className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Monitoring",
                description: "Track your entire fleet in real-time with comprehensive vehicle telemetry and status updates.",
                icon: <Activity className="w-6 h-6 text-primary" />
              },
              {
                title: "Predictive Maintenance",
                description: "Prevent downtime with AI-powered maintenance predictions and automated service scheduling.",
                icon: <Wrench className="w-6 h-6 text-primary" />
              },
              {
                title: "Route Optimization",
                description: "Optimize routes dynamically based on traffic, weather, and real-time conditions.",
                icon: <Map className="w-6 h-6 text-primary" />
              },
              {
                title: "Safety Management",
                description: "Ensure fleet safety with advanced monitoring and incident prevention systems.",
                icon: <Shield className="w-6 h-6 text-primary" />
              },
              {
                title: "Asset Management",
                description: "Track and manage all fleet assets with detailed maintenance and performance history.",
                icon: <Car className="w-6 h-6 text-primary" />
              },
              {
                title: "Compliance Tracking",
                description: "Stay compliant with automated regulatory compliance monitoring and reporting.",
                icon: <FileText className="w-6 h-6 text-primary" />
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Operations Dashboard */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fleet Operations Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor and manage your entire fleet from a single, intuitive dashboard with real-time insights and controls.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Operational Vehicles",
                value: "2,547",
                status: "Normal",
                icon: <Car className="w-4 h-4" />
              },
              {
                title: "Active Alerts",
                value: "3",
                status: "Warning",
                icon: <AlertCircle className="w-4 h-4" />
              },
              {
                title: "Maintenance Due",
                value: "12",
                status: "Scheduled",
                icon: <Wrench className="w-4 h-4" />
              },
              {
                title: "Fleet Efficiency",
                value: "96%",
                status: "Optimal",
                icon: <Activity className="w-4 h-4" />
              }
            ].map((metric, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  {metric.icon}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.status}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with your existing systems and expand capabilities through our extensive integration options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "API Integration",
                description: "Connect with existing fleet management systems through our comprehensive API.",
                icon: <GitBranch className="w-6 h-6 text-primary" />
              },
              {
                title: "Custom Workflows",
                description: "Create automated workflows tailored to your specific operational needs.",
                icon: <Cog className="w-6 h-6 text-primary" />
              },
              {
                title: "Data Analytics",
                description: "Access detailed analytics and reporting tools for fleet performance optimization.",
                icon: <LayoutDashboard className="w-6 h-6 text-primary" />
              }
            ].map((integration, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="mb-4">{integration.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{integration.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                <Button variant="outline" size="sm">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Fleet Operations</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started with our comprehensive fleet management platform and take your operations to the next level.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Request Demo
              <Globe className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 