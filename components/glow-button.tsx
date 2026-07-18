'use client'

import * as React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'

type BackwardVariant = 'cyan' | 'ghost' | 'outline' | 'primary' | 'secondary' | 'danger'

export interface GlowButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: BackwardVariant
}

export function GlowButton({ variant = 'cyan', ...props }: GlowButtonProps) {
  const mappedVariant =
    variant === 'cyan'
      ? 'primary'
      : variant === 'outline'
        ? 'secondary'
        : variant === 'ghost'
          ? 'ghost'
          : variant === 'danger'
            ? 'danger'
            : 'primary'

  return <Button variant={mappedVariant} {...props} />
}
