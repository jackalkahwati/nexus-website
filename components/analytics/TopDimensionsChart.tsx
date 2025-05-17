'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

// Simple placeholder component to avoid build errors
export function TopDimensionsChart({ title = 'Analytics' }) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="h-[400px] flex items-center justify-center">
        <p>Analytics data will display here</p>
      </div>
    </Card>
  )
}
