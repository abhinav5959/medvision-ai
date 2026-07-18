import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # API configuration
    API_TITLE: str = "MedVision AI API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Production-grade Model-Agnostic Decision Support Platform API"

    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    TEMP_DIR: str = os.path.join(BASE_DIR, "temp")
    
    # Model Weights
    BINARY_WEIGHTS: str = os.path.join(BASE_DIR, "weights", "resnet50_binary_fracture.pth")
    TYPE_WEIGHTS: str = os.path.join(BASE_DIR, "weights", "resnet50_fracture_type.pth")

    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "DUMMY_KEY")

    # CORS
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    # Model metadata
    MODEL_NAME: str = "ResNet-50 Fracture Detection Suite"
    MODEL_VERSION: str = "v1.2.0"

settings = Settings()

# Ensure required directories exist
os.makedirs(settings.STATIC_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)
