import { useState, useEffect } from "react";
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

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "#6b7280", marginBottom: 7, letterSpacing: .8,
};

export default function RequestAccessPage() {
  const { isAdmin } = useApp();
  const [roles,   setRoles]   = useState([]);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [role,    setRole]    = useState("");
  const [message, setMessage] = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  useEffect(() => {
    api.getPublicRoles()
      .then((list) => { setRoles(list); if (list.length) setRole(list[0].name); })
      .catch(() => setErr("No se pudo cargar la lista de roles. Intenta de nuevo más tarde."));
  }, []);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.requestAccess({ name: name.trim(), email: email.trim(), phone: phone.trim(), requestedRole: role, message: message.trim() });
      setSent(true);
    } catch (err) {
      setErr(err.message || "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* ── LEFT BRANDING PANEL ── */}
      <div style={{
        flex: 1, background: `linear-gradient(145deg, ${DARK} 0%, #16213e 50%, ${PRIMARY} 100%)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 56px", color: "#fff",
      }}>
        <svg width="72" height="72" viewBox="0 0 36 36" style={{ marginBottom: 24 }}>
          <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2" />
          <polygon points="18,4 26,20 10,20" fill="#fff" opacity=".9" />
          <line x1="10" y1="30" x2="18" y2="18" stroke="#fff" strokeWidth="2" />
        </svg>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 10px", letterSpacing: 1, textAlign: "center" }}>
          Solicitar acceso
        </h1>
        <p style={{ fontSize: 14, opacity: .75, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}>
          Cuenta con qué rol trabajas en Casa ASOL y un administrador o desarrollador revisará tu solicitud para darte acceso al sistema.
        </p>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{
        width: 500, background: "#fff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 56px",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon name="check" size={26} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: DARK, margin: "0 0 10px" }}>Solicitud enviada</h2>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 28px" }}>
                Gracias, {name.split(" ")[0] || "colega"}. Tu solicitud quedó pendiente de aprobación. Te avisaremos cuando tengas acceso.
              </p>
              <Link to="/login" style={{ color: PRIMARY, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                ← Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 30 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>Solicitar acceso</h2>
                <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
                  Panel de Administración · Casa ASOL
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>NOMBRE COMPLETO</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ana López" required style={fieldStyle} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>CORREO ELECTRÓNICO</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required style={fieldStyle} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>TELÉFONO (OPCIONAL)</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 5555-5555" style={fieldStyle} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>ROL / PUESTO</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ ...fieldStyle, cursor: "pointer" }}>
                    {roles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
                  </select>
                  {roles.find((r) => r.name === role) && (
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 2px 0" }}>
                      {roles.find((r) => r.name === role).description}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>MENSAJE (OPCIONAL)</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Algo que quieras contarle a quien apruebe tu acceso" style={{ ...fieldStyle, minHeight: 80, resize: "vertical" }} />
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
                  disabled={loading || !roles.length}
                  style={{
                    width: "100%", padding: "14px",
                    background: loading ? "#93c5fd" : PRIMARY,
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 15, fontWeight: 700,
                    cursor: loading ? "wait" : "pointer", letterSpacing: .5,
                  }}
                >
                  {loading ? "Enviando..." : "ENVIAR SOLICITUD"}
                </button>
              </form>

              <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
                <Link to="/login" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none" }}>
                  ← Ya tengo cuenta, iniciar sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
