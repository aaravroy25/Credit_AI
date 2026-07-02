import express from "express";

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// POST /api/recommendations
// body: { score, tier, breakdown, business, demand, macro }
router.post("/", async (req, res) => {
  const { score, tier, breakdown, business, demand, macro } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const riskFlags = buildRiskFlags({ breakdown, business, demand, macro });

  if (!apiKey) {
    return res.json({
      recommendations: fallbackRecommendations(breakdown),
      riskFlags,
    });
  }

  const weakest = [...breakdown].sort((a, b) => a.rawScore - b.rawScore).slice(0, 3);

  const prompt = `A small business owner running a "${business.industry}" business (${business.yearsOperating} years operating, ${business.monthlyRevenue} monthly revenue) just received an alternative-data credit score of ${score}/900 (tier: ${tier}).
Their three weakest scoring factors are: ${weakest.map((w) => `${w.factor} (${w.rawScore}/100)`).join(", ")}.
Local market demand for their industry is ${demand?.demandScore}/100 (${demand?.trend}, ${demand?.competitorDensity} competition). Country inflation is ${macro?.inflationRate}%.

Give exactly 4 short, specific, actionable recommendations to improve their score and business health over the next 3-6 months. Respond ONLY with valid JSON, no markdown fences, in exactly this shape:
{
  "recommendations": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"]
}
Each tip must be one sentence, plain language, no jargon.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ recommendations: parsed.recommendations, riskFlags });
  } catch (err) {
    console.error("Recommendations AI error:", err);
    res.json({ recommendations: fallbackRecommendations(breakdown), riskFlags });
  }
});

function fallbackRecommendations(breakdown) {
  const tips = {
    paymentHealth: "Push more of your daily sales through digital/UPI payments instead of cash — consistent, frequent digital transactions are the single biggest driver of your score.",
    utilityReliability: "Set a calendar reminder or auto-pay for utility bills — even a few late payments noticeably drag your score down.",
    businessStability: "Keep detailed records of your years in operation and staff — formalizing this history strengthens your profile as you grow.",
    debtBurden: "Avoid taking on new EMIs until your existing debt is below roughly 30-35% of monthly revenue.",
    marketDemand: "Consider whether a nearby, higher-demand neighborhood could support a second outlet or delivery-only presence.",
    macroContext: "This factor depends on national conditions, not your business — focus your energy on the factors you can control instead.",
  };
  const weakest = [...breakdown].sort((a, b) => a.rawScore - b.rawScore).slice(0, 4);
  return weakest.map((w) => tips[w.factor] || "Keep building a consistent digital payment history.");
}

function buildRiskFlags({ breakdown, business, demand, macro }) {
  const flags = [];
  const get = (factor) => breakdown.find((b) => b.factor === factor)?.rawScore ?? 50;

  if (get("debtBurden") < 40) {
    flags.push({ level: "high", label: "High existing debt load relative to revenue" });
  }
  if (get("paymentHealth") < 40) {
    flags.push({ level: "high", label: "Inconsistent or low-volume digital payment activity" });
  }
  if (get("utilityReliability") < 50) {
    flags.push({ level: "medium", label: "Utility bills are frequently paid late" });
  }
  if (business?.yearsOperating < 1) {
    flags.push({ level: "medium", label: "Business is less than a year old — limited track record" });
  }
  if (demand?.trend === "Declining") {
    flags.push({ level: "medium", label: "Local market demand for this industry is declining" });
  }
  if (demand?.competitorDensity === "High") {
    flags.push({ level: "low", label: "High competitor density in this area" });
  }
  if (macro?.inflationRate > 10) {
    flags.push({ level: "medium", label: "Country inflation is elevated, raising lending risk" });
  }
  if (flags.length === 0) {
    flags.push({ level: "none", label: "No major risk flags detected" });
  }
  return flags;
}

export default router;
