'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'rect' | 'circle' | 'text'
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = 'rect', className, ...props }, ref) => {
    const shapeClass =
      shape === 'circle' ? 'rounded-full' : shape === 'text' ? 'h-4 w-3/4 rounded-md' : 'rounded-2xl'

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-white/5 border border-white/5',
          shapeClass,
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan/10 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
    )
  },
)
Skeleton.displayName = 'Skeleton'
