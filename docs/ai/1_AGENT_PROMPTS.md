# Agent Prompt Strategies

## Overview
The NAAF system uses two types of prompts:
1. **Supervisor prompt**: Static instruction in `prompts/supervisor.py`
2. **Layer agent prompts**: Dynamically generated per layer via `prompts/layer_researcher.py`

## Supervisor Prompt Design

The supervisor prompt (`SUPERVISOR_INSTRUCTION`) is structured as:

### Role Definition
```
You are the NAAF (National AI Assessment Framework) Supervisor Agent.
```

### Framework Overview
Lists all 8 layers with weights so the LLM understands the scoring model.

### Workflow Steps
1. Receive country name → delegate to layer agents
2. Collect per-layer scores
3. Call `calculate_overall_score` tool
4. Produce final report with tier classification

### Constraints
- Cite sources with URLs
- Use data from 2023-2025 only
- Be objective and data-driven
- Note missing data explicitly

## Layer Agent Prompt Design

Each layer gets a dynamically generated prompt from `get_layer_instruction(layer_number)`.

### Template Structure
1. **Role**: "You are the Layer N: {name} research agent"
2. **Task**: Research this layer for the given country
3. **Metrics**: Specific metrics to find (from `LAYER_METRICS` dict)
4. **Preferred Sources**: Domain allowlist from `source_registry.py`
5. **Research Protocol**: Step-by-step search strategy
6. **Scoring**: Instructions for calling `score_layer` tool

### Key Prompt Patterns

**Domain-First Search**:
```
Use the `youcom_domain_search` tool with domains="iea.org,worldbank.org" to search
authoritative sources. Fall back to `youcom_web_search` for broader searches.
```

**Year Constraints**:
```
Run 2-3 targeted searches with year constraints (2023-2025)
```

**Anti-Hallucination**:
```
If data is unavailable, explicitly state "data not found" and set confidence low
```

**Structured Output**:
```
End your research by calling `score_layer` with your final assessment.
```

## Tool Docstrings as Prompts

ADK uses function docstrings as tool descriptions for the LLM. Each tool has
carefully crafted docstrings:

### `youcom_web_search`
```
Search the web using the You.com Search API.
Use this tool to find information on the public web...
```

### `youcom_domain_search`
```
Search the web restricted to specific authoritative domains.
Use this tool when you need results from specific sources like
government websites, international organizations...
```

### `score_layer`
```
Record a scored assessment for a single NAAF layer.
After researching a layer's metrics using web search, call this tool
to register the layer's score...
```

## Iteration Strategy

### What Worked
- Explicit domain lists in prompts reduce noise
- Year constraints prevent outdated data
- "data not found" instructions prevent fabrication
- Metric-specific search queries improve relevance

### Potential Improvements
- Add few-shot examples of good vs bad scores
- Include reference benchmarks (e.g. "US scores ~95 on Power")
- Add chain-of-thought reasoning instructions
- Implement self-reflection step before final scoring
