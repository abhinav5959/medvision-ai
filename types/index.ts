export interface Finding {
  label: string
  confidence: number
  tone: 'normal' | 'attention' | 'critical'
}

export interface MedicalDebateOpinion {
  role: string
  summary: string
  key_observations: string[]
  recommendations: string[]
  concerns: string[]
  confidence: number
}

export interface Consensus {
  agreement: string
  remaining_uncertainty: string
  recommended_next_step: string
  summary: string
}

export interface AnalysisResult {
  patientId: string
  patientName: string
  age: number
  sex: string
  studyType: string
  studyDate: string
  primaryImpression: string
  severity: 'Low' | 'Moderate' | 'Elevated' | 'Critical' | string
  severityTone: 'normal' | 'attention' | 'critical'
  overallConfidence: number
  findings: Finding[]
  summary: string
  nextSteps: string[]
  // Extended fields for backend integration
  gradcamUrl?: string
  medicalDebate?: MedicalDebateOpinion[]
  consensus?: Consensus
  doctorGuidance?: {
    suggested_followup: string
    recommended_imaging: string
    differential_considerations: string
    important_notes: string
  }
}

// Backend Response DTO
export interface QualityAssessmentDTO {
  analysis_possible: boolean
  reason?: string
  recommendation?: string
}

export interface InvestigationDTO {
  fracture_detected: boolean
  body_part?: string
  fracture_type: string
  binary_confidence: number
  classification_confidence: number
}

export interface ExplainabilityDTO {
  gradcam_image_url?: string
  model_name: string
  model_version: string
  processing_time: number
  inference_timestamp: string
}

export interface ClinicalSummaryDTO {
  overview: string
  findings: string
  severity?: string
  possible_complications: string
}

export interface PatientGuidanceDTO {
  first_aid: string
  precautions: string
  when_to_seek_emergency_help: string
  recovery_estimate: string
  rehabilitation_guidance: string
}

export interface DoctorGuidanceDTO {
  suggested_followup: string
  recommended_imaging: string
  differential_considerations: string
  important_notes: string
}

export interface AnalysisResponseDTO {
  success: boolean
  quality_assessment: QualityAssessmentDTO
  investigation?: InvestigationDTO
  explainability?: ExplainabilityDTO
  clinical_summary?: ClinicalSummaryDTO
  patient_guidance?: PatientGuidanceDTO
  doctor_guidance?: DoctorGuidanceDTO
  questions?: string[]
  educational?: string
  medical_debate?: MedicalDebateOpinion[]
  consensus?: Consensus
}
