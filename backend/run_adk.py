#!/usr/bin/env python3
"""Run NAAF Multi-Agent System with Google ADK.

Usage:
    python run_adk.py           # Start on port 8000
    python run_adk.py --port 9000  # Custom port

Dev UI will be available at:
    http://127.0.0.1:8000/dev-ui/?app=naaf_research
"""

import argparse
import os
import sys


def main():
    parser = argparse.ArgumentParser(description="NAAF Multi-Agent ADK Server")
    parser.add_argument("--port", type=int, default=8000, help="Port to run on")
    args = parser.parse_args()

    # Check for API keys
    if not os.getenv("GOOGLE_API_KEY"):
        print("ERROR: GOOGLE_API_KEY environment variable not set")
        print("  export GOOGLE_API_KEY=your-key")
        sys.exit(1)

    if not os.getenv("YDC_API_KEY"):
        print("WARNING: YDC_API_KEY not set - search tools will not work")

    # Import and run
    try:
        from agents.naaf_multi.app import run_app
        run_app(port=args.port)
    except ImportError as e:
        print(f"ERROR: {e}")
        print("Make sure google-adk is installed: pip install google-adk")
        sys.exit(1)


if __name__ == "__main__":
    main()
