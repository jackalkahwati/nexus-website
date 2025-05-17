import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Code2,
  ChevronRight,
  Activity,
  Cpu,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Terminal,
  GitBranch,
  Shield,
  Layers,
  Network,
  Database,
  Settings,
  Download,
  Upload
} from 'lucide-react'

export default function SoftwareIntegrationPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter']">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Solutions</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Software Stack Integration</h1>
          <p className="text-xl text-gray-400 mb-8">
            Seamlessly integrate and manage multiple autonomous driving software stacks with unified monitoring, deployment, and analytics.
          </p>
          <div className="flex space-x-4">
            <Link href="https://calendly.com/jackalkahwati">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
                Schedule Demo
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs/solutions/software-integration">
              <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
                Documentation
              </Button>
            </Link>
          </div>
          <div className="flex space-x-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Code2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Multi-Stack Support</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Dashboard */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-800/50">
          <h2 className="text-2xl font-bold mb-8">AV Software Integration Hub</h2>
          <div className="grid grid-cols-4 gap-6">
            {/* Stack Status */}
            <div className="space-y-6">
              {[
                { label: 'Active Stacks', value: '4/4', icon: <Cpu className="w-5 h-5 text-blue-400" /> },
                { label: 'System Health', value: 'Optimal', icon: <Activity className="w-5 h-5 text-green-400" /> },
                { label: 'Updates Available', value: '2', icon: <RefreshCw className="w-5 h-5 text-yellow-400" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    {stat.icon}
                    <div className="text-2xl font-semibold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Integration Status */}
            <div className="col-span-2 bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">AV Stack Status</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-400">Update Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-400">Issue</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Mobileye Drive™', version: 'v2.4.1', status: 'active', health: '100%', updates: true },
                  { name: 'Aurora Driver', version: 'v3.2.0', status: 'active', health: '99%', updates: false },
                  { name: 'Waymo Driver', version: 'v5.1.2', status: 'active', health: '100%', updates: true },
                  { name: 'Custom Stack', version: 'v1.0.3', status: 'active', health: '98%', updates: false }
                ].map((stack, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        stack.health === '100%' ? 'bg-green-500' :
                        parseInt(stack.health) > 95 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="font-medium">{stack.name}</div>
                        <div className="text-sm text-gray-400">Version {stack.version}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{stack.health}</span>
                      </div>
                      {stack.updates && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-sm">Update</span>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="border-gray-700">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Metrics */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <h3 className="text-sm font-semibold mb-4">System Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'API Latency', value: '24ms', trend: '-3ms' },
                    { label: 'Integration Success', value: '99.8%', trend: '+0.2%' },
                    { label: 'Error Rate', value: '0.02%', trend: '-0.01%' }
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">{metric.value}</span>
                          <span className={metric.trend.startsWith('-') ? 'text-green-400' : 'text-red-400'}>
                            {metric.trend}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: parseFloat(metric.value) + '%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12">Integration Capabilities</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                AV Software Compatibility
              </h3>
              <ul className="space-y-3">
                {[
                  "Universal API integration layer",
                  "Multi-stack support & monitoring",
                  "Real-time performance tracking",
                  "Custom stack integration",
                  "Version control & rollback"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                Deployment & Updates
              </h3>
              <ul className="space-y-3">
                {[
                  "Over-the-air (OTA) updates",
                  "Staged rollout management",
                  "Automatic version control",
                  "Rollback capabilities",
                  "Update impact analysis"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Centralized Logging
              </h3>
              <ul className="space-y-3">
                {[
                  "Unified log aggregation",
                  "Real-time error tracking",
                  "Performance analytics",
                  "Custom alert configuration",
                  "Historical data analysis"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Security & Compliance
              </h3>
              <ul className="space-y-3">
                {[
                  "End-to-end encryption",
                  "Access control management",
                  "Audit logging",
                  "Compliance reporting",
                  "Security monitoring"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Unify Your AV Software Stack?</h2>
        <p className="text-gray-400 text-lg mb-8">
          See how Lattis - Nexus can help you integrate and manage multiple autonomous driving platforms.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="https://calendly.com/jackalkahwati">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
              Get Started
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