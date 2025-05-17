export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using our platform.
            By using Lattis - Nexus, you agree to these terms and conditions.
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
              These Terms of Service ("Terms") govern your access to and use of Lattis - Nexus's platform,
              including our website, services, and applications (collectively, the "Services"). 
              These Terms constitute a legally binding agreement between you and Lattis - Nexus.
            </p>
          </section>

          {/* Service Access */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Service Access</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Account Requirements",
                  items: [
                    "Must be 18 years or older",
                    "Valid business credentials required",
                    "Accurate registration information",
                    "Secure account credentials"
                  ]
                },
                {
                  title: "Usage Restrictions",
                  items: [
                    "No unauthorized access",
                    "No malicious activities",
                    "No intellectual property violation",
                    "No service disruption"
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

          {/* Service Terms */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Service Terms</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "License Grant",
                  description: "Limited, non-exclusive, non-transferable license to use our services for your internal business operations."
                },
                {
                  title: "Service Availability",
                  description: "We strive for 99.9% uptime but cannot guarantee uninterrupted access to our services."
                },
                {
                  title: "Data Rights",
                  description: "You retain ownership of your data while granting us license to process it for service provision."
                },
                {
                  title: "Modifications",
                  description: "We reserve the right to modify or discontinue services with reasonable notice."
                }
              ].map((term, index) => (
                <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">{term.title}</h3>
                  <p className="text-gray-300">{term.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Terms */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Payment Terms</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "💳",
                    title: "Billing",
                    description: "Monthly or annual billing cycles with automatic renewal"
                  },
                  {
                    icon: "📊",
                    title: "Usage Fees",
                    description: "Additional charges may apply for excess usage"
                  },
                  {
                    icon: "🔄",
                    title: "Refunds",
                    description: "Pro-rated refunds for service cancellation"
                  }
                ].map((payment, index) => (
                  <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                    <div className="text-3xl mb-4">{payment.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{payment.title}</h3>
                    <p className="text-gray-300 text-sm">{payment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Liability and Warranty */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Liability and Warranty</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Limited Warranty",
                  description: "Services provided 'as is' without warranties of any kind"
                },
                {
                  title: "Limitation of Liability",
                  description: "We are not liable for indirect, incidental, or consequential damages"
                },
                {
                  title: "Indemnification",
                  description: "You agree to indemnify us against third-party claims arising from your use"
                },
                {
                  title: "Force Majeure",
                  description: "Not liable for failures due to circumstances beyond our control"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-900/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Termination */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-300 mb-6">
                Either party may terminate these Terms:
              </p>
              {[
                {
                  condition: "With Notice",
                  description: "30 days written notice required for termination without cause"
                },
                {
                  condition: "Immediate",
                  description: "For material breach of these Terms or applicable laws"
                },
                {
                  condition: "Effect",
                  description: "Upon termination, you must cease using our services and pay outstanding fees"
                }
              ].map((term, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 mr-3 text-cyan-400 mt-1">✓</div>
                  <div>
                    <h3 className="font-semibold mb-1">{term.condition}</h3>
                    <p className="text-gray-300">{term.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Legal Department</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Email: legal@lattis-nexus.com</p>
                  <p>Phone: +1 (555) 123-4569</p>
                  <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p>Legal Support: Business Hours Only</p>
                  <p>Response Time: Within 2 Business Days</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
