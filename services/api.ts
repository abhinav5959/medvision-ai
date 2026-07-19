import type { AnalysisResult, AnalysisResponseDTO, Finding } from '@/types'

const getSeverityTone = (severity?: string): 'normal' | 'attention' | 'critical' => {
  if (!severity) return 'normal'
  const lower = severity.toLowerCase()
  if (lower.includes('high') || lower.includes('severe') || lower.includes('critical')) return 'critical'
  if (lower.includes('moderate') || lower.includes('medium')) return 'attention'
  return 'normal'
}

export const analyzeOrthopedicScan = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData()
  formData.append('file', file)

  let endpoint = '/api/v1/orthopedics/analyze'
  if (process.env.NEXT_PUBLIC_API_URL) {
    const base = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    endpoint = `${base}/api/v1/orthopedics/analyze`
  } else if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    endpoint = 'http://localhost:8000/api/v1/orthopedics/analyze'
  }

  // Automatic retry logic to handle Render free tier cold-starts (502 / gateway timeouts)
  let response: Response | null = null
  let lastError: any = null

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) break
      
      // If server returned 502/503/504 (Render cold-start spin up), retry after delay
      if ([502, 503, 504].includes(response.status) && attempt < 3) {
        await new Promise((res) => setTimeout(res, 3000 * attempt))
        continue
      }
      
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Server returned status ${response.status}`)
    } catch (err: any) {
      lastError = err
      if (attempt < 3 && (err.name === 'TypeError' || err.message?.includes('fetch'))) {
        // Network error (often CORS/502 on spin-up), retry after delay
        await new Promise((res) => setTimeout(res, 3000 * attempt))
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
