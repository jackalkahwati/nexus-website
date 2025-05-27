export default function DemandManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Demand Management
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Optimize your fleet operations with AI-powered demand prediction and intelligent resource allocation.
            Stay ahead of market demands and maximize efficiency with our advanced forecasting system.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            {
              title: "Predictive Analytics",
              description: "Forecast demand patterns with machine learning algorithms.",
              features: [
                "Advanced demand forecasting",
                "Seasonal trend analysis",
                "Market demand patterns",
                "Custom prediction models"
              ]
            },
            {
              title: "Resource Optimization",
              description: "Optimize resource allocation based on predicted demand.",
              features: [
                "Dynamic fleet sizing",
                "Automated resource distribution",
                "Peak demand management",
                "Capacity planning"
              ]
            },
            {
              title: "Real-time Adaptation",
              description: "Adapt to changing market conditions in real-time.",
              features: [
                "Live demand tracking",
                "Automated adjustments",
                "Market event response",
                "Dynamic pricing"
              ]
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">{feature.title}</h2>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Industry Applications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Urban Mobility</h3>
                <p className="text-gray-300">
                  Optimize fleet distribution in urban areas based on historical patterns and real-time demand.
                  Perfect for ride-sharing and urban transit operations.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Logistics & Delivery</h3>
                <p className="text-gray-300">
                  Predict delivery demand patterns and optimize resource allocation for maximum efficiency
                  in last-mile delivery operations.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Industrial Operations</h3>
                <p className="text-gray-300">
                  Manage industrial vehicle fleets with precision, ensuring optimal resource utilization
                  during peak production periods.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Public Transit</h3>
                <p className="text-gray-300">
                  Optimize public transportation schedules and resource allocation based on
                  commuter patterns and special events.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Seamless Integration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "API Integration",
                description: "Connect with existing systems through our robust API"
              },
              {
                title: "Real-time Data",
                description: "Access live demand data and predictions instantly"
              },
              {
                title: "Custom Solutions",
                description: "Tailored integration options for your specific needs"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-3 text-purple-400">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Request a Demo
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 