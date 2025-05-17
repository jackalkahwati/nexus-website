'use client'

import { ArrowRight, Settings, Sliders, Terminal, Code, Check, Copy, FileCode, Cog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function ConfigPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const configSections = [
    {
      title: "SDK Configuration",
      description: "Configure the Lattis - Nexus SDK",
      icon: Settings,
      options: [
        {
          name: "timeout",
          type: "number",
          default: "30000",
          description: "Request timeout in milliseconds"
        },
        {
          name: "retries",
          type: "number",
          default: "3",
          description: "Number of retry attempts"
        },
        {
          name: "baseUrl",
          type: "string",
          default: "https://api.lattis-nexus.com",
          description: "API base URL"
        },
        {
          name: "version",
          type: "string",
          default: "v2",
          description: "API version to use"
        }
      ]
    },
    {
      title: "Stream Configuration",
      description: "Configure real-time data streams",
      icon: Sliders,
      options: [
        {
          name: "bufferSize",
          type: "number",
          default: "1000",
          description: "Maximum number of events to buffer"
        },
        {
          name: "reconnectInterval",
          type: "number",
          default: "5000",
          description: "Reconnection interval in milliseconds"
        },
        {
          name: "maxReconnectAttempts",
          type: "number",
          default: "10",
          description: "Maximum reconnection attempts"
        },
        {
          name: "heartbeatInterval",
          type: "number",
          default: "30000",
          description: "WebSocket heartbeat interval"
        }
      ]
    }
  ]

  const configExamples = [
    {
      title: "Basic Configuration",
      description: "Simple SDK configuration example",
      code: {
        javascript: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key',
  timeout: 30000,
  retries: 3,
  baseUrl: 'https://api.lattis-nexus.com',
  version: 'v2'
});`,
        python: `from lattis_nexus import Client

client = Client(
    api_key='your_api_key',
    timeout=30000,
    retries=3,
    base_url='https://api.lattis-nexus.com',
    version='v2'
)`
      }
    },
    {
      title: "Stream Configuration",
      description: "WebSocket stream configuration",
      code: {
        javascript: `const streamConfig = {
  bufferSize: 1000,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000
};

client.stream.configure(streamConfig);
await client.stream.connect();`,
        python: `stream_config = {
    'buffer_size': 1000,
    'reconnect_interval': 5000,
    'max_reconnect_attempts': 10,
    'heartbeat_interval': 30000
}

client.stream.configure(stream_config)
await client.stream.connect()`
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Configuration
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn how to configure the Lattis - Nexus SDK and customize its behavior
            to match your requirements.
          </p>
        </div>

        {/* Configuration Options */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Configuration Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {configSections.map((section, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-cyan-400 mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-cyan-400">{option.name}</code>
                          <span className="text-sm text-gray-500">({option.type})</span>
                        </div>
                        <p className="text-sm text-gray-400">{option.description}</p>
                        <p className="text-sm text-gray-500">Default: {option.default}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Examples */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Configuration Examples</h2>
          <div className="space-y-8">
            {configExamples.map((example, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{example.title}</h3>
                    <p className="text-gray-400">{example.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(example.code).map(([language, code], codeIndex) => (
                    <div key={codeIndex} className="bg-gray-900/50 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-medium">{language}</span>
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

        {/* Environment Variables */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                <Cog className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Environment Variables</h2>
            </div>
            <p className="text-gray-300 mb-6">
              The SDK also supports configuration through environment variables.
              Environment variables take precedence over programmatic configuration.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-cyan-400">LATTIS_API_KEY</code>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <p className="text-sm text-gray-400">Your API key for authentication</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-cyan-400">LATTIS_API_URL</code>
                  <span className="text-sm text-gray-500">(optional)</span>
                </div>
                <p className="text-sm text-gray-400">Override the default API base URL</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-cyan-400">LATTIS_API_VERSION</code>
                  <span className="text-sm text-gray-500">(optional)</span>
                </div>
                <p className="text-sm text-gray-400">Override the default API version</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 