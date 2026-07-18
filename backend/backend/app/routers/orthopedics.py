import os
import time
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from app.config import settings
from app.utils.image_quality import evaluate_image_quality
from app.utils.exceptions import APIException
from app.ai.inference import run_vision_inference
from app.services.gemini_service import get_gemini_analysis, get_clean_scan_analysis
from app.schemas.analysis import (
    AnalysisResponse, QualityAssessment, Investigation, Explainability
)

router = APIRouter(prefix="/api/v1/orthopedics", tags=["Orthopedics"])

def cleanup_file(filepath: str):
    """Background task to remove temporary files."""
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            print(f"Failed to delete temp file {filepath}: {str(e)}")

@router.post("/analyze", response_model=AnalysisResponse, summary="Analyze X-ray scan for orthopedic fractures")
async def analyze_orthopedics(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Digital X-ray scan image (PNG/JPG/JPEG)")
) -> AnalysisResponse:
    """
    Ingests an orthopedic X-ray scan, performs pre-inference image quality checks, 
    executes PyTorch ResNet-50 models for fracture classification, generates Grad-CAM overlays, 
    and leverages Gemini to output a structured multi-disciplinary clinical summary and debate.
    """
    # Create temporary file path
    temp_filename = f"temp_{uuid.uuid4().hex}_{file.filename}"
    temp_filepath = os.path.join(settings.TEMP_DIR, temp_filename)
    
    # 0. File Validation
    ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in ALLOWED_TYPES:
        raise APIException(
            error_code="INVALID_FILE_TYPE",
            message=f"Unsupported file type: {file.content_type}. Please upload JPEG or PNG.",
            possible_solution="Convert the scan to PNG or JPEG before uploading.",
            status_code=400
        )
        
    # Check size (Max 10MB)
    if file.size and file.size > 10 * 1024 * 1024:
        raise APIException(
            error_code="FILE_TOO_LARGE",
            message="The uploaded file exceeds the 10MB size limit.",
            possible_solution="Compress the image or select a lower resolution scan.",
            status_code=413
        )

    # Save the file stream locally
    try:
        contents = await file.read()
        with open(temp_filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise APIException(
            error_code="UPLOAD_FAILED",
            message=f"Failed to write uploaded file stream: {str(e)}",
            possible_solution="Ensure you have selected a valid file and retry.",
            status_code=400
        )
        
    # Schedule temp file cleanup
    background_tasks.add_task(cleanup_file, temp_filepath)
    
    # 1. Image Quality Assessment Check
    quality_result = evaluate_image_quality(temp_filepath)
    quality_assessment = QualityAssessment(
        analysis_possible=quality_result["analysis_possible"],
        reason=quality_result["reason"],
        recommendation=quality_result["recommendation"]
    )
    
    if not quality_assessment.analysis_possible:
        # Graceful early exit with structured quality error response
        return AnalysisResponse(
            success=True,
            quality_assessment=quality_assessment
        )
        
    # Start execution timer
    start_time = time.time()
    inference_timestamp = datetime.utcnow().isoformat() + "Z"
    
    # 2. Run computer vision inference (ResNet50 + Grad-CAM)
    try:
        vision_result = run_vision_inference(
            image_path=temp_filepath
        )
    except Exception as e:
        raise APIException(
            error_code="INFERENCE_FAILED",
            message=f"Vision model execution failed: {str(e)}",
            possible_solution="Ensure the PyTorch model weights are correctly set up and not corrupted.",
            status_code=500
        )
        
    # 3. Call structured clinical advisory service (Gemini)
    try:
        if vision_result["fracture_detected"]:
            llm_result = get_gemini_analysis(
                fracture_type=vision_result["fracture_type"],
                type_confidence=vision_result["classification_confidence"]
            )
            gradcam_url = vision_result.get("gradcam_data_uri")
        else:
            llm_result = get_clean_scan_analysis()
            gradcam_url = None
    except Exception as e:
        raise APIException(
            error_code="SERVICE_ERROR",
            message=f"Clinical analysis collation failed: {str(e)}",
            possible_solution="Verify internet connection and Gemini credentials.",
            status_code=500
        )
        
    processing_time = time.time() - start_time
    
    # Assemble response payload
    investigation = Investigation(
        fracture_detected=vision_result["fracture_detected"],
        body_part="Orthopedic Scan",
        fracture_type=vision_result["fracture_type"],
        binary_confidence=vision_result["binary_confidence"],
        classification_confidence=vision_result["classification_confidence"]
    )
    
    explainability = Explainability(
        gradcam_image_url=gradcam_url,
        model_name=settings.MODEL_NAME,
        model_version=settings.MODEL_VERSION,
        processing_time=round(processing_time, 3),
        inference_timestamp=inference_timestamp
    )
    
    return AnalysisResponse(
        success=True,
        quality_assessment=quality_assessment,
        investigation=investigation,
        explainability=explainability,
        clinical_summary=llm_result.clinical_summary,
        patient_guidance=llm_result.patient_guidance,
        doctor_guidance=llm_result.doctor_guidance,
        questions=llm_result.questions,
        educational=llm_result.educational,
        medical_debate=llm_result.medical_debate,
        consensus=llm_result.consensus,
        reasoning_timeline=llm_result.reasoning_timeline
    )
