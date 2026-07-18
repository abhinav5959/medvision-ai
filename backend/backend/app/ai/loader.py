import sys
import gc
import torch
from app.config import settings

# Restrict PyTorch to single-thread execution to save substantial heap memory overhead in containers
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

# Add parent directory of app (backend/) to path to access original inference.py
sys.path.append(settings.BASE_DIR)
import inference

def load_binary_model():
    """Loads the ResNet-50 binary fracture detector from disk."""
    print("Loading binary ResNet-50 model...")
    binary_model = inference.models.resnet50()
    binary_model.fc = inference.nn.Linear(binary_model.fc.in_features, 2)
    binary_model.load_state_dict(torch.load(settings.BINARY_WEIGHTS, map_location=inference.DEVICE, mmap=True))
    binary_model.to(inference.DEVICE).eval()
    print("Binary model loaded successfully.")
    return binary_model

def load_type_model():
    """Loads the ResNet-50 fracture type classifier from disk."""
    print("Loading fracture type ResNet-50 model...")
    type_model = inference.models.resnet50()
    type_model.fc = inference.nn.Linear(type_model.fc.in_features, 12)
    type_model.load_state_dict(torch.load(settings.TYPE_WEIGHTS, map_location=inference.DEVICE, mmap=True))
    type_model.to(inference.DEVICE).eval()
    print("Fracture type model loaded successfully.")
    return type_model

def unload_model(model):
    """Deletes the model from memory and forces garbage collection to prevent memory overflow."""
    if model is not None:
        del model
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Model unloaded and garbage collected.")
