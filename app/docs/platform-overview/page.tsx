'use client'

import { ArrowRight, Box, Cloud, Cpu, Database, GitBranch, Globe, Network, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PlatformOverviewPage() {
  const features = [
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud-native architecture built for reliability",
      icon: Cloud,
    },
    {
      title: "Edge Computing",
      description: "Distributed processing at the network edge",
      icon: Cpu,
    },
    {
      title: "Real-time Data",
      description: "High-performance data streaming and processing",
      icon: Zap,
    },
    {
      title: "Global Network",
      description: "Worldwide distributed infrastructure",
      icon: Globe,
    },
    {
      title: "Security",
      description: "Enterprise-grade security and compliance",
      icon: Shield,
    },
    {
      title: "Integration",
      description: "Flexible APIs and integration options",
      icon: GitBranch,
    },
  ]

  const architectureComponents = [
    {
      title: "Data Collection Layer",
      description: "Ingests telemetry data from vehicles, sensors, and edge devices",
      icon: Box,
    },
    {
      title: "Processing Layer",
      description: "Real-time data processing and analytics engine",
      icon: Cpu,
    },
    {
      title: "Storage Layer",
      description: "Distributed data storage and management",
      icon: Database,
    },
    {
      title: "Network Layer",
      description: "Global connectivity and data transmission",
      icon: Network,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Platform Overview
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how Lattis - Nexus powers autonomous fleet operations with our comprehensive platform architecture.
          </p>
        </div>

        {/* Key Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Platform Architecture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {architectureComponents.map((component, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-cyan-400">
                    <component.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold">{component.title}</h3>
                </div>
                <p className="text-gray-300 mb-6">{component.description}</p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    High throughput data processing
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Scalable infrastructure
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Real-time analytics
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our documentation to learn more about integrating with the Lattis - Nexus platform
              and start building your autonomous fleet solution today.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/docs/authentication-setup"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Authentication Setup
              </Link>
              <Link
                href="/docs/first-api-request"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Make Your First API Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 