/**
 * NAAF API Client
 *
 * Connects to the backend research agent API for country AI assessments.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

export interface NAAFLayerResult {
  layer_number: number;
  layer_name: string;
  score: number;
  max_score: number;
  status: string;
  metrics: {
    name: string;
    value: number | null;
    unit: string;
    year: number;
    source_url: string;
    confidence: number;
  }[];
}

export interface NAAFReport {
  country: string;
  country_code: string;
  years: number[];
  overall_score: number;
  tier: string;
  layers: Record<string, NAAFLayerResult>;
  sources: string[];
  generated_at: string;
  research_loops: number;
}

export interface NAAFResearchEvent {
  type:
    | "status"
    | "layer_complete"
    | "scoring_complete"
    | "complete"
    | "error"
    | "progress";
  message: string;
  progress: number;
  stage: string;
  data?: {
    layer_number?: number;
    layer_name?: string;
    score?: number;
    max_score?: number;
    status?: string;
    overall_score?: number;
    tier?: string;
    tier_description?: string;
    report?: NAAFReport;
    summary?: {
      country: string;
      overall_score: number;
      tier: string;
      layer_scores: Record<string, number>;
      sources_count: number;
    };
  };
}

export interface LayerDefinition {
  number: number;
  name: string;
  short_name: string;
  description: string;
  weight: number;
  max_points: number;
  metrics: {
    name: string;
    description: string;
    unit: string;
    weight: number;
  }[];
}

export interface TierDefinition {
  name: string;
  min_score: number;
  max_score: number;
  description: string;
}

/**
 * Start NAAF research for a country with SSE streaming.
 */
export async function* researchCountry(
  country: string,
  year: number = 2024
): AsyncGenerator<NAAFResearchEvent> {
  const response = await fetch(`${API_BASE_URL}/naaf/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country, year }),
  });

  if (!response.ok) {
    throw new Error(`Research request failed: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process SSE events
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          yield data as NAAFResearchEvent;
        } catch (e) {
          console.warn("Failed to parse SSE event:", line);
        }
      }
    }
  }
}

/**
 * Get NAAF layer definitions.
 */
export async function getLayers(): Promise<{
  total_layers: number;
  total_points: number;
  layers: LayerDefinition[];
}> {
  const response = await fetch(`${API_BASE_URL}/naaf/layers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch layers: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get NAAF tier definitions.
 */
export async function getTiers(): Promise<{ tiers: TierDefinition[] }> {
  const response = await fetch(`${API_BASE_URL}/naaf/tiers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tiers: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Check API health.
 */
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

// =============================================================================
// Stored Research API - For demo mode and history
// =============================================================================

export interface StoredResearch {
  id: string;
  country: string;
  country_code: string;
  year: number;
  overall_score: number;
  tier: string;
  layers: Record<string, NAAFLayerResult>;
  sources: string[];
  news_snapshot: {
    title: string;
    description: string;
    url: string;
    source: string;
    timestamp: string;
  }[];
  framework_version: string;
  generated_at: string;
  research_duration_seconds: number;
}

export interface StoredCountry {
  country: string;
  country_code: string;
  latest_score: number;
  tier: string;
  last_updated: string;
  run_count: number;
}

/**
 * List all stored research runs.
 */
export async function listStoredResearch(): Promise<{
  countries: StoredCountry[];
  recent_runs: {
    id: string;
    country: string;
    year: number;
    overall_score: number;
    tier: string;
    generated_at: string;
  }[];
}> {
  const response = await fetch(`${API_BASE_URL}/naaf/stored`);
  if (!response.ok) {
    throw new Error(`Failed to list stored research: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get stored research for a country.
 */
export async function getStoredResearch(
  country: string,
  runId?: string
): Promise<StoredResearch> {
  const url = runId
    ? `${API_BASE_URL}/naaf/stored/${encodeURIComponent(country)}?run_id=${runId}`
    : `${API_BASE_URL}/naaf/stored/${encodeURIComponent(country)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to get stored research: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get research history for a country.
 */
export async function getCountryHistory(country: string): Promise<{
  country: string;
  run_count: number;
  runs: {
    id: string;
    year: number;
    overall_score: number;
    tier: string;
    generated_at: string;
    framework_version: string;
  }[];
}> {
  const response = await fetch(
    `${API_BASE_URL}/naaf/stored/${encodeURIComponent(country)}/history`
  );
  if (!response.ok) {
    throw new Error(`Failed to get country history: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Start NAAF research with optional stored data fallback.
 * If useStored is true and stored data exists, returns that instead of running live.
 */
export async function* researchCountryWithFallback(
  country: string,
  year: number = 2024,
  useStored: boolean = false
): AsyncGenerator<NAAFResearchEvent> {
  const url = new URL(`${API_BASE_URL}/naaf/research`);
  if (useStored) {
    url.searchParams.set("use_stored", "true");
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country, year }),
  });

  if (!response.ok) {
    throw new Error(`Research request failed: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          yield data as NAAFResearchEvent;
        } catch (e) {
          console.warn("Failed to parse SSE event:", line);
        }
      }
    }
  }
}
