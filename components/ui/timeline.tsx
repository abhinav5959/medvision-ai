'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {children}
      </div>
    )
  },
)
Timeline.displayName = 'Timeline'

export type TimelineStepStatus = 'completed' | 'active' | 'pending' | 'error'

export interface TimelineStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  status: TimelineStepStatus
  subtitle?: string
  timestamp?: string
  index?: number
}

export const TimelineStep = React.forwardRef<HTMLDivElement, TimelineStepProps>(
  ({ title, status, subtitle, timestamp, index = 0, className, ...props }, ref) => {
    const isCompleted = status === 'completed'
    const isActive = status === 'active'
    const isPending = status === 'pending'
    const isError = status === 'error'

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 select-none',
          isActive ? 'glass glow-ring-cyan' : isCompleted ? 'bg-white/[0.02]' : isError ? 'bg-critical/5 border border-critical/20' : 'bg-transparent',
          className,
        )}
        {...(props as any)}
      >
        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald" />
          ) : isError ? (
            <XCircle className="h-4.5 w-4.5 text-critical" />
          ) : isActive ? (
            <Loader2 className="h-4.5 w-4.5 text-cyan animate-spin" />
          ) : (
            <Circle className="h-4.5 w-4.5 text-muted-foreground/30" />
          )}
        </div>
        <div className="flex flex-col">
          <span
            className={cn(
              'text-sm transition-colors',
              isCompleted ? 'text-muted-foreground' : isActive ? 'text-foreground font-medium' : isError ? 'text-critical' : 'text-muted-foreground/40',
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-muted-foreground/70">{subtitle}</span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {timestamp && (
            <span className="text-[10px] font-mono text-muted-foreground/60">{timestamp}</span>
          )}
          <span className="text-xs font-mono text-muted-foreground/40">
            {isCompleted ? '✓' : isActive ? '...' : isError ? '✗' : ''}
          </span>
        </div>
      </motion.div>
    )
  },
)
TimelineStep.displayName = 'TimelineStep'
