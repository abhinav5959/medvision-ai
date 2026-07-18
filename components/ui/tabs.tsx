'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
  children?: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className, children }) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-full glass p-1.5 border border-white/10 no-scrollbar">
        {items.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap outline-none select-none',
                isActive ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-full bg-cyan/15 ring-1 ring-cyan/40"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {tab.icon && <span className="relative z-10 flex-shrink-0">{tab.icon}</span>}
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="relative z-10 ml-1 rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-cyan">
                  {tab.badge}
                </span>
              )}
            </button>
          )}
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
