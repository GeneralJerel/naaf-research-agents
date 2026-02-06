"""Research persistence layer for NAAF reports.

Stores completed research runs to:
1. Avoid demo failures (replay saved research)
2. Track historical assessments per country
3. Enable trend analysis over time
4. Support rubric evolution tracking
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict


# Default storage directory (can be overridden via env var)
STORAGE_DIR = Path(os.getenv("NAAF_STORAGE_DIR", "./data/research_runs"))


@dataclass
class StoredResearch:
    """A stored research run."""
    id: str
    country: str
    country_code: str
    year: int
    overall_score: float
    tier: str
    layers: Dict[str, Any]  # Can be layer_scores for backwards compat
    sources: List[str]
    news_snapshot: List[Dict[str, Any]] = None  # News at time of research
    framework_version: str = "1.0"  # Track which rubric version was used
    generated_at: str = ""
    research_duration_seconds: float = 0.0
    raw_response: str = ""  # Store raw LLM response
    created_at: str = ""  # Alias for generated_at

    def __post_init__(self):
        if not self.generated_at and self.created_at:
            self.generated_at = self.created_at
        if not self.created_at and self.generated_at:
            self.created_at = self.generated_at
        if self.news_snapshot is None:
            self.news_snapshot = []

    @property
    def layer_scores(self) -> Dict[str, Any]:
        """Alias for layers field."""
        return self.layers


class ResearchStore:
    """Persistent storage for NAAF research runs."""

    def __init__(self, storage_dir: Optional[Path] = None):
        self.storage_dir = storage_dir or STORAGE_DIR
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._index_path = self.storage_dir / "index.json"
        self._load_index()

    def _load_index(self):
        """Load the research index."""
        if self._index_path.exists():
            with open(self._index_path, "r") as f:
                self._index = json.load(f)
        else:
            self._index = {
                "version": "1.0",
                "runs": [],
                "by_country": {},
                "latest_by_country": {}
            }

    def _save_index(self):
        """Save the research index."""
        with open(self._index_path, "w") as f:
            json.dump(self._index, f, indent=2)

    def _generate_id(self, country: str) -> str:
        """Generate a unique research run ID."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        country_slug = country.lower().replace(" ", "_")
        return f"{country_slug}_{timestamp}"

    def save_research(
        self,
        country: str,
        country_code: str,
        year: int,
        overall_score: float,
        tier: str,
        layers: Dict[str, Any],
        sources: List[str],
        news_snapshot: List[Dict[str, Any]],
        framework_version: str,
        research_duration_seconds: float
    ) -> str:
        """
        Save a completed research run.

        Returns the research ID.
        """
        research_id = self._generate_id(country)
        generated_at = datetime.now().isoformat()

        research = StoredResearch(
            id=research_id,
            country=country,
            country_code=country_code,
            year=year,
            overall_score=overall_score,
            tier=tier,
            layers=layers,
            sources=sources,
            news_snapshot=news_snapshot,
            framework_version=framework_version,
            generated_at=generated_at,
            research_duration_seconds=research_duration_seconds
        )

        # Save the full research data
        research_path = self.storage_dir / f"{research_id}.json"
        with open(research_path, "w") as f:
            json.dump(asdict(research), f, indent=2)

        # Update index
        country_lower = country.lower()

        run_meta = {
            "id": research_id,
            "country": country,
            "year": year,
            "overall_score": overall_score,
            "tier": tier,
            "generated_at": generated_at
        }

        self._index["runs"].append(run_meta)

        if country_lower not in self._index["by_country"]:
            self._index["by_country"][country_lower] = []
        self._index["by_country"][country_lower].append(research_id)

        self._index["latest_by_country"][country_lower] = research_id

        self._save_index()

        print(f"💾 Saved research run: {research_id}")
        return research_id

    def get_research(self, research_id: str) -> Optional[StoredResearch]:
        """Get a specific research run by ID."""
        research_path = self.storage_dir / f"{research_id}.json"
        if not research_path.exists():
            return None

        with open(research_path, "r") as f:
            data = json.load(f)

        return StoredResearch(**data)

    def get_latest_for_country(self, country: str) -> Optional[StoredResearch]:
        """Get the most recent research for a country."""
        country_lower = country.lower()
        research_id = self._index["latest_by_country"].get(country_lower)
        if not research_id:
            return None
        return self.get_research(research_id)

    def get_all_for_country(self, country: str) -> List[StoredResearch]:
        """Get all research runs for a country (for trend analysis)."""
        country_lower = country.lower()
        research_ids = self._index["by_country"].get(country_lower, [])
        results = []
        for rid in research_ids:
            research = self.get_research(rid)
            if research:
                results.append(research)
        return results

    def list_countries(self) -> List[Dict[str, Any]]:
        """List all countries with research data."""
        countries = []
        for country_lower, research_id in self._index["latest_by_country"].items():
            research = self.get_research(research_id)
            if research:
                countries.append({
                    "country": research.country,
                    "country_code": research.country_code,
                    "latest_score": research.overall_score,
                    "tier": research.tier,
                    "last_updated": research.generated_at,
                    "run_count": len(self._index["by_country"].get(country_lower, []))
                })
        return sorted(countries, key=lambda x: x["latest_score"], reverse=True)

    def list_recent_runs(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get the most recent research runs across all countries."""
        runs = sorted(
            self._index["runs"],
            key=lambda x: x["generated_at"],
            reverse=True
        )
        return runs[:limit]

    def has_research(self, country: str) -> bool:
        """Check if we have any research for a country."""
        return country.lower() in self._index["latest_by_country"]

    def save(self, research: StoredResearch) -> str:
        """
        Save a StoredResearch object directly.

        Simpler interface for the API layer.
        """
        # Save the full research data
        research_path = self.storage_dir / f"{research.id}.json"
        with open(research_path, "w") as f:
            json.dump(asdict(research), f, indent=2, default=str)

        # Update index
        country_lower = research.country.lower()

        run_meta = {
            "id": research.id,
            "country": research.country,
            "year": research.year,
            "overall_score": research.overall_score,
            "tier": research.tier,
            "generated_at": research.generated_at or research.created_at
        }

        self._index["runs"].append(run_meta)

        if country_lower not in self._index["by_country"]:
            self._index["by_country"][country_lower] = []
        self._index["by_country"][country_lower].append(research.id)

        self._index["latest_by_country"][country_lower] = research.id

        self._save_index()
        print(f"💾 Saved research run: {research.id}")
        return research.id

    def get(self, research_id: str) -> Optional[StoredResearch]:
        """Alias for get_research."""
        return self.get_research(research_id)

    def list(self, country: Optional[str] = None, limit: int = 20) -> List[StoredResearch]:
        """
        List research runs with optional country filter.

        Args:
            country: Optional country name to filter by
            limit: Maximum number of results

        Returns:
            List of StoredResearch objects
        """
        if country:
            research_ids = self._index["by_country"].get(country.lower(), [])
            results = []
            for rid in research_ids[-limit:]:
                research = self.get_research(rid)
                if research:
                    results.append(research)
            return results
        else:
            # Get most recent runs across all countries
            recent = self.list_recent_runs(limit)
            results = []
            for run_meta in recent:
                research = self.get_research(run_meta["id"])
                if research:
                    results.append(research)
            return results

    def delete_research(self, research_id: str) -> bool:
        """Delete a research run."""
        research_path = self.storage_dir / f"{research_id}.json"
        if not research_path.exists():
            return False

        # Remove from index
        self._index["runs"] = [
            r for r in self._index["runs"] if r["id"] != research_id
        ]

        for country, ids in self._index["by_country"].items():
            if research_id in ids:
                ids.remove(research_id)
                # Update latest if needed
                if self._index["latest_by_country"].get(country) == research_id:
                    if ids:
                        self._index["latest_by_country"][country] = ids[-1]
                    else:
                        del self._index["latest_by_country"][country]

        self._save_index()

        # Delete the file
        research_path.unlink()
        print(f"🗑️ Deleted research run: {research_id}")
        return True


# Global store instance
_store: Optional[ResearchStore] = None


def get_store() -> ResearchStore:
    """Get the global research store instance."""
    global _store
    if _store is None:
        _store = ResearchStore()
    return _store
