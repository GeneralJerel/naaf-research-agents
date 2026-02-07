/**
 * Comprehensive NAAF article content — structured data for the Framework deep-dive page.
 * Based on the assessment-framework.md and the real application architecture.
 */

export interface LayerArticle {
  number: number;
  name: string;
  icon: string; // Lucide icon name mapped in component
  definition: string;
  whyItMatters: string;
  metrics: {
    name: string;
    description: string;
    direction?: string; // e.g. "lower is better"
  }[];
  scoringRubric: {
    maxPoints: number;
    breakdowns: {
      label: string;
      points: number;
      formula?: string;
      tiers?: { score: number; description: string }[];
    }[];
  };
  primarySources: string[];
}

export interface TierInfo {
  tier: number;
  name: string;
  range: string;
  description: string;
  examples: string[];
  color: "high" | "mid" | "low" | "muted";
}

export const frameworkIntro = {
  headline: "The National AI Assessment Framework",
  tagline: "A systematic, evidence-based approach to measuring a nation's AI power across the full technology stack.",
  abstract:
    "The NAAF ranks countries across the eight layers of the AI industry — from physical constraints at the base to economic impact at the top. Unlike single-metric indices, NAAF captures the entire dependency chain: a nation with brilliant AI researchers but no domestic power grid or chip supply remains strategically vulnerable. By weighting foundational layers more heavily, the framework reveals which countries can truly sustain AI sovereignty and which are one sanction away from collapse.",
  designPrinciples: [
    {
      title: "Full-Stack Analysis",
      description:
        "AI power isn't just about models. It spans electricity, chips, data centers, data governance, talent, and real-world adoption. NAAF measures every link in the chain.",
    },
    {
      title: "Relative Power Index",
      description:
        "Scores are calculated relative to the global leader for each metric. This ensures rankings reflect competitive position, not arbitrary thresholds.",
    },
    {
      title: "Public Data Only",
      description:
        "All assessments use publicly available data from governments, IGOs (World Bank, OECD, IEA), and reputable research indices — ensuring reproducibility and transparency.",
    },
    {
      title: "Bottom-Up Weighting",
      description:
        "Physical constraints (power, chips, data centers) receive higher weights because they are the hardest to change and most strategically significant.",
    },
  ],
};

export const layerArticles: LayerArticle[] = [
  {
    number: 1,
    name: "Power & Electricity",
    icon: "Zap",
    definition:
      "The nation's ability to supply cheap, stable, and sustainable electricity to industrial consumers — specifically large-scale data centers that form the backbone of AI compute.",
    whyItMatters:
      "No power means no compute. A single hyperscale data center can draw 50–100 MW — equivalent to a small city. Countries with expensive, unstable, or fossil-heavy grids face an existential bottleneck for AI ambitions. This is the hardest physical constraint to overcome and receives the framework's highest weight at 20%.",
    metrics: [
      {
        name: "Industrial Electricity Price",
        description: "Cost per kWh for large industrial consumers. Directly impacts the economics of running GPU clusters 24/7.",
        direction: "Lower is better",
      },
      {
        name: "Total Output Capacity",
        description: "Installed generation capacity (GW) and total annual generation (TWh). Indicates headroom for massive compute expansion.",
      },
      {
        name: "Grid Reserve Margin",
        description: "Available capacity minus peak demand. Higher margins mean the grid can absorb sudden data center loads without brownouts.",
      },
      {
        name: "Clean Energy Mix",
        description: "Percentage of generation from nuclear, hydro, solar, and wind. Increasingly important as hyperscalers demand carbon-neutral power.",
      },
    ],
    scoringRubric: {
      maxPoints: 20,
      breakdowns: [
        {
          label: "Industrial Capacity",
          points: 10,
          formula: "(Country Generation TWh / Global Max TWh) × 10",
        },
        {
          label: "Cost Efficiency",
          points: 5,
          formula: "(Global Min Price / Country Industrial Price) × 5",
        },
        {
          label: "Grid Reliability & Clean Mix",
          points: 5,
          tiers: [
            { score: 5, description: ">50% Clean Mix AND <1 hr annual outage" },
            { score: 3, description: "Mixed grid, occasional instability" },
            { score: 1, description: "Fossil-heavy, frequent instability" },
          ],
        },
      ],
    },
    primarySources: ["IEA (International Energy Agency)", "World Bank Energy Data", "Global Petrol Prices", "IRENA"],
  },
  {
    number: 2,
    name: "Chipset Manufacturers",
    icon: "Cpu",
    definition:
      "The nation's control over the semiconductor supply chain, distinguishing between chip design (intellectual property) and fabrication (physical manufacturing).",
    whyItMatters:
      "Semiconductors are the single most geopolitically significant technology chokepoint. A country that designs but cannot fabricate advanced chips is one export ban away from losing AI capability. Conversely, controlling lithography equipment (as the Netherlands does with ASML) grants disproportionate leverage. At 15% weight, this layer captures hardware access as a strategic variable.",
    metrics: [
      {
        name: "Domestic Fab Capacity",
        description: "Count of fabrication facilities capable of producing chips at <7nm, <14nm, and mature nodes (>28nm).",
      },
      {
        name: "Equipment Control",
        description: "Presence of lithography, etching, or deposition tool manufacturers. Monopoly holders (e.g., ASML for EUV) score highest.",
      },
      {
        name: "Raw Material Security",
        description: "Access to critical minerals — Gallium, Germanium, Silicon — that form the physical substrate of all chips.",
      },
    ],
    scoringRubric: {
      maxPoints: 15,
      breakdowns: [
        {
          label: "Fabrication Capacity",
          points: 10,
          tiers: [
            { score: 10, description: "Mass production at <5nm (Leading Edge)" },
            { score: 7, description: "Mass production at <14nm" },
            { score: 3, description: "Mature nodes only (>28nm)" },
            { score: 0, description: "No domestic fabrication" },
          ],
        },
        {
          label: "Equipment & Supply Chain Control",
          points: 5,
          tiers: [
            { score: 5, description: "Monopoly/Duopoly holder of critical tools (lithography, etching)" },
            { score: 3, description: "Major supplier of critical chemicals/wafers" },
            { score: 1, description: "Minor component supplier" },
          ],
        },
      ],
    },
    primarySources: ["SEMI", "US CHIPS Act Funding Reports", "OECD TiVA Database"],
  },
  {
    number: 3,
    name: "Cloud & Data Centers",
    icon: "Server",
    definition:
      "The physical housing and networking infrastructure for AI workloads — and critically, whether compute is sovereign or controlled by foreign providers.",
    whyItMatters:
      "Even with abundant power and chips, a nation that hosts all its AI workloads on foreign clouds has limited sovereignty. A hyperscale facility processes petabytes of sensitive data daily. At 15% weight, this layer evaluates both the density of data center infrastructure and the strategic question of who controls it.",
    metrics: [
      {
        name: "Hyperscale Data Center Count",
        description: "Number of facilities exceeding 50MW, capable of supporting enterprise-scale AI training and inference.",
      },
      {
        name: "Sovereign Cloud Capacity",
        description: "Share of government and critical infrastructure data hosted by domestic providers vs. foreign hyperscalers (AWS, Azure, GCP).",
      },
      {
        name: "International Bandwidth",
        description: "Submarine cable capacity (Tbps) connecting to global internet backbone. Essential for distributed AI workloads.",
      },
    ],
    scoringRubric: {
      maxPoints: 15,
      breakdowns: [
        {
          label: "Compute Density",
          points: 10,
          formula: "(Country Hyperscale DC Count / Global Max Count) × 10",
        },
        {
          label: "Sovereign Cloud",
          points: 5,
          tiers: [
            { score: 5, description: "Domestic providers hold >50% of gov/critical infra data" },
            { score: 0, description: "Critical data primarily hosted by foreign providers" },
          ],
        },
      ],
    },
    primarySources: ["Data Center Map", "TeleGeography", "ITU Statistics"],
  },
  {
    number: 4,
    name: "Model Developers",
    icon: "Brain",
    definition:
      "The ability to train frontier foundation models domestically — not just fine-tune or consume foreign models via API.",
    whyItMatters:
      "Foundation models are the 'sovereign brain' of AI. A country that can only use GPT-4 via API lacks the ability to customize, audit, or ensure continuity of its AI capabilities. Training a frontier model requires the convergence of compute, talent, data, and capital. At 10% weight, this layer measures advanced R&D capability.",
    metrics: [
      {
        name: "Sovereign Foundation Model Count",
        description: "Number of domestically developed models with >10B parameters, ranked on leaderboards like LMSYS.",
      },
      {
        name: "HPC/Supercomputer Ranking",
        description: "Number of systems in the global TOP500 list — a proxy for available training compute.",
      },
      {
        name: "AI Patent Intensity",
        description: "Number of AI-related patents filed annually at WIPO, indicating innovation pipeline depth.",
      },
    ],
    scoringRubric: {
      maxPoints: 10,
      breakdowns: [
        {
          label: "Frontier Model Capacity",
          points: 10,
          formula: "(Domestic LLMs on LMSYS Leaderboard / Global Max) × 10",
        },
      ],
    },
    primarySources: ["TOP500.org", "WIPO AI Patent Index", "Stanford AI Index", "LMSYS Chatbot Arena"],
  },
  {
    number: 5,
    name: "Platform & Data",
    icon: "Database",
    definition:
      "The quality, accessibility, and governance of data available to feed AI models — including government data, enterprise data, and native-language training corpora.",
    whyItMatters:
      "Data is the raw material of AI. Countries with restrictive data regimes, poor digitization, or minority languages with limited online presence face a training data deficit. Open government data accelerates public-sector AI, while strong data governance frameworks attract international AI investment. Weighted at 10%.",
    metrics: [
      {
        name: "Open Government Data Score",
        description: "OECD OURdata Index measuring accessibility, machine readability, and reusability of government datasets.",
      },
      {
        name: "Data Gravity",
        description: "Cross-border data flow restrictions and data localization requirements — affecting multi-national AI operations.",
      },
      {
        name: "Local Language Dataset Size",
        description: "Volume of digitized text, media, and structured data in national languages. Critical for non-English NLP.",
      },
    ],
    scoringRubric: {
      maxPoints: 10,
      breakdowns: [
        {
          label: "Data Openness",
          points: 5,
          formula: "OECD OURdata Index (normalized to 5 points)",
        },
        {
          label: "Data Volume Potential",
          points: 5,
          formula: "(Internet Population / Global Max) × 5",
        },
      ],
    },
    primarySources: ["OECD OURdata Index", "World Bank Data Governance Indicators"],
  },
  {
    number: 6,
    name: "Applications & Startups",
    icon: "Rocket",
    definition:
      "The commercial ecosystem that converts AI infrastructure into economic value — startups, venture capital, and developer communities.",
    whyItMatters:
      "Infrastructure without application is wasted potential. This layer measures whether a country's AI stack is actually generating commercial value. AI unicorns, VC density, and GitHub contributions serve as proxies for the health of the innovation engine. Weighted at 10%.",
    metrics: [
      {
        name: "AI Unicorn Count",
        description: "Number of private AI companies valued at over $1 billion — indicating market creation capability.",
      },
      {
        name: "VC Investment Density",
        description: "AI venture capital inflows as a percentage of GDP — normalizing for economy size to capture investment intensity.",
      },
      {
        name: "GitHub Contributions",
        description: "Code contributions to AI/ML repositories by country — a proxy for developer ecosystem activity.",
      },
    ],
    scoringRubric: {
      maxPoints: 10,
      breakdowns: [
        {
          label: "Capital Depth",
          points: 10,
          formula: "(Annual AI VC Investment / Global Max) × 10",
        },
      ],
    },
    primarySources: ["Dealroom", "Crunchbase / CB Insights", "GitHub Innovation Graph"],
  },
  {
    number: 7,
    name: "Education & Consulting",
    icon: "GraduationCap",
    definition:
      "The human capital pipeline required to build, maintain, and advance AI systems — from university programs to researcher retention.",
    whyItMatters:
      "AI systems require skilled humans at every level. Without a robust talent pipeline, even well-funded AI programs stall. Brain drain — where top researchers emigrate to countries with better opportunities — can hollow out a nation's long-term AI competitiveness. Weighted at 10%.",
    metrics: [
      {
        name: "AI/CS Graduates",
        description: "Annual PhD and Master's graduates in Computer Science and Machine Learning — the feeder pool for industry and research.",
      },
      {
        name: "Top University Presence",
        description: "Count of universities ranked in the global top 100 for CS/AI, based on QS and Times Higher Education rankings.",
      },
      {
        name: "Brain Drain/Gain",
        description: "Net migration of AI researchers. Positive = brain gain (attracting talent). Negative = brain drain (losing talent).",
      },
    ],
    scoringRubric: {
      maxPoints: 10,
      breakdowns: [
        {
          label: "Talent Pool",
          points: 5,
          formula: "(Annual CS/AI Graduates / Global Max) × 5",
        },
        {
          label: "Research Impact",
          points: 5,
          formula: "(H-Index of Top Country University / Global Max H-Index) × 5",
        },
      ],
    },
    primarySources: ["UNESCO Institute for Statistics", "QS Rankings by Subject", "LinkedIn Workforce Reports"],
  },
  {
    number: 8,
    name: "Implementation",
    icon: "Building",
    definition:
      "How widely AI is deployed by government and traditional industries — the ultimate measure of whether AI capability translates into real-world benefit.",
    whyItMatters:
      "A country can excel at every other layer and still fail to implement AI effectively. Bureaucratic inertia, lack of digital government infrastructure, and low business adoption can waste enormous investments. This layer measures the economic multiplier — the conversion rate of AI potential into actual productivity gains. Weighted at 10%.",
    metrics: [
      {
        name: "Government AI Readiness",
        description: "Oxford Insights Government AI Readiness Index — measuring digitization, strategy adoption, and institutional capacity.",
      },
      {
        name: "Business Adoption Rate",
        description: "Percentage of firms actively using AI in their operations, per McKinsey and national statistics surveys.",
      },
      {
        name: "Labor Productivity Growth",
        description: "GDP per hour worked — a lagging indicator that captures whether AI adoption is translating to economic output.",
      },
    ],
    scoringRubric: {
      maxPoints: 10,
      breakdowns: [
        {
          label: "Government Readiness",
          points: 10,
          formula: "Oxford Insights Index (normalized to 10 points)",
        },
      ],
    },
    primarySources: ["Oxford Insights", "Eurostat / National Statistics Bureaus", "McKinsey Global AI Survey"],
  },
];

export const tiers: TierInfo[] = [
  {
    tier: 1,
    name: "The Hegemons",
    range: "80–100",
    description:
      "Full-stack AI sovereignty. These nations control both the atoms (chips, power, data centers) and the bits (models, data, applications). They can impose sanctions, set standards, and shape the global AI landscape. No external dependency is existential.",
    examples: ["United States", "China"],
    color: "high",
  },
  {
    tier: 2,
    name: "The Strategic Specialists",
    range: "50–79",
    description:
      "World-class excellence in specific layers but dependent on Hegemons for others. These nations wield outsized influence in their specialty domains — Taiwan in chips, the UK in talent and models — but cannot sustain full AI capability independently.",
    examples: ["Taiwan", "South Korea", "United Kingdom", "France"],
    color: "mid",
  },
  {
    tier: 3,
    name: "The Adopters",
    range: "30–49",
    description:
      "Solid infrastructure and talent, but largely consumers of foreign AI technology rather than creators. Good governance and implementation may compensate for weak foundational layers, but strategic vulnerability remains.",
    examples: ["Germany", "Japan", "Singapore", "Canada"],
    color: "low",
  },
  {
    tier: 4,
    name: "The Consumers",
    range: "0–29",
    description:
      "Fully reliant on imported hardware, software, cloud services, and energy models. High risk of digital dependency — one trade restriction can collapse AI capability overnight.",
    examples: ["Most developing nations"],
    color: "muted",
  },
];

export const methodology = {
  title: "Relative Power Index (RPI)",
  description:
    "Power in geopolitics is relative. Rather than assigning scores against fixed benchmarks, the NAAF uses a Relative Power Index that compares each country's performance against the current global leader for each metric.",
  formula: "Score = (Country Value / Global Leader Value) × Layer Weight",
  keyPrinciples: [
    {
      title: "Global Leader as Benchmark",
      description: "The highest value achieved by any nation defines 100% for that metric. All others are scored proportionally.",
    },
    {
      title: "Inverted Metrics",
      description: "For metrics where lower is better (e.g., electricity price), the formula inverts: (Global Min / Country Value).",
    },
    {
      title: "Qualitative Tiers",
      description: "Some metrics (grid reliability, chip capability) use tier-based scoring where quantitative formulas don't apply.",
    },
    {
      title: "Weighted Aggregation",
      description: "Layer scores are multiplied by their assigned weight and summed to produce the final 0–100 composite score.",
    },
  ],
};

export const agentProtocol = {
  role: "Policy Research Analyst",
  objective: "Assess a country's AI capability across 8 layers using autonomous web research.",
  constraints: [
    "Use only public data from 2023–2025",
    "Prioritize government (.gov), IGOs (World Bank, OECD, IEA), and reputable indices",
    "Cross-reference at least 2 sources per metric",
    "Flag uncertainty and data gaps explicitly",
  ],
  researchTasks: [
    "Power Assessment — industrial electricity price (USD/kWh), total generation capacity (GW)",
    "Hardware Mapping — semiconductor fab count, equipment manufacturer presence",
    "Compute Infrastructure — hyperscale data centers, TOP500 supercomputer count",
    "Model Landscape — domestic foundation models, AI patent filings",
    "Data Governance — open data scores, cross-border data flow policies",
    "Innovation Ecosystem — AI VC investment, unicorn count, developer activity",
    "Talent Pipeline — STEM/CS graduates, net migration of researchers",
    "Implementation Check — national AI strategy status, Oxford Insights readiness rank",
  ],
  outputFormat: "A structured report with per-layer scores, justifications, source citations, and a strategic summary with strengths, weaknesses, and policy recommendations.",
};
