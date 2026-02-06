const frameworkPillars = [
  {
    title: "Frontier Research",
    weight: "25%",
    description: "Model capability, publications, open benchmarks"
  },
  {
    title: "Compute Access",
    weight: "20%",
    description: "Datacenter capacity, chip supply, cloud scale"
  },
  {
    title: "Talent & Education",
    weight: "20%",
    description: "AI workforce depth, training pipeline, retention"
  },
  {
    title: "Commercialization",
    weight: "20%",
    description: "Startup velocity, enterprise adoption, capital flows"
  },
  {
    title: "Policy & Trust",
    weight: "15%",
    description: "Governance readiness, safety, public trust"
  }
];

const ranking = [
  {
    rank: 1,
    country: "United States",
    score: 87.4,
    tier: "Frontier",
    delta: "+1.8",
    strengths: "Frontier labs, venture density, deployment velocity",
    pillars: {
      research: 92,
      compute: 90,
      talent: 88,
      commercialization: 91,
      policy: 74
    }
  },
  {
    rank: 2,
    country: "China",
    score: 83.2,
    tier: "Frontier",
    delta: "+0.9",
    strengths: "National scale, applied AI adoption, data volume",
    pillars: {
      research: 86,
      compute: 85,
      talent: 84,
      commercialization: 82,
      policy: 77
    }
  },
  {
    rank: 3,
    country: "United Kingdom",
    score: 79.1,
    tier: "Accelerating",
    delta: "+1.2",
    strengths: "Research intensity, safety leadership, global capital",
    pillars: {
      research: 84,
      compute: 70,
      talent: 82,
      commercialization: 76,
      policy: 83
    }
  },
  {
    rank: 4,
    country: "Canada",
    score: 77.6,
    tier: "Accelerating",
    delta: "+0.6",
    strengths: "Foundational research, immigration pipeline",
    pillars: {
      research: 83,
      compute: 68,
      talent: 86,
      commercialization: 72,
      policy: 78
    }
  },
  {
    rank: 5,
    country: "Singapore",
    score: 76.2,
    tier: "Strategic",
    delta: "+1.5",
    strengths: "Policy alignment, enterprise adoption, regional hub",
    pillars: {
      research: 72,
      compute: 74,
      talent: 79,
      commercialization: 80,
      policy: 85
    }
  },
  {
    rank: 6,
    country: "France",
    score: 74.8,
    tier: "Strategic",
    delta: "+0.7",
    strengths: "Public research, industry investment, EU scale",
    pillars: {
      research: 78,
      compute: 69,
      talent: 76,
      commercialization: 73,
      policy: 79
    }
  }
];

const expansionTracks = [
  {
    title: "Scenario Studio",
    description:
      "Stress-test rankings under compute caps, export controls, or capital shocks."
  },
  {
    title: "Regional Lens",
    description:
      "Add subnational views for AI corridors, clusters, and city-level benchmarks."
  },
  {
    title: "Sector Overlays",
    description:
      "Layer in healthcare, defense, finance, or climate readiness indices."
  },
  {
    title: "Live Signal Feeds",
    description:
      "Connect to patents, hiring, and model release trackers for real-time updates."
  }
];

export default function Home() {
  return (
    <main className="power">
      <header className="topline">
        <div>
          <span className="kicker">AI Power Framework</span>
          <h1>Ranking countries by their AI power readiness.</h1>
          <p className="lede">
            A prototype intelligence dashboard that blends research strength,
            compute access, talent depth, commercialization, and policy readiness
            into a single, explainable score.
          </p>
          <div className="tag-row">
            <span className="tag">Prototype</span>
            <span className="tag">Mock data</span>
            <span className="tag">Explainable scoring</span>
          </div>
        </div>
        <div className="status-card">
          <div>
            <span className="label">Coverage</span>
            <strong>42 countries</strong>
          </div>
          <div>
            <span className="label">Update cadence</span>
            <strong>Quarterly review</strong>
          </div>
          <div>
            <span className="label">Current snapshot</span>
            <strong>Q1 2026 (mock)</strong>
          </div>
        </div>
      </header>

      <div className="columns">
        <section className="project">
          <div className="card">
            <h2>Project brief</h2>
            <p>
              The AI Power Framework ranks national readiness across five pillars,
              combining measurable signals with expert weighting. The goal is to
              surface comparative strengths, gaps, and the fastest paths to
              improve competitiveness.
            </p>
            <div className="brief-metrics">
              <div>
                <span className="label">Signal sources</span>
                <strong>18 datasets</strong>
              </div>
              <div>
                <span className="label">Total indicators</span>
                <strong>67 metrics</strong>
              </div>
              <div>
                <span className="label">Confidence band</span>
                <strong>±3.5 pts</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Assessment pillars</h3>
              <span className="pill">Weighted</span>
            </div>
            <ul className="pillar-list">
              {frameworkPillars.map((pillar) => (
                <li key={pillar.title}>
                  <div>
                    <span className="pillar-title">{pillar.title}</span>
                    <p>{pillar.description}</p>
                  </div>
                  <span className="weight">{pillar.weight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card expansion">
            <div className="card-header">
              <h3>Ways to expand</h3>
              <span className="pill">Roadmap</span>
            </div>
            <div className="expansion-grid">
              {expansionTracks.map((track) => (
                <div key={track.title} className="expansion-card">
                  <h4>{track.title}</h4>
                  <p>{track.description}</p>
                </div>
              ))}
            </div>
            <div className="cta-row">
              <button type="button">Prototype a scenario</button>
              <button type="button" className="ghost">
                Add new indicator
              </button>
            </div>
          </div>
        </section>

        <section className="ranking">
          <div className="card ranking-card">
            <div className="card-header">
              <div>
                <h2>Mock ranking board</h2>
                <p className="muted">Illustrative scoring for the prototype.</p>
              </div>
              <div className="filters">
                <span>All regions</span>
                <span>Balanced scenario</span>
              </div>
            </div>

            <ol className="ranking-list">
              {ranking.map((row) => (
                <li key={row.country}>
                  <div className="rank-head">
                    <div className="rank-title">
                      <span className="rank-num">#{row.rank}</span>
                      <div>
                        <div className="country-line">
                          <h3>{row.country}</h3>
                          <span className="tier">{row.tier}</span>
                        </div>
                        <p>{row.strengths}</p>
                      </div>
                    </div>
                    <div className="rank-score">
                      <span>{row.score.toFixed(1)}</span>
                      <small>overall</small>
                      <em>{row.delta} QoQ</em>
                    </div>
                  </div>
                  <div className="score-bar">
                    <span style={{ width: `${row.score}%` }} />
                  </div>
                  <div className="pillar-scores">
                    <div>
                      <span>Research</span>
                      <strong>{row.pillars.research}</strong>
                    </div>
                    <div>
                      <span>Compute</span>
                      <strong>{row.pillars.compute}</strong>
                    </div>
                    <div>
                      <span>Talent</span>
                      <strong>{row.pillars.talent}</strong>
                    </div>
                    <div>
                      <span>Commercial</span>
                      <strong>{row.pillars.commercialization}</strong>
                    </div>
                    <div>
                      <span>Policy</span>
                      <strong>{row.pillars.policy}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
