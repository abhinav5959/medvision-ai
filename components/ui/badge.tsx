'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { clinicalTones, type ClinicalTone } from '@/lib/design-system'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ClinicalTone | 'cyan' | 'blue' | 'purple' | 'neutral'
  pulse?: boolean
  icon?: React.ReactNode
}

const toneMappings: Record<string, string> = {
  cyan: 'text-cyan bg-cyan/10 border-cyan/30 shadow-[0_0_12px_rgba(34,211,238,0.3)]',
  blue: 'text-blue bg-blue/10 border-blue/30 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  purple: 'text-purple bg-purple/10 border-purple/30 shadow-[0_0_12px_rgba(167,139,250,0.3)]',
  neutral: 'text-muted-foreground bg-white/5 border-white/10',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = 'cyan', pulse = false, icon, className, children, ...props }, ref) => {
    const isClinicalTone = tone === 'normal' || tone === 'attention' || tone === 'critical'
    const clinicalClass = isClinicalTone
      ? `${clinicalTones[tone].text} ${clinicalTones[tone].bg} border ${clinicalTones[tone].border}`
      : toneMappings[tone] || toneMappings.cyan

    const dotColor = isClinicalTone
      ? clinicalTones[tone].hex
      : tone === 'cyan'
        ? '#22d3ee'
        : tone === 'blue'
          ? '#3b82f6'
          : tone === 'purple'
            ? '#a78bfa'
            : '#7d97a8'

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider transition-colors select-none',
          clinicalClass,
          className,
        )}
        {...props}
      >
        {pulse && (
          <motion.span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ background: dotColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    )
  },
)
Badge.displayName = 'Badge'
