import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Bus,
  Users,
  Clock,
  Map,
  BarChart3,
  ChevronRight,
  Settings,
  Activity,
  Route,
  LineChart,
  Navigation,
  Timer,
  Gauge,
  Shield,
  Wifi,
  Database
} from 'lucide-react'

export default function PublicTransitPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter']">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Solutions</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Public Transit Management</h1>
          <p className="text-xl text-gray-400 mb-8">
            Optimize public transportation with real-time fleet tracking, smart scheduling, and enhanced passenger experience.
          </p>
          <div className="flex space-x-4">
            <Link href="https://calendly.com/jackalkahwati">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
                Contact Sales
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs/solutions/public-transit">
              <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
                Documentation
              </Button>
            </Link>
          </div>
          <div className="flex space-x-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">96% On-Time Performance</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">4.8M Passengers/Day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dashboard */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-800/50">
          <h2 className="text-2xl font-bold mb-8">Transit Operations Center</h2>
          <div className="grid grid-cols-4 gap-6">
            {/* Real-time Stats */}
            <div className="col-span-4 grid grid-cols-4 gap-4 mb-6">
              {[
                { 
                  label: 'Active Vehicles',
                  value: '842',
                  trend: '98% fleet utilization',
                  icon: <Bus className="w-5 h-5" />
                },
                {
                  label: 'On-Time Rate',
                  value: '96.2%',
                  trend: '↑1.8% this month',
                  icon: <Clock className="w-5 h-5" />
                },
                {
                  label: 'Passenger Count',
                  value: '184K',
                  trend: 'Last 3 hours',
                  icon: <Users className="w-5 h-5" />
                },
                {
                  label: 'Service Rating',
                  value: '4.8',
                  trend: 'out of 5.0',
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

            {/* Live Fleet Map */}
            <div className="col-span-2 bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Live Fleet Distribution</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-400">Real-time Tracking</span>
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
                  {/* Vehicle Markers */}
                  {Array(12).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`
                      }}
                    >
                      <div className="relative">
                        <Bus className="w-4 h-4 text-blue-400" />
                        <div className="absolute -inset-2">
                          <div className="w-full h-full rounded-full border border-blue-400/20 animate-ping"></div>
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/90 rounded text-[10px] font-medium text-blue-400 whitespace-nowrap">
                          Route {Math.floor(Math.random() * 50) + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'On Schedule', count: '756 vehicles', color: 'bg-green-500' },
                  { label: 'Slight Delay', count: '64 vehicles', color: 'bg-yellow-500' },
                  { label: 'Major Delay', count: '22 vehicles', color: 'bg-red-500' }
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

            {/* Service Analytics */}
            <div className="col-span-2 bg-gray-900/50 rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Service Metrics</h3>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Avg Wait Time', value: '4.2m', trend: '↓18% vs target' },
                  { label: 'Passenger Load', value: '82%', trend: 'Optimal capacity' },
                  { label: 'Route Coverage', value: '98.4%', trend: 'Service area' },
                  { label: 'Fuel Efficiency', value: '+15%', trend: 'vs. baseline' }
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
                  { route: 'Express Line', onTime: '97%', passengers: '42K/day' },
                  { route: 'Downtown Loop', onTime: '94%', passengers: '86K/day' },
                  { route: 'Cross City', onTime: '92%', passengers: '124K/day' }
                ].map((route, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{route.route}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{route.onTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{route.passengers}</span>
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
                <Route className="w-5 h-5 text-blue-400" />
                Fleet Management
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time vehicle tracking and monitoring",
                  "Dynamic route optimization",
                  "Automated schedule adjustments",
                  "Predictive maintenance alerts",
                  "Driver performance analytics"
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
                <Wifi className="w-5 h-5 text-blue-400" />
                Passenger Experience
              </h3>
              <ul className="space-y-3">
                {[
                  "Mobile app with real-time arrivals",
                  "Digital ticketing integration",
                  "Passenger counting systems",
                  "On-board WiFi management",
                  "Automated announcements"
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
                Analytics & Planning
              </h3>
              <ul className="space-y-3">
                {[
                  "Demand prediction modeling",
                  "Service optimization analytics",
                  "Passenger flow analysis",
                  "Resource allocation planning",
                  "Performance reporting"
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
                Safety & Compliance
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time safety monitoring",
                  "Emergency response integration",
                  "Regulatory compliance tracking",
                  "Driver behavior analysis",
                  "Incident reporting system"
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
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Transit Operations?</h2>
        <p className="text-gray-400 text-lg mb-8">
          Schedule a demo to see how Lattis - Nexus can optimize your public transportation system.
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