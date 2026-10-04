import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PRIMARY, DARK } from "../../constants/theme";

const STORAGE_KEY = "ca-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() })); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
      background: DARK, color: "#dfe3ea",
      padding: "18px 24px",
      boxShadow: "0 -4px 20px rgba(0,0,0,.25)",
      display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
      gap: 18, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, maxWidth: 640, textAlign: "center" }}>
        Usamos cookies propias para mejorar tu experiencia en este sitio. Al continuar navegando,
        aceptas nuestros{" "}
        <Link to="/terminos-y-condiciones" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Términos y Condiciones</Link>
        {" "}y nuestra{" "}
        <Link to="/politica-de-privacidad" style={{ color: PRIMARY, fontWeight: 700, textDecoration: "none" }}>Política de Privacidad y Cookies</Link>.
      </p>
      <button
        onClick={accept}
        style={{
          padding: "11px 28px", background: PRIMARY, color: "#fff", border: "none",
          borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
          whiteSpace: "nowrap", flexShrink: 0,
        }}
      >
        Aceptar
      </button>
    </div>
  );
}
