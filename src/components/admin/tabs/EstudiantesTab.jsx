import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";

const STATUS_LABEL = { activo: "Activo", egresado: "Egresado", retirado: "Retirado" };
const STATUS_COLOR = { activo: "#16a34a", egresado: "#6366f1", retirado: "#9ca3af" };

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
  border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
};

const emptyForm = { fullName: "", birthDate: "", school: "", gradeLevel: "", admissionDate: "", notes: "" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
}

// Vista rápida del expediente de UN estudiante: solo los tipos de
// atención que piden estudiante (requiresBeneficiary) tienen sentido
// aquí — las actividades grupales/de equipo se registran desde
// "Expediente de atenciones" en el menú principal.
function ExpedienteModal({ beneficiary, role, onClose }) {
  const [config, setConfig] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ attentionDate: "", type: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const [cfg, attentions] = await Promise.all([
        api.getAttentionConfig(role).catch(() => null),
        api.getAttentions({ beneficiaryId: beneficiary.id, role }),
      ]);
      setConfig(cfg);
      setList(attentions);
      const personalTypes = (cfg?.types || []).filter((t) => t.requiresBeneficiary);
      if (personalTypes.length) setForm((f) => ({ ...f, type: f.type || personalTypes[0].key }));
    } catch (e) {
      setError(e.message || "No se pudo cargar el expediente");
    } finally {
      setLoading(false);
    }
  }, [beneficiary.id, role]);

  useEffect(() => { load(); }, [load]);

  const personalTypes = (config?.types || []).filter((t) => t.requiresBeneficiary);

  const submit = async () => {
    if (!form.attentionDate) return setError("La fecha es obligatoria");
    if (!form.type) return setError("Elige un tipo de atención");
    setSaving(true);
    setError("");
    try {
      await api.createAttention({ beneficiaryId: beneficiary.id, attentionDate: form.attentionDate, type: form.type, notes: form.notes });
      setForm((f) => ({ ...f, attentionDate: "", notes: "" }));
      setAdding(false);
      load();
    } catch (e) {
      setError(e.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxWidth: "92vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "26px 28px 22px", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Expediente de {beneficiary.full_name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>
        <p style={{ margin: "0 0 18px", fontSize: 12, color: "#9ca3af" }}>Atenciones individuales registradas para este estudiante</p>

        {loading ? (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p>
        ) : !config ? (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Tu rol no tiene expediente de atenciones configurado.</p>
        ) : (
          <>
            {personalTypes.length > 0 && (
              adding ? (
                <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>FECHA</label>
                      <input type="date" value={form.attentionDate} onChange={(e) => setForm((f) => ({ ...f, attentionDate: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>TIPO</label>
                      <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                        {personalTypes.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>NOTAS (OPCIONAL)</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, minHeight: 60, resize: "vertical", marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={submit} disabled={saving} style={{ padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                      {saving ? "Guardando..." : "Guardar registro"}
                    </button>
                    <button onClick={() => setAdding(false)} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 18 }}>
                  <Icon name="plus" size={13} /> Nuevo registro
                </button>
              )
            )}

            {list.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Sin registros todavía.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((a) => (
                  <div key={a.id} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>
                      {config.types.find((t) => t.key === a.type)?.label || a.type}
                      <span style={{ fontWeight: 400, color: "#9ca3af" }}> · {formatDate(a.attention_date)}</span>
                    </p>
                    {a.notes && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{a.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 12 }}>{error}</p>}
      </div>
    </>
  );
}

function BeneficiaryModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.fullName?.trim()) return setErr("El nombre completo es obligatorio");
    setSaving(true);
    setErr("");
    try {
      await onSave(form);
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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{initial ? "Editar estudiante" : "Nuevo estudiante"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>

        {[
          { key: "fullName",       label: "NOMBRE COMPLETO", placeholder: "Nombre y apellidos" },
          { key: "birthDate",      label: "FECHA DE NACIMIENTO", type: "date" },
          { key: "school",         label: "COLEGIO / INSTITUCIÓN", placeholder: "Ej. INDICOOP Santa Rosita" },
          { key: "gradeLevel",     label: "GRADO / NIVEL", placeholder: "Ej. 5to Bachillerato en Ciencias y Letras" },
          { key: "admissionDate",  label: "FECHA DE INGRESO", type: "date" },
        ].map(({ key, label, placeholder, type }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{label}</label>
            <input type={type || "text"} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} style={inputStyle} />
          </div>
        ))}

        <div style={{ marginBottom: 4 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>NOTAS (OPCIONAL)</label>
          <textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} />
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

export default function EstudiantesTab() {
  const { authUser } = useApp();
  const canManage = authUser?.role === "desarrollador" || !!authUser?.permissions?.manageBeneficiaries;
  // El expediente por estudiante es del rol operativo que atiende
  // (ej. psicóloga); admin/desarrollador ya tienen su propia vista
  // con selector de rol en "Expediente de atenciones".
  const canLogAttention = authUser?.role && authUser.role !== "admin" && authUser.role !== "desarrollador";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | beneficiary object
  const [expedienteFor, setExpedienteFor] = useState(null); // null | beneficiary object
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filter, setFilter] = useState("activo");

  const load = useCallback(async () => {
    setError("");
    try {
      setList(await api.getBeneficiaries(filter || undefined));
    } catch (e) {
      setError(e.message || "No se pudo cargar la lista");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (modal && modal !== "new") {
      await api.updateBeneficiary(modal.id, form);
    } else {
      await api.createBeneficiary(form);
    }
    load();
  };

  const handleStatusChange = async (b, status) => {
    try {
      await api.updateBeneficiary(b.id, { ...b, fullName: b.full_name, birthDate: b.birth_date, gradeLevel: b.grade_level, admissionDate: b.admission_date, status });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteBeneficiary(id);
      setConfirmDeleteId(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando estudiantes...</p>;

  const chip = (id, label) => (
    <button onClick={() => setFilter(id)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${filter === id ? PRIMARY : "#ddd"}`, background: filter === id ? PRIMARY : "#fff", color: filter === id ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Estudiantes</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Catálogo compartido de adolescentes y jóvenes (AJ) residentes</p>
        </div>
        {canManage && (
          <button onClick={() => setModal("new")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <Icon name="plus" size={14} /> Nuevo estudiante
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {chip("activo", "Activos")}
        {chip("egresado", "Egresados")}
        {chip("retirado", "Retirados")}
        {chip("", "Todos")}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      {modal && (
        <BeneficiaryModal
          initial={modal === "new" ? null : {
            fullName: modal.full_name, birthDate: modal.birth_date?.slice(0, 10) || "",
            school: modal.school, gradeLevel: modal.grade_level,
            admissionDate: modal.admission_date?.slice(0, 10) || "", notes: modal.notes,
          }}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {expedienteFor && (
        <ExpedienteModal beneficiary={expedienteFor} role={authUser.role} onClose={() => setExpedienteFor(null)} />
      )}

      {list.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="users" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>No hay estudiantes en esta lista.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((b) => (
          <div key={b.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: PRIMARY, fontSize: 12, fontWeight: 700 }}>{b.full_name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div style={{ minWidth: 160, flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{b.full_name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{[b.grade_level, b.school].filter(Boolean).join(" · ") || "Sin datos escolares"}</p>
              </div>

              {canManage ? (
                <select value={b.status} onChange={(e) => handleStatusChange(b, e.target.value)} style={{ padding: "6px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", cursor: "pointer", color: STATUS_COLOR[b.status] }}>
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[b.status], background: `${STATUS_COLOR[b.status]}15`, padding: "3px 10px", borderRadius: 10 }}>
                  {STATUS_LABEL[b.status]}
                </span>
              )}

              {canLogAttention && (
                <button onClick={() => setExpedienteFor(b)} title="Ver expediente" style={{ display: "flex", alignItems: "center", gap: 6, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "#374151", fontSize: 11, fontWeight: 600, marginLeft: canManage ? 0 : "auto" }}>
                  <Icon name="list" size={13} /> Expediente
                </button>
              )}

              {canManage && (
                <div style={{ display: "flex", gap: 6, marginLeft: canLogAttention ? 0 : "auto" }}>
                  <button onClick={() => setModal(b)} title="Editar" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280" }}>
                    <Icon name="edit" size={13} />
                  </button>
                  {confirmDeleteId === b.id ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleDelete(b.id)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirmar</button>
                      <button onClick={() => setConfirmDeleteId(null)} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(b.id)} title="Eliminar" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex" }}>
                      <Icon name="trash" size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
