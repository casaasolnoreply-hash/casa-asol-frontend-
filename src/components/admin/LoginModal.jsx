import { useState } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { api } from "../../api/client";
import Field from "../ui/Field";

export default function LoginModal() {
  const { showLogin, setShowLogin, login } = useApp();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState("");

  if (!showLogin) return null;

  const handleLogin = async () => {
    try {
      const data = await api.login(user.trim(), pass);
      login(data.token, { user: data.user, role: data.role });
      setShowLogin(false);
      setUser(""); setPass(""); setErr("");
    } catch (e) {
      setErr(e.message || "Usuario o contraseña incorrectos");
    }
  };

  const close = () => { setShowLogin(false); setErr(""); };

  const btnBase = { width: "100%", padding: "11px", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", width: 360, boxShadow: "0 24px 64px rgba(0,0,0,.35)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <svg width="44" height="44" viewBox="0 0 36 36" style={{ marginBottom: 10 }}>
            <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
            <polygon points="18,4 26,20 10,20" fill={PRIMARY} opacity=".8" />
          </svg>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#222" }}>Panel de Administración</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>Ingresa tus credenciales</p>
        </div>

        <Field label="USUARIO" value={user} onChange={setUser} placeholder="admin" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 4, letterSpacing: .5 }}>CONTRASEÑA</label>
          <input
            type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 13, boxSizing: "border-box" }}
          />
        </div>

        {err && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: "0 0 12px" }}>{err}</p>}

        <button onClick={handleLogin} style={{ ...btnBase, background: PRIMARY, color: "#fff", marginBottom: 8 }}>
          INICIAR SESIÓN
        </button>
        <button onClick={close} style={{ ...btnBase, background: "#fff", color: "#555", border: "1px solid #d0d7de" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
