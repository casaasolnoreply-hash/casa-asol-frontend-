import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import ImageLightbox from "../ImageLightbox";
import { formatDate } from "./AttentionsTab";

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
  border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
};
const selectStyle = { padding: "8px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#374151", cursor: "pointer", background: "#fff" };

const ALL_ROLES = "__all__";

// Combina los "categories" de varias configuraciones de rol en una sola
// lista, uniendo por nombre de categoría y sin duplicar tipos que ya
// comparten llave (las categorías compartidas como "Atenciones" o
// "Reuniones" existen igual en varios roles — ver attentionFields.js).
function mergeConfigs(configs, label) {
  const catMap = new Map();
  for (const cfg of configs) {
    for (const cat of cfg.categories) {
      if (!catMap.has(cat.name)) catMap.set(cat.name, new Map());
      const typeMap = catMap.get(cat.name);
      for (const t of cat.types) typeMap.set(t.key, t);
    }
  }
  const categories = Array.from(catMap.entries()).map(([name, typeMap]) => ({ name, types: Array.from(typeMap.values()) }));
  return { label, categories, types: categories.flatMap((c) => c.types) };
}

// Todas las imágenes que viven en el contenido público del sitio (landing
// page): hero, historia, programas, equipo, voluntariado y donaciones. No
// dependen de ningún rol — cualquiera con acceso a la galería las ve.
function collectSiteImages(content, programa, team) {
  const items = [];
  const push = (url, title, subtitle) => { if (url) items.push({ url, source: "site", title, subtitle }); };

  (content.hero?.images || []).forEach((url) => push(url, "Hero / Inicio", "Página principal"));
  (content.historia?.images || []).forEach((url) => push(url, "Historia", "Página principal"));
  (content.voluntariado?.images || []).forEach((url) => push(url, "Voluntariado", "Página principal"));
  (content.financiacion?.donacionImages || []).forEach((url) => push(url, "Donaciones", "Carrusel de donación"));
  if (content.brand?.logoUrl) push(content.brand.logoUrl, "Logo del sitio", "Marca");

  (programa || []).forEach((p) => (p.images || []).forEach((url) => push(url, p.title, "Programa")));

  (team || []).forEach((m) => {
    if (m.photoUrl) push(m.photoUrl, m.name, "Equipo — foto de perfil");
    (m.photos || []).forEach((url) => push(url, m.name, "Equipo — labor"));
  });

  return items;
}

export default function GaleriaTab() {
  const { authUser, content, programa, team } = useApp();
  const canManageAllRoles = authUser.role === "admin" || authUser.role === "desarrollador";

  const [availableRoles, setAvailableRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [config, setConfig] = useState(null);
  const [list, setList] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sourceFilter, setSourceFilter] = useState(""); // "" | "site" | "activity"
  const [typeFilter, setTypeFilter] = useState("");
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [lightbox, setLightbox] = useState(null); // null | { images, index }

  const effectiveRole = canManageAllRoles ? selectedRole : authUser.role;
  const isAllRolesMode = effectiveRole === ALL_ROLES;
  const hasAnyRole = canManageAllRoles || !!authUser.role;

  useEffect(() => {
    if (!canManageAllRoles) return;
    api.getAvailableAttentionRoles()
      .then((list) => { setAvailableRoles(list); setSelectedRole((r) => r || ALL_ROLES); })
      .catch((e) => setError(e.message || "No se pudieron cargar los roles con actividades"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleLabel = (name) => availableRoles?.find((r) => r.name === name)?.label || name;

  const load = useCallback(async () => {
    if (!effectiveRole) { setLoading(false); return; }
    setError("");
    setLoading(true);
    try {
      if (isAllRolesMode) {
        const roleNames = availableRoles.map((r) => r.name);
        const [cfgs, attentionsByRole, ben] = await Promise.all([
          Promise.all(roleNames.map((r) => api.getAttentionConfig(r))),
          Promise.all(roleNames.map((r) => api.getAttentions({ role: r }))),
          api.getBeneficiaries(),
        ]);
        setConfig(mergeConfigs(cfgs, "Todos los roles"));
        setList(attentionsByRole.flat());
        setBeneficiaries(ben);
      } else {
        const [cfg, attentions, ben] = await Promise.all([
          api.getAttentionConfig(effectiveRole).catch(() => null),
          api.getAttentions(canManageAllRoles ? { role: effectiveRole } : {}).catch(() => []),
          api.getBeneficiaries(),
        ]);
        setConfig(cfg);
        setList(attentions);
        setBeneficiaries(ben);
      }
    } catch (e) {
      setError(e.message || "No se pudo cargar la galería");
    } finally {
      setLoading(false);
    }
  }, [effectiveRole, canManageAllRoles, isAllRolesMode, availableRoles]);

  useEffect(() => { load(); }, [load]);

  const roleSelector = canManageAllRoles && availableRoles?.length > 0 && (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", background: "#f4f6f8", borderRadius: 8, border: "1px solid #e5e7eb" }}>
      <Icon name="users" size={14} color="#6b7280" />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Viendo actividades de:</span>
      <select value={selectedRole || ""} onChange={(e) => setSelectedRole(e.target.value)} style={{ padding: "7px 12px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
        <option value={ALL_ROLES}>👁 Todos los roles (modo administrador)</option>
        {availableRoles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
      </select>
      <span style={{ fontSize: 11, color: "#9ca3af" }}>— las imágenes del sitio web se ven siempre, sin importar el rol</span>
    </div>
  );

  if (loading || !hasAnyRole) return <div>{roleSelector}<p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p></div>;

  const typeLabel = (key) => config?.types.find((t) => t.key === key)?.label || key;

  // ── Imágenes del sitio web (siempre disponibles, sin importar el rol) ──
  const siteImages = collectSiteImages(content, programa, team);

  // ── Imágenes de actividades (según el rol/modo seleccionado) ──
  const attentionsWithImages = list.filter((a) => a.images?.length > 0);
  const activityImages = attentionsWithImages.flatMap((a) =>
    a.images.map((url) => ({
      url, source: "activity",
      title: typeLabel(a.type),
      subtitle: [formatDate(a.attention_date), a.beneficiary_name].filter(Boolean).join(" · "),
      attention: a,
    }))
  );

  const matchesSearch = (item) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const haystack = [item.title, item.subtitle, item.attention?.notes, item.attention?.author_username].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  };

  const dateOnly = (iso) => iso?.slice(0, 10);
  const matchesDateRange = (item) => {
    if (!dateFrom && !dateTo) return true;
    // Las imágenes del sitio web no tienen fecha propia — si se filtra por
    // fecha, se entiende que se busca algo de actividades puntuales.
    const d = dateOnly(item.attention?.attention_date);
    if (!d) return false;
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  };

  const combined = [
    ...(sourceFilter === "activity" ? [] : siteImages),
    ...(sourceFilter === "site" ? [] : activityImages),
  ];

  const filtered = combined.filter((item) => {
    if (item.source === "activity") {
      if (typeFilter && item.attention.type !== typeFilter) return false;
      if (beneficiaryFilter && String(item.attention.beneficiary_id) !== beneficiaryFilter) return false;
      if (roleFilter && item.attention.role !== roleFilter) return false;
    } else if (typeFilter || beneficiaryFilter) {
      return false; // esos filtros son específicos de actividades
    }
    return matchesDateRange(item) && matchesSearch(item);
  });

  const beneficiariesWithHistory = beneficiaries.filter((b) => attentionsWithImages.some((a) => a.beneficiary_id === b.id));
  const anyFilterActive = search || sourceFilter || typeFilter || beneficiaryFilter || roleFilter || dateFrom || dateTo;

  return (
    <div>
      {roleSelector}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Galería de imágenes</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Todas las imágenes del sitio web y de las actividades registradas</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Icon name="eye" size={13} color="#9ca3af" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, actividad, estudiante..." style={{ ...inputStyle, width: 260, paddingLeft: 30 }} />
        </div>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={selectStyle}>
          <option value="">Sitio web y actividades</option>
          <option value="site">Solo sitio web</option>
          <option value="activity">Solo actividades</option>
        </select>
        {config && (
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
            <option value="">Cualquier actividad</option>
            {config.categories.map((cat) => (
              <optgroup key={cat.name} label={cat.name}>
                {cat.types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </optgroup>
            ))}
          </select>
        )}
        {beneficiariesWithHistory.length > 0 && (
          <select value={beneficiaryFilter} onChange={(e) => setBeneficiaryFilter(e.target.value)} style={selectStyle}>
            <option value="">Todos los estudiantes</option>
            {beneficiariesWithHistory.map((b) => <option key={b.id} value={b.id}>{b.full_name}</option>)}
          </select>
        )}
        {isAllRolesMode && (
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={selectStyle}>
            <option value="">Todos los roles</option>
            {availableRoles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
          </select>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>DESDE</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...inputStyle, width: 150 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>HASTA</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ ...inputStyle, width: 150 }} />
        </div>
        {anyFilterActive && (
          <button
            onClick={() => { setSearch(""); setSourceFilter(""); setTypeFilter(""); setBeneficiaryFilter(""); setRoleFilter(""); setDateFrom(""); setDateTo(""); }}
            style={{ background: "none", border: "none", color: PRIMARY, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "6px 4px" }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="image" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            {combined.length === 0 ? "Todavía no hay imágenes cargadas." : "Nada coincide con estos filtros."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
          {filtered.map((item, idx) => (
            <div key={idx} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={item.url} alt=""
                  onClick={() => setLightbox({ images: filtered.map((i) => i.url), index: idx })}
                  style={{ width: "100%", height: 130, objectFit: "cover", display: "block", cursor: "pointer" }}
                />
                <span style={{
                  position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
                  background: item.source === "site" ? "rgba(255,255,255,.92)" : `${PRIMARY}e6`, color: item.source === "site" ? "#374151" : "#fff",
                }}>
                  {item.source === "site" ? "SITIO WEB" : "ACTIVIDAD"}
                </span>
              </div>
              <div style={{ padding: "8px 10px" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.title}
                </p>
                {item.subtitle && (
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{item.subtitle}</p>
                )}
                {isAllRolesMode && item.source === "activity" && (
                  <span style={{ display: "inline-block", marginTop: 5, fontSize: 10, fontWeight: 700, color: PRIMARY, background: `${PRIMARY}12`, padding: "2px 7px", borderRadius: 10 }}>
                    {roleLabel(item.attention.role)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(i) => setLightbox((l) => ({ ...l, index: i }))}
        />
      )}
    </div>
  );
}
