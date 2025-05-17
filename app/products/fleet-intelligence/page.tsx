export default function FleetIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Fleet Intelligence
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your fleet operations with AI-powered intelligence. Get real-time insights, 
            predictive analytics, and automated decision-making capabilities to optimize your entire fleet.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            {
              title: "Real-time Monitoring",
              description: "Monitor your entire fleet in real-time with advanced telemetry and analytics.",
              features: [
                "Live vehicle tracking and status updates",
                "Performance metrics and KPI dashboards",
                "Automated alerts and notifications",
                "Custom monitoring parameters"
              ]
            },
            {
              title: "Advanced Analytics",
              description: "Make data-driven decisions with comprehensive analytics and insights.",
              features: [
                "Predictive maintenance forecasting",
                "Route optimization algorithms",
                "Efficiency metrics analysis",
                "Custom reporting tools"
              ]
            },
            {
              title: "AI-Powered Insights",
              description: "Leverage artificial intelligence to optimize fleet operations.",
              features: [
                "Machine learning predictions",
                "Anomaly detection",
                "Pattern recognition",
                "Automated recommendations"
              ]
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">{feature.title}</h2>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Fleet Intelligence</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Operational Excellence</h3>
                <p className="text-gray-300">
                  Achieve unprecedented levels of operational efficiency with our AI-driven fleet management system.
                  Reduce downtime, optimize routes, and automate routine decisions.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Cost Optimization</h3>
                <p className="text-gray-300">
                  Reduce operational costs through predictive maintenance, fuel efficiency optimization,
                  and intelligent resource allocation.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Data-Driven Decisions</h3>
                <p className="text-gray-300">
                  Make informed decisions based on comprehensive data analysis and predictive insights.
                  Understand trends and optimize for future growth.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Scalable Solution</h3>
                <p className="text-gray-300">
                  Our platform grows with your fleet. Whether you manage 10 or 10,000 vehicles,
                  we provide the tools you need to succeed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Schedule a Demo
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 