'use client'

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip"
import { useCollaboration } from "contexts/CollaborationContext"
import { cn } from "@/lib/cn"

export function PresenceIndicator() {
  const { status, activeUsers } = useCollaboration()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                status === 'connected' && 'bg-green-500',
                status === 'disconnected' && 'bg-red-500',
                status === 'reconnecting' && 'bg-yellow-500 animate-pulse'
              )}
            />
            <span className="text-sm text-muted-foreground">
              {activeUsers} {activeUsers === 1 ? 'user' : 'users'} online
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-semibold mb-1">Connection Status</div>
            <div className="capitalize">{status}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
