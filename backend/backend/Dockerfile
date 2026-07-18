# Use official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy project files
COPY app/ ./app/
COPY inference.py .

# Create directories for static assets and temp storage
RUN mkdir -p app/static app/temp

# Copy model weights into the container
COPY weights/ ./weights/

# Expose port
EXPOSE 8000

# Run Uvicorn server
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
