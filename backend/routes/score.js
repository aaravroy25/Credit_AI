import express from "express";
import { computeCreditScore } from "../utils/scoreEngine.js";

const router = express.Router();

// POST /api/score
// body: { altData: {...}, business: {...}, demandScore: number, macro: {...} }
router.post("/", (req, res) => {
  try {
    const { altData, business, demandScore, macro } = req.body;

    const result = computeCreditScore({
      ...altData,
      ...business,
      demandScore,
      inflationRate: macro?.inflationRate ?? 5,
      sectorGrowthRate: macro?.sectorGrowthRate ?? 3,
    });

    res.json(result);
  } catch (err) {
    console.error("Score calculation error:", err);
    res.status(500).json({ error: "Failed to compute credit score." });
  }
});

export default router;
