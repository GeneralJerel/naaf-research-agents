import { ResearchResult } from "@/lib/mockResearch";

export const usaReport: ResearchResult = {
  country: {
    country: "United States",
    code: "US",
    overall: 96,
    layers: { 1: 88, 2: 94, 3: 100, 4: 100, 5: 95, 6: 100, 7: 100, 8: 100 },
  },
  tier: "Tier 1: Hegemon",
  dataYears: [2023, 2024, 2025],
  executiveSummary:
    "The United States is the undisputed global AI Hegemon with an overall score of 96.20. It demonstrates absolute dominance across 6 of the 8 NAAF layers, including Cloud Infrastructure, Model Development, Startups, and Talent. The US holds a commanding 54% share of global hyperscale capacity and is the primary source of frontier models like GPT, Gemini, and Claude. Its venture capital ecosystem accounts for roughly 60-70% of global AI investment. While it leads in semiconductor design and equipment, its fabrication capacity (Layer 2) is a strategic vulnerability currently being addressed by the CHIPS Act. Additionally, its energy infrastructure (Layer 1), while massive, faces competitive pressure from China in terms of total capacity and pricing. Strategic recommendations include accelerating domestic leading-edge fabrication and modernizing the power grid to meet the surging electricity demands of AI data centers.",
  layerDetails: [
    {
      layerNumber: 1,
      layerName: "Power & Electricity",
      score: 88,
      weightPct: 20.0,
      weightedContribution: 17.6,
      findings:
        "The United States ranks #2 globally in electricity generation (approx. 4,251 TWh in 2023, including utility-scale and small-scale solar) and total installed utility capacity (1,190 GW). It is the world leader in nuclear electricity generation, which accounts for 18.6% of its mix. Total carbon-free generation (nuclear + renewables) reached 40% in 2023. However, the U.S. trails China significantly in total volume and capacity. Industrial electricity prices are moderately competitive at $0.143 - $0.149/kWh (2024/2025), which is higher than China (~$0.09/kWh) or Saudi Arabia (~$0.07/kWh) but much lower than European averages. Grid reliability is high with a routine SAIDI (outage duration) of approx. 2 hours excluding major weather events, though total SAIDI fluctuates with extreme weather (5.6 hours in 2022).",
      keyData:
        "4,251 TWh generation | 1,190 GW capacity | 40% carbon-free | $0.149/kWh industrial price | ~2hr SAIDI",
      sources: [
        "https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php",
        "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=table_1_01",
        "https://www.globalpetrolprices.com/USA/electricity_prices/",
        "https://www.eia.gov/todayinenergy/detail.php?id=65904",
        "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_DAT_Renewable_energy_highlights_2025.pdf",
      ],
    },
    {
      layerNumber: 2,
      layerName: "Chipset Manufacturers",
      score: 94,
      weightPct: 15.0,
      weightedContribution: 14.1,
      findings:
        "The United States is a global powerhouse in the semiconductor ecosystem, though it trails Taiwan in advanced fabrication scale.\n\n**Fabrication Capacity**: The US has achieved domestic <5nm capability. TSMC's Arizona Fab 1 began volume production of **4nm (N4)** chips in Q4 2024. Intel is currently ramping **Intel 3 (3nm-class)** and **Intel 18A/20A (~2nm-class)** nodes in its Oregon and Arizona facilities (Intel, 2024). This places the US in the top tier (10/10) for fabrication node capability.\n\n**Equipment & Supply Chain**: The US is the undisputed leader in Semiconductor Manufacturing Equipment (SME) and Electronic Design Automation (EDA). US firms **Applied Materials, Lam Research, and KLA** comprise 3 of the top 5 global equipment vendors, dominating etching, deposition, and metrology (Statista, 2023). US EDA tools (Synopsys, Cadence) are essential for virtually all global chip design.\n\n**Vulnerabilities**: The US remains dependent on **ASML (Netherlands)** for EUV lithography equipment and faces significant supply chain risks in critical minerals. It relies heavily on imports for **Gallium and Germanium**, which were subject to Chinese export controls in 2023.",
      keyData:
        "4nm domestic production (TSMC AZ) | 3 of top 5 SME vendors | EDA monopoly (Synopsys, Cadence) | ASML dependency for EUV",
      sources: [
        "https://pr.tsmc.com/english/news/3210",
        "https://www.intel.com/content/www/us/en/foundry/process.html",
        "https://www.statista.com/statistics/267392/market-share-of-semiconductor-equipment-manufacturers/",
        "https://www.energy.gov/eere/ammto/critical-minerals-and-materials-accelerator-0",
      ],
    },
    {
      layerNumber: 3,
      layerName: "Cloud & Data Centers",
      score: 100,
      weightPct: 15.0,
      weightedContribution: 15.0,
      findings:
        "The United States is the undisputed global leader in Layer 3 (Cloud & Data Centers).\n\n**Compute Density**: According to Synergy Research Group (2024-2025), the US accounts for **54% of total global hyperscale data center capacity**. As of Q1 2025, there are 1,189 hyperscale data centers globally, with approximately **51% (~600 facilities)** located in the United States. Northern Virginia remains the world's largest data center market, followed by other major US hubs in Oregon, Iowa, Ohio, and Dallas. Total hyperscale capacity is currently doubling every four years, driven by AI demand.\n\n**Sovereign Cloud**: The US market is characterized by total domestic dominance. US-based providers **AWS (31%), Microsoft Azure (25%), and Google Cloud (11%)** control 67% of the global market and nearly the entire US domestic market. The US possesses the world's most advanced sovereign cloud capabilities for government and defense, such as AWS GovCloud and Azure Government (FedRAMP/IL6 compliant). Foreign cloud dominance in the US is non-existent.",
      keyData:
        "54% of global hyperscale capacity | ~600 facilities | AWS 31% + Azure 25% + GCP 11% = 67% global share",
      sources: [
        "https://www.srgresearch.com/articles/hyperscale-data-center-count-hits-1136-average-size-increases-us-accounts-for-54-of-total-capacity",
        "https://www.srgresearch.com/articles/the-worlds-total-data-center-capacity-is-shifting-rapidly-to-hyperscale-operators",
        "https://www.statista.com/statistics/967365/worldwide-cloud-infrastructure-services-market-share-vendor/",
        "https://www.datacentermap.com/usa/",
      ],
    },
    {
      layerNumber: 4,
      layerName: "Model Developers",
      score: 100,
      weightPct: 10.0,
      weightedContribution: 10.0,
      findings:
        "The United States is the global leader in AI Model Development, serving as the benchmark for this layer.\n\n**Frontier Model Capacity**: The US dominates the foundation model ecosystem, home to the world's most capable models including OpenAI's GPT-4o and o1, Google's Gemini 1.5/2.0, Anthropic's Claude 3.5/3.7, and Meta's Llama 3.1 (up to 405B parameters). According to the Stanford AI Index 2024, the US produced 61 'notable' AI models in 2023, more than four times the output of China (15).\n\n**Supercomputing**: As of the November 2024 TOP500 list, the US hosts the world's #1 supercomputer, **El Capitan** (1.742 Exaflops), and is the only country with three officially verified exascale systems (El Capitan, Frontier, and Aurora). The US holds 172 systems on the list and commands over 50% of the aggregate Rmax performance of the entire TOP500.\n\n**AI Patents**: While China leads in the raw volume of AI patent filings (e.g., 38,210 GenAI inventions vs. 6,276 for the US per WIPO 2024), the US maintains a significant lead in research impact and citations.",
      keyData:
        "61 notable models (4x China) | #1 supercomputer El Capitan 1.742 EFlops | 3 exascale systems | 50%+ TOP500 performance",
      sources: [
        "https://aiindex.stanford.edu/report/",
        "https://top500.org/lists/top500/list/2024/11/",
        "https://www.wipo.int/publications/en/details.jsp?id=4747",
        "https://arxiv.org/html/2506.17303v1",
      ],
    },
    {
      layerNumber: 5,
      layerName: "Platform & Data",
      score: 95,
      weightPct: 10.0,
      weightedContribution: 9.5,
      findings:
        "The United States is a global leader in data openness and statistical quality, serving as a primary hub for AI training data.\n\n**Data Openness**: The U.S. ranks #1 globally in the **Global Data Barometer (GDB) 2022** with a score of **70/100** (the highest achieved score in the index), leading in data governance and availability for public good. It also scores **93.43/100** in the **World Bank Statistical Performance Indicator (SPI)** for 2023, reflecting a highly mature and transparent national statistical system.\n\n**Data Volume Potential**: The U.S. has **331.1 million internet users** as of January 2024, with a penetration rate of **97.1%**. While it ranks 3rd in raw volume behind China and India, the U.S. data ecosystem is characterized by exceptionally high accessibility, commercial value, and digital diversity, making it the world's most valuable pool for frontier model training.",
      keyData:
        "GDB #1 globally (70/100) | SPI 93.43/100 | 331M internet users | 97.1% penetration",
      sources: [
        "https://globaldatabarometer.org/",
        "https://data.worldbank.org/indicator/IQ.SPI.OVRL?locations=US",
        "https://datareportal.com/reports/digital-2024-united-states-of-america",
        "https://odin.opendatawatch.com/Report/countryProfileUpdated/USA?year=2024",
      ],
    },
    {
      layerNumber: 6,
      layerName: "Applications & Startups",
      score: 100,
      weightPct: 10.0,
      weightedContribution: 10.0,
      findings:
        "The United States is the undisputed global leader in Layer 6 (Applications & Startups), serving as the world's primary engine for AI commercialization and venture capital.\n\n**Capital Depth (AI VC Investment)**: In 2024, AI startups in the U.S. captured nearly **half of all domestic venture funding**, totaling approximately **$89 billion** (estimated from PitchBook's report that AI/ML took ~50% of the $178 billion total U.S. VC deal value). This dwarfs all other regions; for comparison, the entire global AI VC market was estimated at $100B-$131.5B, meaning the U.S. accounts for roughly **60-70% of global AI investment**.\n\n**AI Unicorn Count**: The U.S. leads the world in AI unicorn density. In 2024 alone, the U.S. minted **25 new AI unicorns**, accounting for 41% of all new U.S. unicorns that year. Total AI unicorn count in the U.S. is estimated between **150-200**, part of a broader 656-unicorn ecosystem that is the largest globally. Major AI leaders like OpenAI, Anthropic, xAI, and Databricks are U.S.-based.",
      keyData:
        "$89B AI VC in 2024 (60-70% of global) | 25 new AI unicorns in 2024 | 150-200 total AI unicorns",
      sources: [
        "https://pitchbook.com/news/articles/ai-startups-grabbed-a-third-of-global-vc-dollars-in-2024",
        "https://news.crunchbase.com/venture/global-funding-data-analysis-ai-eoy-2024/",
        "https://www.cbinsights.com/research/report/ai-trends-q3-2024/",
        "https://worldpopulationreview.com/country-rankings/unicorns-by-country",
      ],
    },
    {
      layerNumber: 7,
      layerName: "Education & Consulting",
      score: 100,
      weightPct: 10.0,
      weightedContribution: 10.0,
      findings:
        "The United States is the undisputed global leader in AI Talent and Education, serving as the benchmark for this layer.\n\n**Talent Pool**: According to the **2024 CRA Taulbee Survey**, the US and Canada (primarily US) produced a record **2,352 PhDs** in CS, CE, and Information in the 2023-24 academic year, an 8.2% increase over the previous year's record. The **NCES** reports that over **88,000 Master's degrees** were conferred in Computer and Information Sciences in the 2021-22 cycle, with subsequent growth trends placing 2023 estimates near 100,000. The **Stanford AI Index 2024** notes that 70.7% of new AI PhDs enter industry.\n\n**Research Impact**: In the **QS World University Rankings by Subject 2025: Computer Science**, US institutions occupy 4 of the top 5 global positions: **MIT (#2), Stanford (#3), Carnegie Mellon (#4), and UC Berkeley (#5)**. The US maintains the world's highest **H-Index** in Artificial Intelligence, reflecting the unparalleled citation impact of its research output.",
      keyData:
        "2,352 CS PhDs (record) | ~100K CS Master's | 4 of top 5 QS CS rankings | #1 H-Index in AI",
      sources: [
        "https://datavisualization.cra.org/TaulbeeSurvey/CRA_Taulbee_Survey_Report_2024.html",
        "https://nces.ed.gov/programs/coe/indicator/ctb/graduate-degree-fields",
        "https://www.topuniversities.com/university-subject-rankings/computer-science-information-systems",
        "https://www.scimagojr.com/",
        "https://hai.stanford.edu/ai-index/2024-ai-index-report/education",
      ],
    },
    {
      layerNumber: 8,
      layerName: "Implementation",
      score: 100,
      weightPct: 10.0,
      weightedContribution: 10.0,
      findings:
        "The United States is the global leader in Layer 8 (Implementation), ranking #1 in the Oxford Insights Government AI Readiness Index for 2023, 2024, and 2025. Its strategy is anchored by Executive Order 14110, which provides a comprehensive framework for safe and trustworthy AI across all government agencies. Business adoption is high, with 78% of organizations reporting AI use in 2024 according to the Stanford AI Index, and the country has established pioneering institutions like the AI Safety Institute (NIST) and the NAIRR pilot to facilitate ongoing implementation.",
      keyData:
        "#1 Oxford AI Readiness Index (2023-2025) | 78% business AI adoption | EO 14110 framework | NIST AI Safety Institute",
      sources: [
        "https://oxfordinsights.com/ai-readiness/government-ai-readiness-index-2025/",
        "https://hai.stanford.edu/ai-index/2024-ai-index-report",
        "https://www.census.gov/newsroom/press-releases/2024/business-trends-outlook-survey-artificial-intelligence-supplement.html",
      ],
    },
  ],
  strategicSummary: {
    overview:
      "The United States is the undisputed global AI Hegemon with an overall score of 96.20. It demonstrates absolute dominance across 6 of the 8 NAAF layers, including Cloud Infrastructure, Model Development, Startups, and Talent. Its venture capital ecosystem accounts for roughly 60-70% of global AI investment.",
    classification: "AI Hegemon — Full-Spectrum Dominance",
    strengths: [
      {
        title: "Cloud & Compute Monopoly",
        description:
          "54% of global hyperscale capacity with AWS, Azure, and GCP controlling 67% of the global cloud market. No foreign cloud presence in the US.",
      },
      {
        title: "Frontier Model Leadership",
        description:
          "Home to GPT, Gemini, Claude, and Llama. 61 notable models in 2023 (4x China). Three exascale supercomputers.",
      },
      {
        title: "Capital & Startup Ecosystem",
        description:
          "$89B in AI VC funding (2024), representing 60-70% of global AI investment. 150-200 AI unicorns including OpenAI, Anthropic, and xAI.",
      },
    ],
    weaknesses: [
      {
        title: "Fabrication Gap",
        description:
          "Despite leading in chip design and equipment, the US trails Taiwan in leading-edge fab volume. TSMC Arizona just began 4nm production. The CHIPS Act aims to close this gap.",
      },
      {
        title: "Energy Cost & Grid Pressure",
        description:
          "Industrial electricity at $0.149/kWh is significantly higher than China (~$0.09/kWh). Grid modernization is needed to meet surging AI data center demand.",
      },
      {
        title: "Critical Mineral Dependencies",
        description:
          "Heavy reliance on imports for Gallium and Germanium, subject to Chinese export controls since 2023. The DOE CMM Accelerator is addressing this.",
      },
    ],
    recommendations: [
      {
        title: "Accelerate Domestic Fabrication",
        description:
          "Continue CHIPS Act investments to bring leading-edge fabrication capacity (sub-3nm) to domestic soil and reduce Taiwan dependency.",
      },
      {
        title: "Modernize Power Grid",
        description:
          "Invest in grid infrastructure and renewable energy capacity to meet the surging electricity demands of AI data centers at competitive prices.",
      },
      {
        title: "Secure Critical Mineral Supply Chains",
        description:
          "Diversify sourcing for Gallium, Germanium, and other critical semiconductor materials beyond Chinese suppliers.",
      },
    ],
  },
  generatedAt: "2026-02-07T00:05:57.420037+00:00",
};
