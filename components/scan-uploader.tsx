'use client'

import { useCallback, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeader, UploadArea, GlowButton } from '@/components/ui'

interface ScanUploaderProps {
  onScanReady: (fileName: string, file: File) => void
}

export function ScanUploader({ onScanReady }: ScanUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileObj, setFileObj] = useState<File | null>(null)
  const [scannerActive, setScannerActive] = useState(false)

  const handleFileSelect = useCallback((file: File) => {
    setFileName(file.name)
    setFileObj(file)
    setScannerActive(true)
  }, [])

  const handleFileRemove = useCallback(() => {
    setFileName(null)
    setFileObj(null)
    setScannerActive(false)
  }, [])

  const handleLaunch = useCallback(() => {
    if (fileName && fileObj) onScanReady(fileName, fileObj)
  }, [fileName, fileObj, onScanReady])

  return (
    <div className="mx-auto max-w-4xl px-5 pt-28 pb-20">
      <SectionHeader
        align="center"
        eyebrow="Acquisition Bay"
        title="Load a Study"
        description="Upload your orthopedic X-ray into the scanner chamber. The AI will automatically detect the imaging region and route to the fracture analysis engine."
      />

      <UploadArea
        selectedFile={fileName}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        scannerActive={scannerActive}
        acceptedExtensions={['.dcm', '.png', '.jpg', '.jpeg']}
      />

      <div className="mt-8 flex justify-center">
        <GlowButton
          disabled={!fileName}
          onClick={handleLaunch}
          iconRight={<ArrowRight className="h-4 w-4" />}
        >
          Enter Intelligence Chamber
        </GlowButton>
      </div>
    </div>
  )
}

