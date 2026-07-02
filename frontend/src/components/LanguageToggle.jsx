import { useTranslation } from "../i18n.js";
import { LANGUAGES } from "../i18n.js";

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation();
  return (
    <select
      className="lang-select"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Change interface language"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
