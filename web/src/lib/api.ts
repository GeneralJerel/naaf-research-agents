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
