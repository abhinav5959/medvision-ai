import sys
import os
import gc
import torch
from PIL import Image
import numpy as np
import cv2
import base64
from app.config import settings
from app.ai.loader import load_binary_model, load_type_model, unload_model

# Ensure parent directory is in path for original inference.py
sys.path.append(settings.BASE_DIR)
import inference

def run_vision_inference(image_path: str) -> dict:
    """
    Executes the PyTorch ResNet-50 pipeline sequentially.
    Loads and runs the binary detector first, unloads it, then loads and runs the subclass classifier.
    This keeps peak RAM usage below the 512MB limit of Render's free tier.
    """
    # Force initial garbage collection
    gc.collect()
    
    # 1. Load and run binary model
    binary_model = load_binary_model()
    
    img = Image.open(image_path).convert('RGB')
    input_tensor = inference.infer_transforms(img).unsqueeze(0).to(inference.DEVICE)
    
    with torch.no_grad():
        binary_out = binary_model(input_tensor)
        binary_pred = torch.argmax(binary_out, dim=1).item()
        status = inference.BINARY_CLASSES[binary_pred]
        confidence = torch.softmax(binary_out, dim=1)[0][binary_pred].item()
        
    # Unload binary model immediately
    unload_model(binary_model)
    
    if status == 'not fractured':
        return {
            "fracture_detected": False,
            "binary_confidence": confidence,
            "fracture_type": "None",
            "classification_confidence": 0.0,
            "gradcam_saved": False
        }
        
    # 2. Load and run fracture type model
    type_model = load_type_model()
    
    with torch.no_grad():
        type_out = type_model(input_tensor)
        type_pred = torch.argmax(type_out, dim=1).item()
        predicted_type = inference.TYPE_CLASSES[type_pred]
        type_confidence = torch.softmax(type_out, dim=1)[0][type_pred].item()

    # Execute Grad-CAM generation
    img_resized = img.resize((224, 224))
    rgb_img = np.float32(img_resized) / 255.0
    target_layers = [type_model.layer4[-1]]
    
    cam = inference.GradCAM(model=type_model, target_layers=target_layers)
    grayscale_cam = cam(input_tensor=input_tensor, targets=[inference.ClassifierOutputTarget(type_pred)])[0, :]
    visualization = inference.show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
    
    # Encode the Grad-CAM heatmap directly to Base64
    _, buffer = cv2.imencode('.png', cv2.cvtColor(visualization * 255, cv2.COLOR_RGB2BGR))
    gradcam_base64 = base64.b64encode(buffer).decode('utf-8')
    gradcam_data_uri = f"data:image/png;base64,{gradcam_base64}"
    
    # Unload type model immediately
    unload_model(type_model)
    
    return {
        "fracture_detected": True,
        "binary_confidence": confidence,
        "fracture_type": predicted_type,
        "classification_confidence": type_confidence,
        "gradcam_saved": True,
        "gradcam_data_uri": gradcam_data_uri
    }
