import type { AnalysisResult, AnalysisResponseDTO, Finding } from '@/types'

const getSeverityTone = (severity?: string): 'normal' | 'attention' | 'critical' => {
  if (!severity) return 'normal'
  const lower = severity.toLowerCase()
  if (lower.includes('high') || lower.includes('severe') || lower.includes('critical')) return 'critical'
  if (lower.includes('moderate') || lower.includes('medium')) return 'attention'
  return 'normal'
}

const PRODUCTION_BACKEND_URL = 'https://medvision-ai-production-03cd.up.railway.app'

export const pingBackendWarmup = async (): Promise<boolean> => {
  let healthUrl = `${PRODUCTION_BACKEND_URL}/health`
  if (process.env.NEXT_PUBLIC_API_URL) {
    let base = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, '')
    if (base && !base.startsWith('http://') && !base.startsWith('https://')) {
      base = `https://${base}`
    }
    healthUrl = `${base}/health`
  } else if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    healthUrl = 'http://localhost:8000/health'
  }

  try {
    const res = await fetch(healthUrl, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

export const analyzeOrthopedicScan = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData()
  formData.append('file', file)

  let endpoint = `${PRODUCTION_BACKEND_URL}/api/v1/orthopedics/analyze`
  if (process.env.NEXT_PUBLIC_API_URL) {
    let base = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, '')
    if (base && !base.startsWith('http://') && !base.startsWith('https://')) {
      base = `https://${base}`
    }
    endpoint = `${base}/api/v1/orthopedics/analyze`
  } else if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    endpoint = 'http://localhost:8000/api/v1/orthopedics/analyze'
  }

  // Extended 10-attempt retry window (40s) to gracefully absorb Render free-tier cold starts
  let response: Response | null = null
  let lastError: any = null
  const MAX_ATTEMPTS = 10

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) break
      
      // If server returned 502/503/504 (Render cold-start spin up), retry after delay
      if ([502, 503, 504].includes(response.status) && attempt < MAX_ATTEMPTS) {
        await new Promise((res) => setTimeout(res, 4000))
        continue
      }
      
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Server returned status ${response.status}`)
    } catch (err: any) {
      lastError = err
      if (attempt < MAX_ATTEMPTS && (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed'))) {
        // Network error (often CORS/502 on spin-up), retry after 4s delay
        await new Promise((res) => setTimeout(res, 4000))
        continue
      }
      throw err
    }
  }

  if (!response || !response.ok) {
    throw lastError || new Error('Failed to connect to AI server. Please retry.')
  }

  const data: AnalysisResponseDTO = await response.json()
  
  if (!data.success) {
    throw new Error('Analysis unsuccessful')
  }

  if (data.quality_assessment && !data.quality_assessment.analysis_possible) {
    throw new Error(data.quality_assessment.reason || 'Image quality assessment failed. Please upload a valid X-ray scan.')
  }

  // Construct findings array from the backend response
  const findings: Finding[] = []
  if (data.investigation) {
    findings.push({
      label: data.investigation.fracture_detected ? 'Fracture Detected' : 'No Fracture Detected',
      confidence: data.investigation.binary_confidence * 100,
      tone: data.investigation.fracture_detected ? 'critical' : 'normal',
    })
    findings.push({
      label: `Type: ${data.investigation.fracture_type}`,
      confidence: data.investigation.classification_confidence * 100,
      tone: 'attention',
    })
  }

  // Map backend DTO to frontend domain model
  return {
    patientId: 'MV-' + Math.floor(100000 + Math.random() * 899999),
    patientName: 'Anonymized Patient',
    age: 45,
    sex: 'Unknown',
    studyType: data.investigation?.body_part || 'Orthopedic Scan',
    studyDate: data.explainability?.inference_timestamp 
      ? new Date(data.explainability.inference_timestamp).toLocaleDateString()
      : new Date().toLocaleDateString(),
    primaryImpression: data.clinical_summary?.overview || data.investigation?.fracture_type || 'No significant findings',
    severity: data.clinical_summary?.severity || 'Assessed',
    severityTone: getSeverityTone(data.clinical_summary?.severity),
    overallConfidence: data.investigation ? (data.investigation.classification_confidence * 100) : 99,
    findings,
    summary: data.clinical_summary?.findings || '',
    nextSteps: data.consensus?.recommended_next_step ? [data.consensus.recommended_next_step] : [],
    gradcamUrl: data.explainability?.gradcam_image_url,
    medicalDebate: data.medical_debate,
    consensus: data.consensus,
    doctorGuidance: data.doctor_guidance
  }
}
