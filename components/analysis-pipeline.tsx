'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { AiCore } from '@/components/ai-core'
import type { AiCoreState } from '@/components/ai-core'
import {
  SectionHeader,
  ProgressBar,
  Timeline,
  TimelineStep,
  AiStatusCard,
  Alert,
  GlowButton,
  Button
} from '@/components/ui'
import { AlertCircle, RotateCcw, XCircle } from 'lucide-react'

/**
 * 12-stage AI analysis pipeline with live thinking panel.
 */

const pipelineSteps = [
  'Uploading Scan',
  'Medical Image Validation',
  'Bone Region Detection',
  'Image Preprocessing',
  'Feature Extraction',
  'Deep CNN Analysis',
  'Fracture Pattern Recognition',
  'Grad-CAM Explainability',
  'Fracture Classification',
  'Confidence Calibration',
  'Generating Findings',
  'Analysis Complete',
]

interface AnalysisPipelineProps {
  isPending: boolean
  isSuccess: boolean
  isError?: boolean
  error?: Error | null
  onComplete: () => void
  onRetry?: () => void
  onCancel?: () => void
}

export function AnalysisPipeline({ isPending, isSuccess, isError, error, onComplete, onRetry, onCancel }: AnalysisPipelineProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [confidence, setConfidence] = useState(0)
  const hasCompleted = useRef(false)

  // Reactive step advancement based on real mutation state
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isError) {
      // If error occurs, we halt progress
      return
    }
    if (isPending) {
      // While pending, advance up to the second-to-last step
      timer = setInterval(() => {
        setActiveStep((prev) => (prev < pipelineSteps.length - 2 ? prev + 1 : prev))
      }, 150)
    } else if (isSuccess) {
      // When successful, jump to the final step immediately
      setActiveStep(pipelineSteps.length)
    }
    return () => clearInterval(timer)
  }, [isPending, isSuccess, isError])

  // Trigger completion callback
  useEffect(() => {
    if (isSuccess && !hasCompleted.current) {
      hasCompleted.current = true
      // Brief delay to allow the "Complete" animation to play before transitioning
      setTimeout(onComplete, 800)
    }
  }, [isSuccess, onComplete])

  // Confidence animation
  useEffect(() => {
    if (isError) return
    const targetConf = Math.min((activeStep / pipelineSteps.length) * 94 + (activeStep > 8 ? 6 : 0), 94)
    const dur = 400
    const steps = 20
    const start = confidence
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      setConfidence(parseFloat((start + (targetConf - start) * progress).toFixed(1)))
      if (step >= steps) clearInterval(timer)
    }, dur / steps)
    return () => clearInterval(timer)
  }, [activeStep, isError, confidence])

  const done = activeStep >= pipelineSteps.length
  const aiState: AiCoreState = isError ? 'error' : done ? 'connected' : activeStep > 4 ? 'scanning' : 'idle'
  const progressPct = Math.min((activeStep / pipelineSteps.length) * 100, 100)

  const activeMaps = useMemo(() => [
    { label: 'Feature Map', active: activeStep >= 4, color: '#22d3ee' },
    { label: 'Attention Map', active: activeStep >= 5, color: '#3b82f6' },
    { label: 'Activation', active: activeStep >= 6, color: '#a78bfa' },
    { label: 'Gradient', active: activeStep >= 7, color: '#34d399' },
  ], [activeStep])

  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-20">
      <SectionHeader
        eyebrow={isError ? 'Pipeline Failure' : 'Neural Pipeline'}
        title={isError ? 'Analysis Interrupted' : 'AI Investigation in Progress'}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — Pipeline */}
        <div className="space-y-6">
          {/* AI Core */}
          <div className="flex justify-center">
            <AiCore state={aiState} size={80} />
          </div>

          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Alert 
                variant="critical" 
                title="System Error" 
                icon={<AlertCircle className="h-5 w-5" />}
              >
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-sm text-red-200">
                    {error?.message || 'The neural pipeline encountered a critical error and could not complete the investigation. The backend services might be unavailable.'}
                  </p>
                  <div className="flex gap-3">
                    {onRetry && (
                      <GlowButton 
                        size="sm" 
                        onClick={onRetry} 
                        iconLeft={<RotateCcw className="h-4 w-4" />}
                      >
                        Retry Analysis
                      </GlowButton>
                    )}
                    {onCancel && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={onCancel}
                        iconLeft={<XCircle className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}

          {/* Progress Bar */}
          <ProgressBar value={progressPct} max={100} tone={isError ? 'critical' : 'cyan'} />

          {!isError && isPending && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-mono text-[11px] text-cyan/70 flex items-center justify-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-cyan animate-ping" />
              <span>Connecting to Neural Engine... (Free-tier cloud container warm-up active)</span>
            </motion.div>
          )}

          {/* Steps */}
          <Timeline>
            {pipelineSteps.map((step, i) => {
              const isDone = i < activeStep
              const isActive = i === activeStep - 1 || (i === activeStep && activeStep < pipelineSteps.length)
              let status: 'completed' | 'active' | 'pending' | 'error' = isDone ? 'completed' : isActive ? 'active' : 'pending'
              
              if (isError && isActive) {
                status = 'error'
              }

              return (
                <TimelineStep
                  key={step}
                  title={step}
                  status={status}
                  index={i}
                />
              )
            })}
          </Timeline>
        </div>

        {/* Right — Live AI Thinking Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="self-start lg:sticky lg:top-28"
        >
          <AiStatusCard
            status={isError ? 'ERROR' : done ? 'ONLINE' : activeStep > 4 ? 'ANALYZING' : 'SCANNING'}
            confidence={confidence}
            activeLayerIndex={Math.min(6, Math.max(0, Math.floor((activeStep - 1) / 2) + 1))}
            activeMaps={activeMaps}
          />
        </motion.div>
      </div>
    </div>
  )
}
