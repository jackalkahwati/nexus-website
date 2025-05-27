import Image from 'next/image'

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Our Leadership
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the visionaries and industry experts driving innovation in autonomous fleet management
            and smart mobility solutions.
          </p>
        </div>

        {/* Executive Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Executive Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Chief Executive Officer",
                bio: "Former Tesla Autopilot Director with 15+ years in autonomous systems",
                image: "/team/sarah-chen.jpg"
              },
              {
                name: "Marcus Rodriguez",
                role: "Chief Technology Officer",
                bio: "Ex-Google AI researcher specializing in fleet optimization",
                image: "/team/marcus-rodriguez.jpg"
              },
              {
                name: "Dr. Emily Watson",
                role: "Chief Research Officer",
                bio: "PhD in Robotics from MIT, pioneering work in sensor fusion",
                image: "/team/emily-watson.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl" />
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-700">
                    {/* Placeholder for now - would need actual images */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-cyan-400 mb-4">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board of Directors */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Board of Directors</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Michael Chang",
                role: "Board Chairman",
                company: "Former CEO, Autonomous Solutions Inc."
              },
              {
                name: "Dr. Lisa Foster",
                role: "Board Member",
                company: "Professor, Stanford Robotics"
              },
              {
                name: "James Wilson",
                role: "Board Member",
                company: "Managing Partner, Tech Ventures"
              },
              {
                name: "Diana Martinez",
                role: "Board Member",
                company: "CTO, Global Mobility Corp"
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                <p className="text-cyan-400 mb-2">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Culture */}
        <div className="bg-gray-800/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "Pushing the boundaries of what's possible in autonomous systems"
              },
              {
                title: "Customer Success",
                description: "Dedicated to delivering measurable value to our clients"
              },
              {
                title: "Sustainable Future",
                description: "Committed to environmental responsibility in everything we do"
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-2xl">✦</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our vision of revolutionizing
            autonomous fleet management.
          </p>
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                View Open Positions
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 