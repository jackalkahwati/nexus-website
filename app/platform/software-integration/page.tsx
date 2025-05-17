"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Binary,
  Box,
  Braces,
  ChevronRight,
  Code,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  Globe,
  Key,
  Layers,
  Network,
  Puzzle,
  Shield,
  Terminal,
  Users,
  Webhook,
  Zap
} from 'lucide-react'

export default function SoftwareIntegrationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              Seamless Software Integration
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect and enhance your autonomous driving stack with our comprehensive integration platform, supporting everything from basic ADAS to full L4 autonomy.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Start Integration
                <Code className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
                <FileCode className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "API Integration",
                description: "RESTful and GraphQL APIs for seamless integration with your existing systems.",
                icon: <Braces className="w-6 h-6 text-primary" />
              },
              {
                title: "SDK Support",
                description: "Comprehensive SDKs in multiple languages for rapid development.",
                icon: <Code className="w-6 h-6 text-primary" />
              },
              {
                title: "Real-time Data Streams",
                description: "WebSocket and MQTT support for real-time data processing.",
                icon: <Zap className="w-6 h-6 text-primary" />
              },
              {
                title: "Middleware Solutions",
                description: "Custom middleware for complex integration scenarios.",
                icon: <Layers className="w-6 h-6 text-primary" />
              },
              {
                title: "Security Framework",
                description: "Enterprise-grade security with encryption and access controls.",
                icon: <Shield className="w-6 h-6 text-primary" />
              },
              {
                title: "Data Pipeline",
                description: "Scalable data processing pipeline for autonomous operations.",
                icon: <Database className="w-6 h-6 text-primary" />
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

      {/* Integration Stack */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Integration Stack</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive integration capabilities across all layers of autonomous vehicle operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Perception Layer",
                description: "Integration with sensor fusion and perception systems",
                features: [
                  "Camera data processing",
                  "LiDAR integration",
                  "Radar system support",
                  "Sensor fusion optimization"
                ],
                icon: <Binary className="w-6 h-6 text-primary" />
              },
              {
                title: "Planning Layer",
                description: "Support for path planning and decision making",
                features: [
                  "Route planning algorithms",
                  "Behavior prediction",
                  "Decision making systems",
                  "Motion planning"
                ],
                icon: <GitBranch className="w-6 h-6 text-primary" />
              },
              {
                title: "Control Layer",
                description: "Vehicle control system integration",
                features: [
                  "Drive-by-wire interface",
                  "Control algorithms",
                  "Safety systems",
                  "Emergency protocols"
                ],
                icon: <Box className="w-6 h-6 text-primary" />
              },
              {
                title: "Infrastructure Layer",
                description: "Cloud and edge computing infrastructure",
                features: [
                  "Edge computing support",
                  "Cloud infrastructure",
                  "Data storage solutions",
                  "Network optimization"
                ],
                icon: <Network className="w-6 h-6 text-primary" />
              }
            ].map((stack, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  {stack.icon}
                  <h3 className="text-lg font-semibold">{stack.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{stack.description}</p>
                <ul className="space-y-2">
                  {stack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Tools */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Developer Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive development tools and resources for seamless integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "API Console",
                description: "Interactive API testing environment with real-time response validation.",
                icon: <Terminal className="w-6 h-6 text-primary" />
              },
              {
                title: "Integration Hub",
                description: "Central hub for managing all your integrations and configurations.",
                icon: <Puzzle className="w-6 h-6 text-primary" />
              },
              {
                title: "Webhook Manager",
                description: "Configure and manage webhooks for event-driven architectures.",
                icon: <Webhook className="w-6 h-6 text-primary" />
              }
            ].map((tool, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <Button variant="outline" size="sm">
                  Explore
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
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start integrating your autonomous driving stack with our platform today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Get API Key
              <Key className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Support
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 