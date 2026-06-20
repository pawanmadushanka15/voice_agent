FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker caches this layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p audio_uploads outputs/generated_audio

# Hugging Face Spaces requires port 7860
EXPOSE 7860

# Start the FastAPI server on port 7860 (required by HF Spaces)
CMD ["uvicorn", "api:api", "--host", "0.0.0.0", "--port", "7860"]
