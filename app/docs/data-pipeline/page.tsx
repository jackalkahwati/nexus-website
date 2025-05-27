'use client'

import { ArrowRight, Book, Check, Code, Copy, Database, FileCode, Filter, GitBranch, Network, Settings, Terminal, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function DataPipelinePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const pipelineTypes = [
    {
      title: "Real-time Processing",
      description: "Process data streams in real-time with low latency",
      icon: Network,
      features: [
        "Stream processing",
        "Event-driven architecture",
        "Real-time analytics",
        "Automatic scaling"
      ]
    },
    {
      title: "Batch Processing",
      description: "Process large datasets in scheduled batches",
      icon: Database,
      features: [
        "Data aggregation",
        "Historical analysis",
        "Scheduled jobs",
        "Resource optimization"
      ]
    },
    {
      title: "ETL Workflows",
      description: "Extract, transform, and load data across systems",
      icon: Workflow,
      features: [
        "Data transformation",
        "System integration",
        "Data validation",
        "Error handling"
      ]
    }
  ]

  const codeExamples = [
    {
      language: "Python",
      code: `from lattis_nexus.pipeline import Pipeline, DataStream

# Create pipeline
pipeline = Pipeline(name='vehicle_data_pipeline')

# Define data transformations
@pipeline.transform('raw_telemetry')
async def process_telemetry(data: DataStream):
    # Filter relevant data
    filtered = data.filter(lambda x: x.speed > 0)
    
    # Aggregate metrics
    metrics = filtered.window(minutes=5).aggregate([
        Metric.avg('speed'),
        Metric.max('acceleration'),
        Metric.count('events')
    ])
    
    # Output processed data
    await metrics.to_stream('processed_metrics')

# Deploy pipeline
pipeline.deploy()`
    },
    {
      language: "JavaScript",
      code: `import { Pipeline, DataStream } from '@lattis-nexus/pipeline';

// Create pipeline
const pipeline = new Pipeline({
  name: 'vehicle_data_pipeline'
});

// Define data transformations
pipeline.transform('raw_telemetry', async (data) => {
  // Filter relevant data
  const filtered = data.filter(x => x.speed > 0);
  
  // Aggregate metrics
  const metrics = filtered.window({ minutes: 5 }).aggregate([
    Metric.avg('speed'),
    Metric.max('acceleration'),
    Metric.count('events')
  ]);
  
  // Output processed data
  await metrics.toStream('processed_metrics');
});

// Deploy pipeline
pipeline.deploy();`
    }
  ]

  const configExamples = [
    {
      title: "Pipeline Configuration",
      description: "Configure pipeline settings and resources",
      code: {
        yaml: `name: vehicle_data_pipeline
version: '1.0'
resources:
  memory: '2Gi'
  cpu: '1'
input:
  stream: raw_telemetry
  format: json
  schema: telemetry.avsc
transforms:
  - name: filter_valid_data
    type: filter
    condition: "speed > 0"
  - name: calculate_metrics
    type: window
    size: 5m
    metrics:
      - avg: speed
      - max: acceleration
      - count: events
output:
  stream: processed_metrics
  format: json`
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Data Pipeline
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build scalable data processing pipelines for real-time and batch processing.
            Transform, analyze, and route your data with our powerful pipeline framework.
          </p>
        </div>

        {/* Pipeline Types */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Pipeline Types</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pipelineTypes.map((type, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{type.title}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-gray-400">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Implementation Examples</h2>
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
                <pre className="p-6 text-gray-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Configuration</h2>
          <div className="space-y-6">
            {configExamples.map((config, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-gray-800/50">
                  <div>
                    <h3 className="font-medium">{config.title}</h3>
                    <p className="text-sm text-gray-400">{config.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(Object.values(config.code)[0], index + 100)}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedIndex === index + 100 ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="p-6">
                  {Object.entries(config.code).map(([lang, code], codeIndex) => (
                    <div key={codeIndex} className="bg-gray-900/50 rounded-lg overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">{lang}</span>
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

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docs/pipeline/architecture"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Architecture Guide</h3>
              </div>
              <p className="text-gray-400">
                Learn about pipeline architecture and components
              </p>
            </Link>
            <Link
              href="/docs/pipeline/examples"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Example Pipelines</h3>
              </div>
              <p className="text-gray-400">
                Sample pipeline configurations and templates
              </p>
            </Link>
            <Link
              href="/docs/pipeline/monitoring"
              className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">Monitoring</h3>
              </div>
              <p className="text-gray-400">
                Pipeline monitoring and troubleshooting
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 