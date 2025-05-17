export default function OurMissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Our Mission
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing fleet management through intelligent automation and sustainable mobility solutions.
          </p>
        </div>

        {/* Vision Statement */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              To create a world where autonomous fleet management is seamlessly integrated into everyday operations,
              making transportation more efficient, sustainable, and accessible for everyone.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Pushing the boundaries of what's possible in autonomous systems and fleet management",
                icon: "🚀"
              },
              {
                title: "Sustainability",
                description: "Committed to reducing environmental impact through smart mobility solutions",
                icon: "🌱"
              },
              {
                title: "Excellence",
                description: "Delivering exceptional quality and reliability in everything we do",
                icon: "⭐"
              },
              {
                title: "Collaboration",
                description: "Working together with partners and clients to achieve shared success",
                icon: "🤝"
              },
              {
                title: "Integrity",
                description: "Operating with transparency and ethical responsibility",
                icon: "🎯"
              },
              {
                title: "Impact",
                description: "Making a meaningful difference in transportation and logistics",
                icon: "💫"
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{value.title}</h3>
                <p className="text-gray-300 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                metric: "30%",
                label: "Average Fleet Efficiency Improvement"
              },
              {
                metric: "25M+",
                label: "Tons of CO₂ Emissions Reduced"
              },
              {
                metric: "500+",
                label: "Global Partner Organizations"
              },
              {
                metric: "1M+",
                label: "Vehicles Optimized"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  {stat.metric}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Environmental Commitment</h3>
            <p className="text-gray-300 mb-6">
              We're dedicated to reducing the environmental impact of fleet operations through smart routing,
              predictive maintenance, and optimization of resource utilization.
            </p>
            <ul className="space-y-3">
              {[
                "Zero-emission fleet transitions",
                "Smart energy management",
                "Sustainable supply chains",
                "Carbon footprint reduction"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="w-5 h-5 mr-3 text-cyan-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Innovation Focus</h3>
            <p className="text-gray-300 mb-6">
              Our commitment to innovation drives us to continuously develop cutting-edge solutions
              that shape the future of autonomous fleet management.
            </p>
            <ul className="space-y-3">
              {[
                "Advanced AI algorithms",
                "Real-time optimization",
                "Predictive analytics",
                "Edge computing solutions"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="w-5 h-5 mr-3 text-cyan-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a potential partner, customer, or team member, there's a place for you
            in our mission to revolutionize fleet management.
          </p>
          <div className="flex justify-center gap-4">
            <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] rounded-lg">
              <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  Partner With Us
                </span>
              </button>
            </div>
            <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] rounded-lg">
              <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  Learn More
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 