'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Eye,
  Flame,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Contrast,
  FileText,
  CheckCircle2,
  ChevronRight,
  ScanLine,
  ArrowRight,
} from 'lucide-react'
import { type AnalysisResult } from '@/types'
import type { View } from '@/components/top-nav'
import { cn } from '@/lib/utils'
import {
  SectionHeader,
  GlowButton,
  Alert,
  InfoPanel,
  ProgressBar,
  GlassContainer,
  Badge,
} from '@/components/ui'

type OverlayMode = 'original' | 'heatmap'

const toneColor: Record<string, { text: string; bg: string; border: string }> = {
  normal: { text: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/30' },
  attention: { text: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30' },
  critical: { text: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/30' },
}

interface ResultViewProps {
  result: AnalysisResult
  onNavigate: (v: View) => void
}

export function ResultView({ result, onNavigate }: ResultViewProps) {
  const [mode, setMode] = useState<OverlayMode>(result.gradcamUrl ? 'heatmap' : 'original')
  const [zoom, setZoom] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)

  const severityTone = result.severityTone || 'normal'
  const severityColors = toneColor[severityTone]
  
  const handleZoom = useCallback((dir: 'in' | 'out') => {
    setZoom((z) => Math.max(0.5, Math.min(3, dir === 'in' ? z + 0.25 : z - 0.25)))
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setBrightness(100)
    setContrast(100)
    setMode('original')
  }, [])

  const overlayModes: { id: OverlayMode; label: string; icon: typeof Eye }[] = [
    { id: 'original', label: 'Original', icon: Eye },
    { id: 'heatmap', label: 'Grad-CAM', icon: Flame },
  ]

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20">
      <SectionHeader
        eyebrow="Diagnostic Workstation"
        title="Analysis Results"
        action={
          <GlowButton variant="secondary" onClick={() => onNavigate('report')} iconLeft={<FileText className="h-4 w-4" />}>
            View Report
          </GlowButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Main Viewer */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {overlayModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all outline-none',
                  mode === m.id ? 'glass glow-ring-cyan text-cyan' : 'bg-white/5 text-muted-foreground hover:bg-white/10',
                )}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            ))}
            <div className="h-5 w-px bg-white/10 mx-1" />
            <button onClick={() => handleZoom('in')} className="rounded-full p-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"><ZoomIn className="h-4 w-4" /></button>
            <button onClick={() => handleZoom('out')} className="rounded-full p-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"><ZoomOut className="h-4 w-4" /></button>
            <button onClick={handleReset} className="rounded-full p-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"><RotateCcw className="h-4 w-4" /></button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sun className="h-3.5 w-3.5" />
              <input type="range" min={50} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="h-1 w-20 accent-cyan" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Contrast className="h-3.5 w-3.5" />
              <input type="range" min={50} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="h-1 w-20 accent-cyan" />
            </div>
          </div>

          {/* Image stage */}
          <motion.div
            className="scanner-chamber relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#081018]"
            style={{ minHeight: 480 }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              animate={{ scale: zoom }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            >
              <div className="relative flex h-full w-full max-w-md items-center justify-center">
                {/* Fallback svg if no real image */}
                <svg viewBox="0 0 320 400" className="w-full h-full opacity-80 absolute inset-0 m-auto">
                  <defs>
                    <radialGradient id="xrayGrad" cx="50%" cy="45%" r="60%">
                      <stop offset="0%" stopColor="rgba(200,210,220,0.8)" />
                      <stop offset="100%" stopColor="rgba(30,40,50,0.4)" />
                    </radialGradient>
                  </defs>
                  <rect width="320" height="400" fill="rgba(15,20,28,0.95)" rx="8" />
                  <path d="M130 60 C128 100 125 200 124 280 C123 320 128 360 130 380" fill="none" stroke="rgba(200,215,230,0.7)" strokeWidth="18" strokeLinecap="round" />
                  <path d="M180 60 C182 100 185 200 186 280 C187 320 182 360 180 380" fill="none" stroke="rgba(200,215,230,0.65)" strokeWidth="14" strokeLinecap="round" />
                  <ellipse cx="155" cy="50" rx="45" ry="25" fill="rgba(200,215,230,0.3)" />
                  <ellipse cx="155" cy="390" rx="50" ry="20" fill="rgba(200,215,230,0.25)" />
                </svg>

                <AnimatePresence>
                  {mode === 'heatmap' && result.gradcamUrl && (
                    <motion.img
                      src={result.gradcamUrl.startsWith('data:') || result.gradcamUrl.startsWith('http') ? result.gradcamUrl : `http://localhost:8000${result.gradcamUrl}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 object-contain w-full h-full mix-blend-screen"
                    />
                  )}
                  {mode === 'heatmap' && !result.gradcamUrl && (
                     <motion.div
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       transition={{ duration: 0.6 }}
                       className="absolute inset-0 rounded-lg overflow-hidden"
                     >
                       <motion.div
                         className="absolute"
                         style={{
                           left: '25%', top: '55%', width: '50%', height: '20%',
                           background: 'radial-gradient(ellipse, rgba(251,87,121,0.7), rgba(251,87,121,0.4) 40%, rgba(245,158,11,0.2) 70%, transparent)',
                           filter: 'blur(12px)',
                         }}
                         animate={{ opacity: [0.6, 0.9, 0.6], scale: [0.95, 1.05, 0.95] }}
                         transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                       />
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Scan laser */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="animate-scan-line absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
            </div>
            
            <div className="absolute top-3 left-3 font-mono text-[9px] text-cyan/40 space-y-0.5">
              <div>{result.studyType}</div>
              <div>ZOOM: {(zoom * 100).toFixed(0)}%</div>
            </div>
            <div className="absolute top-3 right-3 font-mono text-[9px] text-cyan/40 text-right space-y-0.5">
              <div>MODE: {mode.toUpperCase()}</div>
              <div>B:{brightness} C:{contrast}</div>
            </div>
          </motion.div>

          <Alert variant="warning" title="Preliminary AI Findings">
            AI-generated preliminary findings. This is NOT a diagnostic report. All findings must be reviewed and confirmed by a qualified radiologist.
          </Alert>
        </div>

        {/* Right — Findings Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 self-start lg:sticky lg:top-28"
        >
          <InfoPanel
            eyebrow="Primary Impression"
            title={result.primaryImpression}
            icon={<ScanLine className="h-4 w-4" />}
            collapsible={false}
          />

          <GlassContainer variant="strong" className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-1">AI Confidence</div>
                <div className="font-mono text-4xl font-bold text-cyan animate-confidence-glow">{result.overallConfidence.toFixed(1)}%</div>
              </div>
              <Badge
                tone={severityTone as any}
                className={cn('px-3 py-1.5 text-xs font-medium', severityColors.bg, severityColors.text, 'border', severityColors.border)}
              >
                {result.severity}
              </Badge>
            </div>
          </GlassContainer>

          <GlassContainer variant="strong" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-cyan" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Vision AI Indicators</span>
            </div>
            <div className="space-y-3.5">
              {result.findings.map((finding, i) => {
                const toneMap: Record<string, 'cyan' | 'critical' | 'default'> = {
                  critical: 'critical',
                  attention: 'cyan',
                  normal: 'default',
                }
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <ProgressBar
                      value={finding.confidence}
                      max={100}
                      label={finding.label}
                      showLabel
                      tone={toneMap[finding.tone] || 'cyan'}
                    />
                  </motion.div>
                )
              })}
            </div>
          </GlassContainer>

          <InfoPanel
            eyebrow="Clinical Synthesis"
            title="Overview & Findings"
            collapsible={true}
            defaultOpen={true}
          >
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">{result.summary}</p>
            {result.nextSteps.length > 0 && (
              <>
                <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/80 mb-2">Recommended Next Step</h4>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3.5 w-3.5 text-cyan flex-shrink-0 mt-0.5" />
                  {result.nextSteps[0]}
                </div>
              </>
            )}
          </InfoPanel>

          <GlowButton className="w-full" onClick={() => onNavigate('report')} iconRight={<ArrowRight className="h-4 w-4" />}>
            Generate Full Report
          </GlowButton>
        </motion.div>
      </div>
    </div>
  )
}
