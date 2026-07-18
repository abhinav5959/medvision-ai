'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'
import { glassStyles, type GlassVariant } from '@/lib/design-system'

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: GlassVariant
  interactive?: boolean
  glowColor?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, glowColor, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          interactive
            ? {
                y: -4,
                boxShadow: glowColor
                  ? `0 12px 36px -8px ${glowColor}, 0 0 0 1px rgba(34,211,238,0.3)`
                  : '0 12px 36px -8px rgba(34,211,238,0.25), 0 0 0 1px rgba(34,211,238,0.3)',
              }
            : undefined
        }
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={cn(
          'relative rounded-3xl overflow-hidden transition-all duration-300',
          glassStyles[variant],
          interactive && 'cursor-pointer hover:border-cyan/40',
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 sm:p-7', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display text-xl font-semibold leading-none tracking-tight text-foreground', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-muted-foreground pt-1', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 sm:p-7 pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 sm:p-7 pt-0 border-t border-white/5 mt-auto', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'
