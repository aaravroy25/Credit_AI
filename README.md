# CreditLens — AI Alt-Credit Scoring for Small Businesses

An AI-powered credit scoring platform for small businesses in developing countries. Instead of
bank history, it scores loan eligibility using **alternative data** — digital/UPI payment
patterns, utility bill reliability — and adjusts the score based on **local market demand** and
**macroeconomic context**, so a business in a high-demand growing city scores differently than
an identical business in a saturated, shrinking one. Built starting with India (UPI), designed
to extend to other countries.

---

## 1. What you need before you start

- **Node.js** (v18 or later) — download from https://nodejs.org (choose the LTS version)
- **VS Code** — https://code.visualstudio.com
- A free **Gemini API key** for the AI features (market demand + chatbot) — see Step 3 below

---

## 2. Open the project in VS Code

1. Unzip the `credit-score-app` folder you downloaded.
2. Open VS Code → `File > Open Folder` → select the `credit-score-app` folder.
3. Open a terminal inside VS Code: `Terminal > New Terminal`.

You should see two subfolders: `backend/` and `frontend/`.

---

## 3. Get your free Gemini API key (takes ~2 minutes)

1. Go to **https://aistudio.google.com/apikey**
2. Sign in with a Google account.
3. Click **"Create API key"** → copy the key that appears.
4. In VS Code, go to `backend/.env.example`, and duplicate it as a new file named `.env` in
   the same `backend/` folder (right-click `.env.example` → Copy, then Paste, then rename the
   copy to `.env`).
5. Open `backend/.env` and paste your key:
   ```
   GEMINI_API_KEY=paste_your_key_here
   PORT=5000
   ```
6. Save the file.

> The app still works without a key (it falls back to reasonable demo data), but the market
> demand analysis and chatbot will be static instead of live AI — get the key for the full effect.

---

## 4. Install dependencies

In the VS Code terminal, run these one at a time:

```bash
cd backend
npm install
cd ../frontend
npm install
```

This downloads all the packages (Express, React, Leaflet for maps, Recharts, etc.). It may take
a minute or two.

---

## 5. Run the app (two terminals)

You need the backend and frontend running **at the same time**, so open two terminals in VS Code
(`Terminal > Split Terminal`, or click the `+` icon).

**Terminal 1 — backend:**
```bash
cd backend
npm run start
```
You should see: `✅ CreditLens backend running at http://localhost:5000`

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
You should see a local URL, typically `http://localhost:5173`. Click it (or Ctrl/Cmd+click) to
open it in your browser.

---

## 6. Using the app

1. **Location** — click a country pin on the map, or switch to search mode and pick
   Country → State → City from dropdowns. The tags below show which local data source
   (e.g. "UPI Transactions" for India) the score will simulate.
2. **Business** — enter business name, industry, years operating, employees, revenue, and the
   alternative-data inputs (digital payment volume/frequency, utility bill punctuality).
3. **Debt** — enter existing EMI and a new loan amount/rate/tenure; see the EMI, total interest,
   and projected debt-to-income live.
4. **Score** — the app calls the AI market-demand analysis, pulls live inflation/GDP-growth data
   from the World Bank, and computes a fully transparent 300–900 score with a factor-by-factor
   breakdown.
5. Click the 💬 button anytime for the in-app assistant.
6. Use the language dropdown top-right to switch the whole interface (English / Hindi / Swahili
   / French).

---

## 7. Project structure

```
credit-score-app/
├── backend/                 Node + Express API
│   ├── server.js            App entry point
│   ├── routes/
│   │   ├── score.js         Computes the 300-900 credit score
│   │   ├── marketDemand.js  Calls Gemini for local industry demand
│   │   ├── chatbot.js       Gemini-powered assistant
│   │   ├── economy.js       Live inflation/GDP data (World Bank, no key needed)
│   │   └── locations.js     Serves country/state/city + industry lists
│   ├── data/locations.js    Country → state → city dataset + supported data rails
│   └── utils/scoreEngine.js The explainable scoring formula (see below)
└── frontend/                React + Vite app
    └── src/
        ├── App.jsx           4-step wizard (Location → Business → Debt → Score)
        ├── i18n.js            Translations (en/hi/sw/fr)
        └── components/       LocationSelector (map+search), BusinessProfileForm,
                               EMICalculator, ScoreDashboard (gauge + breakdown), Chatbot
```

---

## 8. How the score is calculated (good to explain in your write-up)

The score is a weighted composite, mapped onto a 300–900 scale, of six transparent factors:

| Factor | Weight | What it measures |
|---|---|---|
| Digital Payment Health | 35% | UPI/mobile-money transaction volume, frequency, consistency |
| Utility Bill Reliability | 15% | On-time electricity/water/internet payments |
| Business Stability | 15% | Years operating, employee count |
| Debt Burden | 15% | Existing EMI as a share of monthly revenue |
| Local Market Demand | 12% | AI-estimated demand for this industry in this specific city |
| Macroeconomic Context | 8% | Country inflation + sector/GDP growth (World Bank data) |

No factor is a black box — the dashboard shows every sub-score and its contribution, which is
the difference between this and a typical opaque ML credit model.

The dashboard also shows:
- **Current liabilities & risk flags** — plain-language red/amber/blue flags for things actively
  hurting the score right now (high debt load, inconsistent payments, late utility bills, a
  young business, declining local demand, high competition, elevated inflation).
- **Personalized recommendations** — 4 AI-generated, specific next steps tailored to the
  business's weakest-scoring factors (falls back to solid rule-based tips without an API key).

---

## 9. Ideas to extend it further (great "future work" section for your submission)

- Swap the simulated payment data for a real UPI/Account Aggregator sandbox API
- Add a "what-if" slider: show how the score changes with 6 more months of consistent payments
- City-vs-city comparison mode (same business, different location)
- PDF export of the full credit report
- Real bank/MFI partner integration for loan disbursement

---

## 10. Troubleshooting

- **"Failed to fetch" in the browser** → make sure the backend terminal is still running and
  shows port 5000.
- **Map doesn't render** → hard refresh the browser (Ctrl/Cmd+Shift+R); this is usually a
  Leaflet CSS caching issue.
- **AI features return generic text** → check `backend/.env` has a valid `GEMINI_API_KEY` and
  you restarted the backend terminal after adding it.

---

## 11. Deploying (backend on Render, frontend on Vercel)

The frontend calls the backend through `frontend/src/api.js`, which reads `VITE_API_URL` at
build time. Locally it's empty (Vite's dev proxy handles `/api`); in production you point it at
your deployed backend.

### Step 1 — Deploy the backend to Render

1. Go to **https://render.com** → sign in with GitHub → **New +** → **Web Service**.
2. Pick this repo. Render should detect `render.yaml` at the repo root and pre-fill the settings
   (service name `creditlens-backend`, root directory `backend`, build `npm install`, start
   `npm start`). If it doesn't auto-detect, set those fields manually.
3. Under **Environment**, add:
   - `GEMINI_API_KEY` = your Gemini key (same one from `backend/.env`)
4. Click **Create Web Service**. Wait for the build to finish, then copy the URL Render gives you,
   e.g. `https://creditlens-backend.onrender.com`.
5. Confirm it's alive by visiting `https://creditlens-backend.onrender.com/api/health` — you
   should see `{"status":"ok",...}`.

> Free Render web services spin down after inactivity; the first request after idling can take
> ~30–50s to wake up. That's normal.

### Step 2 — Deploy the frontend to Vercel

1. Go to **https://vercel.com** → sign in with GitHub → **Add New** → **Project** → pick this repo.
2. Set **Root Directory** to `frontend` (Vercel will auto-detect the Vite framework preset once
   you do — build command `vite build`, output directory `dist`).
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = the Render URL from Step 1, e.g. `https://creditlens-backend.onrender.com`
     (no trailing slash)
4. Click **Deploy**. Once it's done, Vercel gives you a URL like
   `https://credit-ai.vercel.app` — that's your live app.

### Step 3 — Sanity check

Open the Vercel URL, click a country on the map, fill in the business form, and get to the score
step. If you see "Failed to fetch" or a CORS error in the browser console, double-check
`VITE_API_URL` is set exactly to the Render URL and redeploy the frontend (env var changes on
Vercel require a redeploy to take effect).

If you ever change `GEMINI_API_KEY` or other backend env vars, redeploy the Render service the
same way; if you change `VITE_API_URL` or any frontend code, redeploy on Vercel.
