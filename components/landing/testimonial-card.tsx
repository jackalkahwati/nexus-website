import { Card } from "components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export default function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="p-6">
      <p className="text-lg mb-4">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-muted-foreground">{role}</p>
      </div>
    </Card>
  )
}
