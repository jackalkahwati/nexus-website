'use client'

import { useState } from 'react'

interface SystemComponent {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: string
  latency?: string
}

interface Incident {
  date: string
  title: string
  status: 'resolved' | 'monitoring' | 'investigating'
  description: string
  updates: {
    time: string
    message: string
    status: 'resolved' | 'monitoring' | 'investigating'
  }[]
}

export default function StatusPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')

  const systemComponents: SystemComponent[] = [
    {
      name: "Fleet Management API",
      status: "operational",
      uptime: "99.99%",
      latency: "45ms"
    },
    {
      name: "Real-time Telemetry",
      status: "operational",
      uptime: "99.98%",
      latency: "12ms"
    },
    {
      name: "Authentication Services",
      status: "operational",
      uptime: "100%",
      latency: "89ms"
    },
    {
      name: "Analytics Pipeline",
      status: "operational",
      uptime: "99.95%"
    },
    {
      name: "Edge Computing Network",
      status: "operational",
      uptime: "99.97%",
      latency: "8ms"
    },
    {
      name: "Database Clusters",
      status: "operational",
      uptime: "99.99%",
      latency: "3ms"
    }
  ]

  const incidents: Incident[] = [
    {
      date: "2024-02-20",
      title: "Analytics Pipeline Latency",
      status: "resolved",
      description: "Increased latency in analytics processing pipeline",
      updates: [
        {
          time: "15:45 UTC",
          status: "resolved",
          message: "Issue resolved - Pipeline performance restored to normal levels"
        },
        {
          time: "15:30 UTC",
          status: "monitoring",
          message: "Optimization applied - Monitoring performance improvements"
        },
        {
          time: "15:00 UTC",
          status: "investigating",
          message: "Investigating increased latency in analytics pipeline"
        }
      ]
    },
    {
      date: "2024-02-18",
      title: "API Rate Limiting Issue",
      status: "resolved",
      description: "Intermittent API rate limiting errors for some users",
      updates: [
        {
          time: "10:30 UTC",
          status: "resolved",
          message: "Rate limiting configuration updated and verified"
        },
        {
          time: "10:15 UTC",
          status: "monitoring",
          message: "Fix deployed - Monitoring API responses"
        },
        {
          time: "10:00 UTC",
          status: "investigating",
          message: "Investigating reports of rate limiting errors"
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'outage':
        return 'bg-red-500'
      case 'resolved':
        return 'text-green-400'
      case 'monitoring':
        return 'text-yellow-400'
      case 'investigating':
        return 'text-blue-400'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            System Status
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time status of Lattis - Nexus services and infrastructure.
            All times are displayed in UTC.
          </p>
        </div>

        {/* Current Status */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-2xl font-bold">All Systems Operational</span>
              </div>
              <div className="text-gray-400">
                Updated: {new Date().toUTCString()}
              </div>
            </div>

            {/* System Components */}
            <div className="space-y-4">
              {systemComponents.map((component, index) => (
                <div key={index} className="bg-gray-900/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
                    <span className="font-medium">{component.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {component.latency && (
                      <span className="text-sm text-gray-400">
                        Latency: {component.latency}
                      </span>
                    )}
                    <span className="text-sm text-gray-400">
                      Uptime: {component.uptime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 border-b border-gray-800">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'current'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Incidents
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'history'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Incident History
            </button>
          </div>
        </div>

        {/* Incidents */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-gray-800/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{incident.title}</h3>
                    <p className="text-gray-400 text-sm">{incident.description}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {incident.date}
                  </div>
                </div>
                <div className="space-y-4">
                  {incident.updates.map((update, i) => (
                    <div key={i} className="bg-gray-900/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${getStatusColor(update.status)}`}>
                          {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-400">{update.time}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Updates</h2>
            <p className="text-gray-300 mb-6">
              Get notified about system status changes and incidents.
            </p>
            <div className="flex gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100 w-64"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
