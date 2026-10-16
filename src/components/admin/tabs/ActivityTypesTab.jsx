import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import { hasScope } from "../../../utils/permissions";

const inputStyle = {
  width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit",
};
const selectStyle = { padding: "7px 12px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff" };

// Desglose de cuántas actividades ya existen por tipo, para el rol elegido
// — reusa los mismos endpoints que "Actividades" (config + lista completa)
// en vez de duplicar lógica de conteo en el backend.
function ActivityBreakdown({ customTypes }) {
  const { authUser } = useApp();
  const canSeeAllRoles = hasScope(authUser.permissions, "verImagenes");

  const [availableRoles, setAvailableRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [config, setConfig] = useState(null);
  const [attentions, setAttentions] = useState(null);
  const [error, setError] = useState("");

  const effectiveRole = canSeeAllRoles ? selectedRole : authUser.role;

  useEffect(() => {
    if (!canSeeAllRoles) return;
    api.getAvailableAttentionRoles()
      .then((list) => { setAvailableRoles(list); setSelectedRole((r) => r || list[0]?.name || null); })
      .catch((e) => setError(e.message || "No se pudieron cargar los roles"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!effectiveRole) return;
    setError("");
    Promise.all([
      api.getAttentionConfig(effectiveRole),
      api.getAttentions(canSeeAllRoles ? { role: effectiveRole } : {}),
    ])
      .then(([cfg, list]) => { setConfig(cfg); setAttentions(list); })
      .catch((e) => setError(e.message || "No se pudo cargar el desglose"));
    // Se vuelve a cargar también cuando `customTypes` cambia (agregar,
    // editar o quitar un tipo abajo) para que el desglose de arriba no
    // se quede con la foto vieja.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveRole, canSeeAllRoles, customTypes]);

  const customKeys = new Set(customTypes.map((t) => t.key));
  const countByType = (attentions || []).reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {});
  const totalCount = (attentions || []).length;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Actividades registradas</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Cuántos registros existen por cada tipo, incluyendo los del sistema.</p>
        </div>
        {canSeeAllRoles && availableRoles && (
          <select value={selectedRole || ""} onChange={(e) => setSelectedRole(e.target.value)} style={selectStyle}>
            {availableRoles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
          </select>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {!config || !attentions ? (
        <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p>
      ) : (
        <>
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b7280" }}>
            <strong style={{ color: "#1a1a2e" }}>{totalCount}</strong> {totalCount === 1 ? "registro" : "registros"} en total para este rol.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {config.categories.map((cat, catIndex) => (
              <div key={`${cat.name}-${catIndex}`} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12.5, fontWeight: 700, color: "#1a1a2e" }}>{cat.name}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {cat.types.map((t) => (
                    <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                      <Icon name="barChart" size={12} color="#9ca3af" />
                      <span style={{ flex: 1, color: "#374151" }}>{t.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: customKeys.has(t.key) ? PRIMARY : "#9ca3af", background: customKeys.has(t.key) ? `${PRIMARY}12` : "#f3f4f6", padding: "2px 7px", borderRadius: 10 }}>
                        {customKeys.has(t.key) ? "personalizado" : "del sistema"}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a2e", minWidth: 70, textAlign: "right" }}>
                        {countByType[t.key] || 0} {countByType[t.key] === 1 ? "registro" : "registros"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Convierte una etiqueta ("Taller de cocina") en una llave técnica
// válida ("taller_de_cocina") — el admin solo escribe el nombre, la
// llave se genera sola.
const slugify = (text) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const emptyForm = { categoryName: "", label: "", requiresBeneficiary: false };

export default function ActivityTypesTab() {
  const [types, setTypes] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [newForm, setNewForm] = useState(emptyForm);
  const [editingKey, setEditingKey] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const [savedTypes, names] = await Promise.all([
        api.getCustomActivityTypes(),
        api.getActivityCategoryNames(),
      ]);
      setTypes(savedTypes);
      setCategoryNames(names);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los tipos de actividad");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (next) => {
    setSaving(true);
    setError("");
    try {
      const saved = await api.updateCustomActivityTypes(next);
      setTypes(saved);
      if (!categoryNames.length) await load(); // primera categoría nueva: refresca sugerencias
      return true;
    } catch (e) {
      setError(e.message || "No se pudo guardar");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addType = async () => {
    const categoryName = newForm.categoryName.trim();
    const label = newForm.label.trim();
    if (!categoryName || !label) return;
    const key = slugify(label);
    if (!key) return;
    const ok = await save([...types, { categoryName, key, label, requiresBeneficiary: !!newForm.requiresBeneficiary }]);
    if (ok) {
      setNewForm(emptyForm);
      if (!categoryNames.includes(categoryName)) setCategoryNames((n) => [...n, categoryName]);
    }
  };

  const startEdit = (t) => {
    setEditingKey(t.key);
    setEditForm({ categoryName: t.categoryName, label: t.label, requiresBeneficiary: t.requiresBeneficiary });
  };

  const saveEdit = async (key) => {
    const categoryName = editForm.categoryName.trim();
    const label = editForm.label.trim();
    if (!categoryName || !label) return;
    const next = types.map((t) => t.key === key ? { ...t, categoryName, label, requiresBeneficiary: !!editForm.requiresBeneficiary } : t);
    const ok = await save(next);
    if (ok) setEditingKey(null);
  };

  const removeType = async (key) => {
    const ok = await save(types.filter((t) => t.key !== key));
    if (ok) setConfirmDeleteKey(null);
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p>;

  const grouped = types.reduce((acc, t) => {
    (acc[t.categoryName] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <ActivityBreakdown customTypes={types} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Tus tipos de actividad personalizados</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Puedes editar o quitar los que agregaste aquí. Si al agregar uno usas el nombre de una categoría que ya existe (del sistema o tuya), se suma a esa misma categoría en vez de crear una nueva.
        </p>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}
      {saving && <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={12} color="#9ca3af" /> Guardando...</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
        {Object.entries(grouped).map(([categoryName, catTypes]) => (
          <div key={categoryName} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{categoryName}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {catTypes.map((t) => (
                editingKey === t.key ? (
                  <div key={t.key} style={{ padding: "10px", background: "#f9fafb", border: `1.5px solid ${PRIMARY}`, borderRadius: 7, display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={editForm.label}
                      onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
                      placeholder="Nombre del tipo"
                      style={inputStyle}
                    />
                    <input
                      value={editForm.categoryName}
                      onChange={(e) => setEditForm((f) => ({ ...f, categoryName: e.target.value }))}
                      placeholder="Categoría"
                      list="activity-category-names"
                      style={inputStyle}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6b7280" }}>
                        <input
                          type="checkbox"
                          checked={!!editForm.requiresBeneficiary}
                          onChange={(e) => setEditForm((f) => ({ ...f, requiresBeneficiary: e.target.checked }))}
                          style={{ width: 13, height: 13, cursor: "pointer" }}
                        />
                        Pide elegir integrantes
                      </label>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditingKey(null)} style={{ padding: "6px 12px", background: "#fff", color: "#555", border: "1.5px solid #d0d7de", borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                        <button onClick={() => saveEdit(t.key)} style={{ padding: "6px 12px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#f9fafb", border: "1px solid #eef0f2", borderRadius: 7 }}>
                    <Icon name="list" size={12} color="#9ca3af" />
                    <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{t.label}</span>
                    {t.requiresBeneficiary && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: PRIMARY, background: `${PRIMARY}12`, padding: "2px 7px", borderRadius: 10 }}>pide integrantes</span>
                    )}
                    {confirmDeleteKey === t.key ? (
                      <>
                        <span style={{ fontSize: 11, color: "#ef4444" }}>¿Quitar?</span>
                        <button onClick={() => removeType(t.key)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "4px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Sí</button>
                        <button onClick={() => setConfirmDeleteKey(null)} style={{ background: "none", border: "1px solid #d0d7de", borderRadius: 5, padding: "4px 9px", fontSize: 11, cursor: "pointer", color: "#555" }}>No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(t)} title="Editar" style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 2 }}>
                          <Icon name="edit" size={14} />
                        </button>
                        <button onClick={() => setConfirmDeleteKey(t.key)} title="Quitar" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: 2 }}>
                          <Icon name="x" size={14} />
                        </button>
                      </>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ))}

        {types.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
            <Icon name="list" size={32} color="#d1d5db" />
            <p style={{ margin: "12px 0 0", color: "#9ca3af", fontSize: 13 }}>
              Todavía no has agregado ningún tipo personalizado. Arriba puedes ver todas las categorías del sistema y cuántos registros tiene cada una.
            </p>
          </div>
        )}
      </div>

      <datalist id="activity-category-names">
        {categoryNames.map((n) => <option key={n} value={n} />)}
      </datalist>

      <div style={{ padding: "14px 16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10 }}>
        <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "#1a1a2e" }}>Agregar tipo de actividad nuevo</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={newForm.categoryName}
            onChange={(e) => setNewForm((f) => ({ ...f, categoryName: e.target.value }))}
            placeholder="Categoría (ej. Atenciones, o una nueva)"
            list="activity-category-names"
            style={{ ...inputStyle, flex: 1, minWidth: 180 }}
          />
          <input
            value={newForm.label}
            onChange={(e) => setNewForm((f) => ({ ...f, label: e.target.value }))}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addType(); } }}
            placeholder="Nombre del tipo nuevo..."
            style={{ ...inputStyle, flex: 1, minWidth: 180 }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6b7280", whiteSpace: "nowrap" }}>
            <input
              type="checkbox"
              checked={!!newForm.requiresBeneficiary}
              onChange={(e) => setNewForm((f) => ({ ...f, requiresBeneficiary: e.target.checked }))}
              style={{ width: 13, height: 13, cursor: "pointer" }}
            />
            Pide elegir integrantes
          </label>
          <button
            onClick={addType}
            disabled={!newForm.categoryName.trim() || !newForm.label.trim()}
            style={{ padding: "8px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: newForm.categoryName.trim() && newForm.label.trim() ? "pointer" : "default", opacity: newForm.categoryName.trim() && newForm.label.trim() ? 1 : .5, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
          >
            <Icon name="plus" size={12} /> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
