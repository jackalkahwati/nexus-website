'use client'

import { useState, ChangeEvent } from 'react'
import { 
  Check,
  HelpCircle,
  Calculator,
  Car,
  Zap,
  Shield,
  Users,
  Settings,
  ChevronRight,
  X
} from 'lucide-react'

interface PlanPrice {
  monthly: number | string;
  annual: number | string;
}

interface Plan {
  name: string;
  description: string;
  price: PlanPrice;
  features: string[];
  popular?: boolean;
}

export default function PricingPage() {
  const [fleetSize, setFleetSize] = useState(50)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const plans: Plan[] = [
    {
      name: "Starter",
      description: "For small fleets getting started with automation",
      price: {
        monthly: 499,
        annual: 449
      },
      features: [
        "Up to 50 vehicles",
        "Basic fleet monitoring",
        "Real-time tracking",
        "Standard support",
        "Basic analytics",
        "Email notifications"
      ]
    },
    {
      name: "Professional",
      description: "For growing fleets with advanced needs",
      price: {
        monthly: 999,
        annual: 899
      },
      features: [
        "Up to 200 vehicles",
        "Advanced fleet management",
        "Predictive maintenance",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Custom integrations",
        "Mobile app access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large fleets requiring custom solutions",
      price: {
        monthly: "Custom",
        annual: "Custom"
      },
      features: [
        "Unlimited vehicles",
        "Custom solutions",
        "Dedicated support",
        "White-label options",
        "Custom development",
        "SLA guarantees",
        "24/7 phone support",
        "On-site training"
      ]
    }
  ]

  const additionalFeatures = [
    {
      id: "predictive",
      name: "Predictive Analytics",
      description: "AI-powered predictions and insights",
      price: 199
    },
    {
      id: "maintenance",
      name: "Maintenance Management",
      description: "Automated maintenance scheduling",
      price: 149
    },
    {
      id: "routing",
      name: "Advanced Routing",
      description: "Optimized route planning",
      price: 249
    },
    {
      id: "integration",
      name: "Custom Integrations",
      description: "Connect with existing systems",
      price: 299
    }
  ]

  const calculatePrice = () => {
    const basePrice = fleetSize * (billingCycle === 'annual' ? 8 : 10)
    const featuresPrice = selectedFeatures.reduce((total, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId)
      return total + (feature?.price || 0)
    }, 0)
    return basePrice + featuresPrice
  }

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleFleetSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFleetSize(Number(e.target.value))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your fleet management needs.
            All plans include core features with flexible scaling options.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="max-w-4xl mx-auto mb-12 flex justify-center">
          <div className="bg-muted rounded-xl p-2 inline-flex">
            {['monthly', 'annual'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle as 'monthly' | 'annual')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === cycle
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === 'annual' && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                    Save 10%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-card rounded-2xl p-8 relative border ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  <div className="text-3xl font-bold">
                    {typeof plan.price[billingCycle] === 'number' ? (
                      <>
                        ${plan.price[billingCycle]}
                        <span className="text-lg text-muted-foreground">/month</span>
                      </>
                    ) : (
                      plan.price[billingCycle]
                    )}
                  </div>
                  {billingCycle === 'annual' && typeof plan.price.annual === 'number' && typeof plan.price.monthly === 'number' && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${(plan.price.monthly as number - plan.price.annual as number) * 12}/year
                    </div>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border bg-background hover:bg-muted'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculator */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-8">
              <Calculator className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Price Calculator</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 font-medium">Fleet Size</label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={fleetSize}
                  onChange={handleFleetSizeChange}
                  className="w-full"
                  aria-label="Fleet Size"
                  title="Adjust fleet size"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>10 vehicles</span>
                  <span>{fleetSize} vehicles</span>
                  <span>1000 vehicles</span>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Additional Features</label>
                <div className="space-y-2">
                  {additionalFeatures.map((feature) => (
                    <label
                      key={feature.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                          className="w-4 h-4 text-primary rounded border-input focus:ring-primary"
                        />
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +${feature.price}/mo
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-muted rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">Estimated Monthly Cost</div>
                <div className="text-3xl font-bold">${calculatePrice()}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Prices are in USD. Final pricing may vary based on specific requirements and customizations.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How is pricing calculated?",
                a: "Base pricing is calculated per vehicle with additional costs for premium features."
              },
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards and bank transfers for enterprise plans."
              },
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 14-day free trial for all plans."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 