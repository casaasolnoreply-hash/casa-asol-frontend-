import { useState } from "react";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import Icon from "../components/ui/Icon";
import PasswordInput from "../components/ui/PasswordInput";

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

// Pantalla obligatoria: aparece en vez del panel cuando la cuenta
// tiene una contraseña puesta por un admin (temporal o reseteada) y
// todavía no la cambió por una propia. El backend también bloquea
// cualquier otra ruta mientras esto siga pendiente (ver middleware/auth.js).
export default function ForcePasswordChangePage() {
  const { authUser, setAuthUser, logout } = useApp();
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (next !== confirm) return setErr("Las contraseñas nuevas no coinciden");
    if (next.length < 8) return setErr("La nueva contraseña debe tener al menos 8 caracteres");

    setLoading(true);
    try {
      const res = await api.updateProfile({ currentPassword: current, newPassword: next });
      if (res.token) sessionStorage.setItem("ca-token", res.token);
      setAuthUser((u) => ({ ...u, mustChangePassword: false }));
    } catch (e) {
      setErr(e.message || "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f8" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.08)", padding: "36px 32px" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Icon name="settings" size={24} color={PRIMARY} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>Cambia tu contraseña</h2>
        <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 24px" }}>
          Hola {authUser?.user}, tu contraseña actual fue asignada por un administrador. Antes de continuar, elige una contraseña propia.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>CONTRASEÑA ACTUAL</label>
            <PasswordInput value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="La que usaste para entrar" required autoFocus autoComplete="current-password" style={fieldStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>NUEVA CONTRASEÑA</label>
            <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} placeholder="Mínimo 8 caracteres" required style={fieldStyle} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>CONFIRMAR CONTRASEÑA</label>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite la nueva contraseña" required style={fieldStyle} />
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
            {loading ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>

        <button
          onClick={logout}
          style={{ width: "100%", marginTop: 14, background: "none", border: "none", color: "#9ca3af", fontSize: 12, cursor: "pointer", padding: 6 }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
