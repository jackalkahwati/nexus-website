"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Car, 
  Bell, 
  Settings,
  Clock,
  Map,
  Wrench,
  Smartphone,
  Cloud,
  CheckCircle2,
  Building2,
  ArrowUpRight
} from 'lucide-react'
import { SiteHeader } from '@/components/ui/site-header'
import { Footer } from '@/components/ui/footer'
import { Badge } from '@/components/ui/badge'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section with Gradient */}
        <div className="relative h-screen">
          {/* Gradient Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-200% animate-gradient-x" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <Badge variant="secondary" className="mb-4">
              New: AI-Powered Fleet Intelligence
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to Lattis
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
              The next generation platform for smart mobility and fleet management
            </p>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" variant="default">
                  Try Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Vehicles" },
                { number: "99.9%", label: "Uptime" },
                { number: "50+", label: "Countries" },
                { number: "1M+", label: "Routes Optimized" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Fleet Management
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage and optimize your fleet operations in one platform
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground mb-4">
                  SOC 2 certified platform with end-to-end encryption and advanced access controls
                </p>
                <Link href="/features/security" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
              <Card className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Intelligence</h3>
                <p className="text-muted-foreground mb-4">
                  Live tracking, instant alerts, and predictive analytics for your entire fleet
                </p>
                <Link href="/features/tracking" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
              <Card className="p-6">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered insights, custom reports, and performance dashboards
                </p>
                <Link href="/features/analytics" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
              <Card className="p-6">
                <Map className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Route Optimization</h3>
                <p className="text-muted-foreground mb-4">
                  Smart routing algorithms that save time and reduce fuel consumption
                </p>
                <Link href="/features/routing" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
              <Card className="p-6">
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Maintenance Management</h3>
                <p className="text-muted-foreground mb-4">
                  Automated maintenance scheduling and predictive diagnostics
                </p>
                <Link href="/features/maintenance" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
              <Card className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground mb-4">
                  Role-based access, team chat, and collaborative tools
                </p>
                <Link href="/features/team" className="group flex items-center text-primary">
                  Learn more <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started with Lattis in three simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Car,
                  title: "Connect Your Fleet",
                  description: "Install our IoT devices or connect existing hardware"
                },
                {
                  icon: Cloud,
                  title: "Access Platform",
                  description: "Log in to your dashboard and customize settings"
                },
                {
                  icon: BarChart3,
                  title: "Monitor & Optimize",
                  description: "Track performance and implement improvements"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-2/3 w-1/3 h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Seamless Integrations
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with your existing tools and systems
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                "Salesforce",
                "SAP",
                "Oracle",
                "Workday",
                "ServiceNow",
                "Zendesk",
                "Microsoft",
                "Google"
              ].map((integration, index) => (
                <div key={index} className="bg-card hover:bg-muted transition-colors p-6 rounded-xl border border-border flex items-center justify-center">
                  <span className="text-lg font-medium">{integration}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how leading companies are transforming their fleet operations
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  company: "Global Logistics Co",
                  metric: "30% reduction in fuel costs",
                  description: "Optimized routes and improved driver behavior"
                },
                {
                  company: "City Transit Authority",
                  metric: "95% on-time performance",
                  description: "Real-time tracking and predictive maintenance"
                },
                {
                  company: "Express Delivery Inc",
                  metric: "2x faster deliveries",
                  description: "AI-powered route optimization and automation"
                }
              ].map((study, index) => (
                <Card key={index} className="p-6">
                  <div className="mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{study.company}</h3>
                  <p className="text-primary font-medium mb-2">{study.metric}</p>
                  <p className="text-muted-foreground mb-4">{study.description}</p>
                  <Link href="/case-studies" className="group flex items-center text-primary">
                    Read case study <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to transform your fleet management?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using Lattis to optimize their operations
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
