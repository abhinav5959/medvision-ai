import uvicorn
import os
import sys

# Ensure app package is accessible in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    # Start the FastAPI application via Uvicorn on port 8000
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
