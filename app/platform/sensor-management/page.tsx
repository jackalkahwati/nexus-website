"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Camera,
  ChevronRight,
  Cpu,
  Eye,
  FileText,
  Globe,
  Gauge,
  LineChart,
  Radio,
  Radar,
  Settings,
  Shield,
  Signal,
  Users,
  Zap
} from 'lucide-react'

export default function SensorManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              Advanced Sensor Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive sensor monitoring, calibration, and optimization platform for autonomous vehicle fleets.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Monitor Sensors
                <Activity className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Dashboard
                <BarChart3 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Types */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Camera Systems",
                description: "Advanced camera monitoring and calibration for visual perception systems.",
                icon: <Camera className="w-6 h-6 text-primary" />
              },
              {
                title: "LiDAR Arrays",
                description: "High-precision LiDAR sensor management and point cloud optimization.",
                icon: <Radar className="w-6 h-6 text-primary" />
              },
              {
                title: "Radar Systems",
                description: "Multi-range radar sensor configuration and performance monitoring.",
                icon: <Radio className="w-6 h-6 text-primary" />
              },
              {
                title: "GPS/IMU",
                description: "Precise positioning and inertial measurement unit calibration.",
                icon: <Globe className="w-6 h-6 text-primary" />
              },
              {
                title: "Ultrasonic Sensors",
                description: "Short-range detection and proximity sensor management.",
                icon: <Signal className="w-6 h-6 text-primary" />
              },
              {
                title: "Environmental Sensors",
                description: "Temperature, humidity, and environmental condition monitoring.",
                icon: <Gauge className="w-6 h-6 text-primary" />
              }
            ].map((sensor, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="mb-4">{sensor.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{sensor.title}</h3>
                <p className="text-sm text-muted-foreground">{sensor.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Monitoring Dashboard */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Real-Time Sensor Monitoring</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor and analyze sensor performance across your entire fleet in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Active Sensors",
                value: "1,248",
                status: "Operational",
                icon: <Activity className="w-4 h-4" />
              },
              {
                title: "Calibration Needed",
                value: "23",
                status: "Attention Required",
                icon: <Settings className="w-4 h-4" />
              },
              {
                title: "Data Quality",
                value: "98.7%",
                status: "Excellent",
                icon: <LineChart className="w-4 h-4" />
              },
              {
                title: "Sensor Alerts",
                value: "2",
                status: "Minor Issues",
                icon: <AlertCircle className="w-4 h-4" />
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

      {/* Management Features */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Management Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for sensor calibration, monitoring, and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Automated Calibration",
                description: "AI-powered sensor calibration with real-time adjustment capabilities.",
                features: [
                  "Auto-calibration scheduling",
                  "Multi-sensor alignment",
                  "Calibration verification",
                  "Historical tracking"
                ],
                icon: <Settings className="w-6 h-6 text-primary" />
              },
              {
                title: "Performance Analytics",
                description: "Detailed sensor performance analytics and optimization tools.",
                features: [
                  "Real-time monitoring",
                  "Performance trends",
                  "Anomaly detection",
                  "Quality metrics"
                ],
                icon: <BarChart3 className="w-6 h-6 text-primary" />
              },
              {
                title: "Health Monitoring",
                description: "Proactive sensor health monitoring and maintenance alerts.",
                features: [
                  "Health diagnostics",
                  "Predictive maintenance",
                  "Alert management",
                  "Issue resolution"
                ],
                icon: <Activity className="w-6 h-6 text-primary" />
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
          <h2 className="text-3xl font-bold mb-4">Optimize Your Sensor Performance</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take control of your sensor infrastructure with our comprehensive management platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Get Started
              <Zap className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
              <Eye className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 