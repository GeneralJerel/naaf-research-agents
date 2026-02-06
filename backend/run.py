#!/usr/bin/env python3
"""NAAF Research Agents - Entry point script.

Usage:
    python run.py              # Start the API server
    python run.py --assess US  # Run assessment for a country
    python run.py --list       # List previous runs
"""

import os
import sys
import asyncio
import argparse
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def start_server(host: str = "0.0.0.0", port: int = 8000):
    """Start the FastAPI server."""
    import uvicorn
    from api.app import app

    print(f"🚀 Starting NAAF Research Agents API on http://{host}:{port}")
    print(f"📖 API docs: http://{host}:{port}/docs")

    uvicorn.run(app, host=host, port=port)


async def run_assessment(country: str, year: int = 2024, save: bool = True):
    """Run a country assessment."""
    from agents.naaf_agent import assess_country, NAAFAgentConfig

    print(f"🌍 Running NAAF assessment for {country} ({year})...")

    config = NAAFAgentConfig(verbose=True)
    result = await assess_country(country, year, config, save=save)

    print("\n" + "=" * 60)
    print(f"📊 NAAF Assessment Results for {result['country']}")
    print("=" * 60)
    print(f"Overall Score: {result['overall_score']}/100")
    print(f"Tier: {result['tier']}")
    print(f"Description: {result['tier_description']}")
    print("\nLayer Scores:")
    for layer_num, layer_data in sorted(result["layers"].items(), key=lambda x: int(x[0])):
        print(f"  Layer {layer_num}: {layer_data['name']}: {layer_data['score']}/{layer_data['max_score']}")
    print(f"\nRun ID: {result.get('run_id', 'N/A')}")
    print(f"Duration: {result['duration_seconds']:.2f}s")

    return result


def list_runs(country: str = None, limit: int = 10):
    """List previous research runs."""
    from framework import get_store

    store = get_store()
    runs = store.list(country=country, limit=limit)

    print(f"\n📋 Previous Research Runs (showing {len(runs)}):")
    print("-" * 60)

    for run in runs:
        print(f"  {run.id}")
        print(f"    Country: {run.country}")
        print(f"    Score: {run.overall_score}/100 ({run.tier})")
        print(f"    Date: {run.generated_at or run.created_at}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description="NAAF Research Agents CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run.py                     Start the API server
  python run.py --assess "Brazil"   Assess Brazil's AI readiness
  python run.py --assess US --year 2025
  python run.py --list              List all previous runs
  python run.py --list --country US List runs for a specific country
        """
    )

    parser.add_argument(
        "--assess",
        type=str,
        metavar="COUNTRY",
        help="Run assessment for a country"
    )
    parser.add_argument(
        "--year",
        type=int,
        default=2024,
        help="Target year for assessment (default: 2024)"
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List previous research runs"
    )
    parser.add_argument(
        "--country",
        type=str,
        help="Filter runs by country (used with --list)"
    )
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="Server host (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("PORT", 8000)),
        help="Server port (default: 8000 or PORT env var)"
    )
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Don't save assessment results"
    )

    args = parser.parse_args()

    # Check for required environment variables
    if args.assess and not (os.getenv("YOUCOM_API_KEY") or os.getenv("EXA_API_KEY")):
        print("⚠️  Warning: No search API keys configured.")
        print("   Set YOUCOM_API_KEY or EXA_API_KEY for best results.")

    if args.assess:
        asyncio.run(run_assessment(
            args.assess,
            args.year,
            save=not args.no_save
        ))
    elif args.list:
        list_runs(args.country)
    else:
        start_server(args.host, args.port)


if __name__ == "__main__":
    main()
