import sys
import argparse
import json
import torch

# Restrict PyTorch to single-thread execution to save substantial heap memory overhead in containers
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

import os
from PIL import Image
import numpy as np
import cv2
import base64
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn as nn

# Standard Medical Image Transform Pipeline
infer_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

BINARY_CLASSES = ['fractured', 'not fractured']
TYPE_CLASSES = [
    'Avulsion fracture', 'Comminuted fracture', 'Compression-Crush fracture', 
    'Fracture Dislocation', 'Greenstick fracture', 'Hairline Fracture', 
    'Impacted fracture', 'Intra-articular fracture', 'Longitudinal fracture', 
    'Oblique fracture', 'Pathological fracture', 'Spiral Fracture'
]

def run_quality(image_path):
    """Evaluates image quality metrics using OpenCV to block low-quality inputs."""
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(json.dumps({
            "analysis_possible": False,
            "reason": "Failed to read the image file.",
            "recommendation": "Please upload a valid image file in standard format (PNG, JPG, JPEG)."
        }))
        return

    height, width = img.shape
    
    # 1. Check Resolution
    if width < 150 or height < 150:
        print(json.dumps({
            "analysis_possible": False,
            "reason": f"Resolution too low ({width}x{height}px). Minimum required is 150x150px.",
            "recommendation": "Please upload a higher-resolution digital scan."
        }))
        return

    # 2. Check Blur (Variance of Laplacian)
    laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
    if laplacian_var < 1.0:
        print(json.dumps({
            "analysis_possible": False,
            "reason": f"Image is completely uniform or unreadable (Blur metric: {laplacian_var:.2f}).",
            "recommendation": "Please ensure the scan is in-focus and not blank."
        }))
        return

    # 3. Check Brightness (Mean intensity)
    mean_brightness = np.mean(img)
    if mean_brightness < 2:
        print(json.dumps({
            "analysis_possible": False,
            "reason": f"Image is completely black (Average intensity: {mean_brightness:.1f}).",
            "recommendation": "Please upload a properly exposed X-Ray scan."
        }))
        return
    elif mean_brightness > 252:
        print(json.dumps({
            "analysis_possible": False,
            "reason": f"Image is completely white or overexposed (Average intensity: {mean_brightness:.1f}).",
            "recommendation": "Please upload a scan that is not overexposed or blank."
        }))
        return

    # 4. Check Contrast / Cropping (Standard Deviation of pixels)
    std_brightness = np.std(img)
    if std_brightness < 2.0:
        print(json.dumps({
            "analysis_possible": False,
            "reason": f"Image contrast is zero (Standard deviation: {std_brightness:.1f}). Image is an empty placeholder.",
            "recommendation": "Please verify the image is a valid X-Ray scan."
        }))
        return

    print(json.dumps({
        "analysis_possible": True,
        "reason": None,
        "recommendation": None
    }))

def run_binary(image_path, weights_path):
    binary_model = models.resnet50()
    binary_model.fc = nn.Linear(binary_model.fc.in_features, 2)
    binary_model.load_state_dict(torch.load(weights_path, map_location='cpu'))
    binary_model.eval()
    
    img = Image.open(image_path).convert('RGB')
    input_tensor = infer_transforms(img).unsqueeze(0)
    
    with torch.no_grad():
        binary_out = binary_model(input_tensor)
        binary_pred = torch.argmax(binary_out, dim=1).item()
        status = BINARY_CLASSES[binary_pred]
        confidence = torch.softmax(binary_out, dim=1)[0][binary_pred].item()
        
    print(json.dumps({"status": status, "confidence": confidence}))

def run_type(image_path, weights_path):
    type_model = models.resnet50()
    type_model.fc = nn.Linear(type_model.fc.in_features, 12)
    type_model.load_state_dict(torch.load(weights_path, map_location='cpu'))
    type_model.eval()
    
    img = Image.open(image_path).convert('RGB')
    input_tensor = infer_transforms(img).unsqueeze(0)
    
    with torch.no_grad():
        type_out = type_model(input_tensor)
        type_pred = torch.argmax(type_out, dim=1).item()
        predicted_type = TYPE_CLASSES[type_pred]
        type_confidence = torch.softmax(type_out, dim=1)[0][type_pred].item()
        
    # Execute Grad-CAM generation safely
    gradcam_data_uri = ""
    gradcam_saved = False
    try:
        from pytorch_grad_cam import GradCAM
        from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
        from pytorch_grad_cam.utils.image import show_cam_on_image
        
        img_resized = img.resize((224, 224))
        rgb_img = np.float32(img_resized) / 255.0
        target_layers = [type_model.layer4[-1]]
        
        with GradCAM(model=type_model, target_layers=target_layers) as cam:
            grayscale_cam = cam(input_tensor=input_tensor, targets=[ClassifierOutputTarget(type_pred)])[0, :]
            
        visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
        _, buffer = cv2.imencode('.png', cv2.cvtColor(visualization * 255, cv2.COLOR_RGB2BGR))
        gradcam_base64 = base64.b64encode(buffer).decode('utf-8')
        gradcam_data_uri = f"data:image/png;base64,{gradcam_base64}"
        gradcam_saved = True
    except Exception as e:
        sys.stderr.write(f"Failed to generate Grad-CAM: {e}\n")
        
    print(json.dumps({
        "fracture_type": predicted_type,
        "confidence": type_confidence,
        "gradcam_saved": gradcam_saved,
        "gradcam_data_uri": gradcam_data_uri
    }))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", required=True, choices=["quality", "binary", "type"])
    parser.add_argument("--image", required=True)
    parser.add_argument("--weights", required=False, default="")
    args = parser.parse_args()
    
    if args.mode == "quality":
        run_quality(args.image)
    elif args.mode == "binary":
        run_binary(args.image, args.weights)
    elif args.mode == "type":
        run_type(args.image, args.weights)
