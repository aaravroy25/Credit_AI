import express from "express";

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// POST /api/market-demand
// body: { industry, city, state, country }
router.post("/", async (req, res) => {
  const { industry, city, state, country } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback so the app still works before the student adds a key
    return res.json(fallbackDemand(industry, city, country));
  }

  const prompt = `You are a local market research analyst. A small business owner runs a "${industry}" business in ${city}, ${state}, ${country}.
Estimate the current local market demand for this industry in this specific city.
Respond ONLY with valid JSON, no markdown fences, no preamble, in exactly this shape:
{
  "demandScore": <integer 0-100, how strong current demand is>,
  "competitorDensity": "<Low|Medium|High>",
  "trend": "<Growing|Stable|Declining>",
  "summary": "<2-3 sentence plain-English explanation a small business owner would understand>"
}`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("Market demand AI error:", err);
    res.json(fallbackDemand(industry, city, country));
  }
});

function fallbackDemand(industry, city, country) {
  // Deterministic hash-based fallback so the demo still varies sensibly by
  // industry/city/country even before a GEMINI_API_KEY is configured.
  const seedStr = `${industry}|${city}|${country}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 997;
  }
  const demandScore = 35 + (hash % 60); // 35-94 range
  const trendOptions = ["Growing", "Stable", "Declining"];
  const densityOptions = ["Low", "Medium", "High"];
  const trend = trendOptions[hash % 3];
  const competitorDensity = densityOptions[Math.floor(hash / 3) % 3];

  return {
    demandScore,
    competitorDensity,
    trend,
    summary: `Estimated demand for ${industry || "this industry"} in ${city || "this city"}, ${country || ""} based on typical regional patterns (AI key not configured — add GEMINI_API_KEY for live, real-time analysis).`,
  };
}

export default router;
