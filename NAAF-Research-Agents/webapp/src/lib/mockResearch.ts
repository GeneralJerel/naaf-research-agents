import { CountryScore, layers } from "@/data/frameworkData";

export interface ResearchEvent {
  type: "thinking" | "searching" | "reading" | "scoring";
  message: string;
  source?: string;
  layer: number;
  score?: number;
  timestamp: number;
}

export interface StrategicItem {
  title: string;
  description: string;
}

export interface StrategicSummary {
  overview: string;
  classification: string;
  strengths: StrategicItem[];
  weaknesses: StrategicItem[];
  recommendations: StrategicItem[];
}

export interface ResearchResult {
  country: CountryScore;
  layerDetails: {
    layerNumber: number;
    layerName: string;
    score: number;
    findings: string;
    keyData?: string;
    sources: string[];
  }[];
  strategicSummary?: StrategicSummary;
  generatedAt: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const searchQueries: Record<number, string[]> = {
  1: [
    "industrial electricity price per kWh",
    "electricity generation capacity GW",
    "renewable energy mix percentage",
  ],
  2: [
    "semiconductor fab capacity 7nm",
    "chip manufacturing equipment access",
    "raw materials gallium germanium production",
  ],
  3: [
    "hyperscale data centers count",
    "sovereign cloud infrastructure",
    "international bandwidth Tbps",
  ],
  4: [
    "large language models foundation models",
    "Top500 supercomputers ranking",
    "AI patents filed per year WIPO",
  ],
  5: [
    "open government data score OECD",
    "data privacy regulation cross-border",
    "language dataset availability NLP",
  ],
  6: [
    "AI unicorn startups valuation",
    "venture capital AI investment percentage GDP",
    "GitHub AI contributions developers",
  ],
  7: [
    "STEM graduates AI computer science",
    "QS university rankings computer science",
    "AI talent brain drain migration",
  ],
  8: [
    "government AI readiness index Oxford",
    "business AI adoption rate McKinsey",
    "AI productivity growth impact",
  ],
};

const sources: Record<number, string[]> = {
  1: ["iea.org", "china-briefing.com", "eia.gov", "irena.org"],
  2: ["reuters.com", "semiconductors.org", "asml.com", "smic.com"],
  3: ["cargoson.com", "datacentermap.com", "cloudscene.com"],
  4: ["arxiv.org", "top500.org", "wipo.int", "aiindex.stanford.edu"],
  5: ["oecd.org", "opendatabarometer.org", "worldbank.org"],
  6: ["crunchbase.com", "pitchbook.com", "thunderbit.com", "prnewswire.com"],
  7: ["timeshighereducation.com", "qs.com", "nature.com"],
  8: ["oxfordinsights.com", "mckinsey.com", "ict4dblog.wordpress.com"],
};

function generateThinkingMessages(country: string, layerNum: number, score: number): string[] {
  const layerName = layers[layerNum - 1].name;
  const templates: Record<number, string[]> = {
    1: [
      `I'm pulling together specifics on ${country}'s electricity costs, capacity, and clean energy mix to evaluate AI infrastructure readiness.`,
      `${country}'s industrial power rate is emerging as a key factor. Cross-referencing IEA data with recent policy changes for accuracy.`,
      `Evaluating grid reliability and reserve margins. ${score > 60 ? "Strong infrastructure foundation detected." : "Some infrastructure gaps noted that could constrain large-scale AI deployment."}`,
    ],
    2: [
      `Examining ${country}'s semiconductor ecosystem — fab capacity, equipment access, and raw material supply chains.`,
      `${score > 60 ? `${country} shows significant domestic chip manufacturing capability.` : `${country} faces dependencies in advanced chip manufacturing, particularly at sub-7nm nodes.`}`,
    ],
    3: [
      `Assessing ${country}'s data center footprint, sovereign cloud capabilities, and international connectivity.`,
      `${score > 60 ? "Robust hyperscale presence detected with growing sovereign cloud initiatives." : "Data center capacity is developing but lags behind leading nations in density and sovereignty."}`,
    ],
    4: [
      `Investigating ${country}'s foundation model landscape — domestic LLMs, supercomputing, and AI patent output.`,
      `${score > 60 ? `${country} demonstrates strong model development capabilities with multiple sovereign foundation models.` : `Model development ecosystem is emerging but relies on international frameworks.`}`,
    ],
    5: [
      `Analyzing data openness, governance frameworks, and language dataset availability for ${country}.`,
      `${score > 60 ? "Good data governance foundations with accessible open data portals." : "Data policy fragmentation may limit AI training data availability."}`,
    ],
    6: [
      `Mapping ${country}'s AI startup ecosystem — unicorns, VC investment, and developer community activity.`,
      `${score > 60 ? "Vibrant commercial ecosystem with strong venture capital flows into AI." : "Growing startup scene but VC investment as percentage of GDP remains modest."}`,
    ],
    7: [
      `Evaluating ${country}'s AI talent pipeline — university rankings, STEM output, and brain drain patterns.`,
      `${score > 60 ? "Strong talent production with globally ranked CS programs." : "Talent pipeline shows promise but faces retention challenges."}`,
    ],
    8: [
      `Assessing real-world AI implementation across ${country}'s government and industry sectors.`,
      `${score > 60 ? "Broad AI adoption in public and private sectors with measurable productivity gains." : "Implementation is progressing but unevenly distributed across sectors."}`,
    ],
  };
  return templates[layerNum] || [`Analyzing ${layerName} for ${country}.`];
}

export async function mockResearchCountry(
  countryName: string,
  onEvent?: (event: ResearchEvent) => void,
  onProgress?: (step: string) => void
): Promise<ResearchResult> {
  const startTime = Date.now();
  const layerDetails: ResearchResult["layerDetails"] = [];

  for (const layer of layers) {
    const score = Math.round(30 + Math.random() * 60);
    const layerSearches = searchQueries[layer.number] || [];
    const layerSources = sources[layer.number] || [];
    const thinkingMsgs = generateThinkingMessages(countryName, layer.number, score);

    // Search step
    for (const query of layerSearches) {
      const fullQuery = `${countryName} ${query}`;
      onProgress?.(`Searching: ${fullQuery}`);
      onEvent?.({
        type: "searching",
        message: fullQuery,
        layer: layer.number,
        timestamp: Date.now() - startTime,
      });
      await delay(250 + Math.random() * 200);
    }

    // Read sources
    const usedSources = layerSources.slice(0, 1 + Math.floor(Math.random() * 2));
    for (const src of usedSources) {
      onProgress?.(`Reading: ${src}`);
      onEvent?.({
        type: "reading",
        message: src,
        source: `https://${src}`,
        layer: layer.number,
        timestamp: Date.now() - startTime,
      });
      await delay(300 + Math.random() * 250);
    }

    // Thinking
    for (const msg of thinkingMsgs) {
      onProgress?.(`Analyzing Layer ${layer.number}...`);
      onEvent?.({
        type: "thinking",
        message: msg,
        layer: layer.number,
        timestamp: Date.now() - startTime,
      });
      await delay(400 + Math.random() * 300);
    }

    // Scoring
    onEvent?.({
      type: "scoring",
      message: `Layer ${layer.number}: ${layer.name}`,
      score,
      layer: layer.number,
      timestamp: Date.now() - startTime,
    });
    onProgress?.(`Scored Layer ${layer.number}: ${score}/100`);
    await delay(200);

    layerDetails.push({
      layerNumber: layer.number,
      layerName: layer.name,
      score,
      findings: `${countryName} scores ${score}/100 on ${layer.name}. Assessment based on ${layer.metrics.join(", ")}. ${layer.shortDesc}.`,
      sources: usedSources.map((s) => `https://${s}`),
    });
  }

  const weights = [0.2, 0.15, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1];
  const overall = Math.round(
    layerDetails.reduce((sum, ld, i) => sum + ld.score * weights[i], 0)
  );

  const layersRecord: Record<number, number> = {};
  layerDetails.forEach((ld) => {
    layersRecord[ld.layerNumber] = ld.score;
  });

  return {
    country: {
      country: countryName,
      code: countryName.slice(0, 2).toUpperCase(),
      overall,
      layers: layersRecord,
    },
    layerDetails,
    generatedAt: new Date().toISOString(),
  };
}
