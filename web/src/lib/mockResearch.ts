import { CountryScore, layers } from "@/data/frameworkData";

export interface ResearchResult {
  country: CountryScore;
  layerDetails: {
    layerNumber: number;
    layerName: string;
    score: number;
    findings: string;
    sources: string[];
  }[];
  generatedAt: string;
}

// Simulate a research delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockResearchCountry(
  countryName: string,
  onProgress?: (step: string) => void
): Promise<ResearchResult> {
  const steps = layers.map((l) => `Researching Layer ${l.number}: ${l.name}...`);

  const layerDetails: ResearchResult["layerDetails"] = [];

  for (const layer of layers) {
    onProgress?.(
      `Researching Layer ${layer.number}: ${layer.name}...`
    );
    await delay(400 + Math.random() * 300);

    const score = Math.round(30 + Math.random() * 60);
    layerDetails.push({
      layerNumber: layer.number,
      layerName: layer.name,
      score,
      findings: `${countryName} scores ${score}/100 on ${layer.name}. Assessment based on ${layer.metrics.join(", ")}. ${layer.shortDesc}.`,
      sources: [
        "https://data.worldbank.org",
        "https://www.iea.org/data-and-statistics",
        "https://www.oecd.org/en/data.html",
      ].slice(0, 1 + Math.floor(Math.random() * 2)),
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
