'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Inbox, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, actionLabel, onAction, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('glass rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4', className)}
        {...props}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-cyan"
        >
          {icon || <Inbox className="h-8 w-8" />}
        </motion.div>
        <div className="max-w-md space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {actionLabel && onAction && (
          <Button variant="secondary" size="sm" onClick={onAction} iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
            {actionLabel}
          </Button>
        )}
      </div>
    )
  },
)
EmptyState.displayName = 'EmptyState'
