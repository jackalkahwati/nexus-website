'use client'

import { ArrowRight, Book, Check, Code, Copy, Download, FileCode, Github, Package, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function SdkLibrariesPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const sdks = [
    {
      language: "Python",
      version: "2.0.0",
      install: "pip install lattis-nexus",
      requirements: "Python 3.7+",
      features: [
        "Async/await support",
        "Type hints",
        "Automatic retries",
        "Rate limiting"
      ],
      example: `from lattis_nexus import Client

client = Client(api_key='your_api_key')

# Get fleet vehicles
vehicles = client.fleet.get_vehicles()

# Subscribe to real-time updates
async def handle_updates(data):
    print(f"Received update: {data}")

await client.stream.subscribe(
    'vehicle_telemetry',
    callback=handle_updates
)`
    },
    {
      language: "JavaScript",
      version: "2.0.0",
      install: "npm install @lattis-nexus/sdk",
      requirements: "Node.js 14+",
      features: [
        "Promise-based API",
        "TypeScript support",
        "Automatic reconnection",
        "Browser compatibility"
      ],
      example: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Get fleet vehicles
const vehicles = await client.fleet.getVehicles();

// Subscribe to real-time updates
client.stream.subscribe('vehicle_telemetry', (data) => {
  console.log('Received update:', data);
});`
    },
    {
      language: "Java",
      version: "2.0.0",
      install: `<dependency>
  <groupId>com.lattisnexus</groupId>
  <artifactId>sdk</artifactId>
  <version>2.0.0</version>
</dependency>`,
      requirements: "Java 11+",
      features: [
        "Fluent API design",
        "Reactive streams",
        "Connection pooling",
        "Configurable logging"
      ],
      example: `import com.lattisnexus.Client;
import com.lattisnexus.models.*;

Client client = new Client.Builder()
    .setApiKey("your_api_key")
    .build();

// Get fleet vehicles
List<Vehicle> vehicles = client.fleet().getVehicles();

// Subscribe to real-time updates
client.stream().subscribe("vehicle_telemetry",
    data -> System.out.println("Received update: " + data));`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            SDK Libraries
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Official client libraries for integrating with the Lattis - Nexus platform.
            Choose your preferred programming language and get started quickly.
          </p>
        </div>

        {/* SDK Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {sdks.map((sdk, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{sdk.language}</h3>
                    <p className="text-sm text-gray-400">v{sdk.version}</p>
                  </div>
                </div>

                {/* Installation */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Installation</h4>
                  <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">Install</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sdk.install, index)}
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
                      <code>{sdk.install}</code>
                    </pre>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Requirements</h4>
                  <p className="text-gray-400">{sdk.requirements}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Features</h4>
                  <ul className="space-y-2">
                    {sdk.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-gray-400">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example Usage */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Example Usage</h4>
                  <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">Example</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sdk.example, index + 100)}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedIndex === index + 100 ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                      <code>{sdk.example}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docs/api-reference"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">API Reference</h3>
              </div>
              <p className="text-gray-400">
                Complete API documentation and endpoint reference
              </p>
            </Link>
            <Link
              href="https://github.com/lattis-nexus"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Github className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">GitHub</h3>
              </div>
              <p className="text-gray-400">
                Source code, examples, and issue tracking
              </p>
            </Link>
            <Link
              href="/docs/examples"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Examples</h3>
              </div>
              <p className="text-gray-400">
                Sample projects and integration examples
              </p>
            </Link>
          </div>
        </div>

        {/* Downloads */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Downloads</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {sdks.map((sdk, index) => (
                <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{sdk.language} SDK</h3>
                      <p className="text-sm text-gray-400">v{sdk.version}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Download SDK
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 