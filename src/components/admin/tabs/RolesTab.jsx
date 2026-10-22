import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import Toggle from "../../ui/Toggle";

// Permisos simples (sí/no): no tienen un sentido de "otros roles" —
// son sobre lo que el propio rol puede hacer, así que un solo
// interruptor basta.
const SIMPLE_PERMISSIONS = [
  { key: "viewMessages",     icon: "mail",  label: "Ver mensajes de contacto y voluntariado", hint: "Puede abrir la bandeja de mensajes recibidos del sitio público." },
  { key: "crearInformes",    icon: "list",  label: "Llenar su propio informe periódico",      hint: "Puede abrir \"Mi informe\" y enviar su propio reporte." },
  { key: "verEstudiantes",   icon: "users", label: "Ver la lista de estudiantes",             hint: "Puede abrir la pestaña \"Estudiantes\" del panel, en modo solo lectura." },
  { key: "manageBeneficiaries", icon: "users", label: "Crear, editar y eliminar estudiantes", hint: "Además de verlos, puede agregar estudiantes nuevos, editar sus datos o eliminarlos." },
  { key: "gestionarTiposActividad", icon: "settings", label: "Gestionar tipos de actividad", hint: "Puede abrir \"Tipos de actividad\" y crear, editar o quitar categorías y tipos personalizados." },
  { key: "verUsuarios",      icon: "eye",   label: "Ver usuarios y solicitudes de acceso",      hint: "Puede abrir \"Usuarios\" y \"Solicitudes de acceso\" en modo solo lectura, sin crear, editar ni aprobar/rechazar nada." },
  { key: "restablecerCredenciales", icon: "settings", label: "Restablecer contraseñas", hint: "Puede cambiarle la contraseña a cualquier cuenta, sin poder tocar su rol, correo o estado." },
  { key: "manageUsers",      icon: "users", label: "Gestionar usuarios y solicitudes de acceso", hint: "Puede crear, editar (rol, correo, estado), eliminar cuentas y aprobar o rechazar solicitudes — incluye ver y restablecer contraseñas." },
  { key: "gestionarRoles",   icon: "settings", label: "Gestionar roles y permisos", hint: "Puede abrir \"Roles y permisos\": crear roles nuevos, cambiar los permisos de cualquier rol (menos desarrollador) y eliminar cualquier rol que no tenga cuentas ni historial asociado." },
];

// Permisos "escalables": cada uno puede ser Todos / Algunos (una
// lista concreta de otros roles) / Ninguno — controlan qué tan lejos
// ve o actúa un rol sobre los datos de OTROS roles. "Ninguno" nunca
// le quita a nadie ver lo suyo propio: solo bloquea ver/actuar sobre
// lo de los demás.
const SCOPED_PERMISSIONS = [
  { key: "verImagenes",           icon: "image",    label: "Ver imágenes de otros roles",        hint: "En la Galería, además de sus propias fotos, puede ver las de los roles que elijas aquí." },
  { key: "verInformes",           icon: "barChart",  label: "Ver informes de otros roles",        hint: "En \"Informes\", además de lo suyo, puede ver los reportes de los roles que elijas aquí." },
  { key: "verInformesPorUsuario", icon: "list",      label: "Revisar informes de otros roles",    hint: "Puede abrir y leer los informes enviados por los roles que elijas aquí (sin poder aceptarlos/devolverlos)." },
  { key: "aceptarInformes",       icon: "check",     label: "Aceptar o devolver informes de otros roles", hint: "Puede aprobar o rechazar los informes enviados por los roles que elijas aquí, y calificar sus documentos en el editor. Nadie puede aceptar/calificar su propio informe, sin importar este permiso." },
];

// "crearActividades" es distinto a los de arriba: no es sobre otros
// roles, es sobre QUÉ CATEGORÍAS del propio expediente (Atenciones,
// Reuniones, etc.) puede registrar este rol — cada rol tiene las
// suyas, por eso CategoryScopedPermissionRow las trae aparte en vez de
// usar una lista fija como "allRoles".
const CATEGORY_SCOPED_PERMISSIONS = [
  { key: "crearActividades", icon: "image", label: "Registrar actividades", hint: "En \"Actividades\", puede crear registros nuevos de las categorías que elijas aquí (de su propio expediente)." },
];

const SEGMENTS = [
  { value: "all",  label: "Todos" },
  { value: "some", label: "Algunos" },
  { value: "none", label: "Solo lo propio" },
];
const CATEGORY_SEGMENTS = [
  { value: "all",  label: "Todas" },
  { value: "some", label: "Algunas" },
  { value: "none", label: "Ninguna" },
];

function Segmented({ value, onChange, disabled, segments = SEGMENTS }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #e0e0e0", borderRadius: 8, padding: 2, background: "#f7f8fa", opacity: disabled ? .6 : 1 }}>
      {segments.map((s) => {
        const active = value === s.value;
        return (
          <button
            key={s.value}
            disabled={disabled}
            onClick={() => onChange(s.value)}
            style={{
              padding: "5px 11px", borderRadius: 6, border: "none", fontSize: 11.5, fontWeight: 700,
              background: active ? PRIMARY : "transparent", color: active ? "#fff" : "#6b7280",
              cursor: disabled ? "wait" : "pointer", transition: "background .15s, color .15s", whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

const chipStyle = (checked) => ({
  display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20,
  border: `1px solid ${checked ? PRIMARY : "#ddd"}`, background: checked ? `${PRIMARY}12` : "#fff",
  fontSize: 11, color: checked ? PRIMARY : "#6b7280", cursor: "pointer",
});

const scopeState = (value) => (value === true ? "all" : Array.isArray(value) ? "some" : "none");

function ScopedPermissionRow({ role, permKey, icon, label, hint, allRoles, onSave, saving, segments = SEGMENTS, excludeSelf = true, emptyMessage = "No hay otros roles para elegir todavía." }) {
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

  const options = excludeSelf ? allRoles.filter((r) => r.name !== role.name) : allRoles;

  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={13} color="#6b7280" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a1a2e" }}>{label}</p>
          <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#9ca3af" }}>{hint}</p>
        </div>
        {saving && <Icon name="clock" size={12} color="#9ca3af" />}
        <Segmented value={state} disabled={saving} onChange={setState} segments={segments} />
      </div>
      {state === "some" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9, paddingLeft: 38 }}>
          {options.map((r) => (
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
          {options.length === 0 && (
            <span style={{ fontSize: 11, color: "#d1d5db", fontStyle: "italic" }}>{emptyMessage}</span>
          )}
        </div>
      )}
    </div>
  );
}

// "crearActividades": cada rol tiene su propio catálogo de categorías
// de actividad (ver attentionFields.js), así que a diferencia de
// ScopedPermissionRow normal, aquí hay que traerlo primero para ese
// rol en concreto antes de poder mostrar el selector.
function CategoryScopedPermissionRow(props) {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setCategories(null);
    api.getAttentionConfig(props.role.name)
      .then((cfg) => { if (!cancelled) setCategories(cfg.categories.map((c) => ({ name: c.name, label: c.name }))); })
      .catch(() => { if (!cancelled) setCategories([]); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.role.name]);

  if (categories === null) {
    return <p style={{ margin: "10px 0", fontSize: 11.5, color: "#9ca3af" }}>Cargando categorías de actividad...</p>;
  }

  return (
    <ScopedPermissionRow
      {...props}
      allRoles={categories}
      excludeSelf={false}
      segments={CATEGORY_SEGMENTS}
      emptyMessage="Este rol todavía no tiene categorías de actividad configuradas."
    />
  );
}

function SimplePermissionRow({ role, permKey, icon, label, hint, onToggle, saving }) {
  const checked = !!role.permissions?.[permKey];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f5f5f5" }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={13} color="#6b7280" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#1a1a2e" }}>{label}</p>
        <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#9ca3af" }}>{hint}</p>
      </div>
      {saving && <Icon name="clock" size={12} color="#9ca3af" />}
      <Toggle on={checked} onChange={onToggle} sm />
    </div>
  );
}

const roleInputStyle = { width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

export default function RolesTab() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCodePrefix, setNewCodePrefix] = useState("");
  const [newSelfRequestable, setNewSelfRequestable] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [confirmDeleteRole, setConfirmDeleteRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  const [renamingRole, setRenamingRole] = useState(null);
  const [renameLabel, setRenameLabel] = useState("");
  const [renameDescription, setRenameDescription] = useState("");
  const [savingRename, setSavingRename] = useState(false);

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

  const createRole = async () => {
    if (!newLabel.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      await api.createRole({
        label: newLabel.trim(), description: newDescription.trim(),
        codePrefix: newCodePrefix.trim(), selfRequestable: newSelfRequestable,
      });
      setNewLabel(""); setNewDescription(""); setNewCodePrefix(""); setNewSelfRequestable(true);
      setShowCreate(false);
      await load();
    } catch (e) {
      setCreateError(e.message || "No se pudo crear el rol");
    } finally {
      setCreating(false);
    }
  };

  const deleteRole = async (name) => {
    setDeletingRole(name);
    try {
      await api.deleteRole(name);
      setConfirmDeleteRole(null);
      await load();
    } catch (e) {
      setError(e.message || "No se pudo eliminar el rol");
    } finally {
      setDeletingRole(null);
    }
  };

  const saveRename = async (name) => {
    if (!renameLabel.trim()) return;
    setSavingRename(true);
    try {
      const updated = await api.renameRole(name, { label: renameLabel.trim(), description: renameDescription.trim() });
      setRoles((rs) => rs.map((r) => (r.name === name ? updated : r)));
      setRenamingRole(null);
    } catch (e) {
      setError(e.message || "No se pudo cambiar el nombre del rol");
    } finally {
      setSavingRename(false);
    }
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando roles...</p>;

  const editableRoles = roles.filter((r) => r.name !== "desarrollador");
  const visibleRoles = editableRoles.filter((r) =>
    !search.trim() || r.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Roles y permisos</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Elige un rol para ver y cambiar qué puede hacer, y sobre los datos de qué otros roles. El rol desarrollador siempre tiene acceso total y no se edita aquí.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", maxWidth: 320, flex: 1, minWidth: 200 }}>
          <Icon name="users" size={13} color="#9ca3af" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar un rol..."
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", background: showCreate ? PRIMARY : "#fff", color: showCreate ? "#fff" : PRIMARY, border: `1.5px solid ${PRIMARY}`, borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <Icon name="plus" size={13} /> Crear rol nuevo
        </button>
      </div>

      {showCreate && (
        <div style={{ marginBottom: 18, padding: "14px 16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10 }}>
          <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "#1a1a2e" }}>Nuevo rol operativo</p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
            Puede iniciar sesión, registrar actividades (con las categorías compartidas: Atenciones, Reuniones, Formación y recreación, Varios) y llenar su propio informe periódico (con un resumen y conclusión general). Los permisos se ajustan después, como con cualquier otro rol.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nombre del rol (ej. Bibliotecaria)" style={{ ...roleInputStyle, flex: 1, minWidth: 180 }} />
            <input value={newCodePrefix} onChange={(e) => setNewCodePrefix(e.target.value.toUpperCase())} placeholder="Prefijo de informes (opcional, ej. BIB)" maxLength={5} style={{ ...roleInputStyle, width: 220 }} />
          </div>
          <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Descripción breve (opcional)" style={{ ...roleInputStyle, minHeight: 50, resize: "vertical", marginBottom: 8 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6b7280", marginBottom: 10 }}>
            <input type="checkbox" checked={newSelfRequestable} onChange={(e) => setNewSelfRequestable(e.target.checked)} style={{ width: 13, height: 13, cursor: "pointer" }} />
            Disponible en el formulario público "Solicitar acceso"
          </label>
          {createError && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{createError}</p>}
          <button
            onClick={createRole} disabled={creating || !newLabel.trim()}
            style={{ padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: newLabel.trim() ? "pointer" : "default", opacity: newLabel.trim() ? 1 : .5 }}
          >
            {creating ? "Creando..." : "Crear rol"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visibleRoles.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Ningún rol coincide con "{search}".</p>
        )}
        {visibleRoles.map((role) => {
          const isOpen = expanded === role.name;
          const isRenaming = renamingRole === role.name;
          return (
            <div key={role.name} style={{ background: "#fff", border: `1px solid ${isOpen ? PRIMARY : "#e8e8e8"}`, borderRadius: 10, overflow: "hidden", transition: "border-color .15s" }}>
              {isRenaming ? (
                <div style={{ padding: "12px 16px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input value={renameLabel} onChange={(e) => setRenameLabel(e.target.value)} placeholder="Nombre del rol" style={{ ...roleInputStyle, flex: 1, minWidth: 160 }} />
                  <input value={renameDescription} onChange={(e) => setRenameDescription(e.target.value)} placeholder="Descripción breve" style={{ ...roleInputStyle, flex: 2, minWidth: 200 }} />
                  <button onClick={() => saveRename(role.name)} disabled={savingRename || !renameLabel.trim()} style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {savingRename ? "..." : "Guardar"}
                  </button>
                  <button onClick={() => setRenamingRole(null)} style={{ padding: "7px 14px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
                </div>
              ) : (
              <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : role.name)}
                  style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, padding: "14px 16px", background: isOpen ? `${PRIMARY}08` : "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{role.label}</p>
                  <span style={{ fontSize: 11, color: "#9ca3af", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role.description}</span>
                  <Icon name="chevronDown" size={13} color={isOpen ? PRIMARY : "#9ca3af"} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
                </button>
                <button
                  onClick={() => { setRenamingRole(role.name); setRenameLabel(role.label); setRenameDescription(role.description || ""); }}
                  title="Cambiar nombre" style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: "0 10px", flexShrink: 0 }}
                >
                  <Icon name="edit" size={14} />
                </button>
                {role.removable && (
                  confirmDeleteRole === role.name ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "#ef4444" }}>¿Eliminar?</span>
                      <button onClick={() => deleteRole(role.name)} disabled={deletingRole === role.name} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "5px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        {deletingRole === role.name ? "..." : "Sí"}
                      </button>
                      <button onClick={() => setConfirmDeleteRole(null)} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 5, padding: "5px 9px", fontSize: 11, cursor: "pointer", color: "#555" }}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteRole(role.name)} title="Eliminar rol" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: "0 14px", flexShrink: 0 }}>
                      <Icon name="trash" size={14} />
                    </button>
                  )
                )}
              </div>

              {isOpen && (
                <div style={{ padding: "4px 16px 16px" }}>
                  <p style={{ margin: "10px 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#b0b8c8", textTransform: "uppercase" }}>
                    Permisos generales
                  </p>
                  {SIMPLE_PERMISSIONS.map((p) => (
                    <SimplePermissionRow
                      key={p.key}
                      role={role}
                      permKey={p.key}
                      icon={p.icon}
                      label={p.label}
                      hint={p.hint}
                      saving={savingKey === `${role.name}:${p.key}`}
                      onToggle={() => toggleSimple(role, p.key)}
                    />
                  ))}

                  <p style={{ margin: "16px 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#b0b8c8", textTransform: "uppercase" }}>
                    Qué categorías de actividad puede registrar
                  </p>
                  <p style={{ margin: "0 0 4px", fontSize: 10.5, color: "#9ca3af", lineHeight: 1.6 }}>
                    "Ninguna" bloquea por completo "Actividades" y "Galería" para este rol.
                  </p>
                  {CATEGORY_SCOPED_PERMISSIONS.map((p) => (
                    <CategoryScopedPermissionRow
                      key={p.key}
                      role={role}
                      permKey={p.key}
                      icon={p.icon}
                      label={p.label}
                      hint={p.hint}
                      saving={savingKey === `${role.name}:${p.key}`}
                      onSave={(k, v) => save(role, k, v)}
                    />
                  ))}

                  <p style={{ margin: "16px 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#b0b8c8", textTransform: "uppercase" }}>
                    Permisos sobre otros roles
                  </p>
                  <p style={{ margin: "0 0 4px", fontSize: 10.5, color: "#9ca3af", lineHeight: 1.6 }}>
                    "Solo lo propio" nunca le quita a nadie ver lo suyo — solo decide si además puede ver/actuar sobre lo de otros roles.
                  </p>
                  {SCOPED_PERMISSIONS.map((p) => (
                    <ScopedPermissionRow
                      key={p.key}
                      role={role}
                      permKey={p.key}
                      icon={p.icon}
                      label={p.label}
                      hint={p.hint}
                      allRoles={editableRoles}
                      saving={savingKey === `${role.name}:${p.key}`}
                      onSave={(k, v) => save(role, k, v)}
                    />
                  ))}
                </div>
              )}
              </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
