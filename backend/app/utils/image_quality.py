import cv2
import numpy as np

def evaluate_image_quality(image_path: str) -> dict:
    """
    Evaluates image quality metrics using OpenCV to block low-quality inputs:
    - Resolution: Minimum dimension checks
    - Blur: Variance of the Laplacian method
    - Brightness: Mean pixel value analysis
    - Contrast/Rotation/Cropping: Standard deviation of pixel values (flat images)
    
    Returns:
        dict: {
            "analysis_possible": bool,
            "reason": str or None,
            "recommendation": str or None
        }
    """
    # Read the image in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return {
            "analysis_possible": False,
            "reason": "Failed to read the image file.",
            "recommendation": "Please upload a valid image file in standard format (PNG, JPG, JPEG)."
        }

    height, width = img.shape
    
    # 1. Check Resolution
    if width < 150 or height < 150:
        return {
            "analysis_possible": False,
            "reason": f"Resolution too low ({width}x{height}px). Minimum required is 150x150px.",
            "recommendation": "Please upload a higher-resolution digital scan."
        }

    # 2. Check Blur (Variance of Laplacian)
    laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
    if laplacian_var < 10.0:
        return {
            "analysis_possible": False,
            "reason": f"Image is too blurry (Blur metric: {laplacian_var:.2f}).",
            "recommendation": "Please ensure the scan is in-focus and not motion-blurred."
        }

    # 3. Check Brightness (Mean intensity)
    mean_brightness = np.mean(img)
    if mean_brightness < 15:
        return {
            "analysis_possible": False,
            "reason": f"Image is too dark (Average intensity: {mean_brightness:.1f}).",
            "recommendation": "Please upload a properly exposed scan with better contrast."
        }
    elif mean_brightness > 240:
        return {
            "analysis_possible": False,
            "reason": f"Image is too bright or washed out (Average intensity: {mean_brightness:.1f}).",
            "recommendation": "Please upload a scan that is not overexposed or blank."
        }

    # 4. Check Contrast / Cropping (Standard Deviation of pixels)
    std_brightness = np.std(img)
    if std_brightness < 10.0:
        return {
            "analysis_possible": False,
            "reason": f"Image contrast is too low (Standard deviation: {std_brightness:.1f}). Image may be flat or blank.",
            "recommendation": "Please verify the image is a valid X-Ray scan and not an empty placeholder."
        }

    # If all checks pass
    return {
        "analysis_possible": True,
        "reason": None,
        "recommendation": None
    }
