export default function EdgeComputingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Edge Computing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Harness the power of distributed computing at the edge of your network. Process data closer to the source,
            reduce latency, and make faster decisions with our advanced edge computing platform.
          </p>
        </div>

        {/* Key Capabilities */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            {
              title: "Edge Processing",
              description: "Process data at the edge for instant decision making.",
              features: [
                "Real-time data processing",
                "Low-latency compute",
                "Distributed architecture",
                "Scalable deployment"
              ]
            },
            {
              title: "Edge Intelligence",
              description: "Deploy AI models at the edge for autonomous operations.",
              features: [
                "AI model deployment",
                "Machine learning inference",
                "Automated decision making",
                "Predictive analytics"
              ]
            },
            {
              title: "Edge Security",
              description: "Secure your edge computing infrastructure.",
              features: [
                "End-to-end encryption",
                "Secure data transmission",
                "Access control",
                "Compliance management"
              ]
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-400">{feature.title}</h2>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Technical Benefits */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Advantages</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Reduced Latency</h3>
                <p className="text-gray-300">
                  Process data closer to the source, minimizing network latency and enabling real-time
                  decision making for critical operations.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Bandwidth Optimization</h3>
                <p className="text-gray-300">
                  Minimize data transfer costs and network congestion by processing data at the edge
                  and sending only relevant information to the cloud.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Enhanced Reliability</h3>
                <p className="text-gray-300">
                  Maintain operations even during network outages with local processing capabilities
                  and intelligent failover mechanisms.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Scalable Architecture</h3>
                <p className="text-gray-300">
                  Easily scale your edge computing infrastructure as your operations grow,
                  with support for thousands of edge nodes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Implementation Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Assessment",
                description: "Evaluate your edge computing needs and requirements"
              },
              {
                step: "2",
                title: "Design",
                description: "Create a customized edge computing architecture"
              },
              {
                step: "3",
                title: "Deployment",
                description: "Roll out edge nodes and configure the network"
              },
              {
                step: "4",
                title: "Optimization",
                description: "Monitor and optimize edge computing performance"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-gray-900 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 mt-2 text-emerald-400">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Start Implementation
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 