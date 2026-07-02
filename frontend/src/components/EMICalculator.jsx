import { useMemo } from "react";
import { useTranslation } from "../i18n.js";

function calcEMI(principal, annualRatePct, months) {
  if (!principal || !months) return { emi: 0, totalInterest: 0, totalPayment: 0 };
  const r = annualRatePct / 12 / 100;
  if (r === 0) {
    const emi = principal / months;
    return { emi, totalInterest: 0, totalPayment: principal };
  }
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalInterest, totalPayment };
}

function fmt(n, currency) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0)) + " " + (currency || "");
}

export default function EMICalculator({ value, onChange, currency, monthlyRevenue }) {
  const { t } = useTranslation();

  const result = useMemo(
    () => calcEMI(value.loanAmount, value.interestRate, value.tenure),
    [value.loanAmount, value.interestRate, value.tenure]
  );

  const debtToIncome = monthlyRevenue
    ? Math.round(((value.existingEMI + result.emi) / monthlyRevenue) * 100)
    : null;

  const field = (key, num) => (e) => onChange({ ...value, [key]: num ? Number(e.target.value) : e.target.value });

  return (
    <div>
      <h3 style={{ marginBottom: 4 }}>Debt & loan planning</h3>
      <p className="field-hint" style={{ marginBottom: 18 }}>
        Existing debt lowers your score; we'll show you exactly how a new loan would affect your
        monthly cash flow.
      </p>
      <div className="form-grid">
        <div className="field">
          <label>{t("existingEMI")}</label>
          <input type="number" min="0" value={value.existingEMI} onChange={field("existingEMI", true)} />
        </div>
        <div className="field">
          <label>{t("loanAmount")}</label>
          <input type="number" min="0" value={value.loanAmount} onChange={field("loanAmount", true)} />
        </div>
        <div className="field">
          <label>{t("interestRate")}</label>
          <input type="number" min="0" step="0.1" value={value.interestRate} onChange={field("interestRate", true)} />
        </div>
        <div className="field">
          <label>{t("tenure")}</label>
          <input type="number" min="1" value={value.tenure} onChange={field("tenure", true)} />
        </div>
      </div>

      <div className="emi-result">
        <div>
          <div className="label">{t("monthlyEMI")}</div>
          <div className="value">{fmt(result.emi, currency)}</div>
        </div>
        <div>
          <div className="label">{t("totalInterest")}</div>
          <div className="value">{fmt(result.totalInterest, currency)}</div>
        </div>
        <div>
          <div className="label">{t("totalPayment")}</div>
          <div className="value">{fmt(result.totalPayment, currency)}</div>
        </div>
      </div>

      {debtToIncome !== null && (
        <p className="field-hint" style={{ marginTop: 12 }}>
          Projected debt-to-income after this loan: <strong style={{ color: debtToIncome > 45 ? "var(--soft-coral)" : "var(--signal-teal)" }}>{debtToIncome}%</strong>
          {debtToIncome > 45 ? " — this is high and will reduce your score." : " — a healthy range."}
        </p>
      )}
    </div>
  );
}
