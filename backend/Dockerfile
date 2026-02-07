# Dockerfile for NAAF Research Agents API
# Optimized for Google Cloud Run deployment

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for research storage
RUN mkdir -p /app/data/research_runs

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV NAAF_STORAGE_DIR=/app/data/research_runs

# Expose port
EXPOSE 8080

# Run the application
CMD exec uvicorn api.app:app --host 0.0.0.0 --port ${PORT}
