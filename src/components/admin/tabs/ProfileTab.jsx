import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import ImageUpload from "../ImageUpload";
import Icon from "../../ui/Icon";
import PasswordInput from "../../ui/PasswordInput";

const inp = {
  width: "100%", padding: "10px 12px",
  border: "1.5px solid #e0e0e0", borderRadius: 7,
  fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", outline: "none",
};

export default function ProfileTab() {
  const { authUser, setAuthUser } = useApp();

  const [photoUrl,     setPhotoUrl]     = useState(authUser?.photoUrl || "");
  const [passForm,     setPassForm]     = useState({ current: "", next: "", confirm: "" });
  const [savingPass,   setSavingPass]   = useState(false);
  const [savingPhoto,  setSavingPhoto]  = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");

  const flash = (setter, msg) => { setter(msg); setTimeout(() => setter(""), 4000); };
  const upPass = (k, v) => setPassForm((f) => ({ ...f, [k]: v }));
  const initials = (authUser?.user || "?").slice(0, 2).toUpperCase();

  /* ── Cambiar foto ── */
  const handlePhotoUpload = async (url) => {
    setSavingPhoto(true);
    setErrorMsg("");
    try {
      await api.updateProfile({ photoUrl: url });
      setPhotoUrl(url);
      setAuthUser((u) => ({ ...u, photoUrl: url }));
      flash(setSuccessMsg, "Foto de perfil actualizada");
    } catch (e) {
      flash(setErrorMsg, e.message);
    } finally {
      setSavingPhoto(false);
    }
  };

  /* ── Cambiar contraseña ── */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (passForm.next !== passForm.confirm) {
      return flash(setErrorMsg, "Las contraseñas nuevas no coinciden");
    }
    if (passForm.next.length < 8) {
      return flash(setErrorMsg, "La nueva contraseña debe tener al menos 8 caracteres");
    }

    setSavingPass(true);
    try {
      const res = await api.updateProfile({ currentPassword: passForm.current, newPassword: passForm.next });
      if (res.token) sessionStorage.setItem("ca-token", res.token);
      setAuthUser((u) => ({ ...u, mustChangePassword: false }));
      setPassForm({ current: "", next: "", confirm: "" });
      flash(setSuccessMsg, "Contraseña actualizada correctamente");
    } catch (e) {
      flash(setErrorMsg, e.message);
    } finally {
      setSavingPass(false);
    }
  };

  const ROLE_LABEL = { admin: "Administrador", editor: "Editor", viewer: "Solo lectura" };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Mi perfil</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Actualiza tu foto y contraseña de acceso</p>
      </div>

      {/* ── Tarjeta de perfil ── */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "28px", marginBottom: 20 }}>
        {/* Avatar + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ flexShrink: 0 }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `3px solid ${PRIMARY}` }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${PRIMARY}40` }}>
                <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{initials}</span>
              </div>
            )}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 17, color: "#1a1a2e" }}>{authUser?.user}</p>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: `${PRIMARY}15`, color: PRIMARY }}>
              {ROLE_LABEL[authUser?.role] || authUser?.role}
            </span>
            {authUser?.email && (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>{authUser.email}</p>
            )}
          </div>
        </div>

        {/* Subir foto */}
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Foto de perfil</p>
        {savingPhoto && <p style={{ fontSize: 12, color: PRIMARY, margin: "0 0 8px" }}>Guardando foto...</p>}
        <ImageUpload label="" currentUrl={photoUrl} onUpload={handlePhotoUpload} />
      </div>

      {/* ── Cambiar contraseña ── */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "28px" }}>
        <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Cambiar contraseña</p>

        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={14} color="#22c55e" />
            <span style={{ fontSize: 13, color: "#15803d" }}>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="warning" size={14} color="#ef4444" />
            <span style={{ fontSize: 13, color: "#ef4444" }}>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          {[
            { key: "current", label: "CONTRASEÑA ACTUAL",    placeholder: "••••••••",                    autoComplete: "current-password" },
            { key: "next",    label: "NUEVA CONTRASEÑA",     placeholder: "Mínimo 8 caracteres" },
            { key: "confirm", label: "CONFIRMAR CONTRASEÑA", placeholder: "Repite la nueva contraseña" },
          ].map(({ key, label, placeholder, autoComplete }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 6, letterSpacing: .8 }}>
                {label}
              </label>
              <PasswordInput
                value={passForm[key]}
                onChange={(e) => upPass(key, e.target.value)}
                placeholder={placeholder}
                required
                {...(autoComplete && { autoComplete })}
                style={inp}
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e)  => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={savingPass}
            style={{ width: "100%", padding: "11px", background: savingPass ? "#93c5fd" : PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: savingPass ? "wait" : "pointer", marginTop: 4 }}
          >
            {savingPass ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
