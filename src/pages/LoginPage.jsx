import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import Icon from "../components/ui/Icon";
import PasswordInput from "../components/ui/PasswordInput";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

const FEATURES = [
  { icon: "edit",    text: "Edita todo el contenido del sitio" },
  { icon: "compass", text: "Gestiona pestañas y navegación" },
  { icon: "image",   text: "Sube imágenes via Cloudinary" },
  { icon: "eye",     text: "Controla qué secciones se muestran" },
  { icon: "list",    text: "Administra equipo, programa y stats" },
];

export default function LoginPage() {
  const { isAdmin, login, content } = useApp();
  const logoUrl = content?.brand?.logoUrl;
  const navigate = useNavigate();
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await api.login(user.trim(), pass);
      login(data.token, { user: data.user, role: data.role, photoUrl: data.photoUrl, mustChangePassword: data.mustChangePassword, permissions: data.permissions });
      navigate("/admin");
    } catch (err) {
      setErr(err.message || "Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid #e0e0e0", borderRadius: 8,
    fontSize: 14, boxSizing: "border-box",
    outline: "none", transition: "border-color .2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── LEFT BRANDING PANEL ── */}
      <div style={{
        flex: 1, background: `linear-gradient(145deg, ${DARK} 0%, #16213e 50%, ${PRIMARY} 100%)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 56px", color: "#fff",
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 24, borderRadius: 10, background: "rgba(255,255,255,.08)", padding: 6 }} />
        ) : (
          <svg width="72" height="72" viewBox="0 0 36 36" style={{ marginBottom: 24 }}>
            <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2" />
            <polygon points="18,4 26,20 10,20" fill="#fff" opacity=".9" />
            <line x1="10" y1="30" x2="18" y2="18" stroke="#fff" strokeWidth="2" />
          </svg>
        )}

        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 10px", letterSpacing: 2, textAlign: "center" }}>
          Casa ASOL
        </h1>
        <p style={{ fontSize: 14, opacity: .7, textAlign: "center", marginBottom: 52, lineHeight: 1.6 }}>
          Sistema de Administración Web
        </p>

        <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 18 }}>
          {FEATURES.map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "14px 18px" }}>
              <Icon name={icon} size={20} color="#fff" />
              <span style={{ fontSize: 13, opacity: .9, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT LOGIN PANEL ── */}
      <div style={{
        width: 500, background: "#fff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 56px",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>
              Iniciar Sesión
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
              Panel de Administración · Casa ASOL
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 7, letterSpacing: .8 }}>
                USUARIO
              </label>
              <input
                value={user}
                onChange={(e) => { setUser(e.target.value); setErr(""); }}
                placeholder="admin"
                autoFocus
                style={fieldStyle}
                onFocus={(e)  => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e)   => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: .8 }}>
                  CONTRASEÑA
                </label>
                <Link to="/olvide-mi-acceso" style={{ fontSize: 11, color: PRIMARY, textDecoration: "none", fontWeight: 600 }}>
                  ¿Olvidaste tu acceso?
                </Link>
              </div>
              <PasswordInput
                value={pass}
                onChange={(e) => { setPass(e.target.value); setErr(""); }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={fieldStyle}
                onFocus={(e)  => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e)   => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>

            {err && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "11px 14px", marginBottom: 20 }}>
                <p style={{ color: "#ef4444", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="warning" size={14} color="#ef4444" /> {err}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#93c5fd" : PRIMARY,
                color: "#fff", border: "none", borderRadius: 8,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                transition: "background .2s", letterSpacing: .5,
              }}
            >
              {loading ? "Verificando..." : "INGRESAR AL PANEL"}
            </button>
          </form>

          <GoogleLoginButton />

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link to="/solicitar-acceso" style={{ color: PRIMARY, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              ¿No tienes cuenta? Solicitar acceso
            </Link>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
            <Link to="/" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ← Volver al sitio web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
