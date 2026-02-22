export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[];
  category: ArticleCategory;
  tags: string[];
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  layerReference?: number;
}

export type ArticleCategory =
  | "Analysis"
  | "Methodology";

export const articles: Article[] = [
  {
    id: "1",
    slug: "what-is-the-naaf",
    title: "What Is the National AI Assessment Framework?",
    subtitle: "A full-stack model for evaluating national AI capability across eight interdependent layers of the value chain",
    excerpt:
      "Most AI readiness indices treat the field as a monolith. NAAF disaggregates it into eight layers — from physical electricity infrastructure to economic adoption — each scored independently and weighted to reflect its structural importance.",
    body: [
      "The National AI Assessment Framework is a structured methodology for evaluating a country's position across the entire AI value chain. Rather than treating AI capability as a single dimension — the way most readiness indices do — NAAF disaggregates it into eight interdependent layers. Each layer represents a distinct category of national capability, from the physical infrastructure that powers data centers to the policy and market conditions that determine whether AI technology translates into economic value.",

      "The framework rests on a simple premise: AI sovereignty is a full-stack problem. A country may produce world-class machine learning researchers, but if it cannot access advanced semiconductors or afford the electricity to run large-scale training workloads, that talent advantage is structurally constrained. Conversely, abundant cheap energy is strategically meaningless without the compute hardware, models, and talent to exploit it. The eight layers capture these dependencies in a way that single-metric rankings cannot.",

      "Layer 1, Power & Electricity, carries the highest weight in the framework at 20%. It assesses a nation's energy infrastructure specifically as it relates to AI workloads: industrial electricity pricing, generation capacity, grid reserve margins, and clean energy mix. Data is drawn from the International Energy Agency (IEA), the U.S. Energy Information Administration (EIA), the World Bank, and IRENA. The heavy weighting reflects a physical reality — energy infrastructure is the most capital-intensive, slowest to build, and most geographically constrained factor in the AI stack.",

      "Layer 2, Chipset Manufacturers, is weighted at 15% and evaluates a country's position in the semiconductor supply chain. The key metrics are domestic fabrication capacity (particularly at advanced nodes below 7nm), control of lithography and etching equipment, and access to critical raw materials. Sources include SEMI, the OECD, and data published by major fabrication companies. Layer 3, Cloud & Data Centers, also at 15%, measures the physical compute infrastructure available for AI workloads: hyperscale data center count, the share of domestic versus foreign cloud providers, and international bandwidth capacity. Data comes from Cloudscene, TeleGeography, the ITU, and Synergy Research Group.",

      "Layer 4, Model Developers, is weighted at 10% and assesses a nation's capacity to train foundation models domestically. Metrics include the number of sovereign foundation models with more than 10 billion parameters, TOP500 supercomputing systems, and AI patent filings. Sources are the TOP500 list, WIPO, the Stanford AI Index, and arXiv publication data. This layer distinguishes between countries that can build frontier AI and those that can only consume it.",

      "Layer 5, Platform & Data, also at 10%, evaluates the quality, accessibility, and governance of a nation's data ecosystem. The OECD OURdata Index provides the primary open-government-data score, supplemented by internet population size as a proxy for potential training data volume. Layer 6, Applications & Startups, at 10%, measures the commercial ecosystem that translates infrastructure into economic value — annual AI venture capital investment, the number of AI unicorns, and developer community activity. Data is drawn from Dealroom, Crunchbase, CB Insights, PitchBook, and GitHub.",

      "Layer 7, Education & Consulting, at 10%, captures the human capital pipeline: annual CS and AI graduate output, the presence of top-100 ranked universities, and net talent migration (brain drain versus brain gain). UNESCO, QS Rankings, and Times Higher Education provide the underlying data. Layer 8, Implementation, also at 10%, measures how widely AI is actually deployed in government and industry. The Oxford Insights Government AI Readiness Index anchors this layer, supplemented by enterprise adoption surveys and Eurostat data.",

      "Every layer score is normalized to a 0–100 scale, where 0 represents no capability and 100 represents the global leader for that layer. The composite AI Power Score is computed as a weighted sum: each layer's normalized score is multiplied by its weight, and the eight contributions are summed. This produces a single comparable number on a 0–100 scale.",

      "The composite score maps to four power tiers. Tier 1, Hegemon (80–100), describes full-stack AI sovereignty — a nation that controls both the physical and digital layers of the AI value chain. Tier 2, Strategic Specialist (50–79), describes a country that is world-class in specific layers but dependent on others for the rest. Tier 3, Adopter (30–49), describes a growing ecosystem that largely consumes foreign AI technology. Tier 4, Consumer (0–29), describes full dependence on imported hardware, software, and AI services.",

      "The weighting rationale follows a principle of structural inertia. Layers that are hardest to change receive more weight. Energy infrastructure (Layer 1, 20%) and hardware supply chains (Layers 2–3, 15% each) require decades of investment and are constrained by geography, geology, and geopolitics. Layers 4 through 8 (10% each) — from model development to government adoption — are more responsive to policy intervention and capital allocation over shorter time horizons. A country can meaningfully improve its education pipeline in five to seven years; building a new power grid or semiconductor fab takes ten to fifteen.",

      "Crucially, the framework assesses only what can be measured with publicly available, authoritative data. Every score is designed to be reproducible by an independent researcher using the same source set. This commitment to transparency distinguishes NAAF from proprietary indices that rely on opaque survey methodologies or expert panel judgments. The data sources, scoring rubrics, and weight rationale are all published as part of the framework's methodology documentation.",
    ],
    category: "Methodology",
    tags: ["Framework", "8 Layers", "Scoring", "Power Tiers", "AI Sovereignty"],
    author: { name: "NAAF Research Team", role: "Framework Design" },
    publishedAt: "2026-02-20",
    readingTime: 10,
    featured: true,
  },
  {
    id: "2",
    slug: "how-naaf-works",
    title: "How NAAF Works: Autonomous Agents, Authoritative Sources, and Structured Scoring",
    subtitle: "Inside the multi-agent research system that powers the National AI Assessment Framework",
    excerpt:
      "NAAF assessments are conducted by a system of nine AI agents — one supervisor and eight specialists — that autonomously search authoritative sources, extract metrics, and produce scored evaluations for each layer of the framework.",
    body: [
      "The National AI Assessment Framework is not just a scoring rubric — it is an autonomous research system. When a country is submitted for assessment, a multi-agent architecture orchestrates the entire process: searching authoritative sources, extracting quantitative metrics, scoring each layer, computing the weighted composite, and persisting the results as structured data with full source citations. The system is built on the Google Agent Development Kit (ADK) and powered by Gemini.",

      "The architecture follows a supervisor-worker pattern. At the top sits naaf_supervisor, a root agent that receives the country name and coordinates the assessment. Below it are eight specialized layer agents, one for each NAAF layer. The supervisor delegates to each layer agent in sequence, collects their scored results, calls the aggregation tool to compute the overall score, and assembles the final report. This separation of concerns keeps each agent focused on a single domain with a manageable context window.",

      "Each layer agent is generated by a factory function that parameterizes the same template with layer-specific data: the layer's name, weight, metrics, preferred authoritative domains, and a tailored research prompt. For example, the Layer 1 (Power & Electricity) agent is configured to search iea.org, worldbank.org, eia.gov, irena.org, and globalpetrolprices.com. The Layer 2 (Chipset Manufacturers) agent searches semi.org, chips.gov, asml.com, tsmc.com, and intel.com. This domain restriction is a core design decision — it ensures that layer scores are grounded in data from recognized authorities, not blog posts or press releases.",

      "The agents have access to two search tools. The first, youcom_web_search, performs a general web search via the You.com Search API and returns titles, URLs, and text snippets. The second, youcom_domain_search, restricts the same search to a specified set of domains by appending site: clauses to the query. Layer agents are instructed to prefer domain-restricted search first and fall back to general search only when domain results are insufficient. Both tools track every URL returned in the agent's session state, building a provenance chain that is persisted with the final report.",

      "The research protocol for each layer agent follows a consistent pattern. The agent receives a country name and a prompt specifying which metrics to research. For each metric, it runs two to three targeted searches with year constraints (2023–2025) to ensure recency. It extracts specific numeric values where possible and notes the source URL for every data point. If data is unavailable for a metric, the agent explicitly records that and reduces its confidence. This structured approach means the output is auditable — every number in the final report traces back to a specific search result from an authoritative domain.",

      "After gathering evidence, each layer agent calls the score_layer tool to register its assessment. This tool takes the layer number, a score from 0 to 100, a justification string with cited evidence, and the country name. Internally, it computes the weighted contribution (score divided by 100, multiplied by the layer's weight percentage), stores the structured result in the agent's session state, and writes an individual layer JSON file to disk. The scored result includes the raw score, the maximum possible score, the weight percentage, the weighted contribution, and the full justification text.",

      "Once all eight layer agents have reported, the supervisor calls calculate_overall_score with the eight raw scores. This tool applies the Relative Power Index formula: each layer score (0–100) is multiplied by its weight (20%, 15%, 15%, 10%, 10%, 10%, 10%, 10%) and the eight weighted contributions are summed to produce a composite score capped at 100. The tool also classifies the result into a power tier — Hegemon for 80 and above, Strategic Specialist for 50–79, Adopter for 30–49, and Consumer below 30 — and returns a formatted breakdown.",

      "The final step is persistence. The supervisor calls save_final_report, which assembles all per-layer results and source URLs from the session state into a comprehensive JSON structure. This is written to a timestamped directory under reports/ as three files: final_report.json (the complete assessment with overall score, tier, executive summary, and all layer data), sources.json (a deduplicated list of every URL cited during research, with titles and snippets), and individual layer JSON files in a layers/ subdirectory. This structured output is designed to be consumed by the web UI for rendering country reports.",

      "The choice of autonomous agents over manual research is deliberate. A human analyst assessing one country across eight layers — finding authoritative data, cross-referencing metrics, scoring consistently — would take days. The agent system completes an assessment in minutes. More importantly, the process is reproducible: the same country assessed with the same agent configuration and data sources will produce the same results. There is no expert judgment bias, no survey response bias, no panel selection bias. The only inputs are the country name and the public data available at the time of assessment.",

      "The system is designed for transparency at every level. The agent prompts, tool definitions, domain registries, and scoring formulas are all published as source code. The search results that informed each score are persisted and citable. The weight rationale is documented. An independent researcher can inspect any assessment, verify the source data, and critique the methodology. This is fundamentally different from indices that publish a final ranking without exposing the intermediate reasoning.",

      "The technology stack uses Google ADK for agent orchestration, Gemini 3 Flash Preview as the language model for both supervisor and layer agents, the You.com Search API for web search, and httpx for async HTTP calls. The system runs locally via adk web, which provides a development UI for interactive assessments, or can be deployed to Google Cloud Run for production use. The entire codebase is structured as an ADK-compatible package that is auto-discovered by the adk web command.",
    ],
    category: "Methodology",
    tags: ["Agents", "Architecture", "Google ADK", "You.com API", "Scoring Engine", "Research Protocol"],
    author: { name: "NAAF Research Team", role: "Engineering" },
    publishedAt: "2026-02-19",
    readingTime: 11,
    featured: true,
  },
  {
    id: "3",
    slug: "why-ai-sovereignty-matters",
    title: "Why AI Sovereignty Matters: The Case for a Full-Stack Assessment",
    subtitle: "Existing AI indices miss the physical supply chain. A nation's AI future depends on watts, silicon, and cables — not just algorithms and talent.",
    excerpt:
      "The most widely cited AI readiness indices rank countries on talent, research output, and policy ambition. They largely ignore the physical infrastructure that makes AI possible. NAAF argues this is a critical blind spot.",
    body: [
      "In 2025, more than 70 countries had published national AI strategies. Dozens of indices purported to rank their readiness — the Stanford HAI AI Index, the Oxford Insights Government AI Readiness Index, the Tortoise Global AI Index, among others. Each offers valuable perspectives. But they share a common limitation: they systematically underweight or entirely ignore the physical supply chain that makes artificial intelligence possible. NAAF was designed to address this blind spot.",

      "The problem is structural. Most AI indices emphasize talent, research publications, startup funding, and government policy. These are important, but they describe the upper layers of a dependency chain. A country's AI research output is meaningless if it cannot access the compute hardware to train models. Compute hardware is meaningless without the cloud infrastructure to deploy it. Cloud infrastructure is meaningless without the energy to power it. Each layer depends on the one below. An index that measures only the top of the stack produces a distorted picture of national capability.",

      "Consider a concrete example. A nation might rank highly on AI research publications, venture capital investment, and government AI strategy. By most existing indices, it would appear AI-ready. But if that nation imports 100% of its advanced semiconductors from a single foreign supplier, relies entirely on foreign hyperscale cloud providers for compute infrastructure, and faces an energy grid operating at near-maximum capacity with no expansion plan, its AI ambitions rest on a foundation it does not control. A single trade restriction, a geopolitical shift, or an energy crisis could collapse the entire edifice.",

      "This is not a hypothetical scenario. Export controls on advanced semiconductors have already reshaped the AI landscape for multiple countries. Energy constraints have delayed or relocated planned data center buildouts. Cloud provider concentration means that a small number of companies headquartered in a single jurisdiction control the compute infrastructure that most of the world depends on. These are supply chain realities, and they belong in any serious assessment of national AI capability.",

      "The NAAF framework addresses this by modeling AI capability as an eight-layer stack, ordered from physical infrastructure at the base to economic implementation at the top. Layer 1 is energy. Layer 2 is semiconductors. Layer 3 is cloud and data center infrastructure. Layer 4 is domestic foundation model capacity. Layer 5 is data accessibility and governance. Layer 6 is the commercial AI ecosystem. Layer 7 is the talent pipeline. Layer 8 is government and enterprise adoption. Each layer is a potential bottleneck, and weakness in any layer constrains everything above it.",

      "The ordering is deliberate. Physical layers occupy the base because they are hardest to change. A country cannot will a power grid into existence or conjure a semiconductor fab through policy alone. These require massive capital investment, years of construction, and often favorable geography. Upper layers — talent, startups, government adoption — are more responsive to policy intervention. A well-funded university program can shift Layer 7 in five years. Layer 1 improvements typically require a decade or more. The weighting scheme (20% for energy, 15% each for chips and cloud, 10% for each remaining layer) reflects this structural inertia.",

      "Interdependency between layers is a central insight of the framework. Layers do not operate in isolation. A country with abundant cheap energy (strong Layer 1) but no semiconductor access (weak Layer 2) cannot build sovereign AI training infrastructure. A country with excellent universities (strong Layer 7) but no domestic compute (weak Layers 3–4) will export its talent to countries that have both. A country with advanced data governance (strong Layer 5) but no commercial ecosystem to exploit it (weak Layer 6) will watch other nations capture the economic value. The eight-layer model makes these dependencies visible in a way that single-metric indices cannot.",

      "Equally important is what NAAF does not do. It does not rely on surveys. It does not convene expert panels. It does not accept self-reported government data at face value. Every assessment is built exclusively from publicly available, authoritative data published by recognized international organizations: the IEA, the World Bank, the OECD, WIPO, the ITU, UNESCO, TOP500, Oxford Insights, and a curated set of industry data providers. This is a deliberate constraint. If the data is not public and verifiable, it is not used. The goal is reproducibility — any independent researcher with access to the same sources should be able to arrive at the same scores.",

      "The framework is designed to serve four distinct audiences. Government policymakers can use layer-level assessments to identify specific infrastructure gaps, benchmark against peer nations, and prioritize investment where it will have the greatest strategic impact. Investors and corporate strategists can evaluate national AI ecosystems to inform market-entry decisions, venture allocation, and cross-border partnerships. Academic researchers get a transparent, reproducible methodology for comparative AI policy research. Enterprise planners can assess regional compute availability, talent density, and regulatory posture to guide expansion decisions.",

      "What distinguishes NAAF from existing indices is not that it is better at measuring talent or policy — established indices often do that well. The distinction is that NAAF measures the full stack, including the physical layers that existing indices largely ignore. It treats energy, semiconductors, and compute infrastructure as first-class dimensions of AI sovereignty, weighted to reflect their strategic importance. It automates the research process using AI agents that search authoritative sources, ensuring consistency and auditability. And it publishes the methodology, the agent code, the source registries, and the scoring formulas as open artifacts.",

      "The NAAF system is built and operational. The multi-agent research architecture is complete, the scoring engine is implemented, and the web interface for viewing assessments is live. Country assessments are forthcoming. When they are published, every score will come with a full citation trail — the search queries that were run, the source URLs that were consulted, the data points that were extracted, and the justification for each layer's score. The framework is pre-publish not because the methodology is unfinished, but because the first round of country assessments has not yet been conducted. The tools are ready. The data sources are mapped. The agents are waiting for a country name.",
    ],
    category: "Analysis",
    tags: ["AI Sovereignty", "Full-Stack", "Supply Chain", "Public Data", "Transparency", "Indices"],
    author: { name: "NAAF Research Team", role: "Framework Design" },
    publishedAt: "2026-02-18",
    readingTime: 11,
    featured: true,
  },
];

export const categoryColors: Record<ArticleCategory, string> = {
  "Analysis": "bg-blue-100 text-blue-800",
  "Methodology": "bg-emerald-100 text-emerald-800",
};
