export default function CareersPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Careers</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Join our team and help shape the future of autonomous fleet technology.
      </p>
      
      <div className="space-y-8">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
          <div className="space-y-4">
            {[
              {
                title: "Senior Software Engineer",
                department: "Engineering",
                location: "San Francisco, CA",
                type: "Full-time"
              },
              {
                title: "Machine Learning Engineer",
                department: "AI/ML",
                location: "Remote",
                type: "Full-time"
              },
              {
                title: "Product Manager",
                department: "Product",
                location: "San Francisco, CA",
                type: "Full-time"
              },
              {
                title: "Solutions Architect",
                department: "Engineering",
                location: "Remote",
                type: "Full-time"
              }
            ].map((job) => (
              <div key={job.title} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div>
                  <h3 className="font-medium mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department} · {job.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-blue-400">{job.type}</span>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Competitive salary and equity</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Comprehensive health coverage</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Flexible work arrangements</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Professional development</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Culture</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Innovation-driven environment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Collaborative teams</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Work-life balance</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-muted-foreground">Diverse and inclusive</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 