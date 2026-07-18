from pydantic import BaseModel, Field
from typing import List, Optional

class QualityAssessment(BaseModel):
    analysis_possible: bool = Field(..., description="Whether the scan meets quality standards for AI inference")
    reason: Optional[str] = Field(None, description="If quality is unacceptable, the specific failure reason (e.g. too blurry, too dark)")
    recommendation: Optional[str] = Field(None, description="Corrective action recommendation for the operator")

class Investigation(BaseModel):
    fracture_detected: bool = Field(..., description="Whether the vision model flagged structural disruption")
    body_part: Optional[str] = Field(None, description="Anatomical location of the scanned scan (e.g. Left Wrist)")
    fracture_type: str = Field(..., description="Predicted subclass of fracture (or 'None' if clear)")
    binary_confidence: float = Field(..., description="Confidence of the binary ResNet detector")
    classification_confidence: float = Field(..., description="Confidence of the ResNet subclass classifier")

class Explainability(BaseModel):
    gradcam_image_url: Optional[str] = Field(None, description="URL path to the Grad-CAM activation heatmap overlay")
    model_name: str = Field(..., description="Identifier name of the Vision model running inference")
    model_version: str = Field(..., description="Release version of the Vision model")
    processing_time: float = Field(..., description="Pipeline execution time in seconds")
    inference_timestamp: str = Field(..., description="ISO 8601 formatted timestamp of execution")

class ClinicalSummary(BaseModel):
    overview: str = Field(..., description="Plain-English medical definition of the predicted condition")
    findings: str = Field(..., description="Automated radiological findings detailing cortical integrity disruption")
    severity: Optional[str] = Field(None, description="Surgical/discomfort level categorization of the fracture")
    possible_complications: str = Field(..., description="Associated risks if left untreated (e.g. nonunion, vascular damage)")

class PatientGuidance(BaseModel):
    first_aid: str = Field(..., description="Safe, non-invasive first-aid and stabilization protocols")
    precautions: str = Field(..., description="Immediate home care restrictions (e.g. R.I.C.E., weight-bearing limits)")
    when_to_seek_emergency_help: str = Field(..., description="Critical red-flag symptoms requiring immediate emergency care")
    recovery_estimate: str = Field(..., description="Typical duration of healing for similar fractures")
    rehabilitation_guidance: str = Field(..., description="Standard recovery exercises or physical therapy progression milestones")

class DoctorGuidance(BaseModel):
    suggested_followup: str = Field(..., description="Standard specialist followup recommendation timetable")
    recommended_imaging: str = Field(..., description="Further imaging considerations (e.g. CT, MRI to assess intra-articular extension)")
    differential_considerations: str = Field(..., description="Alternative diagnoses that should be excluded during clinical review")
    important_notes: str = Field(..., description="Important diagnostic caveats for the physician")

class MedicalOpinion(BaseModel):
    role: str = Field(..., description="Clinical persona (e.g. Radiologist, Orthopedic Surgeon, Emergency Physician)")
    summary: str = Field(..., description="The persona's primary assessment of the scan")
    key_observations: List[str] = Field(..., description="Specific radiological features noticed by this persona")
    recommendations: List[str] = Field(..., description="Actionable interventions or treatment routes suggested")
    concerns: List[str] = Field(..., description="Specific complications or indicators this specialist is worried about")
    confidence: float = Field(..., description="Estimated confidence level of the specific specialist's opinion")

class Consensus(BaseModel):
    agreement: str = Field(..., description="Areas of mutual agreement between the discussing medical personas")
    remaining_uncertainty: str = Field(..., description="Points of potential variation or items requiring further clinical tests")
    recommended_next_step: str = Field(..., description="Most critical next diagnostic or therapeutic action")
    summary: str = Field(..., description="Integrated consensus diagnostic conclusion")

class TimelineEvent(BaseModel):
    title: str = Field(..., description="Identifier name of the thinking phase (e.g. Cortical Integrity Check)")
    description: str = Field(..., description="Radiological rationale explaining this step in the logical progression")

# --- Structured Schema For Gemini Output ---
class GeminiStructuredOutput(BaseModel):
    clinical_summary: ClinicalSummary
    patient_guidance: PatientGuidance
    doctor_guidance: DoctorGuidance
    questions: List[str] = Field(..., description="Useful questions the patient can ask their specialist")
    educational: str = Field(..., description="Simple, empathetic educational explanation for non-medical users")
    medical_debate: List[MedicalOpinion] = Field(..., description="Opinions from three distinct medical specialists")
    consensus: Consensus
    reasoning_timeline: List[TimelineEvent] = Field(..., description="Step-by-step diagnostic reasoning chain")

# --- Final Integrated API Response Schema ---
class AnalysisResponse(BaseModel):
    success: bool = Field(True, description="Indicates if the operation completed successfully")
    quality_assessment: QualityAssessment
    investigation: Optional[Investigation] = None
    explainability: Optional[Explainability] = None
    clinical_summary: Optional[ClinicalSummary] = None
    patient_guidance: Optional[PatientGuidance] = None
    doctor_guidance: Optional[DoctorGuidance] = None
    questions: Optional[List[str]] = None
    educational: Optional[str] = None
    medical_debate: Optional[List[MedicalOpinion]] = None
    consensus: Optional[Consensus] = None
    reasoning_timeline: Optional[List[TimelineEvent]] = None

# --- Error Schema ---
class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Indicates if the operation failed")
    error_code: str = Field(..., description="Machine-readable unique code identifying the type of failure")
    message: str = Field(..., description="Human-readable explanation of the error")
    possible_solution: str = Field(..., description="Actionable step to resolve the error")
