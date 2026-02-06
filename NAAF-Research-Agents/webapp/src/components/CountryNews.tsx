import { useState } from "react";
import { Newspaper, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  date: string;
  source: string;
}

const categoryColors: Record<string, string> = {
  Policy: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Industry: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Research: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Regulation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Infrastructure: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Workforce: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const mockNewsData: Record<string, NewsItem[]> = {
  "United States": [
    { title: "White House Releases Updated AI Executive Order Guidelines", summary: "The Biden administration published new implementation guidelines for the 2023 AI Executive Order, focusing on safety testing requirements for frontier models and federal agency AI adoption timelines.", category: "Policy", date: "2025-01-15", source: "Reuters" },
    { title: "NVIDIA Announces Next-Gen AI Chips for Data Centers", summary: "NVIDIA unveiled its Blackwell Ultra architecture at CES, promising 4x inference performance gains. Major cloud providers have already placed orders worth billions.", category: "Industry", date: "2025-01-20", source: "TechCrunch" },
    { title: "Stanford HAI Reports Surge in AI Research Publications", summary: "Stanford's 2025 AI Index shows US researchers published 35% more AI papers than the previous year, maintaining the country's lead in citations and novel architectures.", category: "Research", date: "2025-02-01", source: "Stanford HAI" },
    { title: "Senate Committee Advances Comprehensive AI Regulation Bill", summary: "The bipartisan AI Foundation Model Transparency Act passed committee with amendments requiring disclosure of training data sources and compute usage for models above certain thresholds.", category: "Regulation", date: "2024-12-18", source: "The Washington Post" },
    { title: "$12B Federal Investment in AI Data Center Infrastructure", summary: "The Department of Energy approved funding for 5 new AI-optimized data centers near renewable energy sources, expected to add 2GW of compute capacity by 2027.", category: "Infrastructure", date: "2025-01-08", source: "Bloomberg" },
    { title: "Tech Companies Launch National AI Workforce Training Initiative", summary: "Google, Microsoft, and Amazon jointly pledged $500M for community college AI training programs, aiming to certify 100,000 AI technicians over three years.", category: "Workforce", date: "2025-01-25", source: "CNBC" },
  ],
  China: [
    { title: "China Unveils National AI Development Plan Update for 2025", summary: "The State Council released updated targets for AI self-sufficiency, emphasizing domestic chip production and large language model development with Chinese-language datasets.", category: "Policy", date: "2025-01-10", source: "Xinhua" },
    { title: "Baidu and Alibaba Race to Deploy Open-Source LLMs", summary: "Both tech giants released new open-weight models exceeding 100B parameters, with Alibaba's Qwen-2.5 showing competitive benchmarks against Western counterparts.", category: "Industry", date: "2025-01-22", source: "South China Morning Post" },
    { title: "Chinese Researchers Achieve Breakthrough in AI Chip Design", summary: "A team at Tsinghua University demonstrated a novel chiplet architecture that reduces reliance on advanced EUV lithography, potentially circumventing export controls.", category: "Research", date: "2024-12-20", source: "Nature Electronics" },
    { title: "Beijing Issues New Regulations for Generative AI Services", summary: "The Cyberspace Administration of China published detailed compliance requirements for generative AI providers, including mandatory content filtering and user identity verification.", category: "Regulation", date: "2025-01-05", source: "Reuters" },
    { title: "Massive Data Center Expansion in Western China", summary: "China's 'East Data West Computing' project completed Phase 3, adding 500MW of AI compute capacity in Guizhou and Gansu provinces powered primarily by hydroelectric energy.", category: "Infrastructure", date: "2025-02-03", source: "Caixin Global" },
    { title: "Record Number of AI Graduates Enter Chinese Job Market", summary: "Over 200,000 AI-specialized graduates entered the workforce in 2024, though industry reports suggest a growing mismatch between academic training and practical deployment skills.", category: "Workforce", date: "2025-01-18", source: "China Daily" },
  ],
};

const generateGenericNews = (country: string): NewsItem[] => [
  { title: `${country} Government Announces National AI Strategy Update`, summary: `The government released an updated framework prioritizing AI adoption across public services, with new funding commitments for AI research institutions and innovation hubs.`, category: "Policy", date: "2025-01-12", source: "Government Press Release" },
  { title: `Leading ${country} Tech Firms Form AI Industry Alliance`, summary: `Major technology companies have formed a consortium to accelerate AI development, pooling resources for shared computing infrastructure and collaborative research projects.`, category: "Industry", date: "2025-01-19", source: "Reuters" },
  { title: `${country} Universities Report Record AI Research Output`, summary: `Top research universities showed a significant increase in AI paper citations and patent filings, with particular strength in applied machine learning and natural language processing.`, category: "Research", date: "2024-12-28", source: "Nature" },
  { title: `New AI Safety Regulations Under Consideration in ${country}`, summary: `Lawmakers are reviewing proposed legislation that would establish mandatory risk assessments for high-stakes AI systems used in healthcare, finance, and criminal justice.`, category: "Regulation", date: "2025-01-30", source: "Financial Times" },
  { title: `${country} Invests in Sovereign Cloud and AI Infrastructure`, summary: `A multi-billion dollar initiative aims to build domestic AI computing capacity, reducing dependence on foreign cloud providers and ensuring data sovereignty compliance.`, category: "Infrastructure", date: "2025-02-02", source: "Bloomberg" },
  { title: `AI Skills Gap Prompts ${country} Workforce Retraining Push`, summary: `Government and industry partners launched a joint initiative to retrain workers for AI-adjacent roles, targeting 50,000 certifications in the first year of the program.`, category: "Workforce", date: "2025-01-14", source: "World Economic Forum" },
];

export const CountryNews = ({ country }: { country: string }) => {
  const news = mockNewsData[country] ?? generateGenericNews(country);

  return (
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        Recent AI developments
      </p>

      {news.map((item, i) => (
        <article
          key={i}
          className="rounded-xl border border-border bg-card p-5 space-y-2.5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground leading-snug">
              {item.title}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                categoryColors[item.category] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {item.category}
            </span>
          </div>
          <p className="text-sm text-foreground/75 leading-relaxed">{item.summary}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>{item.source}</span>
            <span>·</span>
            <span>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </article>
      ))}
    </div>
  );
};
