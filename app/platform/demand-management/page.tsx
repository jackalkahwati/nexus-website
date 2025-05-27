"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart3,
  Brain,
  Clock,
  Globe,
  LineChart,
  Map,
  Maximize2,
  Minimize2,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'

export default function DemandManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              AI-Powered Demand Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Optimize your autonomous fleet operations with advanced demand prediction and intelligent resource allocation powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Get Started
                <Zap className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
                <Globe className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Demand Prediction",
                description: "Leverage machine learning models to forecast demand patterns across your service area with exceptional accuracy.",
                icon: <Brain className="w-6 h-6 text-primary" />
              },
              {
                title: "Dynamic Fleet Optimization",
                description: "Automatically adjust fleet distribution based on predicted demand hotspots and historical patterns.",
                icon: <Map className="w-6 h-6 text-primary" />
              },
              {
                title: "Performance Analytics",
                description: "Track key metrics and optimize your fleet's performance with comprehensive analytics dashboards.",
                icon: <BarChart3 className="w-6 h-6 text-primary" />
              },
              {
                title: "Capacity Planning",
                description: "Plan fleet capacity efficiently with AI-driven insights and demand forecasting.",
                icon: <Target className="w-6 h-6 text-primary" />
              },
              {
                title: "Resource Utilization",
                description: "Maximize resource efficiency with intelligent allocation and scheduling algorithms.",
                icon: <TrendingUp className="w-6 h-6 text-primary" />
              },
              {
                title: "User Behavior Analysis",
                description: "Understand user patterns and preferences to optimize service delivery and coverage.",
                icon: <Users className="w-6 h-6 text-primary" />
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

      {/* Analytics Dashboard Preview */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Real-Time Analytics Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your fleet's performance and demand patterns in real-time with our comprehensive analytics dashboard.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Active Vehicles",
                value: "1,234",
                change: "+12%",
                icon: <Maximize2 className="w-4 h-4" />
              },
              {
                title: "Current Demand",
                value: "High",
                change: "+23%",
                icon: <TrendingUp className="w-4 h-4" />
              },
              {
                title: "Response Time",
                value: "1.8 min",
                change: "-8%",
                icon: <Clock className="w-4 h-4" />
              },
              {
                title: "Efficiency Score",
                value: "94%",
                change: "+5%",
                icon: <LineChart className="w-4 h-4" />
              }
            ].map((metric, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  {metric.icon}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Fleet?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started with our AI-powered demand management platform and transform your autonomous fleet operations.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Schedule Demo
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