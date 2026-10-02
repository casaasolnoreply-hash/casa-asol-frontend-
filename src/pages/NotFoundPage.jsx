import { useNavigate } from "react-router-dom";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";

export default function NotFoundPage() {
  const { content } = useApp();
  const siteName = content?.brand?.siteName || "Casa ASOL";
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(145deg, ${DARK} 0%, #16213e 60%, #0f3460 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      <div style={{ marginBottom: 40 }}>
        <svg width="90" height="90" viewBox="0 0 36 36">
          <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="1.8" />
          <polygon points="18,4 26,20 10,20" fill="#fff" opacity=".9" />
          <line x1="10" y1="30" x2="18" y2="18" stroke="#fff" strokeWidth="1.8" />
        </svg>
      </div>

      <h1 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: 1 }}>
        {siteName}
      </h1>

      <div style={{ width: 48, height: 3, background: "#e53935", borderRadius: 2, margin: "0 auto 32px" }} />

      <div style={{
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 16,
        padding: "40px 48px",
        maxWidth: 520,
        width: "100%",
      }}>
        <p style={{ fontSize: 72, fontWeight: 800, color: PRIMARY, margin: "0 0 6px", lineHeight: 1 }}>404</p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
          Página no encontrada
        </h2>

        <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
          La página que buscas no existe o fue movida. Verifica el enlace o vuelve al inicio.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "13px 32px",
            background: PRIMARY,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: .5,
          }}
        >
          Volver al inicio
        </button>
      </div>

      <p style={{ marginTop: 40, color: "rgba(255,255,255,.25)", fontSize: 12 }}>
        &copy; {new Date().getFullYear()} {siteName} · Asociación
      </p>
    </div>
  );
}
