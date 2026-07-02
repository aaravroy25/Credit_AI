import express from "express";

const router = express.Router();

// World Bank indicator codes (free, no API key required)
const INFLATION_INDICATOR = "FP.CPI.TOTL.ZG"; // Inflation, consumer prices (annual %)
const GDP_GROWTH_INDICATOR = "NY.GDP.MKTP.KD.ZG"; // GDP growth (annual %) - used as sector-growth proxy

// GET /api/economy/:countryCode  (ISO2 code, e.g. IN, NG, KE)
router.get("/:countryCode", async (req, res) => {
  const { countryCode } = req.params;

  try {
    const [inflationRes, growthRes] = await Promise.all([
      fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${INFLATION_INDICATOR}?format=json&per_page=5&mrnev=1`
      ),
      fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${GDP_GROWTH_INDICATOR}?format=json&per_page=5&mrnev=1`
      ),
    ]);

    const inflationJson = await inflationRes.json();
    const growthJson = await growthRes.json();

    const inflationRate = extractLatestValue(inflationJson);
    const sectorGrowthRate = extractLatestValue(growthJson);

    res.json({
      countryCode,
      inflationRate: inflationRate ?? 5.5,
      sectorGrowthRate: sectorGrowthRate ?? 3.5,
      source: "World Bank Open Data",
    });
  } catch (err) {
    console.error("Economy data error:", err);
    // Sensible fallback so a network hiccup never breaks the demo
    res.json({ countryCode, inflationRate: 5.5, sectorGrowthRate: 3.5, source: "fallback" });
  }
});

function extractLatestValue(worldBankJson) {
  const series = worldBankJson?.[1];
  if (!Array.isArray(series)) return null;
  const withValue = series.find((entry) => entry.value !== null);
  return withValue ? Number(withValue.value.toFixed(2)) : null;
}

export default router;
