import { Card } from '@/components/ui/card'

export default function RebalancingWidget() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Rebalancing Tasks</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Critical Tasks</span>
          <span className="font-bold">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Pending Tasks</span>
          <span className="font-bold">7</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Completed Today</span>
          <span className="font-bold">12</span>
        </div>
      </div>
    </Card>
  )
} 