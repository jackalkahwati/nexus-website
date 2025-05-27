'use client'

import { ArrowRight, Book, Check, Code, Copy, Cpu, Database, GitBranch, Network, Settings, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function EdgeComputingSdkPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const codeExamples = [
    {
      language: "Python",
      code: `from lattis_nexus.edge import EdgeNode, SensorStream

# Initialize edge node
node = EdgeNode(
    node_id='edge-001',
    api_key='your_api_key'
)

# Define sensor data processor
@node.processor('vehicle_telemetry')
async def process_telemetry(data):
    # Process raw sensor data
    processed_data = await node.ml.predict(data)
    
    # Send processed data to cloud
    await node.publish('processed_telemetry', processed_data)

# Start edge node
node.run()`
    },
    {
      language: "JavaScript",
      code: `import { EdgeNode, SensorStream } from '@lattis-nexus/edge-sdk';

// Initialize edge node
const node = new EdgeNode({
  nodeId: 'edge-001',
  apiKey: 'your_api_key'
});

// Define sensor data processor
node.processor('vehicle_telemetry', async (data) => {
  // Process raw sensor data
  const processedData = await node.ml.predict(data);
  
  // Send processed data to cloud
  await node.publish('processed_telemetry', processedData);
});

// Start edge node
node.run();`
    }
  ]

  const features = [
    {
      title: "Local Processing",
      description: "Process sensor data at the edge for reduced latency",
      icon: Cpu,
    },
    {
      title: "Data Streaming",
      description: "Real-time data streaming with automatic buffering",
      icon: Network,
    },
    {
      title: "ML Integration",
      description: "Deploy and run ML models at the edge",
      icon: Database,
    }
  ]

  const deploymentSteps = [
    {
      title: "Install SDK",
      description: "Install the Edge Computing SDK on your edge device",
      code: {
        npm: "npm install @lattis-nexus/edge-sdk",
        pip: "pip install lattis-nexus-edge"
      }
    },
    {
      title: "Configure Node",
      description: "Set up edge node configuration",
      code: {
        js: `const config = {
  nodeId: 'edge-001',
  apiKey: 'your_api_key',
  sensors: ['camera', 'lidar'],
  bufferSize: 1000
};`,
        python: `config = {
    'node_id': 'edge-001',
    'api_key': 'your_api_key',
    'sensors': ['camera', 'lidar'],
    'buffer_size': 1000
}`
      }
    },
    {
      title: "Define Processors",
      description: "Create data processing pipelines",
      code: {
        js: `node.processor('sensor_data', async (data) => {
  const processed = await processData(data);
  await node.publish('processed_data', processed);
});`,
        python: `@node.processor('sensor_data')
async def process_data(data):
    processed = await process_data(data)
    await node.publish('processed_data', processed)`
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Edge Computing SDK
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Process sensor data at the edge with our powerful Edge Computing SDK.
            Reduce latency and bandwidth usage while maintaining real-time performance.
          </p>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Deployment Guide</h2>
          <div className="space-y-8">
            {deploymentSteps.map((step, index) => (
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

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docs/edge-computing/architecture"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Architecture Guide</h3>
              </div>
              <p className="text-gray-400">
                Learn about the Edge Computing architecture and components
              </p>
            </Link>
            <Link
              href="https://github.com/lattis-nexus/edge-examples"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Example Projects</h3>
              </div>
              <p className="text-gray-400">
                Sample edge computing projects and templates
              </p>
            </Link>
            <Link
              href="/docs/edge-computing/configuration"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Configuration</h3>
              </div>
              <p className="text-gray-400">
                Advanced configuration options and optimization
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 