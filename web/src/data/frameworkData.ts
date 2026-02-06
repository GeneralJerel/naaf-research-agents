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
    overall: 80,
    layers: { 1: 45, 2: 80, 3: 100, 4: 100, 5: 50, 6: 100, 7: 90, 8: 100 },
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
    overall: 72,
    layers: { 1: 55, 2: 40, 3: 70, 4: 68, 5: 82, 6: 78, 7: 88, 8: 80 },
  },
  {
    country: "South Korea",
    code: "KR",
    overall: 70,
    layers: { 1: 60, 2: 85, 3: 65, 4: 62, 5: 70, 6: 60, 7: 72, 8: 75 },
  },
  {
    country: "Germany",
    code: "DE",
    overall: 65,
    layers: { 1: 45, 2: 50, 3: 62, 4: 55, 5: 78, 6: 58, 7: 82, 8: 72 },
  },
  {
    country: "Japan",
    code: "JP",
    overall: 64,
    layers: { 1: 52, 2: 72, 3: 60, 4: 58, 5: 65, 6: 48, 7: 70, 8: 68 },
  },
  {
    country: "Canada",
    code: "CA",
    overall: 62,
    layers: { 1: 88, 2: 25, 3: 58, 4: 52, 5: 80, 6: 65, 7: 78, 8: 60 },
  },
  {
    country: "India",
    code: "IN",
    overall: 52,
    layers: { 1: 65, 2: 30, 3: 45, 4: 38, 5: 50, 6: 55, 7: 62, 8: 48 },
  },
];
