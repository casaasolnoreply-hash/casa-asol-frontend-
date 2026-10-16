import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import DocumentEditor from "../documents/DocumentEditor";

const STATUS_LABEL = {
  borrador: "Borrador", enviado: "Enviado para revisión", en_revision: "En revisión",
  calificado: "Calificado", devuelto_a_correccion: "Devuelto para corrección",
};
const STATUS_COLOR = {
  borrador: "#d97706", enviado: "#2563eb", en_revision: "#7c3aed",
  calificado: "#16a34a", devuelto_a_correccion: "#dc2626",
};

const inputStyle = { padding: "8px 12px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" };
const selectStyle = { padding: "8px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#374151", cursor: "pointer", background: "#fff" };

export default function DocumentsTab() {
  const [docs, setDocs] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.getAvailableReportRoles().then(setRoles).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (roleFilter) params.role = roleFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      setDocs(await api.getDocumentsList(params));
    } catch (e) {
      setError(e.message || "No se pudieron cargar los documentos");
    }
  }, [statusFilter, roleFilter, dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  const roleLabel = (name) => roles.find((r) => r.name === name)?.label || name;

  const filtered = (docs || []).filter((d) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const haystack = [d.report_code, d.author_username, roleLabel(d.role)].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Documentos</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Informes trabajados en el editor de texto — búscalos, revísalos o ábrelos para seguir editando.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Icon name="eye" size={13} color="#9ca3af" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por código o autor..." style={{ ...inputStyle, width: 220, paddingLeft: 30 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">Cualquier estado</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={selectStyle}>
          <option value="">Cualquier tipo de informe</option>
          {roles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
        </select>
        <label style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>DESDE</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
        <label style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>HASTA</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

      {!docs ? (
        <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="fileText" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            {docs.length === 0 ? "Todavía no hay documentos trabajados." : "Nada coincide con estos filtros."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((d) => (
            <button
              key={d.id} onClick={() => setOpenId(d.id)}
              style={{ textAlign: "left", background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", cursor: "pointer" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="fileText" size={16} color={PRIMARY} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                  {d.report_code && <span style={{ color: PRIMARY, marginRight: 8 }}>{d.report_code}</span>}
                  {roleLabel(d.role)}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                  {d.author_username} · Actualizado el {new Date(d.updated_at).toLocaleDateString("es-GT")}
                </p>
              </div>
              {d.score && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 10, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                  Nota: {d.score}
                </span>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: `${STATUS_COLOR[d.status]}15`, color: STATUS_COLOR[d.status], border: `1px solid ${STATUS_COLOR[d.status]}40` }}>
                {STATUS_LABEL[d.status]}
              </span>
            </button>
          ))}
        </div>
      )}

      {openId && <DocumentEditor documentId={openId} onClose={() => { setOpenId(null); load(); }} />}
    </div>
  );
}
