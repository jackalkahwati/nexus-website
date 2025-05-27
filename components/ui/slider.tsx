"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/cn"

interface SliderProps {
  className?: string
  min?: number
  max?: number
  step?: number
  value?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({ className, ...props }, ref) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    value = [0],
    onValueChange,
  } = props

  return (
    <div ref={ref} className={cn("relative w-full touch-none select-none", className)}>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
        <div
          className="absolute h-full bg-primary"
          style={{
            width: `${((value[0] || 0) / max) * 100}%`
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange([parseFloat(e.target.value)])
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider } 