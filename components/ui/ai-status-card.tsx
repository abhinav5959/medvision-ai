'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { BrainCircuit, Layers, Cpu, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AiStateStatus = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'CONNECTED' | 'ONLINE'

export interface AiStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: AiStateStatus
  confidence?: number
  activeMaps?: { label: string; active: boolean; color: string }[]
  neuralLayersCount?: number
  activeLayerIndex?: number
}

export const AiStatusCard = React.forwardRef<HTMLDivElement, AiStatusCardProps>(
  (
    {
      status = 'ONLINE',
      confidence = 94.6,
      activeMaps = [
        { label: 'Feature Map', active: true, color: '#22d3ee' },
        { label: 'Attention Map', active: true, color: '#3b82f6' },
        { label: 'Activation', active: true, color: '#a78bfa' },
        { label: 'Gradient', active: true, color: '#34d399' },
      ],
      neuralLayersCount = 6,
      activeLayerIndex = 6,
      className,
      ...props
    },
    ref,
  ) => {
    const layerNames = [
      'Input Layer',
      'Conv Block 1',
      'Conv Block 2',
      'Conv Block 3',
      'Dense Layer',
      'Output',
    ]

    return (
      <div
        ref={ref}
        className={cn('glass-strong rounded-3xl p-6 space-y-6', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-cyan" />
          <h3 className="font-display text-lg font-semibold">AI Thinking</h3>
          <motion.span
            className="ml-auto text-[10px] font-mono text-cyan/70 uppercase tracking-widest flex items-center gap-1.5"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="h-2 w-2 rounded-full bg-cyan" />
            {status}
          </motion.span>
        </div>

        {/* Confidence Display */}
        <div className="text-center py-2">
          <div className="font-mono text-5xl font-bold text-cyan animate-confidence-glow">
            {confidence.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Overall Confidence
          </div>
        </div>

        {/* Neural Layers Progress */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Neural Layers
            </span>
          </div>
          <div className="space-y-2.5">
            {layerNames.slice(0, neuralLayersCount).map((layer, i) => {
              const isLayerActive = i < activeLayerIndex
              return (
                <div key={layer} className="flex items-center gap-3">
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: isLayerActive ? '#22d3ee' : 'rgba(34,211,238,0.15)' }}
                    animate={
                      isLayerActive
                        ? {
                            boxShadow: [
                              '0 0 0 0 rgba(34,211,238,0)',
                              '0 0 8px 2px rgba(34,211,238,0.6)',
                              '0 0 0 0 rgba(34,211,238,0)',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span
                    className={cn(
                      'text-xs',
                      isLayerActive ? 'text-surface-foreground font-medium' : 'text-muted-foreground/40',
                    )}
                  >
                    {layer}
                  </span>
                  <div className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: isLayerActive
                          ? 'linear-gradient(90deg, #22d3ee, #3b82f6)'
                          : 'transparent',
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: isLayerActive ? '100%' : '0%' }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Explainability Maps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Active Maps
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {activeMaps.map((m) => (
              <motion.div
                key={m.label}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: m.active ? `${m.color}12` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${m.active ? m.color + '44' : 'rgba(255,255,255,0.05)'}`,
                  boxShadow: m.active ? `0 0 16px ${m.color}33` : 'none',
                }}
                animate={m.active ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.97 }}
                transition={{ duration: 0.5 }}
              >
                <ScanLine
                  className="h-5 w-5 mx-auto"
                  style={{ color: m.active ? m.color : 'rgba(255,255,255,0.15)' }}
                />
                <div
                  className="mt-1 text-[10px] font-mono uppercase tracking-wider"
                  style={{ color: m.active ? m.color : 'rgba(255,255,255,0.2)' }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  },
)
AiStatusCard.displayName = 'AiStatusCard'
