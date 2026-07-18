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

  const response = await fetch('/api/v1/orthopedics/analyze', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to analyze scan')
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
