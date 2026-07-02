import express from "express";
import { ALL_COUNTRIES, FLAGSHIP_DATA, INDUSTRIES, getCountryDetail, getCurrency } from "../data/locations.js";

const router = express.Router();

// Full country list for the picker. `supported: true` marks flagship markets
// with deep state/city data; others still work via free-text entry.
router.get("/countries", (req, res) => {
  res.json(
    ALL_COUNTRIES.map((c) => ({
      ...c,
      supported: Boolean(FLAGSHIP_DATA[c.code]),
      currency: getCurrency(c.code),
    }))
  );
});

router.get("/countries/:code", (req, res) => {
  const detail = getCountryDetail(req.params.code.toUpperCase());
  if (!detail) return res.status(404).json({ error: "Country not found" });
  res.json(detail);
});

router.get("/industries", (req, res) => {
  res.json(INDUSTRIES);
});

export default router;
