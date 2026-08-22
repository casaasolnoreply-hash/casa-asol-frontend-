import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRIMARY, DARK } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import Icon from "../components/ui/Icon";
import AddItemModal from "../components/ui/AddItemModal";
import NavTab         from "../components/admin/tabs/NavTab";
import SectionsTab    from "../components/admin/tabs/SectionsTab";
import ContentTab     from "../components/admin/tabs/ContentTab";
import ImagesTab      from "../components/admin/tabs/ImagesTab";
import SettingsTab    from "../components/admin/tabs/SettingsTab";
import ProgramaEditor from "../components/admin/tabs/ProgramaEditor";
import EquipoEditor   from "../components/admin/tabs/EquipoEditor";
import MensajesTab    from "../components/admin/tabs/MensajesTab";
import ProfileTab     from "../components/admin/tabs/ProfileTab";
import UsersTab       from "../components/admin/tabs/UsersTab";
import RequestsTab    from "../components/admin/tabs/RequestsTab";
import RolesTab       from "../components/admin/tabs/RolesTab";
import EstudiantesTab from "../components/admin/tabs/EstudiantesTab";
import MiInformeTab   from "../components/admin/tabs/MiInformeTab";
import AttentionsTab  from "../components/admin/tabs/AttentionsTab";

/* ── Site content items ── */
const SITE_TABS = [
  { id: "sections",     icon: "eye",      label: "Visibilidad" },
  { id: "images",       icon: "cloud",    label: "Logo e Imágenes" },
  { id: "hero",         icon: "image",    label: "Hero / Inicio",  sub: "hero" },
  { id: "historia",     icon: "book",     label: "Historia",       sub: "historia" },
  { id: "programa",     icon: "list",     label: "Programa" },
  { id: "equipo",       icon: "users",    label: "Equipo" },
  { id: "stats",        icon: "barChart", label: "Estadísticas" },
  { id: "financiacion", icon: "star",     label: "Financiación",   sub: "financiacion" },
  { id: "voluntariado", icon: "check",    label: "Voluntariado",   sub: "voluntariado" },
  { id: "contacto",     icon: "phone",    label: "Contacto",       sub: "contacto" },
];

/* ── Config drawer items ── */
const CONFIG_TABS = [
  { id: "nav",      icon: "compass",  label: "Navegación" },
  { id: "settings", icon: "settings", label: "Ajustes" },
];

const ACCOUNT_TABS = [
  { id: "usuarios",     icon: "users",    label: "Usuarios" },
  { id: "solicitudes",  icon: "mail",     label: "Solicitudes de acceso" },
  { id: "roles",        icon: "settings", label: "Roles y permisos" },
];

const ALL_TABS = [
  ...SITE_TABS,
  { id: "mensajes",    icon: "mail",  label: "Mensajes" },
  { id: "estudiantes", icon: "users", label: "Estudiantes" },
  { id: "atenciones",  icon: "list",  label: "Expediente de atenciones" },
  { id: "mi-informe",  icon: "list",  label: "Mi informe" },
  ...ACCOUNT_TABS, ...CONFIG_TABS,
  { id: "inicio", icon: "home", label: "Inicio" },
];

// Editar el contenido del sitio (y su configuración) es exclusivo del
// rol "desarrollador" — el resto de roles no debe ver el botón ni
// poder llegar a estas pantallas.
const SITE_EDIT_TAB_IDS = new Set([...SITE_TABS, ...CONFIG_TABS].map((t) => t.id));

/* ── Inline stats editor ── */
function StatsEditor() {
  const { stats, upStat, removeStat, addStat } = useApp();
  const [addModal, setAddModal] = useState(false);
  const i = { padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit" };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Estadísticas</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Números que aparecen en la banda de estadísticas del sitio</p>
        </div>
        <button onClick={() => setAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Icon name="plus" size={14} /> Agregar
        </button>
      </div>
      {addModal && (
        <AddItemModal
          title="Agregar estadística"
          fields={[
            { key: "value", label: "VALOR",    type: "text", placeholder: "Ej: 120+" },
            { key: "label", label: "ETIQUETA", type: "text", placeholder: "Ej: Estudiantes beneficiados" },
          ]}
          onSave={(d) => addStat(d)}
          onClose={() => setAddModal(false)}
        />
      )}
      <div style={{ background: PRIMARY, borderRadius: 10, padding: "20px 24px", marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {stats.map((s) => (
          <div key={s.id} style={{ textAlign: "center", color: "#fff", minWidth: 80 }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 11, opacity: .8 }}>{s.label}</p>
          </div>
        ))}
        {stats.length === 0 && <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, margin: 0 }}>Sin estadísticas</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stats.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid #e0e8f0", borderRadius: 8, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ textAlign: "center", background: `${PRIMARY}10`, borderRadius: 6, padding: "6px 10px", minWidth: 54, flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PRIMARY }}>{s.value}</p>
            </div>
            <input value={s.value} onChange={(e) => upStat(s.id, "value", e.target.value)} style={{ ...i, width: 88 }} placeholder="120+" />
            <input value={s.label} onChange={(e) => upStat(s.id, "label", e.target.value)} style={{ ...i, flex: 1 }} placeholder="Etiqueta" />
            <button onClick={() => removeStat(s.id)} style={{ padding: "6px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionWrapper({ sub, label, description }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>{label}</h2>
        {description && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>{description}</p>}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 24 }}>
        <ContentTab initialSub={sub} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { logout, unreadCount, authUser } = useApp();
  const navigate = useNavigate();
  const isDeveloper = authUser?.role === "desarrollador";
  const canManageUsers = authUser?.role === "admin" || authUser?.role === "desarrollador";
  // "viewMessages" lo otorga el desarrollador por rol (Roles y permisos);
  // desarrollador siempre lo tiene por su acceso total.
  const canViewMessages = isDeveloper || !!authUser?.permissions?.viewMessages;
  // Roles operativos (no admin/desarrollador): tienen su propio informe periódico.
  const isOperationalRole = authUser?.role && authUser.role !== "admin" && !isDeveloper;

  const defaultTab = isDeveloper ? "sections" : canViewMessages ? "mensajes" : canManageUsers ? "usuarios" : isOperationalRole ? "mi-informe" : "inicio";
  const [tab, setTab]           = useState(defaultTab);
  const [configOpen, setConfigOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Sidebar responsivo: en escritorio se puede colapsar a solo
  // iconos; en pantallas angostas (tablet/celular) es un panel que
  // se abre y cierra sobre el contenido. Arranca según el ancho real
  // (breakpoint 900px, igual que el CSS de abajo) para no parpadear.
  const [sidebarOpen, setSidebarOpen] = useState(() => !window.matchMedia("(max-width: 899px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const handle = (e) => setSidebarOpen(!e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);
  // En el panel angosto (overlay), elegir una sección debe cerrarlo solo.
  const goToTab = (id) => {
    setTab(id);
    if (window.matchMedia("(max-width: 899px)").matches) setSidebarOpen(false);
  };

  useEffect(() => {
    if (!canManageUsers) return;
    api.getUserRequests().then((list) => setPendingRequests(list.length)).catch(() => {});
  }, [canManageUsers, tab]);

  const current = ALL_TABS.find((m) => m.id === tab);
  const handleLogout = () => { logout(); navigate("/"); };

  const openConfig = (id) => { setConfigOpen(false); goToTab(id); };
  const openEditSite = () => {
    setConfigOpen(true);
    if (window.matchMedia("(max-width: 899px)").matches) setSidebarOpen(false);
  };

  const NavBtn = ({ id, icon, label, badge }) => (
    <button
      className="ca-nav-btn"
      title={label}
      onClick={() => goToTab(id)}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        width: "100%", padding: "10px 20px",
        background: tab === id ? "rgba(30,136,229,.18)" : "none",
        border: "none",
        borderLeft: tab === id ? `3px solid ${PRIMARY}` : "3px solid transparent",
        color: tab === id ? "#fff" : "#9ca3af",
        cursor: "pointer", fontSize: 13,
        fontWeight: tab === id ? 600 : 400,
        textAlign: "left", transition: "all .15s",
      }}
    >
      <Icon name={icon} size={15} color={tab === id ? "#fff" : "#9ca3af"} />
      <span className="ca-hide-collapsed" style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span className="ca-hide-collapsed" style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8, marginLeft: 2 }}>{badge}</span>
      )}
    </button>
  );

  const renderContent = () => {
    if (SITE_EDIT_TAB_IDS.has(tab) && !isDeveloper) {
      return <p style={{ color: "#9ca3af", fontSize: 13 }}>No tienes acceso a esta sección.</p>;
    }
    if (tab === "mensajes" && !canViewMessages) {
      return <p style={{ color: "#9ca3af", fontSize: 13 }}>No tienes acceso a esta sección.</p>;
    }
    if ((tab === "usuarios" || tab === "solicitudes") && !canManageUsers) {
      return <p style={{ color: "#9ca3af", fontSize: 13 }}>No tienes acceso a esta sección.</p>;
    }
    if (tab === "roles" && !isDeveloper) {
      return <p style={{ color: "#9ca3af", fontSize: 13 }}>No tienes acceso a esta sección.</p>;
    }
    switch (tab) {
      case "programa":     return <ProgramaEditor />;
      case "equipo":       return <EquipoEditor />;
      case "stats":        return <StatsEditor />;
      case "mensajes":     return <MensajesTab />;
      case "usuarios":     return <UsersTab />;
      case "solicitudes":  return <RequestsTab />;
      case "roles":        return <RolesTab />;
      case "estudiantes":  return <EstudiantesTab />;
      case "atenciones":   return <AttentionsTab />;
      case "mi-informe":   return <MiInformeTab />;
      case "inicio":       return (
        <div style={{ textAlign: "center", padding: "56px 24px" }}>
          <Icon name="home" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            Bienvenido/a, {authUser?.user}. Todavía no tienes secciones asignadas en el panel.
          </p>
        </div>
      );
      case "perfil":       return <ProfileTab />;
      case "sections":     return <SectionsTab />;
      case "images":       return <ImagesTab />;
      case "nav":          return <NavTab />;
      case "settings":     return <SettingsTab />;
      case "hero":         return <SectionWrapper sub="hero"         label="Hero / Inicio"  description="Título, subtítulo y fondo de la sección principal" />;
      case "historia":     return <SectionWrapper sub="historia"     label="Historia"       description="Textos y cita de la sección Historia" />;
      case "financiacion": return <SectionWrapper sub="financiacion" label="Financiación"   description="Montos de donación, cuentas bancarias y pagos en línea" />;
      case "voluntariado": return <SectionWrapper sub="voluntariado" label="Voluntariado"   description="Texto e ítems de la sección Voluntariado" />;
      case "contacto":     return <SectionWrapper sub="contacto"     label="Contacto"       description="Ítems de información de contacto" />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        .ca-sidebar { width: 232px; flex-shrink: 0; overflow-x: hidden; transition: width .2s ease; }
        .ca-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 299; }
        @media (min-width: 900px) {
          .ca-sidebar-closed { width: 64px; }
          .ca-sidebar-closed .ca-hide-collapsed { display: none; }
          .ca-sidebar-closed .ca-nav-btn,
          .ca-sidebar-closed .ca-bottom-btn { justify-content: center; }
        }
        @media (max-width: 899px) {
          .ca-sidebar {
            position: fixed; top: 0; left: 0; height: 100vh; z-index: 300;
            transform: translateX(0); transition: transform .2s ease;
          }
          .ca-sidebar-closed { transform: translateX(-100%); }
          .ca-sidebar:not(.ca-sidebar-closed) ~ .ca-backdrop { display: block; }
          .ca-content-pad { padding: 16px !important; }
          .ca-topbar-pad { padding: 0 14px !important; }
          .ca-topbar-badge-text { display: none; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`ca-sidebar${sidebarOpen ? "" : " ca-sidebar-closed"}`} style={{ background: DARK, color: "#9ca3af", display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <svg width="24" height="24" viewBox="0 0 36 36">
              <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
              <polygon points="18,4 26,20 10,20" fill={PRIMARY} opacity=".8" />
            </svg>
            <span className="ca-hide-collapsed" style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Casa ASOL</span>
          </div>
          <p className="ca-hide-collapsed" style={{ fontSize: 10, opacity: .4, margin: 0 }}>Panel de Administración</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div className="ca-hide-collapsed" style={{ padding: "8px 20px 4px", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,.22)", textTransform: "uppercase" }}>
            General
          </div>
          <NavBtn id="estudiantes" icon="users" label="Estudiantes" />
          {(isOperationalRole || canManageUsers) && <NavBtn id="atenciones" icon="list" label="Expediente de atenciones" />}
          <NavBtn id="mi-informe" icon="list" label={isOperationalRole ? "Mi informe" : "Informes"} />

          {canViewMessages && (
            <>
              <div className="ca-hide-collapsed" style={{ padding: "8px 20px 4px", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,.22)", textTransform: "uppercase" }}>
                Mensajes
              </div>
              <NavBtn id="mensajes" icon="mail" label="Mensajes recibidos" badge={unreadCount} />
            </>
          )}

          {canManageUsers && (
            <>
              <div className="ca-hide-collapsed" style={{ padding: "16px 20px 4px", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,.22)", textTransform: "uppercase" }}>
                Cuentas
              </div>
              <NavBtn id="usuarios"    icon="users" label="Usuarios" />
              <NavBtn id="solicitudes" icon="mail"  label="Solicitudes de acceso" badge={pendingRequests} />
              {isDeveloper && <NavBtn id="roles" icon="settings" label="Roles y permisos" />}
            </>
          )}
        </nav>

        {/* Bottom: edit button + user card + links */}
        <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.08)", flexShrink: 0 }}>
          {/* Editar sitio — solo desarrollador */}
          {isDeveloper && (
            <button
              className="ca-bottom-btn"
              title="Editar sitio"
              onClick={openEditSite}
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "11px 20px", background: "rgba(30,136,229,.15)", border: "none", borderLeft: `3px solid ${PRIMARY}`, color: "#e0eaf8", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "background .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,136,229,.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(30,136,229,.15)")}
            >
              <Icon name="edit" size={15} color={PRIMARY} />
              <span className="ca-hide-collapsed" style={{ flex: 1 }}>Editar sitio</span>
              <span className="ca-hide-collapsed" style={{ display: "flex" }}><Icon name="chevronDown" size={12} color={PRIMARY} style={{ transform: "rotate(-90deg)" }} /></span>
            </button>
          )}

          {/* Avatar + nombre + botón perfil */}
          <div className="ca-bottom-btn" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", margin: "6px 0" }}>
            {/* Avatar */}
            {authUser?.photoUrl ? (
              <img src={authUser.photoUrl} alt="Avatar" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>
                  {(authUser?.user || "?").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {/* Nombre y rol */}
            <div className="ca-hide-collapsed" style={{ flex: 1, overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {authUser?.user}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,.38)", textTransform: "capitalize" }}>
                {authUser?.role}
              </p>
            </div>
            {/* Botón perfil */}
            <button
              onClick={() => setTab("perfil")}
              title="Mi perfil"
              style={{ background: tab === "perfil" ? `${PRIMARY}30` : "rgba(255,255,255,.06)", border: "none", borderRadius: 6, padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center", color: tab === "perfil" ? PRIMARY : "#9ca3af", flexShrink: 0 }}
            >
              <Icon name="settings" size={13} color={tab === "perfil" ? PRIMARY : "#9ca3af"} />
            </button>
          </div>

          <div style={{ padding: "2px 20px 8px", display: "flex", flexDirection: "column", gap: 0 }}>
            <Link
              to="/"
              className="ca-bottom-btn"
              title="Ver sitio web"
              style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", textDecoration: "none", fontSize: 12, padding: "7px 0", transition: "color .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              <Icon name="external" size={13} color="#6b7280" /> <span className="ca-hide-collapsed">Ver sitio web</span>
            </Link>
            <button
              className="ca-bottom-btn"
              title="Cerrar sesión"
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12, padding: "7px 0", textAlign: "left" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = ".7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Icon name="logout" size={13} color="#ef4444" /> <span className="ca-hide-collapsed">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="ca-backdrop" onClick={() => setSidebarOpen(false)} />

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f4f6f8", overflow: "hidden" }}>
        {/* Top bar */}
        <div className="ca-topbar-pad" style={{ background: "#fff", padding: "0 28px", borderBottom: "1px solid #e8e8e8", height: 54, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 7, padding: 7, cursor: "pointer", display: "flex", color: "#6b7280", flexShrink: 0 }}
          >
            <Icon name="menu" size={16} color="#6b7280" />
          </button>
          {current && <Icon name={current.icon} size={17} color={PRIMARY} />}
          <h1 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.label}</h1>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#b0b8c8", background: "#f9fafb", padding: "3px 10px", borderRadius: 20, border: "1px solid #e8e8e8", display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <Icon name="check" size={11} color="#22c55e" /> <span className="ca-topbar-badge-text">Guardado automático</span>
          </span>
        </div>

        {/* Content */}
        <div className="ca-content-pad" style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {renderContent()}
          </div>
        </div>
      </main>

      {/* ── CONFIG DRAWER (slides from right) — solo desarrollador ── */}
      {configOpen && isDeveloper && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setConfigOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 200 }}
          />
          {/* Panel */}
          <div style={{ position: "fixed", top: 0, right: 0, width: 300, maxWidth: "92vw", height: "100vh", background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,.18)" }}>
            {/* Panel header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Editar sitio</h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>Selecciona una sección para editar</p>
              </div>
              <button onClick={() => setConfigOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, display: "flex" }}>
                <Icon name="x" size={18} />
              </button>
            </div>

            {/* All items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {/* Contenido del sitio */}
              <p style={{ margin: 0, padding: "8px 20px 5px", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#b0b8c8", textTransform: "uppercase" }}>Contenido del sitio</p>
              {SITE_TABS.map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => openConfig(id)}
                  style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 20px", background: tab === id ? `${PRIMARY}0f` : "none", border: "none", borderLeft: tab === id ? `3px solid ${PRIMARY}` : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "background .12s" }}
                  onMouseEnter={(e) => { if (tab !== id) e.currentTarget.style.background = "#f5f7fa"; }}
                  onMouseLeave={(e) => { if (tab !== id) e.currentTarget.style.background = "none"; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: tab === id ? `${PRIMARY}1a` : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={13} color={tab === id ? PRIMARY : "#6b7280"} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: tab === id ? 700 : 500, color: tab === id ? PRIMARY : "#374151", flex: 1 }}>{label}</span>
                  <Icon name="chevronDown" size={11} color="#d1d5db" style={{ transform: "rotate(-90deg)" }} />
                </button>
              ))}

              {/* Configuración */}
              <p style={{ margin: "8px 0 0", padding: "8px 20px 5px", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#b0b8c8", textTransform: "uppercase", borderTop: "1px solid #f0f0f0" }}>Configuración</p>
              {CONFIG_TABS.map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => openConfig(id)}
                  style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 20px", background: tab === id ? `${PRIMARY}0f` : "none", border: "none", borderLeft: tab === id ? `3px solid ${PRIMARY}` : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "background .12s" }}
                  onMouseEnter={(e) => { if (tab !== id) e.currentTarget.style.background = "#f5f7fa"; }}
                  onMouseLeave={(e) => { if (tab !== id) e.currentTarget.style.background = "none"; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: tab === id ? `${PRIMARY}1a` : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={13} color={tab === id ? PRIMARY : "#6b7280"} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: tab === id ? 700 : 500, color: tab === id ? PRIMARY : "#374151", flex: 1 }}>{label}</span>
                  <Icon name="chevronDown" size={11} color="#d1d5db" style={{ transform: "rotate(-90deg)" }} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
