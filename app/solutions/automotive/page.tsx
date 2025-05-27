import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Car,
  Cpu,
  Network,
  BarChart3,
  ChevronRight,
  Settings,
  Activity,
  Database,
  LineChart,
  Navigation,
  Map,
  Gauge
} from 'lucide-react'

export default function AutomotivePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter']">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Solutions</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Automotive Solutions</h1>
          <p className="text-xl text-gray-400 mb-8">
            Empower your autonomous and connected vehicle fleets with advanced telemetry, predictive maintenance, and real-time analytics.
          </p>
          <div className="flex space-x-4">
            <Link href="https://calendly.com/jackalkahwati">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
                Contact Sales
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs/solutions/automotive">
              <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
                Documentation
              </Button>
            </Link>
          </div>
          <div className="flex space-x-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Car className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">ISO 26262 Certified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">ASIL-D Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Sections */}
      <div className="container mx-auto px-6 py-20 space-y-32">
        <section className="flex justify-between items-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">For OEMs</h2>
            <p className="text-gray-400">
              Comprehensive fleet management solutions for autonomous vehicle manufacturers and operators.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Real-time telemetry and diagnostics",
                "Predictive maintenance optimization",
                "Fleet-wide performance analytics",
                "Safety and compliance monitoring"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-lg aspect-video w-1/2 p-6 border border-gray-800/50">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                {[
                  { label: 'Active Vehicles', value: '1,247', icon: <Car className="w-4 h-4" /> },
                  { label: 'Total Distance', value: '2.5M km', icon: <Map className="w-4 h-4" /> },
                  { label: 'System Health', value: '99.99%', icon: <Activity className="w-4 h-4" /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-blue-400">{stat.icon}</div>
                      <span className="text-sm text-gray-400">{stat.label}</span>
                    </div>
                    <div className="text-xl font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Performance</span>
                  <Gauge className="w-4 h-4 text-blue-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Safety Score', value: '98%' },
                    { label: 'Efficiency', value: '94%' },
                    { label: 'Availability', value: '99.9%' }
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{metric.label}</span>
                        <span>{metric.value}</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: metric.value }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-20">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-4">Advanced Fleet Intelligence</h3>
            <p className="text-gray-400">
              Harness the power of real-time analytics and machine learning to optimize your autonomous fleet operations.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg aspect-video w-full p-6 border border-gray-800/50">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <h4 className="text-sm font-medium mb-3">Sensor Fusion</h4>
                <div className="space-y-3">
                  {[
                    { name: 'LiDAR', status: 'Active', latency: '8ms' },
                    { name: 'Cameras', status: 'Active', latency: '12ms' },
                    { name: 'Radar', status: 'Active', latency: '5ms' }
                  ].map((sensor, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{sensor.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-xs">{sensor.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Real-time Analytics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>
                <div className="h-[calc(100%-32px)] flex items-end gap-1">
                  {Array(48).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/20 rounded-t transition-all duration-500"
                      style={{ height: `${30 + Math.random() * 50}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-12">Key Capabilities</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-6 h-6 text-blue-400" />,
                title: "Edge Computing",
                description: "Process sensor data in real-time with our distributed edge computing architecture."
              },
              {
                icon: <Network className="w-6 h-6 text-blue-400" />,
                title: "Secure Connectivity",
                description: "End-to-end encrypted communication with redundant failover systems."
              },
              {
                icon: <Database className="w-6 h-6 text-blue-400" />,
                title: "Data Analytics",
                description: "Advanced analytics and machine learning for predictive insights."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Customer Stories */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">Customer Success</h2>
        <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-800/50">
          <div className="flex gap-8">
            <div className="flex-1">
              <p className="text-xl text-gray-400 mb-6">
                "Lattis - Nexus has transformed our autonomous fleet operations. The real-time insights and predictive maintenance capabilities have significantly improved our efficiency and safety metrics."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Sarah Chen</p>
                  <p className="text-gray-400">Director of Autonomous Operations, AutoTech Inc</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { metric: 'Efficiency Gain', value: '40%' },
                    { metric: 'Cost Reduction', value: '35%' },
                    { metric: 'Fleet Uptime', value: '99.9%' },
                    { metric: 'Safety Score', value: '98%' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fleet Operations?</h2>
        <p className="text-gray-400 text-lg mb-8">
          Schedule a demo to see how Lattis - Nexus can optimize your autonomous vehicle fleet.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="https://calendly.com/jackalkahwati">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
              Schedule Demo
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 