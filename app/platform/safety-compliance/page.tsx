"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileCheck,
  FileText,
  Globe,
  History,
  LineChart,
  Lock,
  ScrollText,
  Settings,
  Shield,
  Terminal,
  Users,
  Verified,
  Zap
} from 'lucide-react'

export default function SafetyCompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200/90 to-gray-400/90">
              Safety & Compliance Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive safety protocols and regulatory compliance management for autonomous vehicle operations.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                View Compliance Dashboard
                <Shield className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Safety Documentation
                <FileText className="ml-2 h-4 w-4" />
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
                title: "Regulatory Compliance",
                description: "Automated compliance monitoring and reporting for global regulatory requirements.",
                icon: <ClipboardCheck className="w-6 h-6 text-primary" />
              },
              {
                title: "Safety Protocols",
                description: "Comprehensive safety management systems and emergency response protocols.",
                icon: <Shield className="w-6 h-6 text-primary" />
              },
              {
                title: "Audit Management",
                description: "Streamlined audit processes with automated documentation and tracking.",
                icon: <FileCheck className="w-6 h-6 text-primary" />
              },
              {
                title: "Risk Assessment",
                description: "Advanced risk analysis and mitigation strategies for autonomous operations.",
                icon: <AlertCircle className="w-6 h-6 text-primary" />
              },
              {
                title: "Documentation Control",
                description: "Centralized management of safety and compliance documentation.",
                icon: <ScrollText className="w-6 h-6 text-primary" />
              },
              {
                title: "Training Management",
                description: "Comprehensive training tracking and certification management system.",
                icon: <BookOpen className="w-6 h-6 text-primary" />
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

      {/* Compliance Dashboard */}
      <div className="py-24 px-6 bg-gradient-to-b from-background/95 to-background border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compliance Status Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring of safety metrics and compliance status across your operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Compliance Score",
                value: "98%",
                status: "Excellent",
                icon: <Verified className="w-4 h-4" />
              },
              {
                title: "Safety Incidents",
                value: "0",
                status: "Last 30 Days",
                icon: <Shield className="w-4 h-4" />
              },
              {
                title: "Pending Audits",
                value: "2",
                status: "Scheduled",
                icon: <ClipboardCheck className="w-4 h-4" />
              },
              {
                title: "Documentation",
                value: "100%",
                status: "Up to Date",
                icon: <FileText className="w-4 h-4" />
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

      {/* Compliance Tools */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compliance Management Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing safety protocols and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Automated Compliance",
                description: "Automated compliance monitoring and reporting system.",
                features: [
                  "Real-time compliance tracking",
                  "Automated reporting",
                  "Regulatory updates",
                  "Compliance analytics"
                ],
                icon: <Settings className="w-6 h-6 text-primary" />
              },
              {
                title: "Safety Management",
                description: "Comprehensive safety protocol management system.",
                features: [
                  "Incident reporting",
                  "Safety assessments",
                  "Emergency protocols",
                  "Safety analytics"
                ],
                icon: <Shield className="w-6 h-6 text-primary" />
              },
              {
                title: "Audit Management",
                description: "Streamlined audit and documentation management.",
                features: [
                  "Audit scheduling",
                  "Documentation control",
                  "Corrective actions",
                  "Audit history"
                ],
                icon: <History className="w-6 h-6 text-primary" />
              }
            ].map((tool, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  {tool.icon}
                  <h3 className="text-lg font-semibold">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <ul className="space-y-2">
                  {tool.features.map((feature, featureIndex) => (
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

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ensure Compliance and Safety</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take control of your safety and compliance requirements with our comprehensive management platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Schedule Demo
              <Globe className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Expert
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 