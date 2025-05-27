export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are committed to protecting your privacy and ensuring the security of your data.
            This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>

        {/* Last Updated */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/30 rounded-lg p-4 text-gray-400 text-sm">
            Last Updated: February 20, 2024
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <section className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              At Lattis - Nexus, we take your privacy seriously. This Privacy Policy describes how we collect,
              use, process, and disclose your information, including personal information, in conjunction with
              your access to and use of our autonomous fleet management platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Information We Collect</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Account Information",
                  items: [
                    "Name and contact details",
                    "Login credentials",
                    "Company information",
                    "Payment information"
                  ]
                },
                {
                  title: "Platform Usage Data",
                  items: [
                    "Fleet telemetry data",
                    "System logs and analytics",
                    "User preferences and settings",
                    "Performance metrics"
                  ]
                },
                {
                  title: "Technical Information",
                  items: [
                    "Device information",
                    "IP addresses",
                    "Browser type and version",
                    "Operating system details"
                  ]
                }
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-4 text-cyan-400">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <span className="w-5 h-5 mr-3 text-cyan-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Service Provision",
                  description: "To provide and maintain our fleet management services, including system optimization and customer support."
                },
                {
                  title: "Platform Improvement",
                  description: "To analyze usage patterns and enhance our platform's functionality, performance, and user experience."
                },
                {
                  title: "Communication",
                  description: "To send you important updates, newsletters, and marketing communications (with your consent)."
                },
                {
                  title: "Security",
                  description: "To detect, prevent, and address technical issues, fraud, or other illegal activities."
                }
              ].map((use, index) => (
                <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">{use.title}</h3>
                  <p className="text-gray-300">{use.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Data Protection</h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                We implement robust security measures to protect your information, including:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🔒",
                    title: "Encryption",
                    description: "End-to-end encryption for all data transmission and storage"
                  },
                  {
                    icon: "🛡️",
                    title: "Access Control",
                    description: "Strict access controls and authentication protocols"
                  },
                  {
                    icon: "📊",
                    title: "Monitoring",
                    description: "24/7 security monitoring and threat detection"
                  }
                ].map((protection, index) => (
                  <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                    <div className="text-3xl mb-4">{protection.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{protection.title}</h3>
                    <p className="text-gray-300 text-sm">{protection.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
            <div className="space-y-4">
              {[
                {
                  right: "Access",
                  description: "Request access to your personal data"
                },
                {
                  right: "Rectification",
                  description: "Request correction of inaccurate data"
                },
                {
                  right: "Erasure",
                  description: "Request deletion of your personal data"
                },
                {
                  right: "Portability",
                  description: "Request transfer of your data to another service"
                },
                {
                  right: "Objection",
                  description: "Object to processing of your personal data"
                }
              ].map((right, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 mr-3 text-cyan-400 mt-1">✓</div>
                  <div>
                    <h3 className="font-semibold mb-1">{right.right}</h3>
                    <p className="text-gray-300">{right.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Email: privacy@lattis-nexus.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Support Team</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Email: support@lattis-nexus.com</p>
                  <p>Phone: +1 (555) 123-4568</p>
                  <p>Hours: 24/7 Support Available</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
