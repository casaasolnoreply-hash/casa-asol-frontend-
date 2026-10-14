import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";

// Permisos simples (sí/no): no tienen un sentido de "otros roles" —
// son sobre lo que el propio rol puede hacer, así que un solo
// interruptor basta.
const SIMPLE_PERMISSIONS = [
  { key: "viewMessages",     label: "Ver mensajes de contacto y voluntariado" },
  { key: "crearInformes",    label: "Puede llenar su propio informe periódico" },
  { key: "verEstudiantes",   label: "Ver la lista de estudiantes" },
  { key: "crearActividades", label: "Puede registrar actividades" },
];

// Permisos "escalables": cada uno puede ser Todos / Algunos (una
// lista concreta de otros roles) / Ninguno — controlan qué tan lejos
// ve o actúa un rol sobre los datos de OTROS roles. "Ninguno" nunca
// le quita a nadie ver lo suyo propio: solo bloquea ver/actuar sobre
// lo de los demás.
const SCOPED_PERMISSIONS = [
  { key: "verImagenes",           label: "Ver imágenes de actividades de otros roles (Galería)" },
  { key: "verInformes",           label: "Ver informes de otros roles" },
  { key: "verInformesPorUsuario", label: "Revisar y aceptar/devolver informes de otros roles" },
];

const selectStyle = { padding: "5px 8px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit", cursor: "pointer", background: "#fff" };
const chipStyle = (checked) => ({
  display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20,
  border: `1px solid ${checked ? PRIMARY : "#ddd"}`, background: checked ? `${PRIMARY}12` : "#fff",
  fontSize: 11, color: checked ? PRIMARY : "#6b7280", cursor: "pointer",
});

const scopeState = (value) => (value === true ? "all" : Array.isArray(value) ? "some" : "none");

function ScopedPermissionRow({ role, permKey, label, allRoles, onSave, saving }) {
  const value = role.permissions?.[permKey];
  const state = scopeState(value);
  const selected = Array.isArray(value) ? value : [];

  const setState = (next) => {
    if (next === "all") onSave(permKey, true);
    else if (next === "none") onSave(permKey, false);
    else onSave(permKey, []);
  };

  const toggleRole = (name) => {
    const next = selected.includes(name) ? selected.filter((r) => r !== name) : [...selected, name];
    onSave(permKey, next);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{label}</span>
        {saving && <Icon name="clock" size={12} color="#9ca3af" />}
        <select value={state} disabled={saving} onChange={(e) => setState(e.target.value)} style={{ ...selectStyle, cursor: saving ? "wait" : "pointer" }}>
          <option value="all">Todos</option>
          <option value="some">Algunos</option>
          <option value="none">Ninguno (solo lo propio)</option>
        </select>
      </div>
      {state === "some" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7, paddingLeft: 4 }}>
          {allRoles.filter((r) => r.name !== role.name).map((r) => (
            <label key={r.name} style={chipStyle(selected.includes(r.name))}>
              <input
                type="checkbox"
                checked={selected.includes(r.name)}
                onChange={() => toggleRole(r.name)}
                style={{ width: 12, height: 12, cursor: "pointer" }}
              />
              {r.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RolesTab() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState(null);
  const [expanded, setExpanded] = useState(null);

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

  const save = async (role, permKey, value) => {
    const savingId = `${role.name}:${permKey}`;
    setSavingKey(savingId);
    const next = { ...role.permissions, [permKey]: value };
    try {
      const updated = await api.updateRolePermissions(role.name, next);
      setRoles((rs) => rs.map((r) => (r.name === role.name ? updated : r)));
    } catch (e) {
      setError(e.message || "No se pudo actualizar el permiso");
    } finally {
      setSavingKey(null);
    }
  };

  const toggleSimple = (role, permKey) => save(role, permKey, !role.permissions?.[permKey]);

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando roles...</p>;

  const editableRoles = roles.filter((r) => r.name !== "desarrollador");

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Roles y permisos</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Decide qué puede ver o hacer cada rol, y sobre los datos de qué otros roles. El rol desarrollador siempre tiene acceso total y no se edita aquí.
        </p>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {editableRoles.map((role) => {
          const isOpen = expanded === role.name;
          return (
            <div key={role.name} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setExpanded(isOpen ? null : role.name)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{role.label}</p>
                <span style={{ fontSize: 11, color: "#9ca3af", flex: 1 }}>{role.description}</span>
                <Icon name="chevronDown" size={13} color="#9ca3af" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  {SIMPLE_PERMISSIONS.map(({ key, label }) => {
                    const checked = !!role.permissions?.[key];
                    const isSaving = savingKey === `${role.name}:${key}`;
                    return (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#374151", cursor: isSaving ? "wait" : "pointer", marginBottom: 10 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isSaving}
                          onChange={() => toggleSimple(role, key)}
                          style={{ width: 15, height: 15, cursor: isSaving ? "wait" : "pointer" }}
                        />
                        {label}
                        {isSaving && <Icon name="clock" size={12} color="#9ca3af" />}
                      </label>
                    );
                  })}

                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
                    {SCOPED_PERMISSIONS.map(({ key, label }) => (
                      <ScopedPermissionRow
                        key={key}
                        role={role}
                        permKey={key}
                        label={label}
                        allRoles={editableRoles}
                        saving={savingKey === `${role.name}:${key}`}
                        onSave={(k, v) => save(role, k, v)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
