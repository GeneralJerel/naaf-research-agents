"""NAAF Multi-Agent Architecture.

This module implements a multi-agent system for NAAF country assessments
using Google Agent Development Kit (ADK).

Architecture:
- naaf_supervisor: Orchestrates the assessment
- 8 layer agents: Specialized researchers for each NAAF layer
- calculate_overall: Aggregates scores and determines tier
"""

from .app import app, naaf_supervisor
from .layer_agents import (
    layer_1_power_agent,
    layer_2_chips_agent,
    layer_3_cloud_agent,
    layer_4_models_agent,
    layer_5_data_agent,
    layer_6_apps_agent,
    layer_7_talent_agent,
    layer_8_adoption_agent,
)

__all__ = [
    "app",
    "naaf_supervisor",
    "layer_1_power_agent",
    "layer_2_chips_agent",
    "layer_3_cloud_agent",
    "layer_4_models_agent",
    "layer_5_data_agent",
    "layer_6_apps_agent",
    "layer_7_talent_agent",
    "layer_8_adoption_agent",
]
