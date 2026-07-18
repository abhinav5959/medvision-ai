'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  label?: string
  tone?: 'default' | 'cyan' | 'blue' | 'purple' | 'critical'
  indeterminate?: boolean
}

const gradientMap: Record<string, string> = {
  default: 'linear-gradient(90deg, #22d3ee, #3b82f6, #a78bfa)',
  cyan: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
  blue: 'linear-gradient(90deg, #3b82f6, #2563eb)',
  purple: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
  critical: 'linear-gradient(90deg, #fb5779, #e11d48)',
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      showLabel = false,
      label,
      tone = 'default',
      indeterminate = false,
      className,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">{label || 'Progress'}</span>
            <span className="font-mono text-cyan">{percentage.toFixed(0)}%</span>
          </div>
        )}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
          {indeterminate ? (
            <motion.div
              className="absolute inset-y-0 w-1/3 rounded-full"
              style={{ background: gradientMap[tone] }}
              animate={{ left: ['-35%', '105%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: gradientMap[tone] }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-y-0 rounded-full"
                style={{
                  width: 40,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  filter: 'blur(4px)',
                }}
                animate={{ left: `${Math.max(0, percentage - 5)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </>
          )}
        </div>
      </div>
    )
  },
)
ProgressBar.displayName = 'ProgressBar'

export interface ProgressGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export const ProgressGauge = React.forwardRef<HTMLDivElement, ProgressGaugeProps>(
  ({ value, size = 140, strokeWidth = 10, label, sublabel, className, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center flex-col', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            strokeLinecap="round"
            fill="transparent"
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-3xl font-bold text-cyan animate-confidence-glow">
            {percentage.toFixed(1)}%
          </span>
          {label && <span className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>}
          {sublabel && <span className="text-[9px] text-muted-foreground/60">{sublabel}</span>}
        </div>
      </div>
    )
  },
)
ProgressGauge.displayName = 'ProgressGauge'
