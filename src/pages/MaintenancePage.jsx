import { useState } from "react";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";

export default function MaintenancePage() {
  const { content } = useApp();
  const siteName = content?.brand?.siteName || "Casa ASOL";
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    setTimeout(() => window.location.reload(), 800);
  };

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
      {/* Logo animado */}
      <div style={{ marginBottom: 40, animation: "pulse 3s ease-in-out infinite" }}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: .7; transform: scale(.96); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
        <svg width="90" height="90" viewBox="0 0 36 36">
          <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="1.8" />
          <polygon points="18,4 26,20 10,20" fill="#fff" opacity=".9" />
          <line x1="10" y1="30" x2="18" y2="18" stroke="#fff" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Título */}
      <h1 style={{
        fontSize: 38, fontWeight: 800, color: "#fff",
        margin: "0 0 12px", letterSpacing: 1,
      }}>
        {siteName}
      </h1>

      {/* Línea separadora */}
      <div style={{ width: 48, height: 3, background: "#e53935", borderRadius: 2, margin: "0 auto 32px" }} />

      {/* Mensaje principal */}
      <div style={{
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 16,
        padding: "40px 48px",
        maxWidth: 520,
        width: "100%",
      }}>
        {/* Ícono de herramientas */}
        <div style={{ marginBottom: 24 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ opacity: .8 }}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
          Lo sentimos, página en mantenimiento
        </h2>

        <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15, lineHeight: 1.7, margin: "0 0 10px" }}>
          Estamos realizando mejoras en el sistema para brindarte una mejor experiencia.
        </p>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.6, margin: "0 0 32px" }}>
          El sitio estará disponible nuevamente en breve. Gracias por tu comprensión.
        </p>

        {/* Botón de reintentar */}
        <button
          onClick={retry}
          disabled={retrying}
          style={{
            padding: "13px 32px",
            background: retrying ? "rgba(255,255,255,.12)" : PRIMARY,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: retrying ? "wait" : "pointer",
            letterSpacing: .5,
            transition: "background .2s",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {retrying ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.22-8.56" stroke="#fff" strokeWidth="2.5"
                  strokeLinecap="round" />
              </svg>
              Verificando...
            </>
          ) : "Reintentar conexión"}
        </button>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 40, color: "rgba(255,255,255,.25)", fontSize: 12 }}>
        &copy; {new Date().getFullYear()} {siteName} · Asociación
      </p>
    </div>
  );
}
