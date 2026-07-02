import { useEffect, useState } from "react";
import { LanguageContext, useLanguageProvider, useTranslation } from "./i18n.js";
import LanguageToggle from "./components/LanguageToggle.jsx";
import Stepper from "./components/Stepper.jsx";
import LocationSelector from "./components/LocationSelector.jsx";
import BusinessProfileForm from "./components/BusinessProfileForm.jsx";
import EMICalculator from "./components/EMICalculator.jsx";
import ScoreDashboard from "./components/ScoreDashboard.jsx";
import Chatbot from "./components/Chatbot.jsx";

const initialBusiness = {
  businessName: "",
  industry: "",
  yearsOperating: 2,
  employeeCount: 3,
  monthlyRevenue: 60000,
  monthlyTransactionVolume: 45000,
  transactionFrequencyPerWeek: 12,
  missedWeeksLast6Months: 1,
  onTimePaymentRatePct: 85,
};

const initialDebt = {
  existingEMI: 3000,
  loanAmount: 100000,
  interestRate: 14,
  tenure: 24,
};

function Wizard() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [location, setLocation] = useState({ countryCode: "", state: "", city: "" });
  const [business, setBusiness] = useState(initialBusiness);
  const [debt, setDebt] = useState(initialDebt);

  useEffect(() => {
    fetch("/api/locations/countries")
      .then((r) => r.json())
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  const countryMeta = countries.find((c) => c.code === location.countryCode);

  const canProceedStep1 = location.countryCode && location.state && location.city;
  const canProceedStep2 = business.businessName && business.industry;

  return (
    <div className="main-content">
      <div className="hero-intro">
        <span className="eyebrow">AI · ALTERNATIVE DATA · {countryMeta ? countryMeta.currency : "MULTI-COUNTRY"}</span>
        <h1>{t("appName")}</h1>
        <p>{t("tagline")}</p>
      </div>

      <Stepper currentStep={step} />

      {step === 1 && (
        <div className="card">
          <h2 className="card-title">{t("stepLocation")}</h2>
          <p className="card-subtitle">Pick a country on the map or search directly — the data sources we use adapt automatically.</p>
          <LocationSelector countries={countries} value={location} onChange={setLocation} />
          <div className="actions-row" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-primary" disabled={!canProceedStep1} onClick={() => setStep(2)}>
              {t("next")} →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 className="card-title">{t("stepBusiness")}</h2>
          <p className="card-subtitle">The core inputs that power your Alt-Credit Score.</p>
          <BusinessProfileForm value={business} onChange={setBusiness} />
          <div className="actions-row">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← {t("back")}</button>
            <button className="btn btn-primary" disabled={!canProceedStep2} onClick={() => setStep(3)}>
              {t("next")} →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2 className="card-title">{t("stepDebt")}</h2>
          <p className="card-subtitle">See exactly how existing and new debt affect eligibility.</p>
          <EMICalculator
            value={debt}
            onChange={setDebt}
            currency={countryMeta?.currency}
            monthlyRevenue={business.monthlyRevenue}
          />
          <div className="actions-row">
            <button className="btn btn-secondary" onClick={() => setStep(2)}>← {t("back")}</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>
              {t("calculate")} →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <>
          <ScoreDashboard location={location} countryMeta={countryMeta} business={business} debt={debt} />
          <div className="actions-row" style={{ justifyContent: "flex-start" }}>
            <button className="btn btn-secondary" onClick={() => setStep(3)}>← {t("back")}</button>
            <button className="btn btn-teal" onClick={() => setStep(4)} style={{ marginLeft: 12 }}>
              {t("recalculate")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const languageState = useLanguageProvider();

  return (
    <LanguageContext.Provider value={languageState}>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark">CL</span>
            {languageState.t("appName")}
          </div>
          <div className="header-right">
            <LanguageToggle />
          </div>
        </header>
        <Wizard />
        <Chatbot />
      </div>
    </LanguageContext.Provider>
  );
}
