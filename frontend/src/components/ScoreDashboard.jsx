import { useEffect, useState } from "react";
import { useTranslation } from "../i18n.js";
import { apiUrl } from "../api.js";

function ScoreGauge({ score }) {
  const pct = (score - 300) / 600;
  const circumference = 2 * Math.PI * 80;
  const arcLength = circumference * 0.75;
  const offset = arcLength * (1 - pct);

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <g transform="rotate(135 110 110)">
        <circle
          cx="110" cy="110" r="80"
          fill="none" stroke="#e3e8ee" strokeWidth="16"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx="110" cy="110" r="80"
          fill="none" stroke="url(#gaugeGradient)" strokeWidth="16"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </g>
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef6f6c" />
          <stop offset="50%" stopColor="#f2a541" />
          <stop offset="100%" stopColor="#2e8bc0" />
        </linearGradient>
      </defs>
      <text x="110" y="102" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight="700" fontSize="42" fill="#0b1e3d">
        {score}
      </text>
      <text x="110" y="126" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#5b6b79">
        / 900
      </text>
    </svg>
  );
}

export default function ScoreDashboard({ location, countryMeta, business, debt }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demand, setDemand] = useState(null);
  const [macro, setMacro] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const [demandRes, macroRes] = await Promise.all([
          fetch(apiUrl("/api/market-demand"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              industry: business.industry,
              city: location.city,
              state: location.state,
              country: countryMeta?.name,
            }),
          }).then((r) => r.json()),
          fetch(apiUrl(`/api/economy/${location.countryCode}`)).then((r) => r.json()),
        ]);

        if (cancelled) return;
        setDemand(demandRes);
        setMacro(macroRes);

        const scoreRes = await fetch(apiUrl("/api/score"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            altData: {
              monthlyTransactionVolume: business.monthlyTransactionVolume,
              transactionFrequencyPerWeek: business.transactionFrequencyPerWeek,
              missedWeeksLast6Months: business.missedWeeksLast6Months,
              onTimePaymentRatePct: business.onTimePaymentRatePct,
            },
            business: {
              yearsOperating: business.yearsOperating,
              employeeCount: business.employeeCount,
              monthlyRevenue: business.monthlyRevenue,
              existingEMI: debt.existingEMI,
            },
            demandScore: demandRes.demandScore,
            macro: { inflationRate: macroRes.inflationRate, sectorGrowthRate: macroRes.sectorGrowthRate },
          }),
        }).then((r) => r.json());

        if (cancelled) return;
        setScoreResult(scoreRes);
        setLoading(false);

        // Fetch recommendations + risk flags after the score is known (non-blocking for the main view)
        setAdviceLoading(true);
        const adviceRes = await fetch(apiUrl("/api/recommendations"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: scoreRes.score,
            tier: scoreRes.eligibility.tier,
            breakdown: scoreRes.breakdown,
            business: { industry: business.industry, yearsOperating: business.yearsOperating, monthlyRevenue: business.monthlyRevenue },
            demand: demandRes,
            macro: macroRes,
          }),
        }).then((r) => r.json());

        if (!cancelled) setAdvice(adviceRes);
      } catch (err) {
        if (!cancelled) setError("Something went wrong computing your score. Check the backend is running.");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAdviceLoading(false);
        }
      }
    }
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 60 }}>
        <div className="spinner" style={{ margin: "0 auto 16px", width: 32, height: 32 }} />
        <p style={{ color: "var(--slate)" }}>Analyzing local market demand and computing your score…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p style={{ color: "var(--soft-coral)" }}>{error}</p>
      </div>
    );
  }

  if (!scoreResult) return null;

  const tierClass = "tier-" + scoreResult.eligibility.tier.replace(/\s+/g, "-");

  return (
    <div className="card">
      <div className="score-hero">
        <div className="gauge-wrap">
          <ScoreGauge score={scoreResult.score} />
          <span className={`tier-badge ${tierClass}`}>{scoreResult.eligibility.tier}</span>
        </div>
        <div>
          <h2 className="card-title">{t("yourScore")}</h2>
          <p className="card-subtitle">{scoreResult.eligibility.note}</p>

          <div className="insight-grid">
            <div className="insight-card">
              <div className="insight-label">{t("marketDemand")}</div>
              <div className="insight-value">{demand.demandScore}/100</div>
              <div className="field-hint">{demand.trend} · {demand.competitorDensity} competition</div>
              <div className="macro-explainer">Based on {business.industry || "your industry"} in {location.city}, {countryMeta?.name}.</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">{t("inflation")}</div>
              <div className="insight-value">{macro.inflationRate}%</div>
              <div className="field-hint">{countryMeta?.name}</div>
              <div className="macro-explainer">Higher inflation raises lending risk nationwide — this lowers your macro sub-score slightly, regardless of your business.</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">{t("sectorGrowth")}</div>
              <div className="insight-value">{macro.sectorGrowthRate}%</div>
              <div className="field-hint">GDP growth proxy · {macro.source}</div>
              <div className="macro-explainer">Faster national growth generally means more lending headroom in your sector.</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 24, color: "var(--slate)", fontSize: "0.92rem", lineHeight: 1.6 }}>
        {demand.summary}
      </p>

      <hr className="section-divider" />

      <h3 style={{ marginBottom: 4 }}>{t("scoreBreakdown")}</h3>
      <p className="field-hint" style={{ marginBottom: 6 }}>
        Fully transparent — every factor and its weight in your final score.
      </p>
      <div className="breakdown-list">
        {scoreResult.breakdown.map((b) => (
          <div className="breakdown-row" key={b.factor}>
            <span className="breakdown-label">
              {b.factor.replace(/([A-Z])/g, " $1")} ({b.weightPct}%)
            </span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${b.rawScore}%` }} />
            </div>
            <span className="breakdown-score mono">{b.rawScore}/100</span>
          </div>
        ))}
      </div>

      <hr className="section-divider" />

      <h3 style={{ marginBottom: 4 }}>Current liabilities & risk flags</h3>
      <p className="field-hint" style={{ marginBottom: 6 }}>
        What's actively working against this business right now.
      </p>
      {adviceLoading && !advice ? (
        <p className="field-hint">Checking for risk factors…</p>
      ) : (
        <div className="risk-flags">
          {advice?.riskFlags?.map((f, i) => (
            <div className={`risk-flag ${f.level}`} key={i}>
              <span className="dot" />
              {f.label}
            </div>
          ))}
        </div>
      )}

      <hr className="section-divider" />

      <h3 style={{ marginBottom: 4 }}>How to improve your score</h3>
      <p className="field-hint" style={{ marginBottom: 6 }}>
        Personalized next steps based on your weakest-scoring factors.
      </p>
      {adviceLoading && !advice ? (
        <p className="field-hint">Generating personalized recommendations…</p>
      ) : (
        <div className="recommendation-list">
          {advice?.recommendations?.map((r, i) => (
            <div className="recommendation-item" key={i}>
              <span className="recommendation-num">{String(i + 1).padStart(2, "0")}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
