import { ResearchResult } from "@/lib/mockResearch";

export const chinaReport: ResearchResult = {
  country: {
    country: "China",
    code: "CN",
    overall: 89,
    layers: { 1: 95, 2: 85, 3: 90, 4: 92, 5: 80, 6: 80, 7: 94, 8: 90 },
  },
  layerDetails: [
    {
      layerNumber: 1,
      layerName: "Power & Electricity",
      score: 95,
      findings:
        "China is the global leader in electricity infrastructure. Total generation reached 9,490 TWh (2023) and installed capacity hit 3,400 GW (2024). It possesses the world's largest renewable capacity (887 GW solar, 521 GW wind) and maintains highly competitive industrial electricity prices ($0.09–$0.11/kWh).",
      keyData: "Ranked #1 globally in total output; 55% of total capacity from renewables.",
      sources: [
        "https://www.eia.gov/international/content/analysis/countries_long/China/pdf/China-2025.pdf",
        "https://ember-climate.org/data/",
        "https://www.china-briefing.com/news/chinas-industrial-power-rates-category-electricity-usage-region-classification/",
      ],
    },
    {
      layerNumber: 2,
      layerName: "Chipset Manufacturers",
      score: 85,
      findings:
        "China leads the world in mature-node capacity and critical minerals (98% Gallium, 60% Germanium). SMIC has successfully entered volume production of 7nm (N+2) chips. While it lacks domestic EUV lithography for sub-5nm nodes, its resilience in the face of export controls is unmatched.",
      keyData: "$41B spent on fab equipment in 2024 (40% of global total); world's 3rd largest foundry market.",
      sources: [
        "https://www.trendforce.com/",
        "https://www.semi.org/",
        "https://www.reuters.com/technology/",
      ],
    },
    {
      layerNumber: 3,
      layerName: "Cloud & Data Centers",
      score: 90,
      findings:
        "China ranks 2nd globally in data center capacity (~30.5 GW). It holds the world's most robust sovereign cloud ecosystem, with Alibaba, Huawei, and Tencent controlling >90% of the domestic market.",
      keyData: "8.1 million standard racks and 230 EFLOPS of compute power (MIIT 2024).",
      sources: [
        "https://www.srgresearch.com/",
        "https://www.canalys.com/",
        "https://www.miit.gov.cn/",
      ],
    },
    {
      layerNumber: 4,
      layerName: "Model Developers",
      score: 92,
      findings:
        "China is the only peer-level rival to the US in foundation models. The DeepSeek-R1 and Qwen series have reached benchmark parity with top-tier Western reasoning models.",
      keyData: "Accounts for 74.7% of all GenAI patents globally (WIPO 2024); official leader in total AI patent families.",
      sources: [
        "https://www.wipo.int/",
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        "https://www.top500.org/",
      ],
    },
    {
      layerNumber: 5,
      layerName: "Platform & Data",
      score: 80,
      findings:
        "China possesses the world's largest pool of training data (1.12 billion internet users). However, score is tempered by mixed performance in open data openness (ODIN score: 46/100) compared to global leaders.",
      keyData: "79.7% internet penetration (June 2025).",
      sources: [
        "https://www.cnnic.net.cn/",
        "https://odin.opendatawatch.com/",
        "https://publicadministration.un.org/egovkb/",
      ],
    },
    {
      layerNumber: 6,
      layerName: "Applications & Startups",
      score: 80,
      findings:
        "China is the clear global #2 in startups, minting 56 new unicorns in 2023. ByteDance (TikTok/CapCut) remains a global application leader. A significant funding gap remains vs. the US ($9.3B vs $109B private investment).",
      keyData: "Home to 71 AI-specific unicorns as of Q1 2024.",
      sources: [
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        "https://www.hurun.net/",
        "https://www.crunchbase.com/",
      ],
    },
    {
      layerNumber: 7,
      layerName: "Education & Consulting",
      score: 94,
      findings:
        "China is the world's primary AI talent reservoir, producing 47% of top-tier AI researchers. It is projected to graduate 77,000 STEM PhDs in 2025, nearly double the US.",
      keyData: "Research publication volume (23.6k papers) tripled US output (6.3k) in 2024.",
      sources: [
        "https://macropolo.org/",
        "https://cset.georgetown.edu/",
        "https://www.dimensions.ai/",
      ],
    },
    {
      layerNumber: 8,
      layerName: "Implementation",
      score: 90,
      findings:
        "Government readiness is elite; China surged to 6th place in the Oxford Insights AI Readiness Index (Dec 2024). It leads in practical automation, such as autonomous vehicle testing across 16 cities.",
      keyData: "Early and comprehensive regulation of Generative AI services (August 2023).",
      sources: [
        "https://oxfordinsights.com/",
        "https://index.dev/",
        "https://www.unesco.org/",
      ],
    },
  ],
  strategicSummary: {
    overview:
      "China is the only nation capable of rivaling the United States' \"full-stack\" AI capability. It maintains a commanding lead in physical infrastructure (Power and Chips) and has rapidly closed the gap in software-based intelligence (Models and Talent). China's \"Hegemon\" status is defined by its ability to operate an entirely independent AI ecosystem—from the electricity powering data centers to the foundation models used by billion-user apps—largely insulated from Western dependencies.",
    classification: "Full-stack AI Sovereign",
    strengths: [
      {
        title: "Talent Pipeline",
        description: "Unmatched scale of STEM graduates and top-tier researchers.",
      },
      {
        title: "Infrastructure Control",
        description: "Dominance in the physical supply chain (energy, minerals, and mature-node chips).",
      },
      {
        title: "Cloud Sovereignty",
        description: "A fully independent and battle-tested domestic cloud stack.",
      },
    ],
    weaknesses: [
      {
        title: "Advanced Lithography",
        description: "Continued dependence on foreign equipment for sub-5nm production.",
      },
      {
        title: "Capital Gap",
        description: "Private VC funding for AI is currently less than 10% of the US total.",
      },
      {
        title: "Data Governance",
        description: "Restrictive data flows and lower openness scores limit the global interoperability of its data platforms.",
      },
    ],
    recommendations: [
      {
        title: "Accelerate Indigenous SME",
        description: "Prioritize domestic lithography (EUV/Advanced DUV) to break the 5nm process \"ceiling.\"",
      },
      {
        title: "Bolster Private Capital",
        description: "Incentivize more private investment into early-stage AI startups to bridge the VC gap with the U.S.",
      },
      {
        title: "Enhance Data Quality",
        description: "Focus on the \"openness\" and quality of high-value datasets to improve the efficiency of its massive raw data pool.",
      },
    ],
  },
  generatedAt: "2025-06-01T00:00:00.000Z",
};
