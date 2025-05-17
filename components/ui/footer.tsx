import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-[#0B0B0F] text-white">
      {/* Main Navigation Footer */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><Link href="/solutions/electric-vehicles" className="text-sm text-gray-400 hover:text-white transition-colors">Electric Vehicles</Link></li>
              <li><Link href="/solutions/last-mile-delivery" className="text-sm text-gray-400 hover:text-white transition-colors">Last-Mile Delivery</Link></li>
              <li><Link href="/solutions/industrial-automation" className="text-sm text-gray-400 hover:text-white transition-colors">Industrial Automation</Link></li>
              <li><Link href="/solutions/public-transit" className="text-sm text-gray-400 hover:text-white transition-colors">Public Transit</Link></li>
              <li><Link href="/solutions/robotaxi-operations" className="text-sm text-gray-400 hover:text-white transition-colors">Robotaxi Operations</Link></li>
              <li><Link href="/solutions/lights-out-manufacturing" className="text-sm text-gray-400 hover:text-white transition-colors">Lights-Out Manufacturing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/products/fleet-intelligence" className="text-sm text-gray-400 hover:text-white transition-colors">Fleet Intelligence</Link></li>
              <li><Link href="/products/demand-management" className="text-sm text-gray-400 hover:text-white transition-colors">Demand Management</Link></li>
              <li><Link href="/products/edge-computing" className="text-sm text-gray-400 hover:text-white transition-colors">Edge Computing</Link></li>
              <li><Link href="/products/sensor-management" className="text-sm text-gray-400 hover:text-white transition-colors">Sensor Management</Link></li>
              <li><Link href="/products/predictive-maintenance" className="text-sm text-gray-400 hover:text-white transition-colors">Predictive Maintenance</Link></li>
              <li><Link href="/products/route-optimization" className="text-sm text-gray-400 hover:text-white transition-colors">Route Optimization</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Developers</h3>
            <ul className="space-y-3">
              <li><Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs/api" className="text-sm text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/docs/sdk" className="text-sm text-gray-400 hover:text-white transition-colors">SDK Libraries</Link></li>
              <li><Link href="/docs/websocket" className="text-sm text-gray-400 hover:text-white transition-colors">WebSocket Streams</Link></li>
              <li><Link href="/docs/edge" className="text-sm text-gray-400 hover:text-white transition-colors">Edge Computing SDK</Link></li>
              <li><Link href="/status" className="text-sm text-gray-400 hover:text-white transition-colors">System Status</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright and Policy Links */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto py-6 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">LATTIS</span>
              <span className="text-sm text-gray-400">© 2024 Lattis, Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
