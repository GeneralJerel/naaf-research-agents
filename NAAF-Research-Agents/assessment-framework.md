# National AI Assessment Framework

This framework ranks countries across the **eight layers of the AI industry** from physical constraints (bottom) to economic impact (top). It is designed for an AI agent to research using **public government and IGO data**.

## Layer 1: Power & Electricity (The Physical Constraint)
**Definition:** The nation's ability to supply cheap, stable, and sustainable electricity to industrial consumers (specifically data centers).

**Key Metrics:**
- Industrial Electricity Price: Cost per kWh for large consumers (lower is better).
- Total Output Capacity: Installed generation capacity (GW) and total generation (TWh).
- Grid Reserve Margin: Available capacity minus peak demand (higher is better).
- Clean Energy Mix: % from nuclear, hydro, solar, wind.

**Primary Sources:** IEA, World Bank Energy Data, Global Petrol Prices.

## Layer 2: Chipset Manufacturers (The Hardware Supply Chain)
**Definition:** The nation's control over the semiconductor supply chain, distinguishing between design (IP) and fabrication (manufacturing).

**Key Metrics:**
- Domestic Fab Capacity: Count of fabs capable of <7nm, <14nm, and mature nodes.
- Equipment Control: Presence of lithography or etching tool manufacturers.
- Raw Material Security: Access to critical minerals (Gallium, Germanium, Silicon).

**Primary Sources:** SEMI, US CHIPS Act funding reports, OECD TiVA.

## Layer 3: Cloud & Data Centers (The Compute Infrastructure)
**Definition:** The physical housing and networking for AI workloads and whether compute is sovereign.

**Key Metrics:**
- Hyperscale Data Center Count: Facilities >50MW.
- Sovereign Cloud Capacity: Local providers' share vs. foreign cloud dominance.
- International Bandwidth: Submarine cable capacity (Tbps).

**Primary Sources:** Data Center Map, TeleGeography, ITU statistics.

## Layer 4: Model Developers (The Sovereign Brain)
**Definition:** The ability to train foundation models domestically rather than only using foreign APIs.

**Key Metrics:**
- Sovereign FM Count: Foundation models >10B parameters.
- HPC/Supercomputer Ranking: Systems in the global TOP500 list.
- AI Patent Intensity: AI patents filed per year.

**Primary Sources:** TOP500.org, WIPO AI Index, Stanford AI Index.

## Layer 5: Platform & Data (The Raw Material)
**Definition:** The quality, accessibility, and governance of data needed to feed AI models.

**Key Metrics:**
- Open Government Data Score: Accessibility and machine readability.
- Data Gravity: Cross-border data flow restrictions.
- Local Language Dataset Size: Digitized text/media volume in national languages.

**Primary Sources:** OECD OURdata Index, World Bank data governance indicators.

## Layer 6: Applications & Startups (The Innovation Engine)
**Definition:** The commercial ecosystem that turns infrastructure into economic value.

**Key Metrics:**
- AI Unicorn Count: Private AI companies valued >$1B.
- VC Investment Density: AI VC inflows as % of GDP.
- GitHub Contributions: Code contributions by country (proxy for developer activity).

**Primary Sources:** Dealroom, Crunchbase/CB Insights aggregate reports, GitHub Innovation Graph.

## Layer 7: Education & Consulting (The Talent Pipeline)
**Definition:** The human capital required to build and maintain AI systems.

**Key Metrics:**
- AI/CS Graduates: Annual PhD/Master’s in CS/ML.
- Top University Presence: Count in top 100 for CS/AI.
- Brain Drain/Gain: Net migration of AI researchers.

**Primary Sources:** UNESCO Institute for Statistics, QS Rankings by Subject, LinkedIn Workforce Reports.

## Layer 8: Implementation (The Economic Multiplier)
**Definition:** How widely AI is used by government and traditional industries.

**Key Metrics:**
- Government AI Readiness: Digitization + AI strategy adoption.
- Business Adoption Rate: % of firms using AI.
- Labor Productivity Growth: GDP per hour worked (lagging indicator).

**Primary Sources:** Oxford Insights, Eurostat, national statistics bureaus.

## Scoring Weights (AI Power Scorecard)

Layer | Weight | Rationale
---|---:|---
8. Power | 20% | No power = no compute; hardest physical constraint.
7. Chips | 15% | Hardware access is a geopolitical choke point.
6. Cloud | 15% | Sovereign infrastructure supports national security.
5. Models | 10% | Measures advanced R&D capability.
4. Data | 10% | Fuel for models; governance shapes access.
3. Apps | 10% | Economic output indicator.
2. Talent | 10% | Long-term sustainability.
1. Adoption | 10% | Measures real-world benefit.

## Relative Power Index (RPI)
Power in geopolitics is relative. This scoring metric compares each country’s performance against the **global leader** (the “Gold Standard”) for each metric.

### Core Formula
For most quantitative metrics:

Score = (Country Value / Global Leader Value) × Weight

**Global Leader Value:** Highest number currently achieved by any nation.  
**Weight:** Importance of that layer (defined above).

## Detailed Scoring Rubric (Total: 100 Points)

### Layer 1: Power & Electricity (20 Points)
**Metric A: Industrial Capacity (8 pts)**
Formula: (Country Generation TWh / Global Max TWh) × 8

**Metric B: Cost Efficiency (4 pts)**
Formula: (Global Min Price / Country Industrial Price) × 4
Note: Inverted because lower price is better.

**Metric C: Grid Reliability & Clean Mix (4 pts)**
Scoring:
- 4 pts: >50% Clean Mix AND <1 hr annual outage.
- 2.5 pts: Mixed grid, occasional instability.
- 1 pt: Fossil-heavy, frequent instability.

**Metric D: National Output Percentile (4 pts)**
Formula: Percentile rank of country's total electricity generation (TWh) among all nations × 4
Calculation:
- Rank all countries by annual electricity generation (TWh)
- Percentile = (Number of countries below / Total countries) × 100
- Score = (Percentile / 100) × 4

Example: If a country ranks 10th out of 200 countries:
- Percentile = (190 / 200) × 100 = 95th percentile
- Score = 0.95 × 4 = 3.8 pts

Note: This metric rewards absolute national output scale, complementing Metric A which compares against the global maximum. A country can score well here by being in the top tier of global producers even if not #1.

### Layer 2: Chipset Manufacturers (15 Points)
**Metric A: Fabrication Capacity (10 pts)**  
Scoring based on node size:
- 10 pts: Mass production of <5nm (Leading Edge).
- 7 pts: Mass production of <14nm.
- 3 pts: Mature nodes only (>28nm).
- 0 pts: No domestic fabrication.

**Metric B: Equipment & Supply Chain Control (5 pts)**  
Scoring:
- 5 pts: Monopoly/Duopoly holder of critical tools (e.g., lithography, etching).
- 3 pts: Major supplier of critical chemicals/wafers.
- 1 pt: Minor component supplier.

### Layer 3: Cloud & Data Centers (15 Points)
**Metric A: Compute Density (10 pts)**  
Formula: (Country Hyperscale DC Count / Global Max Count) × 10

**Metric B: Sovereign Cloud (5 pts)**  
Scoring:
- 5 pts: Domestic providers hold >50% of government/critical infra data.
- 0 pts: Critical data primarily hosted by foreign providers.

### Layer 4: Model Developers (10 Points)
**Metric A: Frontier Model Capacity (10 pts)**  
Formula: (Domestic LLMs on LMSYS Leaderboard / Global Max) × 10

### Layer 5: Platform & Data (10 Points)
**Metric A: Data Openness (5 pts)**  
Source: OECD OURdata Index (normalized to 5 points).

**Metric B: Data Volume Potential (5 pts)**  
Formula: (Internet Population / Global Max) × 5  
Note: Proxy for user-generated training data volume.

### Layer 6: Applications & Startups (10 Points)
**Metric A: Capital Depth (10 pts)**  
Formula: (Annual AI VC Investment / Global Max) × 10

### Layer 7: Education & Consulting (10 Points)
**Metric A: Talent Pool (5 pts)**  
Formula: (Annual CS/AI Graduates / Global Max) × 5

**Metric B: Research Impact (5 pts)**  
Formula: (H-Index of Top Country University / Global Max H-Index) × 5

### Layer 8: Implementation (10 Points)
**Metric A: Government Readiness (10 pts)**  
Source: Oxford Insights Government AI Readiness Index (normalized to 10 points).

## Power Tiers (Interpretation)

**Tier 1: The Hegemons (80–100)**  
Full‑stack sovereignty. They control the atoms (chips/power) and the bits (models/data). They can sanction others effectively.  
Examples: USA, China.

**Tier 2: The Strategic Specialists (50–79)**  
World‑class in specific layers but dependent on Hegemons for others.  
Examples: Taiwan (chips), South Korea (chips/hardware), UK (talent/models), France (models/nuclear power).

**Tier 3: The Adopters (30–49)**  
Good infrastructure and talent, but largely consume foreign AI technology rather than creating it.  
Examples: Germany, Japan, Singapore, Canada.

**Tier 4: The Consumers (0–29)**  
Reliant entirely on imported hardware, software, and energy models. High risk of digital dependency.

## Agent Research Protocol

**Role:** Policy Research Analyst

**Objective:** Assess a country’s AI capability across 8 layers.

**Constraint:** Use only public data from 2023–2025. Prioritize government (gov.xx), IGOs (World Bank, OECD, IEA), and reputable indices.

**Task List:**
1. Power Assessment: Industrial electricity price (USD/kWh), total generation capacity (GW). Source: IEA or Global Petrol Prices.
2. Compute Capacity: Hyperscale data centers count; TOP500 supercomputer count.
3. Talent: STEM/CS graduates; net migration of researchers (if available). Source: UNESCO/OECD.
4. Innovation: Annual AI VC investment. Source: OECD or national VC reports.
5. Policy: National AI strategy status and Oxford Insights readiness rank.

**Output:** Return a detailed report with a score.
