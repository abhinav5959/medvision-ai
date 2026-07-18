'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string
  title: string | React.ReactNode
  description?: string | React.ReactNode
  action?: React.ReactNode
  align?: 'left' | 'center'
}

export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ eyebrow, title, description, action, align = 'left', className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8',
          align === 'center' && 'text-center items-center sm:items-center sm:flex-col',
          className,
        )}
        {...props}
      >
        <div className={cn('space-y-3', align === 'center' && 'max-w-2xl mx-auto')}>
          {eyebrow && (
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan block">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            {title}
          </h2>
          {description && (
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </motion.div>
    )
  },
)
SectionHeader.displayName = 'SectionHeader'
