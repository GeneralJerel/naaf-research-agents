# Dockerfile for NAAF Research Agents API
# Optimized for Google Cloud Run deployment

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY pyproject.toml .

# Install Python dependencies
RUN pip install --no-cache-dir .

# Copy application code
COPY . .

# Create data directory for research storage
RUN mkdir -p /app/data/research_runs

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV NAAF_STORAGE_DIR=/app/data/research_runs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run the application
CMD exec uvicorn api.app:app --host 0.0.0.0 --port ${PORT}
