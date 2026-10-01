import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DARK, PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { UI, LANGUAGES, LANGUAGE_NAMES, detectBrowserLanguage } from "../../i18n/translations";
import Icon from "../ui/Icon";

function LanguageDropdown({ language, setLanguage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // El encabezado "Escoge tu idioma" se muestra en el idioma del navegador
  // del visitante (no en el idioma activo del sitio), para que quien no
  // hable español de entrada todavía pueda leer la instrucción.
  const headerLang = detectBrowserLanguage() || "es";
  const headerText = UI[headerLang].common.chooseLanguage;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: PRIMARY,
          border: "none", borderRadius: 999, padding: "7px 14px",
          color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 14px ${PRIMARY}80`,
        }}
      >
        <Icon name="globe" size={14} color="#fff" />
        {LANGUAGE_NAMES[language]}
        <Icon name="chevronDown" size={11} color="#fff" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 190, maxHeight: 260, overflowY: "auto",
            background: "#fff", borderRadius: 14, boxShadow: "0 18px 40px rgba(0,0,0,.3)", border: "1px solid #eef2f7",
            padding: 8, zIndex: 300,
          }}
        >
          <p style={{ margin: "2px 8px 8px", fontSize: 11, fontWeight: 700, color: "#8a93a3", letterSpacing: .4, textTransform: "uppercase" }}>
            {headerText}
          </p>
          {LANGUAGES.map((lng) => (
            <button
              key={lng}
              onClick={() => { setLanguage(lng); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%",
                textAlign: "left", padding: "10px 12px", background: language === lng ? "#eaf3fd" : "none", border: "none", borderRadius: 8,
                color: "#1a1a2e", fontSize: 14, fontWeight: language === lng ? 700 : 500, cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#eaf3fd"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = language === lng ? "#eaf3fd" : "none"; }}
            >
              {LANGUAGE_NAMES[lng]}
              {language === lng && <Icon name="check" size={14} color={PRIMARY} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const { content, isAdmin, saving, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const t = UI[language];

  const { topbar } = content;

  const socialLinks = [
    { key: "facebook",  icon: "facebook"  },
    { key: "linkedin",  icon: "linkedin"  },
    { key: "instagram", icon: "instagram" },
  ];

  const iconBox = { width: 26, height: 26, background: "rgba(30,136,229,.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

  return (
    <div style={{ background: DARK, padding: "8px 0", fontSize: 12.5, color: "#c6ceda" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {topbar.locationUrl ? (
            <a href={topbar.locationUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <span><strong>{t.topbar.direccion}</strong> {topbar.address}</span>
            </a>
          ) : (
            <span><strong>{t.topbar.direccion}</strong> {topbar.address}</span>
          )}
          <span><strong>{t.topbar.telefono}</strong> {topbar.phone}</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <LanguageDropdown language={language} setLanguage={setLanguage} />

          {socialLinks.map(({ key, icon }) => {
            const url = topbar[key];
            const box = <span style={iconBox}><Icon name={icon} size={13} color="#cfe4fb" /></span>;
            return url ? (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                {box}
              </a>
            ) : (
              <span key={key} style={iconBox}><Icon name={icon} size={13} color="#5b6472" /></span>
            );
          })}

          {isAdmin && saving && (
            <span style={{ fontSize: 11, color: "#8a93a3", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="refresh" size={11} color="#8a93a3" /> {t.topbar.guardando}
            </span>
          )}

          {isAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              <Icon name="settings" size={13} color="#fff" /> {t.topbar.admin}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "transparent", color: "#c6ceda", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              <Icon name="logout" size={13} color="#c6ceda" /> {t.topbar.login}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
