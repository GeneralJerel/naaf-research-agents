export interface LayerData {
  number: number;
  name: string;
  shortDesc: string;
  weight: string;
  metrics: string[];
}

export interface CountryScore {
  country: string;
  code: string;
  overall: number;
  layers: Record<number, number>;
}

export const layers: LayerData[] = [
  {
    number: 1,
    name: "Power & Electricity",
    shortDesc: "Cheap, stable, sustainable electricity for data centers",
    weight: "20%",
    metrics: ["Industrial Price ($/kWh)", "Capacity (GW)", "Reserve Margin", "Clean Mix %"],
  },
  {
    number: 2,
    name: "Chipset Manufacturers",
    shortDesc: "Semiconductor supply chain control — design & fabrication",
    weight: "15%",
    metrics: ["Fab Capacity (<7nm)", "Equipment Control", "Raw Materials"],
  },
  {
    number: 3,
    name: "Cloud & Data Centers",
    shortDesc: "Physical housing & networking for AI workloads",
    weight: "15%",
    metrics: ["Hyperscale Count", "Sovereign Cloud %", "Int'l Bandwidth (Tbps)"],
  },
  {
    number: 4,
    name: "Model Developers",
    shortDesc: "Ability to train foundation models domestically",
    weight: "10%",
    metrics: ["Sovereign FMs (>10B)", "TOP500 Systems", "AI Patents/yr"],
  },
  {
    number: 5,
    name: "Platform & Data",
    shortDesc: "Quality, accessibility & governance of AI data",
    weight: "10%",
    metrics: ["Open Gov Data Score", "Data Flow Policy", "Language Dataset Size"],
  },
  {
    number: 6,
    name: "Applications & Startups",
    shortDesc: "Commercial ecosystem turning infra into economic value",
    weight: "10%",
    metrics: ["AI Unicorns", "VC as % GDP", "GitHub Contributions"],
  },
  {
    number: 7,
    name: "Education & Consulting",
    shortDesc: "Human capital for building and maintaining AI",
    weight: "10%",
    metrics: ["AI/CS Graduates", "Top 100 Universities", "Brain Drain/Gain"],
  },
  {
    number: 8,
    name: "Implementation",
    shortDesc: "How widely AI is used by government & industry",
    weight: "10%",
    metrics: ["Gov AI Readiness", "Business Adoption %", "Productivity Growth"],
  },
];

export const sampleCountries: CountryScore[] = [
  {
    country: "United States",
    code: "US",
    overall: 96,
    layers: { 1: 88, 2: 94, 3: 100, 4: 100, 5: 95, 6: 100, 7: 100, 8: 100 },
  },
  {
    country: "China",
    code: "CN",
    overall: 66,
    layers: { 1: 75, 2: 67, 3: 53, 4: 80, 5: 70, 6: 30, 7: 90, 8: 70 },
  },
  {
    country: "United Kingdom",
    code: "UK",
    overall: 58,
    layers: { 1: 40, 2: 35, 3: 55, 4: 55, 5: 72, 6: 65, 7: 75, 8: 68 },
  },
  {
    country: "South Korea",
    code: "KR",
    overall: 55,
    layers: { 1: 50, 2: 75, 3: 50, 4: 48, 5: 55, 6: 45, 7: 60, 8: 62 },
  },
  {
    country: "Germany",
    code: "DE",
    overall: 52,
    layers: { 1: 40, 2: 45, 3: 48, 4: 45, 5: 68, 6: 50, 7: 70, 8: 60 },
  },
  {
    country: "Japan",
    code: "JP",
    overall: 50,
    layers: { 1: 45, 2: 65, 3: 45, 4: 45, 5: 55, 6: 40, 7: 58, 8: 55 },
  },
  {
    country: "Canada",
    code: "CA",
    overall: 48,
    layers: { 1: 75, 2: 20, 3: 45, 4: 42, 5: 68, 6: 55, 7: 65, 8: 50 },
  },
  {
    country: "India",
    code: "IN",
    overall: 38,
    layers: { 1: 55, 2: 22, 3: 35, 4: 30, 5: 40, 6: 45, 7: 50, 8: 38 },
  },
];
