'use client'

import { ArrowRight, Book, Check, Code, Copy, FileCode, GitBranch, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function ExamplesPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const examples = [
    {
      title: "Fleet Management",
      description: "Basic fleet management operations",
      code: {
        python: `from lattis_nexus import Client

# Initialize client
client = Client(api_key='your_api_key')

# Get all vehicles
vehicles = client.fleet.get_vehicles()

# Filter active vehicles
active_vehicles = [v for v in vehicles if v.status == 'active']

# Get vehicle telemetry
for vehicle in active_vehicles:
    telemetry = client.telemetry.get_latest(vehicle.id)
    print(f"Vehicle {vehicle.id}:")
    print(f"  Location: {telemetry.location}")
    print(f"  Battery: {telemetry.battery}%")
    print(f"  Status: {telemetry.status}")`,
        javascript: `import { LattisNexusClient } from '@lattis-nexus/sdk';

// Initialize client
const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Get all vehicles
const vehicles = await client.fleet.getVehicles();

// Filter active vehicles
const activeVehicles = vehicles.filter(v => v.status === 'active');

// Get vehicle telemetry
for (const vehicle of activeVehicles) {
  const telemetry = await client.telemetry.getLatest(vehicle.id);
  console.log('Vehicle', vehicle.id);
  console.log('  Location:', telemetry.location);
  console.log('  Battery:', telemetry.battery + '%');
  console.log('  Status:', telemetry.status);
}`
      }
    },
    {
      title: "Real-time Updates",
      description: "Subscribe to real-time vehicle updates",
      code: {
        python: `from lattis_nexus import Client

client = Client(api_key='your_api_key')

# Define event handler
async def handle_telemetry(data):
    vehicle_id = data['vehicle_id']
    location = data['location']
    print(f"Vehicle {vehicle_id} location update:")
    print(f"  Lat: {location['lat']}")
    print(f"  Lng: {location['lng']}")

# Subscribe to updates
await client.stream.subscribe(
    'vehicle_telemetry',
    callback=handle_telemetry,
    vehicle_ids=['v123', 'v124'],
    events=['location_update']
)

# Start streaming
await client.stream.connect()`,
        javascript: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Subscribe to updates
client.stream.subscribe('vehicle_telemetry', {
  vehicleIds: ['v123', 'v124'],
  events: ['location_update']
}, (data) => {
  const { vehicleId, location } = data;
  console.log('Vehicle', vehicleId, 'location update:');
  console.log('  Lat:', location.lat);
  console.log('  Lng:', location.lng);
});

// Handle connection events
client.stream.on('connected', () => {
  console.log('Connected to stream');
});

client.stream.on('error', (error) => {
  console.error('Stream error:', error);
});

// Start streaming
client.stream.connect();`
      }
    },
    {
      title: "Data Processing",
      description: "Process and analyze vehicle data",
      code: {
        python: `from lattis_nexus import Client
from datetime import datetime, timedelta

client = Client(api_key='your_api_key')

# Get historical data
end_time = datetime.utcnow()
start_time = end_time - timedelta(hours=24)

# Get vehicle metrics
metrics = client.analytics.get_metrics(
    vehicle_id='v123',
    start_time=start_time,
    end_time=end_time,
    metrics=['speed', 'battery', 'distance']
)

# Calculate averages
avg_speed = sum(m.speed for m in metrics) / len(metrics)
avg_battery = sum(m.battery for m in metrics) / len(metrics)
total_distance = sum(m.distance for m in metrics)

print(f"24-hour Statistics:")
print(f"  Average Speed: {avg_speed:.1f} km/h")
print(f"  Average Battery: {avg_battery:.1f}%")
print(f"  Total Distance: {total_distance:.1f} km")`,
        javascript: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Get historical data
const endTime = new Date();
const startTime = new Date(endTime - 24 * 60 * 60 * 1000);

// Get vehicle metrics
const metrics = await client.analytics.getMetrics({
  vehicleId: 'v123',
  startTime,
  endTime,
  metrics: ['speed', 'battery', 'distance']
});

// Calculate averages
const avgSpeed = metrics.reduce((sum, m) => sum + m.speed, 0) / metrics.length;
const avgBattery = metrics.reduce((sum, m) => sum + m.battery, 0) / metrics.length;
const totalDistance = metrics.reduce((sum, m) => sum + m.distance, 0);

console.log('24-hour Statistics:');
console.log('  Average Speed:', avgSpeed.toFixed(1), 'km/h');
console.log('  Average Battery:', avgBattery.toFixed(1), '%');
console.log('  Total Distance:', totalDistance.toFixed(1), 'km');`
      }
    }
  ]

  const repositories = [
    {
      name: "Fleet Management Demo",
      description: "Complete fleet management application example",
      language: "Python",
      url: "https://github.com/lattis-nexus/fleet-management-demo"
    },
    {
      name: "Real-time Dashboard",
      description: "Real-time vehicle monitoring dashboard",
      language: "JavaScript",
      url: "https://github.com/lattis-nexus/realtime-dashboard"
    },
    {
      name: "Data Analytics",
      description: "Vehicle data analysis and visualization",
      language: "Python",
      url: "https://github.com/lattis-nexus/data-analytics"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Code Examples
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn from practical examples and sample code.
            Explore common use cases and integration patterns.
          </p>
        </div>

        {/* Example Categories */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="space-y-12">
            {examples.map((example, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4">{example.title}</h2>
                <p className="text-gray-400 mb-6">{example.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(example.code).map(([language, code], codeIndex) => (
                    <div key={codeIndex} className="bg-gray-900/50 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          <span className="font-medium">{language}</span>
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
                      <pre className="p-6 text-sm text-gray-300 overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Projects */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Sample Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {repositories.map((repo, index) => (
              <Link
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-400">{repo.language}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{repo.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 