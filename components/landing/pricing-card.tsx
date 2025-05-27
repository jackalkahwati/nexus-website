import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { Check } from "lucide-react"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({ title, price, description, features, highlighted = false }: PricingCardProps) {
  return (
    <Card className={`p-6 ${highlighted ? 'border-primary shadow-lg' : ''}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-3xl font-bold mb-2">{price}</div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-primary mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={highlighted ? "default" : "outline"}>
        Get Started
      </Button>
    </Card>
  )
}
