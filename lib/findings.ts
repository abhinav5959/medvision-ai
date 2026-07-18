export interface QualityAssessment {
  analysis_possible: boolean
  reason?: string
  recommendation?: string
}

export interface Investigation {
  fracture_detected: boolean
  body_part?: string
  fracture_type: string
  binary_confidence: number
  classification_confidence: number
}

export interface Explainability {
  gradcam_image_url?: string
  model_name: string
  model_version: string
  processing_time: number
  inference_timestamp: string
}

export interface ClinicalSummary {
  overview: string
  findings: string
  severity?: string
  possible_complications: string
}

export interface PatientGuidance {
  first_aid: string
  precautions: string
  when_to_seek_emergency_help: string
  recovery_estimate: string
  rehabilitation_guidance: string
}

export interface DoctorGuidance {
  suggested_followup: string
  recommended_imaging: string
  differential_considerations: string
  important_notes: string
}

export interface MedicalOpinion {
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

export interface TimelineEvent {
  title: string
  description: string
}

export interface AnalysisResponse {
  success: boolean
  quality_assessment: QualityAssessment
  investigation?: Investigation
  explainability?: Explainability
  clinical_summary?: ClinicalSummary
  patient_guidance?: PatientGuidance
  doctor_guidance?: DoctorGuidance
  questions?: string[]
  educational?: string
  medical_debate?: MedicalOpinion[]
  consensus?: Consensus
  reasoning_timeline?: TimelineEvent[]
}
