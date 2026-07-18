'use client'

import { useMutation } from '@tanstack/react-query'
import { analyzeOrthopedicScan } from '@/services/api'
import type { AnalysisResult } from '@/types'

export const useAnalyzeStudy = () => {
  return useMutation<AnalysisResult, Error, File>({
    mutationFn: (file: File) => analyzeOrthopedicScan(file),
  })
}
