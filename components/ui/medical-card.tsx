'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Lock, ArrowRight, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTilt } from '@/lib/use-tilt'
import { useCursor } from '@/lib/cursor-context'
import { Badge } from '@/components/ui/badge'
import type { ClinicalTone } from '@/lib/design-system'

export interface MedicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  modality: string
  accentHex?: string
  status?: ClinicalTone | 'active' | 'coming-soon'
  statusLabel?: string
  scansCount?: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  onSelect?: () => void
}

export const MedicalCard = React.forwardRef<HTMLDivElement, MedicalCardProps>(
  (
    {
      title,
      subtitle,
      modality,
      accentHex = '#22d3ee',
      status = 'active',
      statusLabel = 'Active Pipeline',
      scansCount,
      icon: IconOrNode,
      onSelect,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const [hovered, setHovered] = React.useState(false)
    const { ref: tiltRef, cursorX, cursorY } = useTilt({ maxRotation: 4, scale: 1.02 })
    const { setVariant, setLabel } = useCursor()

    const isActive = status !== 'coming-soon'

    const handleEnter = () => {
      setHovered(true)
      if (isActive) {
        setVariant('analyzing')
        setLabel('SCAN READY')
      } else {
        setVariant('hover')
        setLabel('COMING SOON')
      }
    }

    const handleLeave = () => {
      setHovered(false)
      setVariant('default')
      setLabel(null)
    }

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

    const hoverParticles = React.useMemo(
      () =>
        Array.from({ length: 5 }).map((_, i) => ({
          id: i,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          size: 2 + Math.random() * 3,
          dur: 2 + Math.random() * 3,
          delay: Math.random() * 1.5,
        })),
      [],
    )

    return (
      <motion.div
        ref={setRef as any}
        onClick={isActive ? onSelect : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={cn(
          'group relative flex h-72 flex-col overflow-hidden rounded-[1.75rem] p-6 text-left transition-all duration-500 select-none',
          hovered ? 'glass-holographic' : 'glass-strong',
          isActive ? 'cursor-pointer' : 'cursor-default opacity-75',
          className,
        )}
        style={{
          boxShadow: hovered
            ? `0 0 50px -10px ${accentHex}55, 0 0 0 1px ${accentHex}44`
            : `0 0 0 1px ${accentHex}22`,
        }}
        {...(props as any)}
      >
        {/* Hover glow border */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${accentHex}66, 0 0 40px -6px ${accentHex}77` }}
        />

        {/* Scan-line on hover */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span
            className="animate-scan-line absolute inset-x-0 h-24"
            style={{ background: `linear-gradient(to bottom, transparent, ${accentHex}30, transparent)` }}
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${accentHex}14 1px, transparent 1px), linear-gradient(90deg, ${accentHex}14 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />
        </span>

        {/* Cursor reflection */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-screen"
          style={{
            background: `radial-gradient(circle 120px at ${cursorX}px ${cursorY}px, ${accentHex}40, transparent 100%)`,
          }}
        />

        {/* Corner glow */}
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: `${accentHex}30`, opacity: 0.4 }}
        />

        {/* Hover particles */}
        {hovered &&
          isActive &&
          hoverParticles.map((p) => (
            <motion.span
              key={p.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: accentHex,
                boxShadow: `0 0 6px ${accentHex}`,
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: -30 }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
            />
          ))}

        {/* Coming Soon overlay */}
        {!isActive && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[1.75rem]">
            <motion.div
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
              style={{ borderColor: `${accentHex}40`, background: `${accentHex}10`, color: accentHex }}
              animate={hovered ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Lock className="h-3.5 w-3.5" />
              Coming Soon
            </motion.div>
          </div>
        )}

        {/* Header slot */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="relative">
            <motion.span
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${accentHex}1f`, color: accentHex }}
              animate={hovered ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {React.isValidElement(IconOrNode)
                ? IconOrNode
                : typeof IconOrNode === 'function' || (IconOrNode && typeof IconOrNode === 'object' && '$$typeof' in IconOrNode)
                  ? React.createElement(IconOrNode as any, { className: 'h-7 w-7' })
                  : IconOrNode}
            </motion.span>
            <span
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: `0 0 0 0 ${accentHex}55`, animation: 'pulse-ring 2.6s ease-out infinite' }}
            />
            {hovered && isActive && (
              <motion.span
                className="absolute inset-[-4px] rounded-2xl border"
                style={{ borderColor: `${accentHex}40` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium',
              status === 'normal'
                ? 'text-emerald'
                : status === 'attention'
                  ? 'text-amber'
                  : status === 'critical'
                    ? 'text-critical'
                    : 'text-cyan',
            )}
          >
            <CircleDot className="h-3 w-3" />
            {statusLabel}
          </span>
        </div>

        {/* Heartbeat line on hover */}
        {hovered && isActive && (
          <div className="absolute right-6 top-20 w-24 h-8 opacity-50">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <motion.path
                d="M0 15 H25 l5 -10 l6 20 l5 -10 H60 l3 -6 l3 12 l3 -6 H100"
                fill="none"
                stroke={accentHex}
                strokeWidth={1.5}
                strokeDasharray="200"
                initial={{ strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                style={{ filter: `drop-shadow(0 0 3px ${accentHex})` }}
              />
            </svg>
          </div>
        )}

        {/* Body */}
        <div className="relative z-10 mt-auto">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {modality}
          </div>
          <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
          {subtitle && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-xs text-muted-foreground">
            {scansCount && (
              <>
                <span className="font-mono" style={{ color: accentHex }}>
                  {scansCount}
                </span>{' '}
                {isActive ? 'scans' : ''}
              </>
            )}
          </span>
          {isActive ? (
            <motion.span
              className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-all duration-300"
              style={{ color: accentHex }}
              animate={
                hovered
                  ? { backgroundColor: `${accentHex}18`, paddingLeft: 14, paddingRight: 14 }
                  : { backgroundColor: 'transparent' }
              }
            >
              Start Analysis
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <span className="text-xs text-muted-foreground/50">In Validation</span>
          )}
        </div>
      </motion.div>
    )
  },
)
MedicalCard.displayName = 'MedicalCard'
