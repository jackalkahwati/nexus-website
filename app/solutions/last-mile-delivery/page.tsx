import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Truck,
  Package,
  Map,
  Clock,
  BarChart3,
  ChevronRight,
  Activity,
  Cpu,
  LineChart,
  Timer,
  Navigation,
  Users,
  Box,
  Route
} from "lucide-react"

export default function LastMileDeliveryPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Hero Section */}
      <div className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-3xl -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Last-Mile Delivery Solutions</span>
          </div>
          <h1 className="text-5xl font-['Gilroy-Bold'] font-bold mb-6 bg-gradient-to-b from-white to-white/80 text-transparent bg-clip-text">
            Optimize Your Last-Mile<br />Delivery Operations
          </h1>
          <p className="text-gray-400 text-xl mb-10 max-w-3xl">
            Transform your delivery fleet with AI-powered route optimization, real-time tracking,
            and predictive analytics for maximum efficiency and customer satisfaction.
          </p>
          <div className="flex gap-4 mb-16">
            <Link href="https://calendly.com/jackalkahwati">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 group">
                Schedule Demo
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs/last-mile-solutions">
              <Button variant="outline" className="border-gray-700 text-white px-8 py-6 text-lg font-medium hover:bg-gray-800/50 transition-all duration-200">
                Technical Specs
              </Button>
            </Link>
          </div>

          {/* Live Stats Dashboard */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Deliveries', value: '2.4K+', icon: <Package className="w-5 h-5 text-blue-400" /> },
                { label: 'On-Time Rate', value: '98.5%', icon: <Clock className="w-5 h-5 text-blue-400" /> },
                { label: 'Route Efficiency', value: '+32%', icon: <Route className="w-5 h-5 text-blue-400" /> },
                { label: 'Customer Rating', value: '4.9/5', icon: <Users className="w-5 h-5 text-green-400" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    {stat.icon}
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>
            
            {/* Delivery Analytics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Delivery Performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live Tracking</span>
                  </div>
                </div>
                <div className="h-[200px] flex items-end gap-1">
                  {Array(48).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/20 rounded-t transition-all duration-500 hover:bg-blue-500/30"
                      style={{ 
                        height: `${70 + Math.random() * 25}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Box className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Delivery Status</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'In Transit', value: '842 packages' },
                      { label: 'Completed Today', value: '1,568' },
                      { label: 'Success Rate', value: '99.2%' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Time Metrics</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Avg Delivery Time', value: '-18%' },
                      { label: 'Route Duration', value: '-25%' },
                      { label: 'Stop Duration', value: '-22%' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium text-green-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-['Gilroy-Bold'] font-bold mb-12">Comprehensive Delivery Management</h2>
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Route className="w-6 h-6 text-blue-400" />,
                title: "Dynamic Route Optimization",
                description: "AI-powered route planning that adapts to real-time traffic and delivery conditions."
              },
              {
                icon: <Package className="w-6 h-6 text-blue-400" />,
                title: "Package Tracking",
                description: "Real-time visibility into package location and delivery status with predictive ETAs."
              },
              {
                icon: <Map className="w-6 h-6 text-blue-400" />,
                title: "Territory Management",
                description: "Optimize delivery zones and driver assignments for maximum efficiency."
              },
              {
                icon: <LineChart className="w-6 h-6 text-blue-400" />,
                title: "Performance Analytics",
                description: "Comprehensive insights into delivery metrics, costs, and driver performance."
              },
              {
                icon: <Users className="w-6 h-6 text-blue-400" />,
                title: "Customer Experience",
                description: "Real-time notifications and delivery updates for enhanced satisfaction."
              },
              {
                icon: <Cpu className="w-6 h-6 text-blue-400" />,
                title: "Predictive Intelligence",
                description: "ML models for demand forecasting and capacity planning."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-6 border border-gray-800/50 backdrop-blur-sm group hover:border-gray-700/50 transition-all duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="py-24 px-6 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-['Gilroy-Bold'] font-bold mb-12">Seamless Integration</h2>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Works with Your Existing Systems</h3>
              <p className="text-gray-400 mb-6">
                Our platform integrates with major delivery management systems and e-commerce platforms,
                providing a unified solution for your entire delivery operation.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Shopify Integration',
                  'WooCommerce API',
                  'Amazon Logistics',
                  'Major 3PL Systems'
                ].map((partner, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-4 border border-gray-800/50 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg border border-gray-800/50 p-6">
              <div className="space-y-4">
                {[
                  { label: 'Order Processing', value: '2.5K/min', status: 'High Volume' },
                  { label: 'Route Calculation', value: '<100ms', status: 'Ultra Fast' },
                  { label: 'Tracking Updates', value: 'Real-time', status: 'Live' }
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-400">{metric.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{metric.value}</span>
                      <span className="text-xs text-green-400">{metric.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-['Gilroy-Bold'] font-bold mb-6">
            Ready to Transform Your Delivery Operations?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join leading delivery operators in optimizing their last-mile operations with our intelligent platform.
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
    </div>
  )
} 