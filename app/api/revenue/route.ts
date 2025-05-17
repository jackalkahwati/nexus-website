import { NextResponse } from 'next/server'

// Generate demo data for the past 30 days and next 7 days
function generateDemoData() {
  const today = new Date()
  const history = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split('T')[0],
      value: 15000 + Math.random() * 10000
    }
  })

  const forecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + (i + 1))
    return {
      date: date.toISOString().split('T')[0],
      value: 20000 + Math.random() * 12000
    }
  })

  const lastMonthTotal = history[0].value
  const currentTotal = history[history.length - 1].value
  const change = ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100

  return {
    total: Math.round(currentTotal),
    change: Math.round(change * 10) / 10,
    history,
    forecast
  }
}

export async function GET() {
  // In production, this would fetch real data from your database
  const data = generateDemoData()
  
  return NextResponse.json(data)
} 