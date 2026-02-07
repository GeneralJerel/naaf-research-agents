.PHONY: run run-adk install clean check help

# Default target
help:
	@echo "NAAF Research Agents - Backend"
	@echo ""
	@echo "Usage:"
	@echo "  make run      - Start the server (installs deps if needed)"
	@echo "  make install  - Install dependencies"
	@echo "  make check    - Verify environment is set up correctly"
	@echo "  make clean    - Remove cached files"
	@echo ""
	@echo "Environment variables:"
	@echo "  YDC_API_KEY   - Required: You.com Search API key"
	@echo "  GOOGLE_API_KEY - Optional: Google Gemini API key"

# Install dependencies using uv (falls back to pip)
install:
	@if command -v uv >/dev/null 2>&1; then \
		echo "Installing with uv..."; \
		uv pip install -r requirements.txt; \
	else \
		echo "Installing with pip..."; \
		pip install -r requirements.txt; \
	fi

# Check environment
check:
	@echo "Checking environment..."
	@if [ -z "$$YDC_API_KEY" ]; then \
		echo "ERROR: YDC_API_KEY is not set"; \
		echo "  Run: export YDC_API_KEY=your-key"; \
		exit 1; \
	else \
		echo "  YDC_API_KEY: set"; \
	fi
	@if [ -z "$$GOOGLE_API_KEY" ]; then \
		echo "  GOOGLE_API_KEY: not set (optional)"; \
	else \
		echo "  GOOGLE_API_KEY: set"; \
	fi
	@echo "Environment OK"

# Run the server
run: check
	@if command -v uv >/dev/null 2>&1; then \
		uv run python run.py; \
	else \
		python run.py; \
	fi

# Run multi-agent ADK server
run-adk: check
	@if command -v uv >/dev/null 2>&1; then \
		uv run python run_adk.py; \
	else \
		python run_adk.py; \
	fi

# Clean cached files
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf .pytest_cache 2>/dev/null || true
