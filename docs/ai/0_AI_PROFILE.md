# NAAF Research Agents — AI Engineering Profile

## Agent Architecture
Multi-agent system using Google ADK's `LlmAgent` with hierarchical delegation:
- **Supervisor** (root_agent): orchestrates and aggregates
- **8 Layer Agents** (sub_agents): specialized researchers

## Model
- **Gemini 2.5 Flash** — fast, cost-effective, good for research tasks
- Configurable per agent via the `model` parameter

## Prompt Strategy

### Supervisor Prompt
The supervisor receives a structured instruction covering:
- The 8-layer framework with weights
- Workflow steps (delegate → collect → score → report)
- Tier classification rules
- Citation requirements

### Layer Agent Prompts
Each layer agent gets a dynamically generated instruction from `get_layer_instruction()`:
- Layer-specific metrics to research
- Preferred authoritative domains
- Tool usage instructions (domain search first, fallback to general)
- Scoring protocol (0-100, justify with evidence)

## Tool Design

### You.com Search Tools
- `youcom_web_search(query, num_results)` — general web search
- `youcom_domain_search(query, domains, num_results)` — restricted to specific domains

Both return formatted markdown with titles, URLs, and snippets that the LLM
can parse and cite.

### Scoring Tools
- `score_layer(layer_number, score_0_to_100, justification)` — per-layer scoring
- `calculate_overall_score(layer_1..8_score)` — weighted aggregation

Scores are returned as formatted text so the LLM can include them in its response.

## Delegation Pattern
ADK handles agent transfer via LLM-based routing. The supervisor's `sub_agents`
list makes all 8 layer agents available. When the supervisor decides to research
a layer, the LLM naturally transfers to the appropriate sub-agent based on its
name and description.

## Output Format
The final output is a human-readable report with:
- Overall AI Power Score (0-100)
- Tier classification
- Per-layer scores with justifications
- Source URLs for all data points

## Prompt Iteration Notes
- Domain filters in prompts reduce hallucination by directing search to authoritative sources
- Year constraints (2023-2025) prevent stale data
- Explicit confidence scoring helps identify gaps
- "data not found" instructions prevent fabrication
