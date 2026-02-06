#!/bin/bash
# NAAF Research Agents - Cloud Run Deployment Script
#
# Usage:
#   ./deploy.sh                    # Deploy with defaults
#   ./deploy.sh --project my-proj  # Specify project
#   ./deploy.sh --region us-west1  # Specify region
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated
#   2. APIs enabled: run.googleapis.com, secretmanager.googleapis.com
#   3. Secrets created in Secret Manager:
#      - naaf-youcom-api-key
#      - naaf-exa-api-key
#      - naaf-google-api-key (optional)

set -e

# Defaults
SERVICE_NAME="naaf-api"
REGION="${REGION:-us-central1}"
PROJECT="${PROJECT:-$(gcloud config get-value project)}"
MEMORY="1Gi"
CPU="1"
TIMEOUT="300"
CONCURRENCY="80"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --service)
            SERVICE_NAME="$2"
            shift 2
            ;;
        --memory)
            MEMORY="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🚀 Deploying NAAF Research Agents to Cloud Run"
echo "   Project: $PROJECT"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo ""

# Check if secrets exist
echo "📋 Checking secrets..."
SECRETS_OK=true

check_secret() {
    if gcloud secrets describe "$1" --project="$PROJECT" &>/dev/null; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 (not found)"
        SECRETS_OK=false
    fi
}

check_secret "naaf-ydc-api-key"
check_secret "naaf-google-api-key"

if [ "$SECRETS_OK" = false ]; then
    echo ""
    echo "⚠️  Some secrets are missing. Create them with:"
    echo "   gcloud secrets create naaf-youcom-api-key --data-file=-"
    echo "   gcloud secrets create naaf-exa-api-key --data-file=-"
    echo "   gcloud secrets create naaf-google-api-key --data-file=-"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build and deploy
echo ""
echo "🔨 Building and deploying..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --project "$PROJECT" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --memory "$MEMORY" \
    --cpu "$CPU" \
    --timeout "$TIMEOUT" \
    --concurrency "$CONCURRENCY" \
    --set-env-vars "NAAF_STORAGE_DIR=/app/data/research_runs" \
    --set-secrets "YDC_API_KEY=naaf-ydc-api-key:latest,GOOGLE_API_KEY=naaf-google-api-key:latest"

echo ""
echo "✅ Deployment complete!"
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT" --region "$REGION" --format 'value(status.url)')
echo "🌐 Service URL: $SERVICE_URL"
echo "📖 API Docs: $SERVICE_URL/docs"
echo "❤️ Health: $SERVICE_URL/health"
