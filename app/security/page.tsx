export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Security & Compliance
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade security measures and compliance standards to protect
            your fleet operations and sensitive data.
          </p>
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                cert: "ISO 27001",
                description: "Information Security Management"
              },
              {
                cert: "SOC 2 Type II",
                description: "Service Organization Control"
              },
              {
                cert: "GDPR",
                description: "Data Protection Compliance"
              },
              {
                cert: "CCPA",
                description: "Privacy Protection"
              }
            ].map((cert, index) => (
              <div key={index} className="bg-card rounded-xl p-6 text-center border border-border">
                <div className="text-xl font-bold mb-2 text-primary">{cert.cert}</div>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Security Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "End-to-End Encryption",
                description: "All data is encrypted in transit and at rest using industry-standard protocols."
              },
              {
                title: "Access Control",
                description: "Role-based access control with multi-factor authentication."
              },
              {
                title: "Regular Audits",
                description: "Continuous security assessments and penetration testing."
              },
              {
                title: "Data Backup",
                description: "Automated backups with geo-redundancy and quick recovery."
              },
              {
                title: "Incident Response",
                description: "24/7 security monitoring and rapid incident response."
              },
              {
                title: "Privacy Controls",
                description: "Advanced data privacy controls and user consent management."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Framework */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Compliance Framework</h2>
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Data Protection</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Personal data encryption
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Data minimization principles
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Regular security updates
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Risk Management</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Continuous monitoring
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Vulnerability assessments
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Incident response planning
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
