import { useEffect, useState } from "react";
import { useTranslation } from "../i18n.js";
import { apiUrl } from "../api.js";

export default function BusinessProfileForm({ value, onChange }) {
  const { t } = useTranslation();
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetch(apiUrl("/api/locations/industries"))
      .then((r) => r.json())
      .then(setIndustries)
      .catch(() => setIndustries([]));
  }, []);

  const field = (key, updates) => onChange({ ...value, ...updates });

  return (
    <div>
      <h3 style={{ marginBottom: 4 }}>Business details</h3>
      <p className="field-hint" style={{ marginBottom: 18 }}>
        Tell us about the business so we can weigh stability and debt load.
      </p>
      <div className="form-grid">
        <div className="field">
          <label>{t("businessName")}</label>
          <input
            type="text"
            value={value.businessName}
            onChange={(e) => field("businessName", { businessName: e.target.value })}
            placeholder="e.g. Sharma General Store"
          />
        </div>
        <div className="field">
          <label>{t("industry")}</label>
          <select
            value={value.industry}
            onChange={(e) => field("industry", { industry: e.target.value })}
          >
            <option value="">—</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>{t("yearsOperating")}</label>
          <input
            type="number"
            min="0"
            value={value.yearsOperating}
            onChange={(e) => field("yearsOperating", { yearsOperating: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t("employeeCount")}</label>
          <input
            type="number"
            min="0"
            value={value.employeeCount}
            onChange={(e) => field("employeeCount", { employeeCount: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t("monthlyRevenue")}</label>
          <input
            type="number"
            min="0"
            value={value.monthlyRevenue}
            onChange={(e) => field("monthlyRevenue", { monthlyRevenue: Number(e.target.value) })}
          />
        </div>
      </div>

      <h3 style={{ margin: "28px 0 4px" }}>Alternative data (in place of bank history)</h3>
      <p className="field-hint" style={{ marginBottom: 18 }}>
        This is the data traditional lenders ignore — but it's often a better signal for a
        cash-based small business.
      </p>
      <div className="form-grid">
        <div className="field">
          <label>{t("monthlyTxnVolume")}</label>
          <input
            type="number"
            min="0"
            value={value.monthlyTransactionVolume}
            onChange={(e) => field("monthlyTransactionVolume", { monthlyTransactionVolume: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t("txnFrequency")}</label>
          <input
            type="number"
            min="0"
            max="50"
            value={value.transactionFrequencyPerWeek}
            onChange={(e) => field("transactionFrequencyPerWeek", { transactionFrequencyPerWeek: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t("missedWeeks")}</label>
          <input
            type="number"
            min="0"
            max="26"
            value={value.missedWeeksLast6Months}
            onChange={(e) => field("missedWeeksLast6Months", { missedWeeksLast6Months: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t("utilityOnTime")}</label>
          <input
            type="number"
            min="0"
            max="100"
            value={value.onTimePaymentRatePct}
            onChange={(e) => field("onTimePaymentRatePct", { onTimePaymentRatePct: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
