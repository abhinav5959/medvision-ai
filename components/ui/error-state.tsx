'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title = 'Diagnostic Pipeline Error', message, onRetry, retryLabel = 'Retry Analysis', className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('glass-strong rounded-3xl border border-critical/40 p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_0_30px_-6px_rgba(251,87,121,0.25)]', className)}
        {...(props as any)}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-critical/15 text-critical border border-critical/30 animate-pulse">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry} iconLeft={<RefreshCw className="h-3.5 w-3.5" />}>
            {retryLabel}
          </Button>
        )}
      </motion.div>
    )
  },
)
ErrorState.displayName = 'ErrorState'
