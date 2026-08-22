import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { api } from "../../api/client";
import Icon from "../ui/Icon";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Botón "Continuar con Google". No se renderiza si no hay
// VITE_GOOGLE_CLIENT_ID configurado (integración lista pero inactiva
// hasta que se cree el OAuth Client ID en Google Cloud Console).
export default function GoogleLoginButton() {
  const { login } = useApp();
  const navigate = useNavigate();
  const btnRef = useRef(null);

  const [roles,     setRoles]     = useState([]);
  const [needsRole, setNeedsRole] = useState(null); // { name, email, picture, idToken }
  const [role,      setRole]      = useState("");
  const [pendingMsg, setPendingMsg] = useState("");
  const [err,        setErr]        = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const handleCredential = async (response) => {
      setErr("");
      try {
        const data = await api.loginWithGoogle({ idToken: response.credential });
        if (data.token) {
          login(data.token, { user: data.user, role: data.role, photoUrl: data.photoUrl, mustChangePassword: data.mustChangePassword, permissions: data.permissions });
          navigate("/admin");
        } else if (data.status === "needs_role") {
          const list = await api.getPublicRoles();
          setRoles(list);
          setRole(list[0]?.name || "");
          setNeedsRole({ ...data, idToken: response.credential });
        }
      } catch (e) {
        setErr(e.message || "No se pudo iniciar sesión con Google.");
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
      window.google.accounts.id.renderButton(btnRef.current, { theme: "outline", size: "large", width: 320, text: "continue_with" });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [login, navigate]);

  if (!CLIENT_ID) return null;

  const submitRoleRequest = async () => {
    setSubmitting(true);
    setErr("");
    try {
      const data = await api.loginWithGoogle({ idToken: needsRole.idToken, requestedRole: role });
      setPendingMsg(data.message || "Tu solicitud fue enviada.");
      setNeedsRole(null);
    } catch (e) {
      setErr(e.message || "No se pudo enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {pendingMsg ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={14} color="#22c55e" /> {pendingMsg}
          </p>
        </div>
      ) : needsRole ? (
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151" }}>
            No encontramos una cuenta para <strong>{needsRole.email}</strong>. Elige tu rol y enviaremos tu solicitud de acceso.
          </p>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: 7, fontSize: 13, marginBottom: 10, fontFamily: "inherit" }}>
            {roles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
          </select>
          <button
            onClick={submitRoleRequest}
            disabled={submitting || !role}
            style={{ width: "100%", padding: "10px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: submitting ? "wait" : "pointer" }}
          >
            {submitting ? "Enviando..." : "Solicitar acceso"}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>O</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>
          <div ref={btnRef} style={{ display: "flex", justifyContent: "center" }} />
        </>
      )}
      {err && (
        <p style={{ color: "#ef4444", fontSize: 12, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="warning" size={13} color="#ef4444" /> {err}
        </p>
      )}
    </div>
  );
}
