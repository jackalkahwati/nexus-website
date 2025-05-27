'use client'

import { ArrowRight, Cpu, Database, Play, Radio, Settings, Terminal, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function WebSocketStreamsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const streamTypes = [
    {
      name: "Vehicle Telemetry",
      description: "Real-time vehicle sensor data and status updates",
      icon: Radio,
      events: [
        "location_update",
        "speed_reading",
        "battery_status",
        "sensor_data"
      ]
    },
    {
      name: "System Events",
      description: "Platform events and status notifications",
      icon: Zap,
      events: [
        "system_alert",
        "maintenance_required",
        "status_change",
        "error_notification"
      ]
    },
    {
      name: "Analytics",
      description: "Real-time analytics and metrics",
      icon: Cpu,
      events: [
        "performance_metrics",
        "usage_statistics",
        "trend_analysis",
        "anomaly_detection"
      ]
    }
  ]

  const codeExamples = [
    {
      language: "JavaScript",
      code: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Subscribe to vehicle telemetry stream
client.stream.subscribe('vehicle_telemetry', {
  vehicleId: 'v123',
  events: ['location_update', 'speed_reading']
}, (data) => {
  console.log('Received telemetry:', data);
});

// Handle connection events
client.stream.on('connected', () => {
  console.log('Connected to WebSocket');
});

client.stream.on('error', (error) => {
  console.error('WebSocket error:', error);
});`
    },
    {
      language: "Python",
      code: `from lattis_nexus import Client
import asyncio

client = Client(api_key='your_api_key')

async def handle_telemetry(data):
    print(f"Received telemetry: {data}")

async def main():
    # Subscribe to vehicle telemetry stream
    await client.stream.subscribe(
        'vehicle_telemetry',
        vehicle_id='v123',
        events=['location_update', 'speed_reading'],
        callback=handle_telemetry
    )

    # Handle connection events
    client.stream.on_connected(lambda: print("Connected to WebSocket"))
    client.stream.on_error(lambda e: print(f"WebSocket error: {e}"))

    await client.stream.connect()

asyncio.run(main())`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            WebSocket Streams
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time data streaming with WebSocket connections for live vehicle telemetry,
            system events, and analytics.
          </p>
        </div>

        {/* Stream Types */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Available Streams</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {streamTypes.map((stream, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <stream.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{stream.name}</h3>
                    <p className="text-sm text-gray-400">{stream.description}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Available Events</h4>
                  <ul className="space-y-2">
                    {stream.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="flex items-center gap-2 text-gray-400">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Implementation Guide</h2>
          <div className="space-y-8">
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
                    onClick={() => copyToClipboard(example.code, index)}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="p-6 text-gray-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Connection Management",
                description: "Implement proper reconnection logic with exponential backoff",
                icon: Radio,
              },
              {
                title: "Error Handling",
                description: "Handle connection errors and data parsing failures gracefully",
                icon: Settings,
              },
              {
                title: "Data Processing",
                description: "Process incoming data efficiently to prevent bottlenecks",
                icon: Cpu,
              },
              {
                title: "State Management",
                description: "Maintain proper state for subscribed streams and events",
                icon: Database,
              }
            ].map((practice, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <practice.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{practice.title}</h3>
                </div>
                <p className="text-gray-400">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Try it Live</h2>
            <p className="text-gray-300 mb-8">
              Experience real-time data streaming with our interactive WebSocket demo.
              Connect to a test stream and see live data in action.
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Launch Interactive Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 