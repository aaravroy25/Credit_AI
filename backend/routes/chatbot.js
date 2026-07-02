import express from "express";

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_CONTEXT = `You are the in-app assistant for "CreditLens", an AI credit-scoring platform that helps
small businesses in developing countries get loan eligibility scores using alternative data
(mobile/UPI payments, utility bills) instead of traditional bank history, adjusted for local
market demand and macroeconomic context. Help users navigate the app (selecting their
location, filling business details, understanding their score breakdown, using the EMI
calculator) and give short, practical, encouraging small-business advice. Keep replies under
120 words, plain language, no markdown headers.`;

// POST /api/chat
// body: { message: string, history: [{role, text}] }
router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      reply:
        "The AI assistant needs a GEMINI_API_KEY configured on the backend to answer questions. In the meantime: use the map or search bar to pick your country, then state and city; fill in your business details; and your score will appear on the dashboard with a full breakdown.",
    });
  }

  try {
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
      { role: "model", parts: [{ text: "Understood, I'll help with the app and give short business advice." }] },
      ...history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      // Log the raw Gemini response so the real cause shows up in the backend terminal
      console.error("Gemini returned no text. Status:", response.status, "Body:", JSON.stringify(data));
    }

    const reply = text ?? "Sorry, I couldn't process that. Could you rephrase?";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "Something went wrong reaching the assistant. Please try again." });
  }
});

export default router;