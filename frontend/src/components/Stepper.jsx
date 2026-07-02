import { useTranslation } from "../i18n.js";

export default function Stepper({ currentStep }) {
  const { t } = useTranslation();
  const steps = [
    { key: "stepLocation", num: 1 },
    { key: "stepBusiness", num: 2 },
    { key: "stepDebt", num: 3 },
    { key: "stepScore", num: 4 },
  ];

  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            className={
              "step-pill " +
              (currentStep === s.num ? "active" : currentStep > s.num ? "done" : "")
            }
          >
            <span className="step-num">{currentStep > s.num ? "✓" : s.num}</span>
            {t(s.key)}
          </div>
          {i < steps.length - 1 && <div className="step-connector" />}
        </div>
      ))}
    </div>
  );
}
