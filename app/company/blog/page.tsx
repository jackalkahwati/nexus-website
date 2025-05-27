export default function BlogPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Industry insights and updates from the Lattis - Nexus team.
      </p>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "The Future of Autonomous Fleet Management",
            excerpt: "Exploring the latest trends and innovations in autonomous vehicle fleet operations.",
            author: "Sarah Johnson",
            date: "December 15, 2023",
            category: "Industry Trends"
          },
          {
            title: "Edge Computing in Fleet Operations",
            excerpt: "How edge computing is revolutionizing real-time fleet management and decision making.",
            author: "Michael Chen",
            date: "December 12, 2023",
            category: "Technology"
          },
          {
            title: "Sustainable Fleet Operations",
            excerpt: "Implementing eco-friendly practices in autonomous fleet management.",
            author: "Emily Brown",
            date: "December 10, 2023",
            category: "Sustainability"
          },
          {
            title: "AI in Fleet Optimization",
            excerpt: "Leveraging artificial intelligence for smarter fleet operations.",
            author: "David Wilson",
            date: "December 8, 2023",
            category: "AI & ML"
          },
          {
            title: "The Rise of Electric Fleet Management",
            excerpt: "Managing the transition to electric vehicle fleets effectively.",
            author: "Lisa Anderson",
            date: "December 5, 2023",
            category: "Electric Vehicles"
          },
          {
            title: "Security in Autonomous Systems",
            excerpt: "Best practices for securing autonomous fleet operations.",
            author: "John Smith",
            date: "December 1, 2023",
            category: "Security"
          }
        ].map((post) => (
          <div key={post.title} className="rounded-lg border p-6 hover:border-gray-700/50 transition-all duration-200">
            <div className="text-sm text-blue-400 mb-2">{post.category}</div>
            <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 