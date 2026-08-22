import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";

// Solo se muestran los permisos que de verdad controlan algo hoy.
// Cuando se conecte otra función a un permiso (manageContent,
// manageSettings, manageUsers...), agrégala aquí y aparece sola en
// esta pantalla — el backend ya acepta esas llaves.
const PERMISSION_TOGGLES = [
  { key: "viewMessages", label: "Ver mensajes de contacto y voluntariado" },
];

export default function RolesTab() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setRoles(await api.getRoles());
    } catch (e) {
      setError(e.message || "No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (role, permKey) => {
    const savingId = `${role.name}:${permKey}`;
    setSavingKey(savingId);
    const next = { ...role.permissions, [permKey]: !role.permissions?.[permKey] };
    try {
      const updated = await api.updateRolePermissions(role.name, next);
      setRoles((rs) => rs.map((r) => (r.name === role.name ? updated : r)));
    } catch (e) {
      setError(e.message || "No se pudo actualizar el permiso");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando roles...</p>;

  const editableRoles = roles.filter((r) => r.name !== "desarrollador");

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Roles y permisos</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Decide qué puede ver o hacer cada rol. El rol desarrollador siempre tiene acceso total y no se edita aquí.
        </p>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {editableRoles.map((role) => (
          <div key={role.name} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: PERMISSION_TOGGLES.length ? 10 : 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{role.label}</p>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{role.description}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {PERMISSION_TOGGLES.map(({ key, label }) => {
                const checked = !!role.permissions?.[key];
                const isSaving = savingKey === `${role.name}:${key}`;
                return (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#374151", cursor: isSaving ? "wait" : "pointer" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isSaving}
                      onChange={() => toggle(role, key)}
                      style={{ width: 15, height: 15, cursor: isSaving ? "wait" : "pointer" }}
                    />
                    {label}
                    {isSaving && <Icon name="clock" size={12} color="#9ca3af" />}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
