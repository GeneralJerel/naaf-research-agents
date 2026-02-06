import { useParams, Navigate } from "react-router-dom";
import AgentResearchView from "@/components/AgentResearchView";

export default function ResearchPage() {
  const { countryName } = useParams<{ countryName: string }>();

  if (!countryName) {
    return <Navigate to="/" replace />;
  }

  return <AgentResearchView countryName={decodeURIComponent(countryName)} />;
}
