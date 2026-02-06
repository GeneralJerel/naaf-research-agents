"""NAAF Research Agent - Main agent definition.

This module defines the main NAAF (National AI Assessment Framework) agent
that conducts comprehensive assessments of countries' AI capabilities
across 8 layers, from physical infrastructure to economic implementation.

Can be used with Google ADK or standalone with Gemini API.
"""

import os
import json
import asyncio
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any, Callable
from datetime import datetime

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

from .prompts import NAAF_SYSTEM_PROMPT, LAYER_RESEARCH_PROMPT, SCORING_PROMPT
from .tools import (
    search_layer_info,
    get_live_news,
    calculate_score,
    search_with_exa,
    check_rubric_updates,
    get_layer_info,
    get_all_layers_summary,
)

try:
    # Try relative imports first (when installed as package)
    from ...framework import (
        NAAF_LAYERS,
        POWER_TIERS,
        get_tier,
        get_tier_description,
        StoredResearch,
        get_store,
    )
except ImportError:
    # Fall back to absolute imports (when running from backend dir)
    from framework import (
        NAAF_LAYERS,
        POWER_TIERS,
        get_tier,
        get_tier_description,
        StoredResearch,
        get_store,
    )


@dataclass
class NAAFAgentConfig:
    """Configuration for the NAAF Research Agent."""
    model: str = "gemini-2.0-flash-exp"
    max_research_loops: int = 3
    include_news: bool = True
    check_rubric_updates: bool = False
    verbose: bool = True
    api_key: Optional[str] = None

    def __post_init__(self):
        if self.api_key is None:
            self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


@dataclass
class LayerResearchResult:
    """Result of researching a single NAAF layer."""
    layer_number: int
    layer_name: str
    score: float
    max_score: float
    findings: str
    sources: List[str]
    metrics: Dict[str, Any]
    status: str = "complete"


@dataclass
class NAAFAssessmentResult:
    """Complete NAAF assessment result."""
    country: str
    year: int
    overall_score: float
    tier: str
    tier_description: str
    layer_results: Dict[int, LayerResearchResult]
    news_articles: List[Dict[str, Any]]
    sources: List[str]
    generated_at: str
    research_duration_seconds: float
    raw_response: str = ""


# Tool registry for function calling
NAAF_TOOLS = {
    "search_layer_info": search_layer_info,
    "get_live_news": get_live_news,
    "calculate_score": calculate_score,
    "search_with_exa": search_with_exa,
    "check_rubric_updates": check_rubric_updates,
    "get_layer_info": get_layer_info,
    "get_all_layers_summary": get_all_layers_summary,
}

# Tool definitions for Gemini function calling
TOOL_DEFINITIONS = [
    {
        "name": "search_layer_info",
        "description": "Search for NAAF layer-specific metrics using authoritative sources like IEA, World Bank, OECD.",
        "parameters": {
            "type": "object",
            "properties": {
                "country": {"type": "string", "description": "Country to research"},
                "layer_number": {"type": "integer", "description": "NAAF layer number (1-8)"},
                "metric_query": {"type": "string", "description": "Specific metric to search for"},
                "year": {"type": "integer", "description": "Target year for data", "default": 2024}
            },
            "required": ["country", "layer_number", "metric_query"]
        }
    },
    {
        "name": "get_live_news",
        "description": "Get live news about AI developments for a country using You.com Live News API.",
        "parameters": {
            "type": "object",
            "properties": {
                "country": {"type": "string", "description": "Country to get news for"},
                "topic": {"type": "string", "description": "Topic to search", "default": "artificial intelligence"},
                "count": {"type": "integer", "description": "Number of articles", "default": 5}
            },
            "required": ["country"]
        }
    },
    {
        "name": "search_with_exa",
        "description": "Search using Exa AI with date filtering for recent developments.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "days_back": {"type": "integer", "description": "Days to look back", "default": 30},
                "num_results": {"type": "integer", "description": "Max results", "default": 10}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_layer_info",
        "description": "Get detailed information about a NAAF layer including metrics and weights.",
        "parameters": {
            "type": "object",
            "properties": {
                "layer_number": {"type": "integer", "description": "Layer number (1-8)"}
            },
            "required": ["layer_number"]
        }
    },
    {
        "name": "get_all_layers_summary",
        "description": "Get a summary of all 8 NAAF layers with their weights and descriptions.",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    }
]


class NAAFAgent:
    """
    NAAF Research Agent for country AI readiness assessment.

    This agent researches countries across 8 layers:
    1. Power & Electricity (20%)
    2. Chipset Manufacturers (15%)
    3. Cloud & Data Centers (15%)
    4. Model Developers (10%)
    5. Platform & Data (10%)
    6. Applications & Startups (10%)
    7. Education & Consulting (10%)
    8. Implementation (10%)
    """

    def __init__(self, config: Optional[NAAFAgentConfig] = None):
        self.config = config or NAAFAgentConfig()
        self.tools = NAAF_TOOLS
        self._setup_model()

    def _setup_model(self):
        """Initialize the Gemini model."""
        if not HAS_GENAI:
            print("Warning: google-generativeai not installed. Using mock mode.")
            self.model = None
            return

        if self.config.api_key:
            genai.configure(api_key=self.config.api_key)

        self.model = genai.GenerativeModel(
            model_name=self.config.model,
            system_instruction=NAAF_SYSTEM_PROMPT,
        )

    def _execute_tool(self, tool_name: str, args: Dict[str, Any]) -> str:
        """Execute a tool by name with given arguments."""
        if tool_name not in self.tools:
            return f"Unknown tool: {tool_name}"

        try:
            result = self.tools[tool_name](**args)
            if isinstance(result, dict):
                return json.dumps(result, indent=2)
            return str(result)
        except Exception as e:
            return f"Tool {tool_name} failed: {str(e)}"

    async def research_layer(
        self,
        country: str,
        layer_number: int,
        year: int = 2024
    ) -> LayerResearchResult:
        """Research a single NAAF layer for a country."""
        layer = NAAF_LAYERS.get(layer_number)
        if not layer:
            return LayerResearchResult(
                layer_number=layer_number,
                layer_name="Unknown",
                score=0,
                max_score=0,
                findings="Invalid layer number",
                sources=[],
                metrics={},
                status="error"
            )

        if self.config.verbose:
            print(f"🔍 Researching Layer {layer_number}: {layer.name} for {country}...")

        # Search for each metric in the layer
        findings = []
        sources = []
        metrics = {}

        for metric in layer.metrics:
            # Use primary search query
            query = metric.search_queries[0].format(country=country, year=year)
            result = search_layer_info(country, layer_number, metric.name, year)
            findings.append(f"### {metric.name}\n{result}")

            # Try Exa for recent data
            try:
                exa_result = search_with_exa(
                    f"{country} {metric.name} {year}",
                    days_back=90,
                    num_results=3
                )
                if "No results" not in exa_result and "failed" not in exa_result.lower():
                    findings.append(f"**Recent data from Exa:**\n{exa_result}")
            except Exception:
                pass

        # Calculate a preliminary score based on data availability
        # In production, this would use actual metric values
        data_coverage = len([f for f in findings if "No results" not in f]) / max(len(layer.metrics), 1)
        score = layer.max_points * data_coverage * 0.7  # Conservative estimate

        return LayerResearchResult(
            layer_number=layer_number,
            layer_name=layer.name,
            score=round(score, 2),
            max_score=layer.max_points,
            findings="\n\n".join(findings),
            sources=sources,
            metrics=metrics,
            status="complete"
        )

    async def assess_country(
        self,
        country: str,
        year: int = 2024,
        progress_callback: Optional[Callable[[str, Dict], None]] = None
    ) -> NAAFAssessmentResult:
        """
        Run a full NAAF assessment for a country.

        Args:
            country: Country name to assess
            year: Target year for data
            progress_callback: Optional callback for progress updates

        Returns:
            NAAFAssessmentResult with full assessment
        """
        start_time = datetime.now()

        def emit(event: str, data: Dict):
            if progress_callback:
                progress_callback(event, data)
            if self.config.verbose:
                print(f"[{event}] {data.get('message', '')}")

        emit("start", {
            "country": country,
            "year": year,
            "message": f"Starting NAAF assessment for {country}"
        })

        layer_results = {}
        all_sources = []

        # Research each layer
        for layer_num in range(1, 9):
            layer = NAAF_LAYERS[layer_num]

            emit("layer_start", {
                "layer_number": layer_num,
                "layer_name": layer.name,
                "weight": layer.weight,
                "message": f"Researching Layer {layer_num}: {layer.name}"
            })

            result = await self.research_layer(country, layer_num, year)
            layer_results[layer_num] = result
            all_sources.extend(result.sources)

            emit("layer_complete", {
                "layer_number": layer_num,
                "layer_name": layer.name,
                "score": result.score,
                "max_score": result.max_score,
                "message": f"Layer {layer_num} complete: {result.score}/{result.max_score}"
            })

        # Get live news if enabled
        news_articles = []
        if self.config.include_news:
            emit("news_start", {"message": f"Fetching live news for {country}"})
            try:
                news_result = get_live_news(country)
                # Parse news into structured format
                news_articles = [{"raw": news_result}]
            except Exception as e:
                emit("news_error", {"message": f"News fetch failed: {e}"})
            emit("news_complete", {"count": len(news_articles)})

        # Calculate overall score
        overall_score = sum(r.score for r in layer_results.values())
        tier = get_tier(overall_score)
        tier_desc = get_tier_description(tier)

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        result = NAAFAssessmentResult(
            country=country,
            year=year,
            overall_score=round(overall_score, 2),
            tier=tier,
            tier_description=tier_desc,
            layer_results=layer_results,
            news_articles=news_articles,
            sources=list(set(all_sources)),
            generated_at=end_time.isoformat(),
            research_duration_seconds=duration
        )

        emit("complete", {
            "country": country,
            "overall_score": result.overall_score,
            "tier": result.tier,
            "duration": duration,
            "message": f"Assessment complete: {result.overall_score}/100 ({result.tier})"
        })

        return result

    def save_result(self, result: NAAFAssessmentResult) -> str:
        """Save assessment result to the research store."""
        store = get_store()

        # Convert layer results to dict
        layer_scores = {}
        for layer_num, lr in result.layer_results.items():
            layer_scores[str(layer_num)] = {
                "score": lr.score,
                "max_score": lr.max_score,
                "status": lr.status,
                "findings": lr.findings[:1000] if lr.findings else ""
            }

        stored = StoredResearch(
            id=f"naaf_{result.country.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            country=result.country,
            country_code="",
            year=result.year,
            overall_score=result.overall_score,
            tier=result.tier,
            layers=layer_scores,
            sources=result.sources,
            news_snapshot=result.news_articles,
            framework_version="1.0",
            generated_at=result.generated_at,
            research_duration_seconds=result.research_duration_seconds,
            raw_response=result.raw_response,
            created_at=result.generated_at
        )

        return store.save(stored)


def create_naaf_agent(config: Optional[NAAFAgentConfig] = None) -> NAAFAgent:
    """Create a NAAF Research Agent with the given configuration."""
    return NAAFAgent(config)


async def assess_country(
    country: str,
    year: int = 2024,
    config: Optional[NAAFAgentConfig] = None,
    save: bool = True
) -> Dict[str, Any]:
    """
    Convenience function to run a full NAAF assessment.

    Args:
        country: Country name to assess
        year: Target year for data
        config: Optional agent configuration
        save: Whether to save the result

    Returns:
        Dictionary with assessment results
    """
    agent = create_naaf_agent(config)
    result = await agent.assess_country(country, year)

    run_id = None
    if save:
        run_id = agent.save_result(result)

    return {
        "run_id": run_id,
        "country": result.country,
        "year": result.year,
        "overall_score": result.overall_score,
        "tier": result.tier,
        "tier_description": result.tier_description,
        "layers": {
            str(k): {
                "name": v.layer_name,
                "score": v.score,
                "max_score": v.max_score,
                "status": v.status
            }
            for k, v in result.layer_results.items()
        },
        "news_count": len(result.news_articles),
        "source_count": len(result.sources),
        "duration_seconds": result.research_duration_seconds,
        "generated_at": result.generated_at
    }


# Export main functions
__all__ = [
    "NAAFAgent",
    "NAAFAgentConfig",
    "NAAFAssessmentResult",
    "LayerResearchResult",
    "create_naaf_agent",
    "assess_country",
    "NAAF_TOOLS",
    "TOOL_DEFINITIONS",
]
