'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ active = false, onRemove, icon, className, children, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium transition-all select-none',
          onClick || onRemove ? 'cursor-pointer' : '',
          active
            ? 'border-cyan/50 bg-cyan/15 text-cyan shadow-[0_0_14px_-2px_rgba(34,211,238,0.4)]'
            : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-white/10',
          className,
        )}
        {...(props as any)}
      >
        {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-1 rounded-full p-0.5 hover:bg-white/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    )
  },
)
Chip.displayName = 'Chip'
