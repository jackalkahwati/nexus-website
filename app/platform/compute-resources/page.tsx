"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Activity,
  BarChart3,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Eye,
  FileText,
  Globe,
  HardDrive,
  LineChart,
  Network,
  Power,
  Server,
  Settings,
  Shield,
  Terminal,
  Users,
  Zap
} from 'lucide-react'

export default function ComputeResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              High-Performance Compute Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Optimize and scale your autonomous vehicle compute infrastructure with our advanced resource management platform.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Manage Resources
                <Server className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Analytics
                <BarChart3 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Edge Computing",
                description: "Distributed edge computing infrastructure for real-time processing and decision making.",
                icon: <Network className="w-6 h-6 text-primary" />
              },
              {
                title: "Cloud Integration",
                description: "Seamless integration with cloud platforms for scalable compute resources.",
                icon: <Cloud className="w-6 h-6 text-primary" />
              },
              {
                title: "Resource Optimization",
                description: "AI-powered resource allocation and optimization for maximum efficiency.",
                icon: <Cpu className="w-6 h-6 text-primary" />
              },
              {
                title: "Performance Monitoring",
                description: "Real-time monitoring and analytics of compute resource utilization.",
                icon: <Activity className="w-6 h-6 text-primary" />
              },
              {
                title: "Storage Management",
                description: "Intelligent data storage management and optimization systems.",
                icon: <HardDrive className="w-6 h-6 text-primary" />
              },
              {
                title: "Security Controls",
                description: "Advanced security measures for compute resource protection.",
                icon: <Shield className="w-6 h-6 text-primary" />
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

      {/* Resource Dashboard */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Resource Utilization Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor and optimize your compute resources in real-time across your entire infrastructure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "CPU Usage",
                value: "78%",
                trend: "+2%",
                icon: <Cpu className="w-4 h-4" />
              },
              {
                title: "Memory Usage",
                value: "64%",
                trend: "-5%",
                icon: <Database className="w-4 h-4" />
              },
              {
                title: "Network Load",
                value: "42%",
                trend: "+8%",
                icon: <Activity className="w-4 h-4" />
              },
              {
                title: "Storage Usage",
                value: "56%",
                trend: "+3%",
                icon: <HardDrive className="w-4 h-4" />
              }
            ].map((metric, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  {metric.icon}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className={`text-sm ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.trend}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools for managing and optimizing your compute infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Resource Scaling",
                description: "Automatic scaling of compute resources based on demand.",
                features: [
                  "Dynamic resource allocation",
                  "Load balancing",
                  "Auto-scaling policies",
                  "Performance optimization"
                ],
                icon: <Power className="w-6 h-6 text-primary" />
              },
              {
                title: "Infrastructure Management",
                description: "Comprehensive infrastructure monitoring and management.",
                features: [
                  "Health monitoring",
                  "Resource tracking",
                  "Capacity planning",
                  "Cost optimization"
                ],
                icon: <Settings className="w-6 h-6 text-primary" />
              },
              {
                title: "Performance Analytics",
                description: "Detailed analytics and reporting for resource utilization.",
                features: [
                  "Usage analytics",
                  "Performance metrics",
                  "Trend analysis",
                  "Optimization insights"
                ],
                icon: <LineChart className="w-6 h-6 text-primary" />
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Optimize Your Compute Infrastructure</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take control of your compute resources with our comprehensive management platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Get Started
              <Terminal className="ml-2 h-4 w-4" />
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