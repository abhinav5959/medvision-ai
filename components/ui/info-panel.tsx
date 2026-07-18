'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InfoPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  eyebrow?: string
  icon?: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  variant?: 'default' | 'strong' | 'subtle'
}

export const InfoPanel = React.forwardRef<HTMLDivElement, InfoPanelProps>(
  (
    {
      title,
      eyebrow,
      icon,
      collapsible = false,
      defaultOpen = true,
      variant = 'strong',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    const bgClass =
      variant === 'strong'
        ? 'glass-strong'
        : variant === 'subtle'
          ? 'glass-subtle'
          : 'glass'

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl p-5 sm:p-6 transition-all duration-300', bgClass, className)}
        {...props}
      >
        <div
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
          className={cn(
            'flex items-center justify-between gap-3',
            collapsible && 'cursor-pointer select-none',
          )}
        >
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-cyan flex-shrink-0">{icon}</span>}
            <div>
              {eyebrow && (
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-0.5">
                  {eyebrow}
                </span>
              )}
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
                {title}
              </h3>
            </div>
          </div>
          {collapsible && (
            <button
              type="button"
              className="rounded-full p-1 hover:bg-white/10 text-muted-foreground transition-colors"
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? 16 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="text-sm leading-relaxed text-muted-foreground pt-1">{children}</div>
        </motion.div>
      </div>
    )
  },
)
InfoPanel.displayName = 'InfoPanel'
