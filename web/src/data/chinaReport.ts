import { ResearchResult } from "@/lib/mockResearch";

export const chinaReport: ResearchResult = {
  country: {
    country: "China",
    code: "CN",
    overall: 66,
    layers: { 1: 75, 2: 67, 3: 53, 4: 80, 5: 70, 6: 30, 7: 90, 8: 70 },
  },
  layerDetails: [
    {
      layerNumber: 1,
      layerName: "Power & Electricity",
      score: 75,
      findings:
        "China generated ~9,300 TWh of electricity in 2023 — the highest in the world, more than the U.S. and EU combined. Installed capacity exceeded 3,000 GW (3 TW) by 2024. Industrial electricity averages ~US$0.088/kWh, kept low by government measures — about 3× the cheapest global rates but well below Western averages. In Q1 2025, China's wind+solar capacity (1.482 TW) surpassed coal capacity (1.451 TW) for the first time. About 36% of generation comes from non-fossil sources, with ~64% still fossil (mostly coal). The grid is generally stable, though occasional shortages occur during extreme weather. Score: ~15/20 — full marks on capacity, less on cost and green grid quality.",
      sources: [
        "https://www.china-briefing.com/news/chinas-industrial-power-rates-category-electricity-usage-region-classification/",
        "https://www.eia.gov/international/content/analysis/countries_long/China/pdf/China-2025.pdf",
      ],
    },
    {
      layerNumber: 2,
      layerName: "Chipset Manufacturers",
      score: 67,
      findings:
        "China can manufacture semiconductors down to ~7 nm in limited volumes (SMIC trial production) with mass production at 14 nm and larger. It lacks fabs at the cutting-edge <5 nm scale. China remains dependent on foreign lithography equipment (ASML's EUV machines are unavailable due to export controls). Domestic firms like Naura and AMEC are supplying etching tools for 14 nm and testing 7 nm lines. Critically, China controls over 90% of global gallium and ~60% of germanium production — essential semiconductor materials — and imposed export restrictions in 2023 for leverage. Score: ~10/15 — strong in materials and older nodes, but dependent on foreign tech for cutting-edge chips.",
      sources: [
        "https://www.reuters.com/technology/chinas-ai-war-hundred-models-heads-shakeout-2023-09-21/",
        "https://www.reuters.com/world/china/china-mandates-50-domestic-equipment-rule-chipmakers-sources-say-2025-12-30/",
        "https://www.reuters.com/markets/commodities/chinas-major-germanium-gallium-producers-2023-07-07/",
      ],
    },
    {
      layerNumber: 3,
      layerName: "Cloud & Data Centers",
      score: 53,
      findings:
        "China has ~190 hyperscale data centers (~16% of the global total), second only to the U.S. (~642, 54%). Major Chinese tech firms (Alibaba, Tencent, Baidu, Huawei) operate dozens of facilities. The domestic cloud market is dominated by Chinese companies: Alibaba Cloud ~36%, Huawei ~19%, Tencent ~15%, totaling 70%+ market share. Foreign providers have minimal presence due to data residency laws. China has over 3.37 million 5G base stations supporting cloud-edge integration. However, tight internet controls (Great Firewall) heavily filter cross-border data flows. Score: ~8/15 — strong sovereign control (5/5) but compute density (~3/10) lags the U.S.",
      sources: [
        "https://www.cargoson.com/en/blog/number-of-data-centers-by-country",
        "https://www.mordorintelligence.com/industry-reports/china-cloud-computing-market",
        "https://www.globaltimes.cn/page/202403/1309361.shtml",
      ],
    },
    {
      layerNumber: 4,
      layerName: "Model Developers",
      score: 80,
      findings:
        "China experienced a 'war of a hundred models' — by September 2023 it had at least 130 LLMs exceeding 10B parameters, about 40% of all such models globally (nearly on par with the U.S. at 50%). Major models include Baidu's ERNIE, Alibaba's Tongyi Qianwen, Tencent's Hunyuan, and Huawei's PanGu. China has built at least two exascale supercomputers (Sunway 'Oceanlite' and Tianhe-3) achieving >1 exaflop in tests, though not reported to TOP500. China leads the world in AI research publication volume (28–31% of global papers) and filed 12,945 AI patents in 2024 vs 8,609 for the U.S. In generative AI, Chinese inventors filed 6× more patent families than U.S. inventors (38k vs 6k, 2014–2023). Score: ~8/10 — thriving model ecosystem, gap to U.S. is months not years.",
      sources: [
        "https://www.reuters.com/technology/chinas-ai-war-hundred-models-heads-shakeout-2023-09-21/",
        "https://www.theregister.com/2023/05/22/us_china_top500_may_2023/",
        "https://www.rdworldonline.com/quality-vs-quantity-us-and-china-chart-different-paths-in-global-ai-patent-race-in-2024/",
      ],
    },
    {
      layerNumber: 5,
      layerName: "Platform & Data",
      score: 70,
      findings:
        "China has the world's largest internet user base: 1.09 billion netizens as of Dec 2023 (77.5% penetration), climbing above 1.1 billion in 2024. This massive population generates enormous volumes of data across social media, e-commerce, and video platforms. However, government data openness is limited — China ranks outside the top 30 on open data metrics and is not part of OECD OURdata index. China practices strict data localization under the Data Security Law and Personal Information Protection Law (2021), with tight controls on cross-border data flows. Score: ~7/10 — maximum data volume (5/5) but weak open data governance (~2/5).",
      sources: [
        "https://www.globaltimes.cn/page/202403/1309361.shtml",
        "https://accesstochina.com/information/access-to-china-papers/china-internet-development/222-core-data-statistical-report-on-china-s-internet-development",
        "https://ict4dblog.wordpress.com/2024/04/11/ai-readiness-of-the-us-vs-china/",
      ],
    },
    {
      layerNumber: 6,
      layerName: "Applications & Startups",
      score: 30,
      findings:
        "China has over 4,400 AI companies and is #2 globally in AI unicorns (~70+ vs ~160+ for the U.S.). However, private AI investment has sharply declined: from ~$17B in 2021 to just $9.3B in 2024, while the U.S. invested $109.1B — nearly 12× more. Only 20 new unicorns (any sector) were added in 2024, the lowest in a decade. The gap reflects regulatory crackdowns and global capital controls. The government is stepping in with state guidance funds to compensate. Score: ~3/10 — many startups and unicorns exist, but capital depth is a fraction of the global leader.",
      sources: [
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        "https://thunderbit.com/blog/ai-unicorn-stats-2025",
        "https://www.prnewswire.com/news-releases/2024-global-unicorn-landscape-ai-reshapes-the-ecosystem-302416586.html",
      ],
    },
    {
      layerNumber: 7,
      layerName: "Education & Consulting",
      score: 90,
      findings:
        "China produces an enormous number of STEM graduates. It awarded ~43,000 S&E PhDs in 2020 (slightly surpassing the U.S.'s 42,000), with projections of 77,000+ STEM PhDs/year by 2025. At the bachelor level, China awards nearly 2 million degrees per year. Top institutions like Tsinghua and Peking University rank among the global top 15 in computer science. China leads in total AI papers published (28–31% of global output). Brain drain is being addressed via the Thousand Talents program, with more Chinese AI experts returning to lead labs at Alibaba, Baidu, etc. Score: ~9/10 — immense talent pipeline with world-class universities, slightly behind U.S. in citation impact.",
      sources: [
        "https://itif.org/publications/2025/09/10/americas-innovation-future-at-risk-without-stem-growth/",
        "https://cset.georgetown.edu/publication/china-is-fast-outpacing-u-s-stem-phd-growth/",
        "https://www.topuniversities.com/university-subject-rankings/computer-science-information-systems?countries=cn&region=Asia",
      ],
    },
    {
      layerNumber: 8,
      layerName: "Implementation",
      score: 70,
      findings:
        "China ranks 16th globally in the Oxford Insights Government AI Readiness Index 2023 (U.S. was 1st). China has a clear national AI strategy (New Generation AI Development Plan, 2017) and is aggressively deploying AI across smart cities, facial recognition surveillance, public healthcare, courts, and military. Nearly all major cities use AI camera systems. The State Council published 2022 guidance to integrate AI across manufacturing, agriculture, and governance. Business adoption is high in tech, fintech, and e-commerce sectors. However, lower scores on governance transparency and regulatory frameworks hold back the overall readiness score. Score: ~7/10 — substantial deployment backed by strategic plans, but governance gaps remain.",
      sources: [
        "https://ict4dblog.wordpress.com/2024/04/11/ai-readiness-of-the-us-vs-china/",
        "https://hai.stanford.edu/ai-index/2025-ai-index-report",
      ],
    },
  ],
  generatedAt: "2025-06-01T00:00:00.000Z",
};
