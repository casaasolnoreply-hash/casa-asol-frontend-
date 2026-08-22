import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
  border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
};
const selectStyle = { padding: "8px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#374151", cursor: "pointer", background: "#fff" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
}

function AttentionModal({ initial, config, beneficiaries, onClose, onSave }) {
  const [form, setForm] = useState(initial || { attentionDate: "", type: config.types[0]?.key || "", beneficiaryId: "", notes: "" });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const typeDef = config.types.find((t) => t.key === form.type);

  const submit = async () => {
    if (!form.attentionDate) return setErr("La fecha es obligatoria");
    if (!form.type) return setErr("Elige un tipo de atención");
    if (typeDef?.requiresBeneficiary && !form.beneficiaryId) return setErr(`"${typeDef.label}" necesita elegir un estudiante`);
    setSaving(true);
    setErr("");
    try {
      await onSave({ ...form, beneficiaryId: typeDef?.requiresBeneficiary ? Number(form.beneficiaryId) : null });
      onClose();
    } catch (e) {
      setErr(e.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 460, maxWidth: "92vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "26px 28px 22px", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{initial ? "Editar registro" : "Nuevo registro"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>FECHA</label>
          <input type="date" value={form.attentionDate} onChange={(e) => set("attentionDate", e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>TIPO</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {config.types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>

        {typeDef?.requiresBeneficiary && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>ESTUDIANTE</label>
            <select value={form.beneficiaryId} onChange={(e) => set("beneficiaryId", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Selecciona...</option>
              {beneficiaries.map((b) => <option key={b.id} value={b.id}>{b.full_name}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 4 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>NOTAS (OPCIONAL)</label>
          <textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} />
        </div>

        {err && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 12 }}>{err}</p>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <button onClick={onClose} style={{ padding: "9px 22px", background: "#fff", color: "#555", border: "1.5px solid #d0d7de", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
          <button onClick={submit} disabled={saving} style={{ padding: "9px 24px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
}

export default function AttentionsTab() {
  const { authUser } = useApp();
  const canManageAllRoles = authUser.role === "admin" || authUser.role === "desarrollador";

  const [availableRoles, setAvailableRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [config, setConfig] = useState(null);
  const [list, setList] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | attention object
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("");
  const [search, setSearch] = useState("");

  const effectiveRole = canManageAllRoles ? selectedRole : authUser.role;

  useEffect(() => {
    if (!canManageAllRoles) return;
    api.getAvailableAttentionRoles()
      .then((list) => { setAvailableRoles(list); setSelectedRole((r) => r || list[0]?.name || null); })
      .catch((e) => setError(e.message || "No se pudieron cargar los roles con expediente"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    if (!effectiveRole) { setLoading(false); return; }
    setError("");
    setLoading(true);
    try {
      const [cfg, attentions, ben] = await Promise.all([
        api.getAttentionConfig(effectiveRole),
        api.getAttentions(canManageAllRoles ? { role: effectiveRole } : {}),
        api.getBeneficiaries(),
      ]);
      setConfig(cfg);
      setList(attentions);
      setBeneficiaries(ben);
    } catch (e) {
      setError(e.message || "No se pudo cargar el expediente");
    } finally {
      setLoading(false);
    }
  }, [effectiveRole, canManageAllRoles]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    const payload = {
      attentionDate: form.attentionDate, type: form.type, beneficiaryId: form.beneficiaryId, notes: form.notes,
      ...(canManageAllRoles && { role: effectiveRole }),
    };
    if (modal && modal !== "new") {
      await api.updateAttention(modal.id, payload);
    } else {
      await api.createAttention(payload);
    }
    load();
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAttention(id);
      setConfirmDeleteId(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const roleSelector = canManageAllRoles && availableRoles?.length > 0 && (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", background: "#f4f6f8", borderRadius: 8, border: "1px solid #e5e7eb" }}>
      <Icon name="users" size={14} color="#6b7280" />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Viendo expediente de:</span>
      <select value={selectedRole || ""} onChange={(e) => setSelectedRole(e.target.value)} style={{ padding: "7px 12px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
        {availableRoles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
      </select>
    </div>
  );

  if (loading) return <div>{roleSelector}<p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p></div>;

  if (canManageAllRoles && availableRoles?.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
        <Icon name="warning" size={36} color="#d1d5db" />
        <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>Todavía no hay ningún rol con expediente de atenciones configurado.</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div>
        {roleSelector}
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="warning" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>Tu rol todavía no tiene expediente de atenciones configurado.</p>
        </div>
      </div>
    );
  }

  const matchesSearch = (a) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const haystack = [a.beneficiary_name, a.notes, a.author_username].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  };

  const filtered = list.filter((a) =>
    (!typeFilter || a.type === typeFilter) &&
    (!beneficiaryFilter || String(a.beneficiary_id) === beneficiaryFilter) &&
    matchesSearch(a)
  );

  const typeLabel = (key) => config.types.find((t) => t.key === key)?.label || key;
  const canEditDelete = (a) => a.author_username === authUser.user || canManageAllRoles;
  const beneficiariesWithHistory = beneficiaries.filter((b) => list.some((a) => a.beneficiary_id === b.id));

  return (
    <div>
      {roleSelector}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Expediente de atenciones</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>{config.label} — registro individual de cada atención, taller o reunión</p>
        </div>
        <button onClick={() => setModal("new")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Icon name="plus" size={14} /> Nuevo registro
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Icon name="eye" size={13} color="#9ca3af" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por estudiante o nota..." style={{ ...inputStyle, width: 240, paddingLeft: 30 }} />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="">Cualquier tipo</option>
          {config.types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        {beneficiariesWithHistory.length > 0 && (
          <select value={beneficiaryFilter} onChange={(e) => setBeneficiaryFilter(e.target.value)} style={selectStyle}>
            <option value="">Todos los estudiantes</option>
            {beneficiariesWithHistory.map((b) => <option key={b.id} value={b.id}>{b.full_name}</option>)}
          </select>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      {modal && (
        <AttentionModal
          initial={modal === "new" ? null : {
            attentionDate: modal.attention_date?.slice(0, 10) || "", type: modal.type,
            beneficiaryId: modal.beneficiary_id || "", notes: modal.notes,
          }}
          config={config}
          beneficiaries={beneficiaries}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="list" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            {list.length === 0 ? "Todavía no hay registros en el expediente." : "Nada coincide con estos filtros."}
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="list" size={16} color={PRIMARY} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                {typeLabel(a.type)} {a.beneficiary_name && <span style={{ color: PRIMARY, fontWeight: 600 }}>· {a.beneficiary_name}</span>}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                {formatDate(a.attention_date)} · registrado por {a.author_username}
                {a.notes && ` · ${a.notes.length > 60 ? `${a.notes.slice(0, 60)}...` : a.notes}`}
              </p>
            </div>
            {canEditDelete(a) && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setModal(a)} title="Editar" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280" }}>
                  <Icon name="edit" size={13} />
                </button>
                {confirmDeleteId === a.id ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleDelete(a.id)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirmar</button>
                    <button onClick={() => setConfirmDeleteId(null)} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(a.id)} title="Eliminar" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex" }}>
                    <Icon name="trash" size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
