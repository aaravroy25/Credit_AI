/**
 * CreditLens Alt-Score Engine
 * ----------------------------
 * Produces a 300-900 score (CIBIL-style scale, familiar in India) using
 * ALTERNATIVE data instead of traditional bank/credit-bureau history:
 *
 *   1. Digital Payment Health   (35%) - UPI/mobile-money frequency, volume, consistency
 *   2. Utility Bill Reliability (15%) - on-time electricity/water/internet payments
 *   3. Business Stability       (15%) - years operating, employee count
 *   4. Debt Burden              (15%) - existing EMI vs monthly revenue
 *   5. Local Market Demand      (12%) - AI-estimated demand for this industry, this city
 *   6. Macroeconomic Context    (8%)  - country inflation + sector growth (World Bank data)
 *
 * The engine is intentionally transparent (no black box) - every factor and
 * its weight is returned to the frontend so the score can be explained.
 */

const WEIGHTS = {
  paymentHealth: 0.35,
  utilityReliability: 0.15,
  businessStability: 0.15,
  debtBurden: 0.15,
  marketDemand: 0.12,
  macroContext: 0.08,
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// --- Sub-score calculators (each returns 0-100) ---

function scorePaymentHealth({ monthlyTransactionVolume, transactionFrequencyPerWeek, missedWeeksLast6Months }) {
  const volumeScore = clamp((monthlyTransactionVolume / 150000) * 100, 0, 100); // saturates around ₹1.5L/mo
  const freqScore = clamp((transactionFrequencyPerWeek / 25) * 100, 0, 100);
  const reliabilityPenalty = clamp(missedWeeksLast6Months * 8, 0, 60);
  return clamp(volumeScore * 0.45 + freqScore * 0.35 + (100 - reliabilityPenalty) * 0.2, 0, 100);
}

function scoreUtilityReliability({ onTimePaymentRatePct }) {
  return clamp(onTimePaymentRatePct, 0, 100);
}

function scoreBusinessStability({ yearsOperating, employeeCount }) {
  const ageScore = clamp((yearsOperating / 8) * 100, 0, 100); // 8+ yrs = full marks
  const sizeScore = clamp((employeeCount / 15) * 100, 0, 100);
  return clamp(ageScore * 0.7 + sizeScore * 0.3, 0, 100);
}

function scoreDebtBurden({ monthlyRevenue, existingEMI }) {
  if (!monthlyRevenue || monthlyRevenue <= 0) return 30;
  const ratio = existingEMI / monthlyRevenue; // debt-to-income
  // 0% ratio -> 100, 50%+ ratio -> 0
  return clamp(100 - ratio * 200, 0, 100);
}

function scoreMarketDemand({ demandScore }) {
  // demandScore comes from the AI market-analysis call, 0-100
  return clamp(demandScore ?? 50, 0, 100);
}

function scoreMacroContext({ inflationRate, sectorGrowthRate }) {
  // Lower inflation = friendlier lending environment; higher sector growth = better
  const inflationScore = clamp(100 - inflationRate * 6, 0, 100); // ~16%+ inflation -> 0
  const growthScore = clamp(50 + sectorGrowthRate * 8, 0, 100); // growth can be negative
  return clamp(inflationScore * 0.5 + growthScore * 0.5, 0, 100);
}

/**
 * Main entry point.
 * @param {object} input - all raw business + alt-data inputs
 * @returns {object} full score breakdown, 300-900 scale
 */
export function computeCreditScore(input) {
  const sub = {
    paymentHealth: scorePaymentHealth(input),
    utilityReliability: scoreUtilityReliability(input),
    businessStability: scoreBusinessStability(input),
    debtBurden: scoreDebtBurden(input),
    marketDemand: scoreMarketDemand(input),
    macroContext: scoreMacroContext(input),
  };

  const weighted0to100 = Object.entries(sub).reduce(
    (acc, [key, val]) => acc + val * WEIGHTS[key],
    0
  );

  // Map 0-100 composite onto the familiar 300-900 band
  const finalScore = Math.round(300 + (weighted0to100 / 100) * 600);

  let eligibility;
  if (finalScore >= 750) eligibility = { tier: "Excellent", note: "Eligible for higher loan amounts and lower interest rates." };
  else if (finalScore >= 650) eligibility = { tier: "Good", note: "Eligible for standard microloans." };
  else if (finalScore >= 550) eligibility = { tier: "Fair", note: "Eligible for smaller, shorter-tenure loans." };
  else eligibility = { tier: "Needs Improvement", note: "Consider building 3-6 months of consistent digital payment history first." };

  return {
    score: finalScore,
    eligibility,
    breakdown: Object.entries(sub).map(([key, val]) => ({
      factor: key,
      rawScore: Math.round(val),
      weightPct: WEIGHTS[key] * 100,
      contribution: Math.round(val * WEIGHTS[key]),
    })),
  };
}
