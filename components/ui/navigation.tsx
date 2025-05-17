'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface MenuItem {
  name: string;
  description?: string;
  href?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
}

interface NavigationMenu {
  label: string;
  sections: MenuSection[];
}

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems: NavigationMenu[] = [
    {
      label: 'Platform',
      sections: [
        {
          title: 'Core Features',
          items: [
            {
              name: 'Demand Management',
              description: 'AI-powered demand prediction and fleet optimization',
              href: '/platform/demand-management'
            },
            {
              name: 'Fleet Operations',
              description: 'Comprehensive fleet management and monitoring',
              href: '/platform/fleet-operations'
            },
            {
              name: 'Software Integration',
              description: 'Seamless integration with autonomous driving stacks',
              href: '/platform/software-integration'
            }
          ]
        },
        {
          title: 'Advanced Features',
          items: [
            {
              name: 'Sensor Management',
              description: 'Real-time sensor monitoring and calibration',
              href: '/platform/sensor-management'
            },
            {
              name: 'Compute Resources',
              description: 'High-performance compute management',
              href: '/platform/compute-resources'
            },
            {
              name: 'Safety & Compliance',
              description: 'Regulatory compliance and safety protocols',
              href: '/platform/safety-compliance'
            }
          ]
        }
      ]
    },
    {
      label: 'Solutions',
      sections: [
        {
          title: 'By Industry',
          items: [
            {
              name: 'Electric Vehicles',
              description: 'Solutions for EV fleets and charging optimization',
              href: '/solutions/electric-vehicles'
            },
            {
              name: 'Last-Mile Delivery',
              description: 'Autonomous delivery fleet management',
              href: '/solutions/last-mile-delivery'
            },
            {
              name: 'Robotaxi Operations',
              description: 'End-to-end robotaxi fleet management',
              href: '/solutions/robotaxi-operations'
            }
          ]
        },
        {
          title: 'By Application',
          items: [
            {
              name: 'Industrial Automation',
              description: 'Automated industrial vehicle fleets',
              href: '/solutions/industrial-automation'
            },
            {
              name: 'Public Transit',
              description: 'Autonomous public transportation',
              href: '/solutions/public-transit'
            },
            {
              name: 'Lights-Out Manufacturing',
              description: 'Fully autonomous manufacturing operations',
              href: '/solutions/lights-out-manufacturing'
            }
          ]
        }
      ]
    },
    {
      label: 'Resources',
      sections: [
        {
          title: 'Documentation',
          items: [
            {
              name: 'Getting Started',
              description: 'Quick start guide and tutorials',
              href: '/docs/getting-started'
            },
            {
              name: 'API Reference',
              description: 'Complete API documentation',
              href: '/docs/api'
            },
            {
              name: 'Integration Guide',
              description: 'Step-by-step integration instructions',
              href: '/docs/integration'
            },
            {
              name: 'Security',
              description: 'Security features and best practices',
              href: '/docs/security'
            }
          ]
        },
        {
          title: 'Support',
          items: [
            {
              name: 'Help Center',
              description: 'Troubleshooting and guides',
              href: '/support'
            },
            {
              name: 'System Status',
              description: 'Real-time platform status',
              href: '/status'
            },
            {
              name: 'Release Notes',
              description: 'Latest updates and changes',
              href: '/docs/releases'
            }
          ]
        }
      ]
    }
  ];

  return (
    <nav className="flex items-center gap-8">
      {menuItems.map((menu) => (
        <div
          key={menu.label}
          className="relative"
          onMouseEnter={() => setActiveMenu(menu.label)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
          >
            {menu.label}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {activeMenu === menu.label && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px]">
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-800/50 p-6 grid grid-cols-2 gap-8 shadow-xl">
                {menu.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-medium text-gray-300 mb-4">{section.title}</h3>
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href || '#'}
                          className="block group"
                        >
                          <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                            {item.name}
                            {item.badge && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <div className="mt-0.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
} 