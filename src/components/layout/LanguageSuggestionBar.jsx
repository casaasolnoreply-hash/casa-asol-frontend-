import { PRIMARY, PRIMARY_DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SUGGEST_BANNER } from "../../i18n/translations";

export default function LanguageSuggestionBar() {
  const { langSuggestion, acceptLangSuggestion, dismissLangSuggestion } = useApp();
  if (!langSuggestion) return null;
  const copy = SUGGEST_BANNER[langSuggestion];
  if (!copy) return null;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
        color: "#fff", padding: "10px 20px", fontSize: 13.5,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
        flexWrap: "wrap", textAlign: "center", position: "relative", zIndex: 150,
      }}
    >
      <span>{copy.text}</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={acceptLangSuggestion}
          style={{ background: "#fff", color: PRIMARY_DARK, border: "none", borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
        >
          {copy.accept}
        </button>
        <button
          onClick={dismissLangSuggestion}
          style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.4)", borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
        >
          {copy.dismiss}
        </button>
      </div>
    </div>
  );
}
