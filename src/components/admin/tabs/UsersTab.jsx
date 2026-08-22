import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import PasswordInput from "../../ui/PasswordInput";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
}

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
  border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
};

function CreateUserModal({ roles, onClose, onCreated }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: roles[0]?.name || "" });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setErr("");
    setSaving(true);
    try {
      await api.createUser(form);
      onCreated();
      onClose();
    } catch (e) {
      setErr(e.message || "No se pudo crear el usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 440, maxWidth: "92vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "26px 28px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Nuevo usuario</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>USUARIO</label>
          <input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="ej. maria.lopez" autoComplete="off" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>CORREO (OPCIONAL)</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="correo@ejemplo.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>CONTRASEÑA</label>
          <PasswordInput value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 8 caracteres" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 4 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>ROL</label>
          <select value={form.role} onChange={(e) => set("role", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {roles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
          </select>
        </div>

        {err && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 12 }}>{err}</p>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <button onClick={onClose} style={{ padding: "9px 22px", background: "#fff", color: "#555", border: "1.5px solid #d0d7de", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
          <button onClick={submit} disabled={saving || !form.username || !form.password} style={{ padding: "9px 24px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            {saving ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </>
  );
}

function ResetPasswordRow({ userId, onDone, onCancel }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (pass.length < 8) { setErr("Mínimo 8 caracteres"); return; }
    setSaving(true);
    try {
      await api.updateUser(userId, { password: pass });
      onDone();
    } catch (e) {
      setErr(e.message || "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <PasswordInput autoFocus value={pass} onChange={(e) => { setPass(e.target.value); setErr(""); }} placeholder="Nueva contraseña" title="Se le pedirá cambiarla al iniciar sesión" style={{ ...inputStyle, width: 140, padding: "6px 10px" }} />
      <button onClick={submit} disabled={saving} title="Guardar" style={{ background: "#f0fdf4", color: "#22c55e", border: "1px solid #bbf7d0", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex" }}><Icon name="check" size={13} /></button>
      <button onClick={onCancel} title="Cancelar" style={{ background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex" }}><Icon name="x" size={13} /></button>
      {err && <span style={{ color: "#ef4444", fontSize: 11 }}>{err}</span>}
    </div>
  );
}

export default function UsersTab() {
  const { authUser } = useApp();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [resettingId, setResettingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [rowError, setRowError] = useState({});

  const load = useCallback(async () => {
    setError("");
    try {
      const [u, r] = await Promise.all([api.getUsers(), api.getRoles()]);
      setUsers(u);
      setRoles(r);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isSelf = (u) => u.username === authUser?.user;
  const canGrantDeveloper = authUser?.role === "desarrollador";
  const assignableRoles = roles.filter((r) => r.name !== "desarrollador" || canGrantDeveloper);

  const setErrFor = (id, msg) => setRowError((m) => ({ ...m, [id]: msg }));

  const changeRole = async (u, role) => {
    setErrFor(u.id, "");
    try {
      await api.updateUser(u.id, { role });
      load();
    } catch (e) {
      setErrFor(u.id, e.message || "No se pudo cambiar el rol");
    }
  };

  const toggleActive = async (u) => {
    setErrFor(u.id, "");
    try {
      await api.updateUser(u.id, { active: !u.active });
      load();
    } catch (e) {
      setErrFor(u.id, e.message || "No se pudo actualizar");
    }
  };

  const remove = async (u) => {
    setErrFor(u.id, "");
    try {
      await api.deleteUser(u.id);
      setConfirmDeleteId(null);
      load();
    } catch (e) {
      setErrFor(u.id, e.message || "No se pudo eliminar");
    }
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando usuarios...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Usuarios</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Cuentas con acceso al sistema y su rol</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Icon name="plus" size={14} /> Nuevo usuario
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      {showCreate && (
        <CreateUserModal roles={assignableRoles} onClose={() => setShowCreate(false)} onCreated={load} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {users.map((u) => (
          <div key={u.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: PRIMARY, fontSize: 12, fontWeight: 700 }}>{u.username.slice(0, 2).toUpperCase()}</span>
              </div>

              <div style={{ minWidth: 140 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                  {u.username} {isSelf(u) && <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tú)</span>}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{u.email || "sin correo"}</p>
              </div>

              <select
                value={u.role}
                disabled={isSelf(u) || (u.role === "desarrollador" && !canGrantDeveloper)}
                onChange={(e) => changeRole(u, e.target.value)}
                style={{ padding: "6px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", cursor: isSelf(u) ? "not-allowed" : "pointer" }}
              >
                {roles.filter((r) => r.name === u.role || r.name !== "desarrollador" || canGrantDeveloper).map((r) => (
                  <option key={r.name} value={r.name}>{r.label}</option>
                ))}
              </select>

              <button
                onClick={() => toggleActive(u)}
                disabled={isSelf(u)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 14,
                  border: `1px solid ${u.active ? "#bbf7d0" : "#fecaca"}`,
                  background: u.active ? "#f0fdf4" : "#fef2f2",
                  color: u.active ? "#16a34a" : "#dc2626",
                  fontSize: 11, fontWeight: 700, cursor: isSelf(u) ? "not-allowed" : "pointer",
                }}
              >
                {u.active ? "Activo" : "Desactivado"}
              </button>

              <span style={{ fontSize: 11, color: "#b0b8c8", marginLeft: "auto" }}>
                Último acceso: {formatDate(u.last_login)}
              </span>

              {resettingId === u.id ? (
                <ResetPasswordRow userId={u.id} onDone={() => setResettingId(null)} onCancel={() => setResettingId(null)} />
              ) : (
                <button onClick={() => setResettingId(u.id)} title="Restablecer contraseña" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280" }}>
                  <Icon name="settings" size={13} />
                </button>
              )}

              {!isSelf(u) && (
                confirmDeleteId === u.id ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => remove(u)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirmar</button>
                    <button onClick={() => setConfirmDeleteId(null)} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(u.id)} title="Eliminar" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex" }}>
                    <Icon name="trash" size={13} />
                  </button>
                )
              )}
            </div>
            {rowError[u.id] && <p style={{ color: "#ef4444", fontSize: 11, margin: "8px 0 0" }}>{rowError[u.id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
