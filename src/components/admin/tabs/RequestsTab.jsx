import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import PasswordInput from "../../ui/PasswordInput";

const SOURCE_LABEL = { system: "Formulario", google: "Google" };

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
}

function ApproveForm({ request, onDone, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  const submit = async () => {
    setSaving(true);
    setErr("");
    try {
      const body = {};
      if (username.trim()) body.username = username.trim();
      if (password) body.password = password;
      const res = await api.approveRequest(request.id, body);
      setResult(res);
    } catch (e) {
      setErr(e.message || "No se pudo aprobar la solicitud");
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 14, marginTop: 10 }}>
        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#166534" }}>
          Cuenta creada: {result.user.username}
        </p>
        {result.generatedPassword ? (
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#166534" }}>
            Se intentó enviar por correo automáticamente. Contraseña temporal (guárdala por si el correo no llega): <code style={{ background: "#dcfce7", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{result.generatedPassword}</code>
            <br />Se le va a pedir cambiarla al entrar por primera vez.
          </p>
        ) : (
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#166534" }}>
            Se intentó enviar la contraseña que le pusiste por correo automáticamente.
          </p>
        )}
        <button onClick={onDone} style={{ padding: "7px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          Listo
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 14, marginTop: 10 }}>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280" }}>
        Déjalos vacíos para generar usuario y contraseña automáticamente.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario (opcional)" autoComplete="off" name="new-username-no-autofill" style={{ flex: 1, minWidth: 140, padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }} />
        <div style={{ flex: 1, minWidth: 140 }}>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña (opcional)" style={{ padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }} />
        </div>
      </div>
      {err && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{err}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} disabled={saving} style={{ padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
          {saving ? "Creando..." : "Confirmar y crear cuenta"}
        </button>
        <button onClick={onCancel} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [rowError, setRowError] = useState({});

  const load = useCallback(async () => {
    setError("");
    try {
      setRequests(await api.getUserRequests());
    } catch (e) {
      setError(e.message || "No se pudieron cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const reject = async (req) => {
    setRowError((m) => ({ ...m, [req.id]: "" }));
    try {
      await api.rejectRequest(req.id);
      load();
    } catch (e) {
      setRowError((m) => ({ ...m, [req.id]: e.message || "No se pudo rechazar" }));
    }
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando solicitudes...</p>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Solicitudes de acceso</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Cuentas pendientes de aprobación (formulario público y Google)</p>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      {requests.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="users" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>No hay solicitudes pendientes.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {requests.map((req) => (
          <div key={req.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{req.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{req.email}{req.phone ? ` · ${req.phone}` : ""}</p>
                {req.message && (
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#374151", background: "#f9fafb", borderRadius: 6, padding: "8px 10px" }}>{req.message}</p>
                )}
              </div>

              <span style={{ background: `${PRIMARY}12`, color: PRIMARY, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
                {req.requested_role}
              </span>
              <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, padding: "3px 8px", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                {SOURCE_LABEL[req.source] || req.source}
              </span>

              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                {approvingId !== req.id && (
                  <>
                    <button onClick={() => setApprovingId(req.id)} style={{ padding: "7px 14px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Aprobar
                    </button>
                    <button onClick={() => reject(req)} style={{ padding: "7px 14px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>

            <p style={{ margin: "10px 0 0", fontSize: 10, color: "#b0b8c8" }}>Solicitado el {formatDate(req.created_at)}</p>

            {rowError[req.id] && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{rowError[req.id]}</p>}

            {approvingId === req.id && (
              <ApproveForm request={req} onCancel={() => setApprovingId(null)} onDone={() => { setApprovingId(null); load(); }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
