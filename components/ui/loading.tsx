'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

const sizeMappings: Record<string, { sizePx: number; borderPx: number }> = {
  sm: { sizePx: 20, borderPx: 2 },
  md: { sizePx: 32, borderPx: 2.5 },
  lg: { sizePx: 48, borderPx: 3 },
  xl: { sizePx: 64, borderPx: 3.5 },
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', label, className, ...props }, ref) => {
    const { sizePx, borderPx } = sizeMappings[size] || sizeMappings.md

    return (
      <div ref={ref} className={cn('inline-flex flex-col items-center justify-center gap-2', className)} {...props}>
        <div className="relative flex items-center justify-center" style={{ width: sizePx, height: sizePx }}>
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-cyan/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-t border-cyan"
            style={{ borderWidth: borderPx }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full bg-cyan/80"
            style={{ width: borderPx * 1.5, height: borderPx * 1.5 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        {label && <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>}
      </div>
    )
  },
)
Spinner.displayName = 'Spinner'

export interface PulseLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  dots?: number
  color?: string
}

export const PulseLoader = React.forwardRef<HTMLDivElement, PulseLoaderProps>(
  ({ dots = 3, color = '#22d3ee', className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
        {Array.from({ length: dots }).map((_, i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
    )
  },
)
PulseLoader.displayName = 'PulseLoader'

export interface ScanPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string
}

export const ScanPulse = React.forwardRef<HTMLDivElement, ScanPulseProps>(
  ({ height = '100%', className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} style={{ height }} {...props}>
        <div className="animate-scan-line absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
      </div>
    )
  },
)
ScanPulse.displayName = 'ScanPulse'
