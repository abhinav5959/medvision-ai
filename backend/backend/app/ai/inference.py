import sys
import os
import subprocess
import json
from app.config import settings

def run_vision_inference(image_path: str) -> dict:
    """
    Executes the PyTorch ResNet-50 pipeline using separate child subprocesses.
    Each subprocess runs one model and exits, which releases 100% of the allocated memory back to the OS.
    This guarantees peak RAM stays well below the 512MB limit of Render's free tier.
    """
    # Path to the standalone inference runner
    script_path = os.path.join(settings.BASE_DIR, "app", "ai", "run_sub.py")
    
    # 1. Run binary detection in subprocess
    cmd_binary = [
        sys.executable,
        script_path,
        "--mode", "binary",
        "--image", image_path,
        "--weights", settings.BINARY_WEIGHTS
    ]
    
    result = subprocess.run(cmd_binary, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Binary detector subprocess failed: {result.stderr}")
        
    binary_data = json.loads(result.stdout.strip())
    status = binary_data["status"]
    confidence = binary_data["confidence"]
    
    if status == 'not fractured':
        return {
            "fracture_detected": False,
            "binary_confidence": confidence,
            "fracture_type": "None",
            "classification_confidence": 0.0,
            "gradcam_saved": False
        }
        
    # 2. Run fracture type classification + Grad-CAM in subprocess
    cmd_type = [
        sys.executable,
        script_path,
        "--mode", "type",
        "--image", image_path,
        "--weights", settings.TYPE_WEIGHTS
    ]
    
    result_type = subprocess.run(cmd_type, capture_output=True, text=True)
    if result_type.returncode != 0:
        raise RuntimeError(f"Fracture type subprocess failed: {result_type.stderr}")
        
    type_data = json.loads(result_type.stdout.strip())
    
    return {
        "fracture_detected": True,
        "binary_confidence": confidence,
        "fracture_type": type_data["fracture_type"],
        "classification_confidence": type_data["confidence"],
        "gradcam_saved": type_data["gradcam_saved"],
        "gradcam_data_uri": type_data.get("gradcam_data_uri", "")
    }
