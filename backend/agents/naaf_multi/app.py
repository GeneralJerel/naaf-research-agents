"""NAAF Multi-Agent ADK Application.

Entry point for running the multi-agent NAAF system with Google ADK.
"""

import os

try:
    from google.adk import Application
    HAS_ADK = True
except ImportError:
    Application = None
    HAS_ADK = False

from .supervisor import naaf_supervisor

# Create the ADK application
app = None
if HAS_ADK:
    app = Application(
        name="naaf_research",
        agent=naaf_supervisor,
    )


def run_app(port: int = 8000):
    """Run the ADK application with dev UI."""
    if not HAS_ADK:
        print("ERROR: google-adk not installed. Run: pip install google-adk")
        return

    if not os.getenv("GOOGLE_API_KEY"):
        print("WARNING: GOOGLE_API_KEY not set. Agent may not function.")

    print(f"Starting NAAF Multi-Agent System on port {port}")
    print(f"Dev UI: http://127.0.0.1:{port}/dev-ui/?app=naaf_research")
    app.run(port=port)


if __name__ == "__main__":
    run_app()
