import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Factory,
  Cog,
  Cpu,
  BarChart3,
  ChevronRight,
  Settings,
  Activity,
  LineChart,
  Gauge,
  AlertTriangle,
  Timer,
  Zap,
  Shield,
  Network,
  Database
} from 'lucide-react'

export default function IndustrialAutomationPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter']">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Solutions</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Industrial Automation</h1>
          <p className="text-xl text-gray-400 mb-8">
            Transform your manufacturing operations with advanced robotics control, predictive maintenance, and real-time process optimization.
          </p>
          <div className="flex space-x-4">
            <Link href="https://calendly.com/jackalkahwati">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
                Contact Sales
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs/solutions/industrial-automation">
              <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
                Documentation
              </Button>
            </Link>
          </div>
          <div className="flex space-x-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Gauge className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">99.99% Uptime</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">35% Efficiency Gain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dashboard */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-800/50">
          <h2 className="text-2xl font-bold mb-8">Production Control Center</h2>
          <div className="grid grid-cols-4 gap-6">
            {/* Real-time Stats */}
            <div className="col-span-4 grid grid-cols-4 gap-4 mb-6">
              {[
                { 
                  label: 'Active Production Lines',
                  value: '24',
                  trend: '98% efficiency',
                  icon: <Factory className="w-5 h-5" />
                },
                {
                  label: 'OEE Score',
                  value: '92.4%',
                  trend: '↑3.2% this month',
                  icon: <Gauge className="w-5 h-5" />
                },
                {
                  label: 'Active Robots',
                  value: '156',
                  trend: 'All systems nominal',
                  icon: <Cpu className="w-5 h-5" />
                },
                {
                  label: 'Quality Rate',
                  value: '99.8%',
                  trend: 'Within targets',
                  icon: <Activity className="w-5 h-5" />
                }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <div className="text-blue-400">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Process Monitoring */}
            <div className="col-span-2 bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Process Performance</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live Monitoring</span>
                </div>
              </div>
              <div className="relative h-[300px] bg-gray-950 rounded-lg overflow-hidden">
                <div className="absolute inset-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-8 gap-px opacity-10">
                    {Array(64).fill(0).map((_, i) => (
                      <div key={i} className="border-r border-b border-blue-500/20"></div>
                    ))}
                  </div>
                  {/* Process Indicators */}
                  {Array(6).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`
                      }}
                    >
                      <div className="relative">
                        <Cog className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                        <div className="absolute -inset-2">
                          <div className="w-full h-full rounded-full border border-blue-400/20 animate-ping"></div>
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/90 rounded text-[10px] font-medium text-blue-400 whitespace-nowrap">
                          Process {i + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'Optimal', count: '18 processes', color: 'bg-green-500' },
                  { label: 'Warning', count: '4 processes', color: 'bg-yellow-500' },
                  { label: 'Critical', count: '2 processes', color: 'bg-red-500' }
                ].map((status, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                    <div>
                      <div className="text-sm font-medium">{status.label}</div>
                      <div className="text-xs text-gray-400">{status.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Analytics */}
            <div className="col-span-2 bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Production Metrics</h3>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Cycle Time', value: '42s', trend: '↓8% improvement' },
                  { label: 'First Pass Yield', value: '98.2%', trend: 'Above target' },
                  { label: 'Energy Efficiency', value: '+24%', trend: 'vs. baseline' },
                  { label: 'Throughput', value: '842', trend: 'units/hour' }
                ].map((metric, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-xl font-bold mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-400">{metric.trend}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { line: 'Assembly A', efficiency: '96%', output: '320/hr' },
                  { line: 'Assembly B', efficiency: '94%', output: '285/hr' },
                  { line: 'Packaging', efficiency: '98%', output: '842/hr' }
                ].map((line, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{line.line}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{line.efficiency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{line.output}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">Technical Capabilities</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                Process Control
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time process monitoring and control",
                  "Advanced PID control algorithms",
                  "Multi-variable process optimization",
                  "Automated quality control systems",
                  "Predictive maintenance scheduling"
                ].map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Industrial IoT
              </h3>
              <ul className="space-y-3">
                {[
                  "Edge computing with 5G connectivity",
                  "Real-time sensor data processing",
                  "Distributed control architecture",
                  "OPC UA protocol support",
                  "Industrial ethernet integration"
                ].map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Data Analytics
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time production analytics",
                  "Machine learning for process optimization",
                  "Quality prediction models",
                  "Energy consumption analysis",
                  "Automated reporting systems"
                ].map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Security & Safety
              </h3>
              <ul className="space-y-3">
                {[
                  "IEC 62443 security compliance",
                  "Role-based access control",
                  "Encrypted data transmission",
                  "Safety system integration",
                  "Emergency shutdown protocols"
                ].map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Automate Your Industrial Operations?</h2>
        <p className="text-gray-400 text-lg mb-8">
          Schedule a demo to see how Lattis - Nexus can transform your manufacturing processes.
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