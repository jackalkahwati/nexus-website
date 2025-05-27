'use client'

import { ArrowRight, Book, Check, Code, Copy, FileText, GitBranch, Lock, Server, Terminal, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function ApiReferencePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const endpoints = [
    {
      category: "Fleet Management",
      description: "Manage your vehicle fleet",
      endpoints: [
        {
          method: "GET",
          path: "/v2/fleet/vehicles",
          description: "List all vehicles in the fleet",
          parameters: [
            { name: "status", type: "string", description: "Filter by vehicle status" },
            { name: "limit", type: "number", description: "Maximum number of results" },
            { name: "offset", type: "number", description: "Pagination offset" }
          ],
          response: `{
  "vehicles": [
    {
      "id": "v123",
      "status": "active",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194
      },
      "battery": 85,
      "lastUpdate": "2024-01-15T08:30:00Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}`
        },
        {
          method: "POST",
          path: "/v2/fleet/vehicles",
          description: "Add a new vehicle to the fleet",
          parameters: [
            { name: "vehicleId", type: "string", description: "Unique vehicle identifier" },
            { name: "type", type: "string", description: "Vehicle type" },
            { name: "configuration", type: "object", description: "Vehicle configuration" }
          ],
          request: `{
  "vehicleId": "v123",
  "type": "autonomous_car",
  "configuration": {
    "sensors": ["lidar", "camera"],
    "capacity": 4,
    "autonomyLevel": 4
  }
}`,
          response: `{
  "id": "v123",
  "status": "registered",
  "createdAt": "2024-01-15T08:30:00Z"
}`
        }
      ]
    },
    {
      category: "Telemetry",
      description: "Real-time vehicle telemetry data",
      endpoints: [
        {
          method: "GET",
          path: "/v2/telemetry/{vehicleId}",
          description: "Get latest telemetry for a vehicle",
          parameters: [
            { name: "vehicleId", type: "string", description: "Vehicle identifier" },
            { name: "fields", type: "string", description: "Comma-separated list of fields" }
          ],
          response: `{
  "vehicleId": "v123",
  "timestamp": "2024-01-15T08:30:00Z",
  "data": {
    "speed": 25.5,
    "heading": 180,
    "battery": 85,
    "temperature": 72
  }
}`
        },
        {
          method: "POST",
          path: "/v2/telemetry/{vehicleId}/stream",
          description: "Subscribe to real-time telemetry stream",
          parameters: [
            { name: "vehicleId", type: "string", description: "Vehicle identifier" },
            { name: "events", type: "array", description: "List of event types to subscribe to" }
          ],
          request: `{
  "events": ["location", "battery", "diagnostics"],
  "interval": 1000
}`,
          response: `{
  "streamId": "stream_123",
  "status": "connected",
  "subscriptions": ["location", "battery", "diagnostics"]
}`
        }
      ]
    }
  ]

  const authExamples = [
    {
      language: "cURL",
      code: `curl -X GET "https://api.lattis-nexus.com/v2/fleet/vehicles" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json"`
    },
    {
      language: "Python",
      code: `from lattis_nexus import Client

client = Client(api_key='your_api_key')
vehicles = client.fleet.get_vehicles()`
    },
    {
      language: "JavaScript",
      code: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

const vehicles = await client.fleet.getVehicles();`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            API Reference
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete documentation for the Lattis - Nexus API.
            Build powerful integrations with our platform using our well-documented endpoints.
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Authentication",
                description: "API authentication guide",
                icon: Lock,
                link: "/docs/authentication-setup"
              },
              {
                title: "SDKs",
                description: "Official client libraries",
                icon: Terminal,
                link: "/docs/sdk-libraries"
              },
              {
                title: "Examples",
                description: "Code examples and demos",
                icon: GitBranch,
                link: "/docs/examples"
              }
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Authentication</h2>
          <div className="bg-gray-800/30 rounded-xl p-8">
            <p className="text-gray-300 mb-6">
              All API requests require authentication using API keys. Include your API key
              in the Authorization header of each request.
            </p>
            <div className="space-y-6">
              {authExamples.map((example, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium">{example.language}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.code, index)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Endpoints</h2>
          <div className="space-y-8">
            {endpoints.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-800/30 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-2">{category.category}</h3>
                <p className="text-gray-400 mb-6">{category.description}</p>
                <div className="space-y-6">
                  {category.endpoints.map((endpoint, endpointIndex) => (
                    <div key={endpointIndex} className="border-t border-gray-700 pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                          endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {endpoint.method}
                        </div>
                        <div>
                          <div className="font-mono text-gray-300">{endpoint.path}</div>
                          <p className="text-gray-400 mt-1">{endpoint.description}</p>
                        </div>
                      </div>

                      {endpoint.parameters && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Parameters</h4>
                          <div className="bg-gray-900/50 rounded-lg p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-400">
                                  <th className="pb-2">Name</th>
                                  <th className="pb-2">Type</th>
                                  <th className="pb-2">Description</th>
                                </tr>
                              </thead>
                              <tbody className="text-gray-300">
                                {endpoint.parameters.map((param, paramIndex) => (
                                  <tr key={paramIndex}>
                                    <td className="py-1 font-mono">{param.name}</td>
                                    <td className="py-1 text-cyan-400">{param.type}</td>
                                    <td className="py-1">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {endpoint.request && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Request Body</h4>
                          <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                              <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-medium">JSON</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(endpoint.request, categoryIndex * 100 + endpointIndex)}
                                className="text-gray-400 hover:text-white"
                              >
                                {copiedIndex === categoryIndex * 100 + endpointIndex ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                              <code>{endpoint.request}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Response</h4>
                        <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm font-medium">JSON</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.response, categoryIndex * 1000 + endpointIndex)}
                              className="text-gray-400 hover:text-white"
                            >
                              {copiedIndex === categoryIndex * 1000 + endpointIndex ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 