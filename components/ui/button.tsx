'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTilt } from '@/lib/use-tilt'
import { useCursor } from '@/lib/cursor-context'
import type { ButtonVariant, ComponentSize } from '@/lib/design-system'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ComponentSize
  isLoading?: boolean
  loadingText?: string
  enableTilt?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'text-cyan-foreground bg-cyan border-transparent shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)] hover:bg-cyan/95',
  secondary:
    'text-cyan border-cyan/40 bg-cyan/5 hover:bg-cyan/10 shadow-[0_0_20px_-8px_rgba(34,211,238,0.6)]',
  ghost:
    'text-surface-foreground border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20',
  danger:
    'text-white bg-critical/90 border-transparent shadow-[0_0_30px_-4px_rgba(251,87,121,0.7)] hover:bg-critical',
}

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'px-4 py-1.5 text-xs rounded-full gap-1.5',
  md: 'px-7 py-3 text-sm rounded-full gap-2',
  lg: 'px-8 py-3.5 text-base rounded-full gap-2.5',
  xl: 'px-10 py-4 text-lg rounded-full gap-3',
  icon: 'h-10 w-10 p-0 rounded-full flex items-center justify-center',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      enableTilt = true,
      iconLeft,
      iconRight,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      disabled,
      ...props
    },
    forwardedRef,
  ) => {
    const { ref: tiltRef, cursorX, cursorY } = useTilt({
      maxRotation: enableTilt ? 5 : 0,
      scale: enableTilt ? 1.04 : 1.01,
    })
    const { setVariant } = useCursor()

    const handleEnter = (e: any) => {
      setVariant('hover')
      if (onMouseEnter) onMouseEnter(e)
    }

    const handleLeave = (e: any) => {
      setVariant('default')
      if (onMouseLeave) onMouseLeave(e)
    }

    // Merge refs
    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        ;(tiltRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }
      },
      [tiltRef, forwardedRef],
    )

    return (
      <motion.button
        ref={setRef as any}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        whileHover={disabled || isLoading ? undefined : { scale: enableTilt ? 1.035 : 1.02, y: -1 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        disabled={disabled || isLoading}
        className={cn(
          'group relative inline-flex items-center justify-center font-medium tracking-wide transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-cyan/70 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {/* Cursor tracking sheen reflection */}
        <span
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 60px at ${cursorX}px ${cursorY}px, rgba(255,255,255,0.4), transparent 100%)`,
          }}
        />
        {/* Horizontal sweep animation on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        
        <span className="relative z-10 inline-flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-current" />
              {loadingText || children}
            </>
          ) : (
            <>
              {iconLeft}
              {children}
              {iconRight}
            </>
          )}
        </span>
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

/**
 * Backward & ergonomic alias for GlowButton
 */
export const GlowButton = Button
