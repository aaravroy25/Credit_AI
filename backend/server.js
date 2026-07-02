import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import scoreRoutes from "./routes/score.js";
import marketDemandRoutes from "./routes/marketDemand.js";
import chatbotRoutes from "./routes/chatbot.js";
import economyRoutes from "./routes/economy.js";
import locationsRoutes from "./routes/locations.js";
import recommendationsRoutes from "./routes/recommendations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CreditLens API is running" });
});

app.use("/api/score", scoreRoutes);
app.use("/api/market-demand", marketDemandRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/economy", economyRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.listen(PORT, () => {
  console.log(`✅ CreditLens backend running at http://localhost:${PORT}`);
});
