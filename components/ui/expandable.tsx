'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ExpandablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  summary?: React.ReactNode
  defaultExpanded?: boolean
}

export const ExpandablePanel = React.forwardRef<HTMLDivElement, ExpandablePanelProps>(
  ({ title, summary, defaultExpanded = false, className, children, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded)

    return (
      <div ref={ref} className={cn('glass-strong rounded-2xl p-5 transition-all duration-300', className)} {...props}>
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div>
            <h4 className="font-display font-semibold text-base text-foreground">{title}</h4>
            {summary && !expanded && <div className="text-xs text-muted-foreground mt-1">{summary}</div>}
          </div>
          <button type="button" className="rounded-full p-1.5 hover:bg-white/10 text-muted-foreground transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/10 text-sm leading-relaxed text-muted-foreground">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
ExpandablePanel.displayName = 'ExpandablePanel'
