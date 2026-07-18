import io
import requests
import numpy as np
import time
from PIL import Image

# Create dummy image
img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='PNG')

print("Starting deployment verification poller...")
for i in range(20):
    img_byte_arr.seek(0)
    print(f"Attempt {i+1}/20: Sending request to live API...")
    try:
        r = requests.post(
            'https://medvision-ai-00i0.onrender.com/api/v1/orthopedics/analyze',
            files={'file': ('valid_xray.png', img_byte_arr, 'image/png')},
            timeout=30
        )
        print("Status Code:", r.status_code)
        if r.status_code == 200:
            print("SUCCESS! Response payload:")
            print(r.json())
            break
        else:
            print("Response text:", r.text[:200])
    except Exception as e:
        print("Exception:", e)
    time.sleep(15)
