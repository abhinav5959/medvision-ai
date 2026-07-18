'use client'

import * as React from 'react'
import { Modal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className }) => {
  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)} className={className}>
      {children}
    </Modal>
  )
}

export const DialogTrigger: React.FC<{
  asChild?: boolean
  onClick?: () => void
  children: React.ReactElement
}> = ({ children, onClick }) => {
  const child = children as React.ReactElement<any>
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      if (child.props.onClick) child.props.onClick(e)
      if (onClick) onClick()
    },
  })
}

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('space-y-6', className)} {...props} />,
)
DialogContent.displayName = 'DialogContent'

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col space-y-2', className)} {...props} />,
)
DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display text-2xl font-semibold leading-none tracking-tight text-foreground', className)} {...props} />
  ),
)
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-muted-foreground pt-1', className)} {...props} />
  ),
)
DialogDescription.displayName = 'DialogDescription'

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2 pt-4 border-t border-white/5', className)} {...props} />
  ),
)
DialogFooter.displayName = 'DialogFooter'
