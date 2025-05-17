'use client'

import { ArrowRight, Book, Check, Code, Copy, Play, Send, Terminal, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function FirstApiRequestPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const codeExamples = [
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

# Get list of vehicles
vehicles = client.fleet.get_vehicles()

# Print vehicle details
for vehicle in vehicles:
    print(f"Vehicle ID: {vehicle.id}")
    print(f"Status: {vehicle.status}")
    print(f"Location: {vehicle.location}")`
    },
    {
      language: "JavaScript",
      code: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Get list of vehicles
const vehicles = await client.fleet.getVehicles();

// Print vehicle details
vehicles.forEach(vehicle => {
  console.log('Vehicle ID:', vehicle.id);
  console.log('Status:', vehicle.status);
  console.log('Location:', vehicle.location);
});`
    }
  ]

  const steps = [
    {
      title: "Install SDK",
      description: "Install the Lattis - Nexus SDK for your preferred programming language",
      code: {
        npm: "npm install @lattis-nexus/sdk",
        pip: "pip install lattis-nexus",
        maven: `<dependency>
  <groupId>com.lattisnexus</groupId>
  <artifactId>sdk</artifactId>
  <version>2.0.0</version>
</dependency>`
      }
    },
    {
      title: "Initialize Client",
      description: "Create a client instance with your API key",
      code: {
        js: `const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});`,
        python: `client = Client(api_key='your_api_key')`
      }
    },
    {
      title: "Make Request",
      description: "Send your first API request to get vehicle data",
      code: {
        js: `const vehicles = await client.fleet.getVehicles();`,
        python: `vehicles = client.fleet.get_vehicles()`
      }
    },
    {
      title: "Handle Response",
      description: "Process the API response data",
      code: {
        js: `vehicles.forEach(vehicle => {
  console.log('Vehicle ID:', vehicle.id);
});`,
        python: `for vehicle in vehicles:
    print(f"Vehicle ID: {vehicle.id}")`
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Your First API Request
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with the Lattis - Nexus API by making your first request.
            Follow this step-by-step guide to retrieve vehicle data from your fleet.
          </p>
        </div>

        {/* Prerequisites */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Prerequisites</h2>
          <div className="bg-gray-800/30 rounded-xl p-8">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>A Lattis - Nexus developer account</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Your API key (generated in the developer portal)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>A development environment with your preferred programming language</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Step-by-Step Guide</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(step.code).map(([lang, code], codeIndex) => (
                    <div key={codeIndex} className="bg-gray-900/50 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-medium">{lang}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code, index * 10 + codeIndex)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedIndex === index * 10 + codeIndex ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Examples */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Complete Examples</h2>
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{example.language}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, index + 100)}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedIndex === index + 100 ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <pre className="p-6 text-gray-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/docs/api-reference"
                className="bg-gray-900/30 rounded-xl p-6 hover:bg-gray-900/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Book className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">API Reference</h3>
                </div>
                <p className="text-gray-400">
                  Explore the complete API documentation and available endpoints
                </p>
              </Link>
              <Link
                href="/docs/websocket-streams"
                className="bg-gray-900/30 rounded-xl p-6 hover:bg-gray-900/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Real-time Data</h3>
                </div>
                <p className="text-gray-400">
                  Learn how to receive real-time updates using WebSocket streams
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Try it Live */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Try it Live</h2>
            <p className="text-gray-300 mb-8">
              Test your first API request in our interactive playground.
              No setup required - just click and send!
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Send className="w-4 h-4 mr-2" />
              Open API Playground
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 