"""Report persistence tool — writes structured JSON output to disk.

After all 8 layers have been scored, the supervisor calls save_final_report
to assemble the CountryReport, write final_report.json, sources.json, and
individual layer JSON files to a timestamped folder under reports/.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from google.adk.tools import ToolContext

logger = logging.getLogger(__name__)

# Project root: tools/ -> naaf_research/ -> agents/ -> NAAF-Research-Agents/
_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_REPORTS_DIR = _PROJECT_ROOT / "reports"

# Maps layer number -> short name used in file names and dict keys
_LAYER_SHORT_NAMES = {
    1: "power",
    2: "chips",
    3: "cloud",
    4: "models",
    5: "data",
    6: "apps",
    7: "talent",
    8: "adoption",
}

_LAYER_FULL_NAMES = {
    1: "Power & Electricity",
    2: "Chipset Manufacturers",
    3: "Cloud & Data Centers",
    4: "Model Developers",
    5: "Platform & Data",
    6: "Applications & Startups",
    7: "Education & Consulting",
    8: "Implementation",
}


def _get_or_create_report_dir(country: str, tool_context: ToolContext) -> Path:
    """Return the report directory for the current run, creating it if needed.

    The directory path is cached in tool_context.state["report_dir"] so all
    tools in the same session write to the same folder.
    """
    existing = tool_context.state.get("report_dir")
    if existing:
        report_dir = Path(existing)
    else:
        slug = country.strip().lower().replace(" ", "_")
        ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        report_dir = _REPORTS_DIR / f"{slug}_{ts}"
        tool_context.state["report_dir"] = str(report_dir)

    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / "layers").mkdir(exist_ok=True)
    return report_dir


def save_final_report(
    country: str,
    overall_score: float,
    tier: str,
    executive_summary: str,
    tool_context: ToolContext,
) -> str:
    """Persist the complete NAAF assessment to disk as structured JSON.

    Call this AFTER calculate_overall_score. It gathers the per-layer results
    and source URLs that were accumulated in session state during the run,
    assembles a CountryReport, and writes:
      - reports/{country}_{ts}/final_report.json
      - reports/{country}_{ts}/sources.json
      - reports/{country}_{ts}/layers/layer_N_name.json  (if not already written)

    Args:
        country: The country that was assessed (e.g. 'China').
        overall_score: The final weighted AI Power Score (0-100).
        tier: The power tier label (e.g. 'Tier 1: Hegemon').
        executive_summary: A brief executive summary of the assessment findings,
            including key strengths, weaknesses, and strategic recommendations.
        tool_context: Injected by ADK — provides access to session state.

    Returns:
        Confirmation message with the path to the report folder.
    """
    report_dir = _get_or_create_report_dir(country, tool_context)

    # ------------------------------------------------------------------
    # 1. Assemble per-layer data from session state
    # ------------------------------------------------------------------
    layers = {}
    for num in range(1, 9):
        key = f"layer_{num}_json"
        layer_data = tool_context.state.get(key)
        if layer_data:
            # layer_data is a dict stored by score_layer
            short = _LAYER_SHORT_NAMES[num]
            layers[short] = layer_data

            # Also ensure individual layer file exists
            layer_file = report_dir / "layers" / f"layer_{num}_{short}.json"
            if not layer_file.exists():
                layer_file.write_text(
                    json.dumps(layer_data, indent=2, ensure_ascii=False)
                )

    # ------------------------------------------------------------------
    # 2. Collect all source URLs from session state
    # ------------------------------------------------------------------
    collected_sources = tool_context.state.get("collected_sources", [])
    # Deduplicate by URL while preserving order
    seen_urls = set()
    unique_sources = []
    for src in collected_sources:
        url = src.get("url", "") if isinstance(src, dict) else str(src)
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_sources.append(src)

    source_urls = [
        s.get("url", "") if isinstance(s, dict) else str(s)
        for s in unique_sources
    ]

    # ------------------------------------------------------------------
    # 3. Build the final report
    # ------------------------------------------------------------------
    final_report = {
        "country": country,
        "years": [2023, 2024, 2025],
        "overall_score": round(overall_score, 2),
        "tier": tier,
        "executive_summary": executive_summary,
        "layers": layers,
        "sources": source_urls,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    # ------------------------------------------------------------------
    # 4. Write final_report.json
    # ------------------------------------------------------------------
    report_path = report_dir / "final_report.json"
    report_path.write_text(
        json.dumps(final_report, indent=2, ensure_ascii=False)
    )

    # ------------------------------------------------------------------
    # 5. Write sources.json (full metadata)
    # ------------------------------------------------------------------
    sources_path = report_dir / "sources.json"
    sources_path.write_text(
        json.dumps(unique_sources, indent=2, ensure_ascii=False)
    )

    logger.info(f"Report saved to {report_dir}")

    return (
        f"Report saved successfully.\n"
        f"**Folder**: {report_dir}\n"
        f"**Files**:\n"
        f"  - final_report.json ({len(layers)} layers, score {overall_score:.1f})\n"
        f"  - sources.json ({len(unique_sources)} unique sources)\n"
        f"  - layers/ ({len(layers)} layer files)\n"
    )
