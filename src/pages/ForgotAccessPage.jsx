import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import Icon from "../components/ui/Icon";

const fieldStyle = {
  width: "100%", padding: "12px 14px",
  border: "1.5px solid #e0e0e0", borderRadius: 8,
  fontSize: 14, boxSizing: "border-box",
  outline: "none", fontFamily: "inherit",
};

export default function ForgotAccessPage() {
  const { isAdmin } = useApp();
  const [email,   setEmail]   = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setErr(err.message || "No se pudo procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f8" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.08)", padding: "36px 32px" }}>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="check" size={26} color="#22c55e" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 10px" }}>Revisa tu correo</h2>
            <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 26px" }}>
              Si existe una cuenta activa con ese correo, te enviamos tu usuario y una contraseña temporal para entrar de nuevo.
            </p>
            <Link to="/login" style={{ color: PRIMARY, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              ← Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Icon name="mail" size={22} color={PRIMARY} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>¿Olvidaste tu usuario o contraseña?</h2>
            <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 24px" }}>
              Escribe el correo con el que te registraron en el sistema. Te vamos a enviar ahí tu usuario y una contraseña temporal nueva.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 7, letterSpacing: .8 }}>
                  CORREO REGISTRADO
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  autoFocus
                  style={fieldStyle}
                />
              </div>

              {err && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "11px 14px", marginBottom: 18 }}>
                  <p style={{ color: "#ef4444", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="warning" size={14} color="#ef4444" /> {err}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "13px", background: loading ? "#93c5fd" : PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer" }}
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </button>
            </form>

            <div style={{ marginTop: 22, textAlign: "center" }}>
              <Link to="/login" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none" }}>
                ← Volver a iniciar sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
