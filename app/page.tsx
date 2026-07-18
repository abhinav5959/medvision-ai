'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TopNav, type View } from '@/components/top-nav'
import { LandingHero } from '@/components/landing-hero'
import { SpecialtySelector } from '@/components/specialty-selector'
import { ScanUploader } from '@/components/scan-uploader'
import { RadiologyChamber } from '@/components/radiology-chamber'
import { AnalysisPipeline } from '@/components/analysis-pipeline'
import { ResultView } from '@/components/result-view'
import { ReportView } from '@/components/report-view'
import { AmbientBackground } from '@/components/ambient-background'
import { detectModality, type ModalityResult } from '@/lib/modality-detector'
import { useAnalyzeStudy } from '@/hooks/useAnalyzeStudy'

export default function Page() {
  const [view, setView] = useState<View>('landing')
  const [fileName, setFileName] = useState('wrist-lateral-view.dcm')
  const [modality, setModality] = useState<ModalityResult>({
    specialtyId: 'ortho-fracture',
    displayName: 'Orthopedic Fracture Analysis',
    organKey: 'bones',
    modality: 'Radiography',
  })
  const [fileObj, setFileObj] = useState<File | null>(null)

  const analyzeMutation = useAnalyzeStudy()

  const handleNavigate = useCallback((newView: View) => {
    setView(newView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleScanReady = useCallback((fileName: string, file: File) => {
    setFileName(fileName)
    setFileObj(file)
    const detected = detectModality(fileName)
    setModality(detected)
    setView('chamber')
  }, [])

  const handleChamberComplete = useCallback(() => {
    setView('analysis')
    if (fileObj) {
      analyzeMutation.mutate(fileObj)
    }
  }, [fileObj, analyzeMutation])

  const handlePipelineComplete = useCallback(() => {
    setView('result')
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />

      {view !== 'chamber' && <TopNav view={view} onNavigate={handleNavigate} />}

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <LandingHero onNavigate={handleNavigate} />
          </motion.main>
        )}

        {view === 'specialty' && (
          <motion.main
            key="specialty"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <SpecialtySelector onNavigate={handleNavigate} />
          </motion.main>
        )}

        {view === 'upload' && (
          <motion.main
            key="upload"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <ScanUploader onScanReady={handleScanReady} />
          </motion.main>
        )}

        {view === 'analysis' && (
          <motion.main
            key="analysis"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisPipeline 
              isPending={analyzeMutation.isPending}
              isSuccess={analyzeMutation.isSuccess}
              isError={analyzeMutation.isError}
              error={analyzeMutation.error}
              onComplete={handlePipelineComplete} 
              onRetry={() => {
                if (fileObj) analyzeMutation.mutate(fileObj)
              }}
              onCancel={() => setView('upload')}
            />
          </motion.main>
        )}

        {view === 'result' && analyzeMutation.data && (
          <motion.main
            key="result"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <ResultView result={analyzeMutation.data} onNavigate={handleNavigate} />
          </motion.main>
        )}

        {view === 'report' && analyzeMutation.data && (
          <motion.main
            key="report"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <ReportView result={analyzeMutation.data} onNavigate={handleNavigate} />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Chamber renders outside main container for full-screen immersion */}
      {view === 'chamber' && (
        <RadiologyChamber
          fileName={fileName}
          detectedModality={modality.displayName}
          detectedOrganKey={modality.organKey}
          onComplete={handleChamberComplete}
        />
      )}
    </div>
  )
}
