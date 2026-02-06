import { ResearchResult } from "@/lib/mockResearch";

export const usaReport: ResearchResult = {
  country: {
    country: "United States",
    code: "US",
    overall: 80,
    layers: { 1: 45, 2: 80, 3: 100, 4: 100, 5: 50, 6: 100, 7: 90, 8: 100 },
  },
  layerDetails: [
    {
      layerNumber: 1,
      layerName: "Power & Electricity",
      score: 45,
      findings:
        "The U.S. has enormous electricity output (~4,178 TWh in 2023, second globally after China) with ~1.16 TW installed capacity. However, industrial electricity averages $0.156/kWh — roughly 5× the cheapest global rates. The clean energy mix sits at ~39–40% (18% nuclear, 10% wind, 5–6% hydro, 5% solar), with fossil fuels still supplying ~60%. Grid reliability averaged ~5.5 hours of outages per customer in 2022, decent but not top-tier. The U.S. has sufficient power for AI needs, but improvements in cost and clean energy share would strengthen this foundation. Score: ~9/20.",
      sources: [
        "https://en.wikipedia.org/wiki/Electricity_sector_of_the_United_States",
        "https://www.globalpetrolprices.com/USA/electricity_prices/",
        "https://www.eia.gov/todayinenergy/detail.php?id=61303",
      ],
    },
    {
      layerNumber: 2,
      layerName: "Chipset Manufacturers",
      score: 80,
      findings:
        "The U.S. hosts advanced fabs (Intel, Samsung Austin) producing chips at ~10 nm and 7 nm, but sub-5 nm mass production is not yet operational domestically — TSMC Arizona will begin 4 nm production in late 2025. The U.S. dominates semiconductor equipment: Applied Materials, Lam Research, and KLA hold over 50% of the global fab equipment market. The U.S. also controls EDA software (Synopsys, Cadence). Score: ~12/15 — strong chip sovereignty except reliance on foreign fabs for cutting-edge nodes, a gap the CHIPS Act aims to close.",
      sources: [
        "https://wccftech.com/tsmc-arizona-set-to-begin-4nm-production-in-h2-2025/",
        "https://www.marketsandmarkets.com/ResearchInsight/semiconductor-manufacturing-equipment-market.asp",
      ],
    },
    {
      layerNumber: 3,
      layerName: "Cloud & Data Centers",
      score: 100,
      findings:
        "The U.S. houses by far the most hyperscale data centers globally — over 500 facilities by early 2024, roughly half of all hyperscale data centers worldwide. No other country comes close. The three leading cloud providers (AWS, Azure, Google Cloud) are all U.S. firms dominating market share. Government workloads run on GovCloud regions, and federal contracts (DoD JWCC) go to American providers. Score: 15/15 — unparalleled cloud infrastructure backbone with full sovereign control.",
      sources: [
        "https://www.datacenterfrontier.com/hyperscale/article/55020441/us-contains-fully-half-of-1000-hyperscale-data-centers-now-counted-globally-as-cloud-giants-race-toward-ai",
        "https://www.srgresearch.com/articles/cloud-market-share-trends-big-three-together-hold-63-while-oracle-and-the-neoclouds-inch-higher",
      ],
    },
    {
      layerNumber: 4,
      layerName: "Model Developers",
      score: 100,
      findings:
        "In 2024, the U.S. led the world with 40 notable AI models (each >10B parameters), vastly outpacing China's ~15. World-leading systems include OpenAI's GPT-4, Google's PaLM 2, and Meta's LLaMA 2. The U.S. hosts the #1 supercomputer globally (Frontier at Oak Ridge, exascale) plus massive cloud GPU clusters. While China publishes more AI papers by volume, U.S. research remains higher-impact in citations, H-index, and benchmark performance. Score: 10/10 — full sovereign AI model development capability.",
      sources: [
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        "https://research.com/university-rankings/computer-science",
      ],
    },
    {
      layerNumber: 5,
      layerName: "Platform & Data",
      score: 50,
      findings:
        "The U.S. has a robust open data program (data.gov with hundreds of thousands of datasets) but doesn't rank in the OECD's top 10 for open government data. The Open Data Inventory 2024 ranked the U.S. 21st globally (78/100). However, with ~318 million internet users (93% penetration) generating vast English-language data, and as the home of major internet platforms, the U.S. benefits from enormous data availability. Cross-border data flows are generally unrestricted. Score: ~5/10 — one of the weaker areas relative to other U.S. strengths.",
      sources: [
        "https://www.oecd.org/en/publications/2025/06/government-at-a-glance-2025_70e14c6c/full-report/open-government-data_619b668c.html",
        "https://www.government-transformation.com/data/oecd-the-top-performing-governments-for-open-data",
        "https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users",
      ],
    },
    {
      layerNumber: 6,
      layerName: "Applications & Startups",
      score: 100,
      findings:
        "Private AI investment in the U.S. reached $109 billion in 2024 — nearly 12× China ($9.3B) and 24× the UK. The U.S. routinely attracts 40–50+% of all global AI startup funding. Well over half of all AI unicorns globally are U.S.-based, spanning Silicon Valley, New York, and Boston. The U.S. has the most GitHub contributors to AI projects and a thriving open-source AI community. Score: 10/10 — the global leader in AI commercialization by every measure.",
      sources: [
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
      ],
    },
    {
      layerNumber: 7,
      layerName: "Education & Consulting",
      score: 90,
      findings:
        "The U.S. awarded ~33,800 STEM PhDs in 2022, while China awarded over 50,000. However, U.S. institutions dominate global AI/CS rankings — Carnegie Mellon is #1 worldwide, with MIT, Stanford, and Berkeley consistently in the top 5. Over 80% of international AI PhD graduates stay in the U.S. for at least 5 years, and ~90% take a U.S. job immediately after graduating. The U.S. effectively 'imports' and retains top global talent, compensating for lower domestic output. Score: ~9/10.",
      sources: [
        "https://itif.org/publications/2025/09/10/americas-innovation-future-at-risk-without-stem-growth/",
        "https://cset.georgetown.edu/publication/keeping-top-ai-talent-in-the-united-states/",
        "https://research.com/university-rankings/computer-science",
      ],
    },
    {
      layerNumber: 8,
      layerName: "Implementation",
      score: 100,
      findings:
        "The U.S. ranks #1 globally in the Oxford Insights Government AI Readiness Index 2025 (87.2/100). AI adoption in U.S. industry accelerated to 78% of organizations in 2024, up from 55% a year before. Sectors including tech, finance, healthcare, and manufacturing are deploying AI at scale. Federal agencies use AI for predictive analytics, and the U.S. leads in experimenting with AI-augmented government operations. Score: 10/10 — top in both government readiness and private sector adoption.",
      sources: [
        "https://oxfordinsights.com/ai-readiness/government-ai-readiness-index-2025/",
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
      ],
    },
  ],
  generatedAt: "2025-06-01T00:00:00.000Z",
};
