'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UploadCloud, ImageIcon, X, Zap, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCursor } from '@/lib/cursor-context'

export interface UploadAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  selectedFile?: File | string | null
  acceptedExtensions?: string[]
  maxSizeMB?: number
  error?: string | null
  scannerActive?: boolean
}

export const UploadArea = React.forwardRef<HTMLDivElement, UploadAreaProps>(
  (
    {
      onFileSelect,
      onFileRemove,
      selectedFile,
      acceptedExtensions = ['.dcm', '.png', '.jpg', '.jpeg'],
      maxSizeMB = 50,
      error: externalError,
      scannerActive = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [dragging, setDragging] = React.useState(false)
    const [internalError, setInternalError] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const { setVariant, setLabel } = useCursor()

    const currentError = externalError || internalError

    const validateAndSelect = React.useCallback(
      (file: File) => {
        setInternalError(null)
        // Check size
        if (file.size > maxSizeMB * 1024 * 1024) {
          setInternalError(`File size exceeds ${maxSizeMB}MB limit.`)
          return
        }
        if (onFileSelect) onFileSelect(file)
      },
      [maxSizeMB, onFileSelect],
    )

    const handleFiles = React.useCallback(
      (files: FileList | null) => {
        if (files && files[0]) {
          validateAndSelect(files[0])
        }
      },
      [validateAndSelect],
    )

    const fileName =
      typeof selectedFile === 'string'
        ? selectedFile
        : selectedFile instanceof File
          ? selectedFile.name
          : null

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      setInternalError(null)
      if (onFileRemove) onFileRemove()
      if (inputRef.current) inputRef.current.value = ''
    }

    return (
      <motion.div
        ref={ref}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
          setVariant('drag')
          setLabel('DROP SCAN')
        }}
        onDragLeave={() => {
          setDragging(false)
          setVariant('default')
          setLabel(null)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          setVariant('default')
          setLabel(null)
          handleFiles(e.dataTransfer.files)
        }}
        onMouseEnter={() => {
          if (!fileName) {
            setVariant('hover')
            setLabel('LOAD SCAN')
          }
        }}
        onMouseLeave={() => {
          setVariant('default')
          setLabel(null)
        }}
        onClick={() => !fileName && inputRef.current?.click()}
        className={cn(
          'scanner-chamber relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[2rem] p-10 text-center transition-all duration-500 select-none',
          !fileName && 'cursor-pointer',
          dragging && 'glow-ring-cyan scale-[1.01]',
          scannerActive && 'glow-ring-blue',
          currentError && 'border-critical/60 shadow-[0_0_24px_rgba(251,87,121,0.3)]',
          className,
        )}
        {...props}
      >
        {/* Corner brackets */}
        {[
          { pos: 'left-4 top-4', border: 'border-l-2 border-t-2', lockX: '-4px', lockY: '-4px' },
          { pos: 'right-4 top-4', border: 'border-r-2 border-t-2', lockX: '4px', lockY: '-4px' },
          { pos: 'left-4 bottom-4', border: 'border-l-2 border-b-2', lockX: '-4px', lockY: '4px' },
          { pos: 'right-4 bottom-4', border: 'border-r-2 border-b-2', lockX: '4px', lockY: '4px' },
        ].map(({ pos, border, lockX, lockY }) => (
          <motion.span
            key={pos}
            className={`absolute h-10 w-10 rounded-[3px] ${pos} ${border}`}
            style={{
              borderColor: currentError
                ? 'rgba(251,87,121,0.8)'
                : scannerActive
                  ? 'rgba(59,130,246,0.8)'
                  : dragging
                    ? 'rgba(34,211,238,0.8)'
                    : 'rgba(34,211,238,0.4)',
              boxShadow: currentError
                ? '0 0 16px rgba(251,87,121,0.6)'
                : scannerActive
                  ? '0 0 16px rgba(59,130,246,0.6)'
                  : dragging
                    ? '0 0 12px rgba(34,211,238,0.5)'
                    : 'none',
            }}
            animate={
              scannerActive || dragging
                ? { x: [0, parseInt(lockX)], y: [0, parseInt(lockY)] }
                : {}
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Rotating scanner rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute rounded-full border border-dashed"
            style={{
              width: 280,
              height: 280,
              borderColor: scannerActive
                ? 'rgba(59,130,246,0.25)'
                : 'rgba(34,211,238,0.1)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: scannerActive ? 4 : 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: 340,
              height: 340,
              borderColor: scannerActive
                ? 'rgba(34,211,238,0.2)'
                : 'rgba(34,211,238,0.06)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: scannerActive ? 6 : 24, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border border-dotted"
            style={{ width: 400, height: 400, borderColor: 'rgba(167,139,250,0.08)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Laser alignment lines */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
            style={{ width: '70%' }}
            animate={{
              opacity: scannerActive ? [0.3, 0.8, 0.3] : [0.05, 0.15, 0.05],
              scaleX: scannerActive ? [0.8, 1, 0.8] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan/40 to-transparent"
            style={{ height: '70%' }}
            animate={{
              opacity: scannerActive ? [0.3, 0.8, 0.3] : [0.05, 0.15, 0.05],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Scan line */}
        <div className="pointer-events-none absolute inset-x-6 top-0 bottom-0 overflow-hidden">
          <div
            className="animate-scan-line absolute inset-x-0 h-1.5 rounded-full"
            style={{
              background: scannerActive
                ? 'linear-gradient(90deg, transparent, #3b82f6, transparent)'
                : 'rgb(34,211,238)',
              boxShadow: scannerActive
                ? '0 0 24px 6px rgba(59,130,246,0.8)'
                : '0 0 20px 4px rgba(34,211,238,0.8)',
            }}
          />
        </div>

        {/* Floor grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)',
          }}
        />

        <input
          ref={inputRef}
          type="file"
          accept={acceptedExtensions.join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <AnimatePresence mode="wait">
          {fileName ? (
            <motion.div
              key="loaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                <ImageIcon className="h-9 w-9" />
                <span className="absolute inset-0 animate-ping rounded-2xl border border-cyan/40" />
              </div>
              <p className="mt-4 font-medium text-foreground">{fileName}</p>
              <p className="mt-1 text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-cyan" />
                AI will analyze for fracture patterns & severity
              </p>
              <button
                type="button"
                onClick={handleRemove}
                className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-critical transition-colors"
              >
                <X className="h-3 w-3" /> Remove Study
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-cyan border border-white/10"
              >
                <UploadCloud className="h-9 w-9" />
              </motion.div>
              <p className="mt-5 font-display text-lg font-medium text-foreground">
                Drop scan to begin acquisition
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · {acceptedExtensions.map((e) => e.replace('.', '').toUpperCase()).join(', ')} supported
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60 font-mono">
                Orthopedic X-rays · Bone radiographs · Fracture studies
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message slot */}
        <AnimatePresence>
          {currentError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative z-10 mt-4 flex items-center gap-2 rounded-full bg-critical/15 border border-critical/40 px-4 py-1.5 text-xs font-medium text-critical"
            >
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{currentError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  },
)
UploadArea.displayName = 'UploadArea'
