'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'
import { glassStyles, type GlassVariant } from '@/lib/design-system'
import { useTilt } from '@/lib/use-tilt'

export interface GlassProps extends HTMLMotionProps<'div'> {
  variant?: GlassVariant
  enableTilt?: boolean
  glowRing?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'none'
}

const ringMappings: Record<string, string> = {
  cyan: 'glow-ring-cyan',
  blue: 'glow-ring-blue',
  purple: 'glow-ring-purple',
  emerald: 'glow-ring-emerald',
  none: '',
}

export const GlassContainer = React.forwardRef<HTMLDivElement, GlassProps>(
  (
    { variant = 'default', enableTilt = false, glowRing = 'none', className, children, ...props },
    forwardedRef,
  ) => {
    const { ref: tiltRef } = useTilt({ maxRotation: enableTilt ? 4 : 0, scale: enableTilt ? 1.01 : 1 })

    // Merge refs
    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ;(tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [tiltRef, forwardedRef],
    )

    return (
      <motion.div
        ref={setRef as any}
        className={cn(
          'relative rounded-3xl transition-all duration-300',
          glassStyles[variant],
          ringMappings[glowRing],
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
GlassContainer.displayName = 'GlassContainer'
