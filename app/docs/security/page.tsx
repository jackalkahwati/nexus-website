'use client'

import { ArrowRight, Lock, Shield, Key, FileCode, AlertTriangle, Check, Copy, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SecurityPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState('')

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let currentSection = ''
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentSection = section.id
        }
      })
      
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All data in transit is encrypted using TLS 1.3",
      icon: Lock,
      details: [
        "Strong cipher suites",
        "Perfect forward secrecy",
        "Certificate pinning",
        "Automatic certificate rotation"
      ]
    },
    {
      title: "Access Control",
      description: "Fine-grained access control and permissions",
      icon: Shield,
      details: [
        "Role-based access control",
        "Resource-level permissions",
        "API key scoping",
        "Audit logging"
      ]
    },
    {
      title: "API Security",
      description: "Secure API authentication and authorization",
      icon: Key,
      details: [
        "API key authentication",
        "JWT token support",
        "Rate limiting",
        "Request validation"
      ]
    }
  ]

  const bestPractices = [
    {
      title: "API Key Management",
      description: "Best practices for managing API keys",
      code: `# Store API keys in environment variables
export LATTIS_API_KEY=your_api_key

# Use environment variables in code
from lattis_nexus import Client
client = Client(api_key=os.environ['LATTIS_API_KEY'])`
    },
    {
      title: "Error Handling",
      description: "Secure error handling practices",
      code: `try:
    result = client.process_sensitive_data()
except Exception as e:
    # Log safely without exposing sensitive data
    log.error("Error processing data: %s", type(e).__name__)
    raise`
    },
    {
      title: "Data Validation",
      description: "Input validation and sanitization",
      code: `def process_vehicle_data(data):
    # Validate input data
    if not isinstance(data, dict):
        raise ValueError("Invalid data format")
        
    # Sanitize and validate fields
    vehicle_id = sanitize_input(data.get('vehicle_id'))
    if not is_valid_vehicle_id(vehicle_id):
        raise ValueError("Invalid vehicle ID")`
    }
  ]

  const tableOfContents = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Security Features' },
    { id: 'practices', label: 'Best Practices' },
    { id: 'checklist', label: 'Security Checklist' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Floating Table of Contents */}
      <div className="fixed right-8 top-24 w-64 hidden xl:block">
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-4">ON THIS PAGE</h4>
          <nav className="space-y-2">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-2 px-4 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Hero Section */}
        <section id="overview" className="relative mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl" />
          <div className="relative py-16 px-8 md:px-12">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Security
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Learn about our comprehensive security features and best practices for keeping your
              integration secure and compliant. Our platform is built with security-first principles
              to protect your data and ensure reliable operations.
            </p>
            <div className="mt-8 flex gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section id="features" className="mb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Security Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-gray-300">
                          <ArrowRight className="w-4 h-4 text-cyan-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="practices" className="mb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <FileCode className="w-8 h-8 text-cyan-400" />
              Security Best Practices
            </h2>
            <div className="space-y-8">
              {bestPractices.map((practice, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{practice.title}</h3>
                      <p className="text-gray-400">{practice.description}</p>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">Example</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(practice.code, index)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                      <code>{practice.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Checklist */}
        <section id="checklist">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/30 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Security Checklist</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Store API Keys Securely</h3>
                    <p className="text-gray-400">Never commit API keys to version control or expose them in client-side code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Implement Rate Limiting</h3>
                    <p className="text-gray-400">Use rate limiting in your applications to prevent abuse</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Validate All Input</h3>
                    <p className="text-gray-400">Implement proper input validation and sanitization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Monitor API Usage</h3>
                    <p className="text-gray-400">Regularly monitor API usage and set up alerts for suspicious activity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Keep Dependencies Updated</h3>
                    <p className="text-gray-400">Regularly update dependencies to patch security vulnerabilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 