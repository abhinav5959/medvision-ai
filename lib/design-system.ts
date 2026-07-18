/**
 * MedVision AI — Design System & Architecture Tokens
 * Centralized, type-safe tokens across the entire platform.
 */

export type ClinicalTone = 'normal' | 'attention' | 'critical'
export type GlassVariant = 'default' | 'strong' | 'subtle' | 'holographic'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon'
export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Core Color Palette & Tones
 */
export const colors = {
  background: '#050b14',
  foreground: '#e8f4f8',
  surface: '#0a1622',
  surfaceForeground: '#cfe6ef',
  card: '#0b1826',
  cardForeground: '#e8f4f8',
  muted: '#16283a',
  mutedForeground: '#7d97a8',
  border: '#1c3247',
  ring: '#22d3ee',
  // Accents
  cyan: '#22d3ee',
  blue: '#3b82f6',
  purple: '#a78bfa',
  emerald: '#34d399',
  amber: '#fbbf24',
  critical: '#fb5779',
} as const

/**
 * Clinical Severity & Status Tone Mappings
 */
export const clinicalTones: Record<
  ClinicalTone,
  {
    text: string
    bg: string
    border: string
    hex: string
    glow: string
    label: string
  }
> = {
  normal: {
    text: 'text-emerald',
    bg: 'bg-emerald/10',
    border: 'border-emerald/30',
    hex: '#34d399',
    glow: '0 0 16px rgba(52, 211, 153, 0.4)',
    label: 'Normal / Verified',
  },
  attention: {
    text: 'text-amber',
    bg: 'bg-amber/10',
    border: 'border-amber/30',
    hex: '#fbbf24',
    glow: '0 0 16px rgba(251, 191, 36, 0.4)',
    label: 'Attention Required',
  },
  critical: {
    text: 'text-critical',
    bg: 'bg-critical/10',
    border: 'border-critical/30',
    hex: '#fb5779',
    glow: '0 0 20px rgba(251, 87, 121, 0.6)',
    label: 'Critical Finding',
  },
}

/**
 * Icon Size Mappings (in px or classes)
 */
export const iconSizes: Record<IconSize, { className: string; px: number }> = {
  sm: { className: 'h-3.5 w-3.5', px: 14 },
  md: { className: 'h-4 w-4', px: 16 },
  lg: { className: 'h-5 w-5', px: 20 },
  xl: { className: 'h-7 w-7', px: 28 },
}

/**
 * Glass Container Variant Styles
 */
export const glassStyles: Record<GlassVariant, string> = {
  subtle: 'glass-subtle border border-white/5 bg-white/[0.03] backdrop-blur-md',
  default: 'glass border border-white/10 bg-white/[0.05] backdrop-blur-lg',
  strong: 'glass-strong border border-cyan/15 bg-surface/90 backdrop-blur-xl shadow-lg',
  holographic:
    'glass-holographic border border-cyan/20 bg-gradient-to-br from-cyan/10 via-blue/5 to-purple/10 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(34,211,238,0.25)]',
}

/**
 * Spring Physics Configurations (Motion)
 */
export const springs = {
  snappy: { type: 'spring', stiffness: 500, damping: 30, mass: 0.8 },
  smooth: { type: 'spring', stiffness: 350, damping: 25, mass: 1 },
  gentle: { type: 'spring', stiffness: 200, damping: 20, mass: 1.2 },
  bouncy: { type: 'spring', stiffness: 450, damping: 15, mass: 0.8 },
} as const

/**
 * Standard Spacing Scale (in rems)
 */
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4.5rem', // 72px
} as const

/**
 * Border Radius Tokens
 */
export const radii = {
  sm: '0.375rem', // 6px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  full: '9999px',
} as const
