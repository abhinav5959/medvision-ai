'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertVariant = 'info' | 'warning' | 'critical' | 'success'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  icon?: React.ReactNode
}

const alertMappings: Record<
  AlertVariant,
  { bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  info: {
    bg: 'bg-cyan/10',
    border: 'border-cyan/30',
    text: 'text-cyan',
    icon: Info,
  },
  warning: {
    bg: 'bg-amber/10',
    border: 'border-amber/30',
    text: 'text-amber',
    icon: AlertTriangle,
  },
  critical: {
    bg: 'bg-critical/10',
    border: 'border-critical/30',
    text: 'text-critical',
    icon: AlertCircle,
  },
  success: {
    bg: 'bg-emerald/10',
    border: 'border-emerald/30',
    text: 'text-emerald',
    icon: CheckCircle2,
  },
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, icon, className, children, ...props }, ref) => {
    const { bg, border, text, icon: DefaultIcon } = alertMappings[variant]

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-start gap-3.5 rounded-2xl border p-4 text-xs sm:text-sm leading-relaxed transition-all select-none',
          bg,
          border,
          text,
          className,
        )}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || <DefaultIcon className="h-4.5 w-4.5" />}
        </div>
        <div className="flex-1 space-y-1">
          {title && <h4 className="font-semibold uppercase tracking-wider text-current">{title}</h4>}
          <div className="text-current/90 leading-relaxed">{children}</div>
        </div>
      </motion.div>
    )
  },
)
Alert.displayName = 'Alert'
