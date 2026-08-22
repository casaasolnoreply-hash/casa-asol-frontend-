import { useState, useEffect, useCallback } from "react";

/* ─── PERSIST HELPER ─── */
function useLocalState(key, def) {
  const [s, set] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch { return def; }
  });
  const setS = useCallback((v) => {
    set(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [s, setS];
}

/* ─── MINI COMPONENTS ─── */
function Toggle({ on, onChange, sm }) {
  const w = sm ? 32 : 42, h = sm ? 18 : 24, d = sm ? 14 : 18;
  return (
    <div onClick={onChange} style={{ width: w, height: h, borderRadius: h, background: on ? "#1e88e5" : "#ccc", position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: (h - d) / 2, left: on ? w - d - (h - d) / 2 : (h - d) / 2, width: d, height: d, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </div>
  );
}

function Field({ label, value, onChange, textarea, placeholder }) {
  const s = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 4, letterSpacing: .5 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={{ ...s, minHeight: 72 }} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={s} placeholder={placeholder} />}
    </div>
  );
}

/* ─── CONSTANTS ─── */
const P = "#1e88e5";
const DARK = "#1a1a2e";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

/* ─── DEFAULT DATA ─── */
const DC = {
  topbar: { address: "10a Calle 2-25, Zona 16, Santa Rosita, 01016 Guatemala", phone: "(+502) 2255 9450" },
  hero: { bgUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400", title: "CASA ESTUDIANTIL ASOL", subtitle: "Oportunidades y protección para los niños frente a desventaja y violencia.", btn1Text: "CONOCER MÁS", btn1Href: "#programa", btn2Text: "AYUDAR Y DONAR", btn2Href: "#financiacion" },
  historia: { supertitle: "NUESTRA HISTORIA", title: "Un sueño que se convirtió en hogar", text1: "Casa ASOL nació en 2009 con la misión de brindar un espacio seguro para niños y jóvenes guatemaltecos en situación de vulnerabilidad. Fundada por un grupo de voluntarios austriacos y guatemaltecos, la casa comenzó con tan solo 8 estudiantes en una pequeña vivienda de la Zona 16.", text2: "Con el paso de los años, ASOL ha crecido hasta convertirse en un referente de protección estudiantil en Guatemala, combinando el apoyo académico, emocional y social para garantizar que cada niño tenga la oportunidad de construir un futuro digno.", quote: "Cada niño que llega a ASOL trae consigo una historia de resiliencia. Nuestro trabajo es asegurarnos de que esa historia tenga un final brillante.", quoteAuthor: "— Fundadora, Casa ASOL" },
  financiacion: { supertitle: "AYUDAR Y DONAR", title: "Tu apoyo cambia vidas", desc: "Con tu donación mensual ayudas a garantizar educación, alimentación y un hogar seguro para niños guatemaltecos en situación de vulnerabilidad.", amounts: ["Q50 / mes", "Q100 / mes", "Q250 / mes", "Otra cantidad"], btnText: "DONAR AHORA" },
  voluntariado: { supertitle: "VOLUNTARIADO", title: "Únete como voluntario", desc: "Buscamos personas comprometidas que quieran dedicar su tiempo y talento a transformar la vida de niños y jóvenes guatemaltecos.", list: ["Apoyo educativo (tutorías y refuerzo)", "Talleres de arte y manualidades", "Actividades deportivas y recreativas", "Asistencia administrativa y comunicación"], btnText: "QUIERO VOLUNTARIAR" },
  contacto: { supertitle: "CONTACTO", title: "Ponte en contacto con nosotros", items: [{ icon: "📍", title: "Dirección", val: "10a Calle 2-25, Zona 16, Santa Rosita, 01016 Guatemala" }, { icon: "📞", title: "Teléfono", val: "(+502) 2255 9450" }, { icon: "✉️", title: "Correo", val: "info@casaasol.org" }, { icon: "🕐", title: "Horario", val: "Lunes a Viernes, 8:00 – 17:00 hrs" }] },
  footer: { desc: "Oportunidades y protección para los niños frente a desventaja y violencia desde 2009." },
};
const DS = [{ id: 1, value: "120+", label: "Estudiantes beneficiados" }, { id: 2, value: "15", label: "Años de operación" }, { id: 3, value: "45", label: "Voluntarios activos" }, { id: 4, value: "98%", label: "Tasa de continuidad escolar" }];
const DP = [{ id: 1, icon: "📚", title: "Apoyo Escolar", desc: "Refuerzo académico diario para niños de primaria y básicos." }, { id: 2, icon: "🏠", title: "Alojamiento Seguro", desc: "Espacio de protección para estudiantes en riesgo de violencia." }, { id: 3, icon: "🍽️", title: "Alimentación", desc: "Tres comidas balanceadas al día para todos los residentes." }, { id: 4, icon: "🎨", title: "Arte y Deporte", desc: "Actividades extracurriculares para el desarrollo integral." }];
const DT = [{ id: 1, name: "Directora General", role: "Responsable de la visión y gestión de la casa", initials: "DG" }, { id: 2, name: "Coordinadora Pedagógica", role: "Diseño y seguimiento de programas educativos", initials: "CP" }, { id: 3, name: "Trabajadora Social", role: "Acompañamiento a familias en situación vulnerable", initials: "TS" }, { id: 4, name: "Psicóloga Clínica", role: "Apoyo emocional y terapéutico a los estudiantes", initials: "PC" }];
const DN = [
  { id: "home", label: "HOME", href: "#home", enabled: true },
  { id: "la-casa", label: "LA CASA", enabled: true, dropdown: [{ id: "equipo", label: "EL EQUIPO", href: "#equipo", enabled: true }, { id: "historia", label: "HISTORIA", href: "#historia", enabled: true }, { id: "programa", label: "PROGRAMA", href: "#programa", enabled: true }] },
  { id: "ayudar", label: "AYUDAR Y DONAR", enabled: true, dropdown: [{ id: "financiacion", label: "FINANCIACIÓN", href: "#financiacion", enabled: true }, { id: "voluntariado", label: "VOLUNTARIADO", href: "#voluntariado", enabled: true }] },
  { id: "contacto", label: "CONTACTO", href: "#contacto", enabled: true },
];
const DSEC = [{ id: "home", label: "Hero / Inicio", visible: true }, { id: "stats", label: "Estadísticas", visible: true }, { id: "historia", label: "Historia", visible: true }, { id: "programa", label: "Programa", visible: true }, { id: "equipo", label: "Equipo", visible: true }, { id: "financiacion", label: "Financiación", visible: true }, { id: "voluntariado", label: "Voluntariado", visible: true }, { id: "contacto", label: "Contacto", visible: true }];

/* ─── MAIN COMPONENT ─── */
export default function CasaASOL() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("nav");
  const [contentSub, setContentSub] = useState("hero");
  const [dataSub, setDataSub] = useState("stats");
  const [expandModal, setExpandModal] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addNavForm, setAddNavForm] = useState({ show: false, label: "", href: "" });
  const [addSubForm, setAddSubForm] = useState({ show: null, label: "", href: "" });

  const [content, setContent] = useLocalState("ca-content", DC);
  const [stats, setStats] = useLocalState("ca-stats", DS);
  const [programa, setPrograma] = useLocalState("ca-prog", DP);
  const [team, setTeam] = useLocalState("ca-team", DT);
  const [navItems, setNavItems] = useLocalState("ca-nav", DN);
  const [sections, setSections] = useLocalState("ca-sec", DSEC);

  useEffect(() => {
    const h = () => setOpenMenu(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const scrollTo = (href) => {
    const el = document.getElementById((href || "").replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false); setOpenMenu(null);
  };

  const vis = (id) => { const s = sections.find(x => x.id === id); return !s || s.visible; };

  const handleLogin = () => {
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      setIsAdmin(true); setShowLogin(false); setLoginUser(""); setLoginPass(""); setLoginErr("");
    } else { setLoginErr("Usuario o contraseña incorrectos"); }
  };

  /* content helpers */
  const upC = (sec, field, val) => setContent(c => ({ ...c, [sec]: { ...c[sec], [field]: val } }));
  const upStat = (id, f, v) => setStats(s => s.map(x => x.id === id ? { ...x, [f]: v } : x));
  const upProg = (id, f, v) => setPrograma(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));
  const upTeam = (id, f, v) => setTeam(t => t.map(x => x.id === id ? { ...x, [f]: v } : x));

  const upNavHref = (id, href) => setNavItems(n => n.map(x => x.id === id ? { ...x, href } : x));
  const upNavLabel = (id, label) => setNavItems(n => n.map(x => x.id === id ? { ...x, label } : x));
  const toggleNav = (id) => setNavItems(n => n.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  const removeNav = (id) => setNavItems(n => n.filter(x => x.id !== id));
  const addNav = () => { if (addNavForm.label) { setNavItems(n => [...n, { id: Date.now().toString(), label: addNavForm.label.toUpperCase(), href: addNavForm.href, enabled: true }]); setAddNavForm({ show: false, label: "", href: "" }); } };

  const upSubLabel = (pid, cid, label) => setNavItems(n => n.map(x => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map(d => d.id === cid ? { ...d, label } : d) } : x));
  const upSubHref = (pid, cid, href) => setNavItems(n => n.map(x => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map(d => d.id === cid ? { ...d, href } : d) } : x));
  const toggleSub = (pid, cid) => setNavItems(n => n.map(x => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map(d => d.id === cid ? { ...d, enabled: !d.enabled } : d) } : x));
  const removeSub = (pid, cid) => setNavItems(n => n.map(x => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.filter(d => d.id !== cid) } : x));
  const addSub = (pid) => { if (addSubForm.label) { setNavItems(n => n.map(x => x.id === pid && x.dropdown ? { ...x, dropdown: [...x.dropdown, { id: Date.now().toString(), label: addSubForm.label.toUpperCase(), href: addSubForm.href, enabled: true }] } : x)); setAddSubForm({ show: null, label: "", href: "" }); } };

  const toggleSec = (id) => setSections(s => s.map(x => x.id === id ? { ...x, visible: !x.visible } : x));

  const upAmt = (i, v) => setContent(c => ({ ...c, financiacion: { ...c.financiacion, amounts: c.financiacion.amounts.map((a, j) => i === j ? v : a) } }));
  const removeAmt = (i) => setContent(c => ({ ...c, financiacion: { ...c.financiacion, amounts: c.financiacion.amounts.filter((_, j) => j !== i) } }));
  const addAmt = () => setContent(c => ({ ...c, financiacion: { ...c.financiacion, amounts: [...c.financiacion.amounts, "Nueva cantidad"] } }));

  const upVol = (i, v) => setContent(c => ({ ...c, voluntariado: { ...c.voluntariado, list: c.voluntariado.list.map((a, j) => i === j ? v : a) } }));
  const removeVol = (i) => setContent(c => ({ ...c, voluntariado: { ...c.voluntariado, list: c.voluntariado.list.filter((_, j) => j !== i) } }));
  const addVol = () => setContent(c => ({ ...c, voluntariado: { ...c.voluntariado, list: [...c.voluntariado.list, "Nueva actividad"] } }));

  const upContact = (i, f, v) => setContent(c => ({ ...c, contacto: { ...c.contacto, items: c.contacto.items.map((x, j) => i === j ? { ...x, [f]: v } : x) } }));

  /* style shortcuts */
  const inp = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };
  const btnP = { padding: "8px 16px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" };
  const btnD = { padding: "4px 9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer", lineHeight: 1.4 };
  const btnG = { padding: "6px 12px", background: "#fff", color: "#555", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 12, cursor: "pointer" };
  const chipStyle = (active) => ({ padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? P : "#ddd"}`, background: active ? P : "#fff", color: active ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" });

  const ExpandBtn = ({ onClick, light }) => (
    <button onClick={onClick} title="Ver más grande" style={{ position: "absolute", top: 14, right: 14, background: light ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.07)", border: light ? "1px solid rgba(255,255,255,0.4)" : "none", color: light ? "#fff" : "#666", borderRadius: 6, padding: "5px 11px", cursor: "pointer", fontSize: 13, fontWeight: 600, backdropFilter: "blur(4px)", zIndex: 5 }}>
      ⤢ Ver más
    </button>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#333", minHeight: "100vh" }}>

      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", width: 360, boxShadow: "0 24px 64px rgba(0,0,0,.35)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <svg width="44" height="44" viewBox="0 0 36 36" style={{ marginBottom: 10 }}>
                <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
                <polygon points="18,4 26,20 10,20" fill={P} opacity=".8" />
              </svg>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#222" }}>Panel de Administración</h2>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>Ingresa tus credenciales</p>
            </div>
            <Field label="USUARIO" value={loginUser} onChange={setLoginUser} placeholder="admin" />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 4, letterSpacing: .5 }}>CONTRASEÑA</label>
              <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inp, width: "100%", padding: "8px 10px" }} />
            </div>
            {loginErr && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: "0 0 12px" }}>{loginErr}</p>}
            <button onClick={handleLogin} style={{ ...btnP, width: "100%", padding: "12px", fontSize: 14, marginBottom: 8 }}>INICIAR SESIÓN</button>
            <button onClick={() => { setShowLogin(false); setLoginErr(""); }} style={{ ...btnG, width: "100%", padding: "10px" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ── EXPAND MODAL ── */}
      {expandModal && (
        <div onClick={() => setExpandModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: "44px 52px", maxWidth: 820, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 96px rgba(0,0,0,.45)", position: "relative" }}>
            <button onClick={() => setExpandModal(null)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#aaa", lineHeight: 1 }}>×</button>
            <h2 style={{ margin: "0 0 28px", fontSize: 30, fontWeight: 800, color: P }}>{expandModal.title}</h2>
            <div style={{ fontSize: 17, lineHeight: 1.85, color: "#333" }}>{expandModal.content}</div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ── */}
      {showAdmin && (
        <>
          <div onClick={() => setShowAdmin(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1400 }} />
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 480, background: "#f4f6f8", boxShadow: "-6px 0 32px rgba(0,0,0,.2)", zIndex: 1500, display: "flex", flexDirection: "column" }}>
            {/* header */}
            <div style={{ background: DARK, color: "#fff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>⚙️ Panel de Administración</p>
                <p style={{ margin: 0, fontSize: 11, opacity: .6 }}>Casa ASOL — Editor de contenido</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setIsAdmin(false); setShowAdmin(false); }} style={{ ...btnD, padding: "5px 12px" }}>Cerrar sesión</button>
                <button onClick={() => setShowAdmin(false)} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            </div>
            {/* tabs */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", display: "flex", flexShrink: 0 }}>
              {[["nav", "Navegación"], ["sections", "Secciones"], ["content", "Contenido"], ["data", "Datos"]].map(([id, lbl]) => (
                <button key={id} onClick={() => setAdminTab(id)} style={{ flex: 1, padding: "11px 4px", background: "none", border: "none", borderBottom: adminTab === id ? `2px solid ${P}` : "2px solid transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: adminTab === id ? P : "#666" }}>{lbl}</button>
              ))}
            </div>
            {/* body */}
            <div style={{ overflowY: "auto", flex: 1, padding: 18 }}>

              {/* ── NAV TAB ── */}
              {adminTab === "nav" && (
                <div>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Gestiona las pestañas del menú principal.</p>
                  {navItems.map(item => (
                    <div key={item.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
                      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 7 }}>
                        <Toggle on={item.enabled} onChange={() => toggleNav(item.id)} sm />
                        <input value={item.label} onChange={e => upNavLabel(item.id, e.target.value)} style={{ ...inp, flex: 1, opacity: item.enabled ? 1 : .45 }} />
                        {item.dropdown
                          ? <span style={{ fontSize: 10, background: "#e3f0fb", color: P, borderRadius: 10, padding: "2px 7px", whiteSpace: "nowrap" }}>Menú</span>
                          : <input value={item.href || ""} onChange={e => upNavHref(item.id, e.target.value)} placeholder="#link" style={{ ...inp, width: 88, flex: "none" }} />
                        }
                        <button onClick={() => removeNav(item.id)} style={btnD}>×</button>
                      </div>
                      {item.dropdown && (
                        <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 12px 10px", background: "#fafafa" }}>
                          {item.dropdown.map(sub => (
                            <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                              <span style={{ color: "#ccc", fontSize: 13 }}>└</span>
                              <Toggle on={sub.enabled} onChange={() => toggleSub(item.id, sub.id)} sm />
                              <input value={sub.label} onChange={e => upSubLabel(item.id, sub.id, e.target.value)} style={{ ...inp, flex: 1, fontSize: 12, opacity: sub.enabled ? 1 : .45 }} />
                              <input value={sub.href || ""} onChange={e => upSubHref(item.id, sub.id, e.target.value)} placeholder="#link" style={{ ...inp, width: 80, flex: "none", fontSize: 12 }} />
                              <button onClick={() => removeSub(item.id, sub.id)} style={{ ...btnD, padding: "3px 7px" }}>×</button>
                            </div>
                          ))}
                          {addSubForm.show === item.id ? (
                            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                              <input autoFocus placeholder="Etiqueta" value={addSubForm.label} onChange={e => setAddSubForm(f => ({ ...f, label: e.target.value }))} style={{ ...inp, flex: 1, fontSize: 12 }} />
                              <input placeholder="#link" value={addSubForm.href} onChange={e => setAddSubForm(f => ({ ...f, href: e.target.value }))} style={{ ...inp, width: 76, flex: "none", fontSize: 12 }} />
                              <button onClick={() => addSub(item.id)} style={{ ...btnP, padding: "5px 10px" }}>+</button>
                              <button onClick={() => setAddSubForm({ show: null, label: "", href: "" })} style={btnG}>✕</button>
                            </div>
                          ) : (
                            <button onClick={() => setAddSubForm({ show: item.id, label: "", href: "" })} style={{ background: "none", border: "none", color: P, fontSize: 12, cursor: "pointer", padding: "2px 0", marginTop: 4 }}>+ Agregar subpestaña</button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {addNavForm.show ? (
                    <div style={{ background: "#fff", border: `1px solid ${P}`, borderRadius: 8, padding: 14, marginTop: 6 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: .5, margin: "0 0 10px" }}>NUEVA PESTAÑA</p>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <input autoFocus placeholder="Etiqueta" value={addNavForm.label} onChange={e => setAddNavForm(f => ({ ...f, label: e.target.value }))} style={{ ...inp, flex: 1 }} />
                        <input placeholder="#link o URL" value={addNavForm.href} onChange={e => setAddNavForm(f => ({ ...f, href: e.target.value }))} style={{ ...inp, width: 120, flex: "none" }} />
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={addNav} style={btnP}>Agregar</button>
                        <button onClick={() => setAddNavForm({ show: false, label: "", href: "" })} style={btnG}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setAddNavForm({ show: true, label: "", href: "" })} style={{ ...btnP, width: "100%", marginTop: 6 }}>+ Agregar pestaña</button>
                  )}
                  <button onClick={() => setNavItems(DN)} style={{ ...btnG, width: "100%", marginTop: 8, fontSize: 12 }}>↺ Restaurar por defecto</button>
                </div>
              )}

              {/* ── SECTIONS TAB ── */}
              {adminTab === "sections" && (
                <div>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Muestra u oculta secciones completas de la página.</p>
                  {sections.map(sec => (
                    <div key={sec.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: sec.visible ? "#222" : "#bbb" }}>{sec.label}</span>
                      <Toggle on={sec.visible} onChange={() => toggleSec(sec.id)} />
                    </div>
                  ))}
                  <button onClick={() => setSections(DSEC)} style={{ ...btnG, width: "100%", marginTop: 8, fontSize: 12 }}>↺ Restaurar por defecto</button>
                </div>
              )}

              {/* ── CONTENT TAB ── */}
              {adminTab === "content" && (
                <div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 18 }}>
                    {[["topbar", "Barra"], ["hero", "Hero"], ["historia", "Historia"], ["financiacion", "Donación"], ["voluntariado", "Voluntariado"], ["contacto", "Contacto"], ["footer", "Footer"]].map(([id, lbl]) => (
                      <button key={id} onClick={() => setContentSub(id)} style={chipStyle(contentSub === id)}>{lbl}</button>
                    ))}
                  </div>

                  {contentSub === "topbar" && <>
                    <Field label="DIRECCIÓN" value={content.topbar.address} onChange={v => upC("topbar", "address", v)} />
                    <Field label="TELÉFONO" value={content.topbar.phone} onChange={v => upC("topbar", "phone", v)} />
                  </>}

                  {contentSub === "hero" && <>
                    <Field label="TÍTULO PRINCIPAL" value={content.hero.title} onChange={v => upC("hero", "title", v)} />
                    <Field label="SUBTÍTULO" value={content.hero.subtitle} onChange={v => upC("hero", "subtitle", v)} textarea />
                    <Field label="URL IMAGEN DE FONDO" value={content.hero.bgUrl} onChange={v => upC("hero", "bgUrl", v)} />
                    <Field label="BOTÓN 1 — TEXTO" value={content.hero.btn1Text} onChange={v => upC("hero", "btn1Text", v)} />
                    <Field label="BOTÓN 1 — LINK" value={content.hero.btn1Href} onChange={v => upC("hero", "btn1Href", v)} />
                    <Field label="BOTÓN 2 — TEXTO" value={content.hero.btn2Text} onChange={v => upC("hero", "btn2Text", v)} />
                    <Field label="BOTÓN 2 — LINK" value={content.hero.btn2Href} onChange={v => upC("hero", "btn2Href", v)} />
                  </>}

                  {contentSub === "historia" && <>
                    <Field label="SUPERTÍTULO" value={content.historia.supertitle} onChange={v => upC("historia", "supertitle", v)} />
                    <Field label="TÍTULO" value={content.historia.title} onChange={v => upC("historia", "title", v)} />
                    <Field label="PÁRRAFO 1" value={content.historia.text1} onChange={v => upC("historia", "text1", v)} textarea />
                    <Field label="PÁRRAFO 2" value={content.historia.text2} onChange={v => upC("historia", "text2", v)} textarea />
                    <Field label="CITA" value={content.historia.quote} onChange={v => upC("historia", "quote", v)} textarea />
                    <Field label="AUTOR DE LA CITA" value={content.historia.quoteAuthor} onChange={v => upC("historia", "quoteAuthor", v)} />
                  </>}

                  {contentSub === "financiacion" && <>
                    <Field label="SUPERTÍTULO" value={content.financiacion.supertitle} onChange={v => upC("financiacion", "supertitle", v)} />
                    <Field label="TÍTULO" value={content.financiacion.title} onChange={v => upC("financiacion", "title", v)} />
                    <Field label="DESCRIPCIÓN" value={content.financiacion.desc} onChange={v => upC("financiacion", "desc", v)} textarea />
                    <Field label="TEXTO DEL BOTÓN" value={content.financiacion.btnText} onChange={v => upC("financiacion", "btnText", v)} />
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6, letterSpacing: .5 }}>MONTOS DE DONACIÓN</label>
                      {content.financiacion.amounts.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                          <input value={a} onChange={e => upAmt(i, e.target.value)} style={{ ...inp, flex: 1 }} />
                          <button onClick={() => removeAmt(i)} style={btnD}>×</button>
                        </div>
                      ))}
                      <button onClick={addAmt} style={{ ...btnG, fontSize: 12, marginTop: 2 }}>+ Agregar monto</button>
                    </div>
                  </>}

                  {contentSub === "voluntariado" && <>
                    <Field label="SUPERTÍTULO" value={content.voluntariado.supertitle} onChange={v => upC("voluntariado", "supertitle", v)} />
                    <Field label="TÍTULO" value={content.voluntariado.title} onChange={v => upC("voluntariado", "title", v)} />
                    <Field label="DESCRIPCIÓN" value={content.voluntariado.desc} onChange={v => upC("voluntariado", "desc", v)} textarea />
                    <Field label="TEXTO DEL BOTÓN" value={content.voluntariado.btnText} onChange={v => upC("voluntariado", "btnText", v)} />
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6, letterSpacing: .5 }}>LISTA DE ACTIVIDADES</label>
                      {content.voluntariado.list.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                          <input value={a} onChange={e => upVol(i, e.target.value)} style={{ ...inp, flex: 1 }} />
                          <button onClick={() => removeVol(i)} style={btnD}>×</button>
                        </div>
                      ))}
                      <button onClick={addVol} style={{ ...btnG, fontSize: 12, marginTop: 2 }}>+ Agregar item</button>
                    </div>
                  </>}

                  {contentSub === "contacto" && <>
                    <Field label="SUPERTÍTULO" value={content.contacto.supertitle} onChange={v => upC("contacto", "supertitle", v)} />
                    <Field label="TÍTULO" value={content.contacto.title} onChange={v => upC("contacto", "title", v)} />
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 8, letterSpacing: .5 }}>ÍTEMS DE CONTACTO</label>
                    {content.contacto.items.map((item, i) => (
                      <div key={i} style={{ background: "#f8f9fa", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                          <input value={item.icon} onChange={e => upContact(i, "icon", e.target.value)} style={{ ...inp, width: 48, flex: "none", textAlign: "center" }} />
                          <input value={item.title} onChange={e => upContact(i, "title", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Título" />
                        </div>
                        <input value={item.val} onChange={e => upContact(i, "val", e.target.value)} style={{ ...inp, width: "100%" }} placeholder="Valor" />
                      </div>
                    ))}
                  </>}

                  {contentSub === "footer" && <>
                    <Field label="DESCRIPCIÓN" value={content.footer.desc} onChange={v => upC("footer", "desc", v)} textarea />
                  </>}
                </div>
              )}

              {/* ── DATA TAB ── */}
              {adminTab === "data" && (
                <div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                    {[["stats", "Estadísticas"], ["programa", "Programa"], ["equipo", "Equipo"]].map(([id, lbl]) => (
                      <button key={id} onClick={() => setDataSub(id)} style={chipStyle(dataSub === id)}>{lbl}</button>
                    ))}
                  </div>

                  {dataSub === "stats" && <>
                    {stats.map(s => (
                      <div key={s.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input value={s.value} onChange={e => upStat(s.id, "value", e.target.value)} style={{ ...inp, width: 80, flex: "none", fontWeight: 700 }} placeholder="Valor" />
                          <input value={s.label} onChange={e => upStat(s.id, "label", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Etiqueta" />
                          <button onClick={() => setStats(x => x.filter(t => t.id !== s.id))} style={btnD}>×</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setStats(x => [...x, { id: Date.now(), value: "0", label: "Nueva estadística" }])} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar estadística</button>
                  </>}

                  {dataSub === "programa" && <>
                    {programa.map(p => (
                      <div key={p.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          <input value={p.icon} onChange={e => upProg(p.id, "icon", e.target.value)} style={{ ...inp, width: 46, flex: "none", textAlign: "center" }} />
                          <input value={p.title} onChange={e => upProg(p.id, "title", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Título" />
                          <button onClick={() => setPrograma(x => x.filter(t => t.id !== p.id))} style={btnD}>×</button>
                        </div>
                        <textarea value={p.desc} onChange={e => upProg(p.id, "desc", e.target.value)} style={{ ...inp, resize: "vertical", minHeight: 56, display: "block" }} placeholder="Descripción" />
                      </div>
                    ))}
                    <button onClick={() => setPrograma(x => [...x, { id: Date.now(), icon: "⭐", title: "Nuevo Programa", desc: "Descripción del programa." }])} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar programa</button>
                  </>}

                  {dataSub === "equipo" && <>
                    {team.map(m => (
                      <div key={m.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          <input value={m.initials} onChange={e => upTeam(m.id, "initials", e.target.value)} style={{ ...inp, width: 52, flex: "none", fontWeight: 700, textTransform: "uppercase" }} maxLength={3} placeholder="XX" />
                          <input value={m.name} onChange={e => upTeam(m.id, "name", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Nombre / Cargo" />
                          <button onClick={() => setTeam(x => x.filter(t => t.id !== m.id))} style={btnD}>×</button>
                        </div>
                        <input value={m.role} onChange={e => upTeam(m.id, "role", e.target.value)} style={{ ...inp, width: "100%" }} placeholder="Descripción del rol" />
                      </div>
                    ))}
                    <button onClick={() => setTeam(x => [...x, { id: Date.now(), name: "Nuevo Miembro", role: "Descripción del rol", initials: "NM" }])} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar miembro</button>
                  </>}
                </div>
              )}
            </div>
            <div style={{ padding: "10px 18px", background: "#fff", borderTop: "1px solid #e8e8e8", fontSize: 11, color: "#aaa", textAlign: "center", flexShrink: 0 }}>
              Los cambios se guardan automáticamente en este dispositivo
            </div>
          </div>
        </>
      )}

      {/* ── TOP BAR ── */}
      <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e0e0e0", padding: "8px 0", fontSize: 13 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <span><strong>Dirección</strong> {content.topbar.address}</span>
            <span><strong>Teléfono</strong> {content.topbar.phone}</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {[["F", "#3b5998"], ["in", "#0077b5"], ["📷", "#e1306c"]].map(([s, c]) => (
              <span key={s} style={{ width: 28, height: 28, background: "#ddd", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, fontWeight: "bold", color: "#555" }}>{s}</span>
            ))}
            {isAdmin
              ? <button onClick={() => setShowAdmin(true)} style={{ padding: "4px 12px", background: DARK, color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>⚙️ Admin</button>
              : <button onClick={() => setShowLogin(true)} style={{ padding: "4px 10px", background: "transparent", color: "#999", border: "1px solid #ccc", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Admin</button>
            }
          </div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => scrollTo("#home")}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
              <polygon points="18,4 26,20 10,20" fill={P} opacity=".7" />
              <line x1="10" y1="30" x2="18" y2="18" stroke={P} strokeWidth="2" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 18, color: P, letterSpacing: 1 }}>SOL</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navItems.filter(x => x.enabled).map(item => (
              <div key={item.id} style={{ position: "relative" }}
                onMouseEnter={() => item.dropdown && setOpenMenu(item.id)}
                onMouseLeave={() => setOpenMenu(null)}>
                <button onClick={e => { e.stopPropagation(); item.dropdown ? setOpenMenu(openMenu === item.id ? null : item.id) : scrollTo(item.href); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#555", letterSpacing: .5, display: "flex", alignItems: "center", gap: 4, borderBottom: "2px solid transparent", transition: "color .2s" }}>
                  {item.label}{item.dropdown && <span style={{ fontSize: 9 }}>▾</span>}
                </button>
                {item.dropdown && openMenu === item.id && (
                  <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 180, background: P, borderRadius: "0 0 6px 6px", boxShadow: "0 4px 12px rgba(0,0,0,.15)", zIndex: 200, overflow: "hidden" }}>
                    {item.dropdown.filter(s => s.enabled).map(sub => (
                      <button key={sub.id} onClick={e => { e.stopPropagation(); scrollTo(sub.href); setOpenMenu(null); }}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 18px", background: "none", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.15)" }}
                        onMouseEnter={e => e.target.style.background = "rgba(255,255,255,.15)"}
                        onMouseLeave={e => e.target.style.background = "none"}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#555" }}>☰</button>
        </div>
        {mobileOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "12px 20px" }}>
            {navItems.filter(x => x.enabled).map(item => (
              <div key={item.id}>
                <button onClick={() => item.href && scrollTo(item.href)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", background: "none", border: "none", fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>{item.label}</button>
                {item.dropdown && item.dropdown.filter(s => s.enabled).map(sub => (
                  <button key={sub.id} onClick={() => scrollTo(sub.href)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0 8px 16px", background: "none", border: "none", fontSize: 13, color: P, cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>{sub.label}</button>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      {vis("home") && (
        <section id="home" style={{ position: "relative", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${content.hero.bgUrl}')center/cover no-repeat`, color: "#fff", textAlign: "center", padding: "80px 20px" }}>
          <ExpandBtn light onClick={() => setExpandModal({ title: content.hero.title, content: <div><p style={{ fontSize: 20, color: "#555", lineHeight: 1.8, marginBottom: 28 }}>{content.hero.subtitle}</p><div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><button style={{ padding: "14px 32px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{content.hero.btn1Text}</button><button style={{ padding: "14px 32px", background: "transparent", color: P, border: `2px solid ${P}`, borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{content.hero.btn2Text}</button></div></div> })} />
          <div>
            <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "0 0 18px", letterSpacing: 2, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>{content.hero.title}</h1>
            <p style={{ fontSize: "clamp(15px,2vw,20px)", maxWidth: 600, margin: "0 auto 32px", opacity: .95, lineHeight: 1.6 }}>{content.hero.subtitle}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => scrollTo(content.hero.btn1Href)} style={{ padding: "12px 28px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .5 }}>{content.hero.btn1Text}</button>
              <button onClick={() => scrollTo(content.hero.btn2Href)} style={{ padding: "12px 28px", background: "transparent", color: "#fff", border: "2px solid #fff", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .5 }}>{content.hero.btn2Text}</button>
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      {vis("stats") && (
        <section style={{ background: P, padding: "40px 20px", position: "relative" }}>
          <ExpandBtn light onClick={() => setExpandModal({ title: "Estadísticas", content: <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 36, textAlign: "center", padding: "16px 0" }}>{stats.map(s => <div key={s.id}><div style={{ fontSize: 72, fontWeight: 800, color: P }}>{s.value}</div><div style={{ fontSize: 20, color: "#444", marginTop: 10 }}>{s.label}</div></div>)}</div> })} />
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24, textAlign: "center" }}>
            {stats.map(s => (
              <div key={s.id}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── HISTORIA ── */}
      {vis("historia") && (
        <section id="historia" style={{ padding: "70px 20px", background: "#fff", position: "relative" }}>
          <ExpandBtn onClick={() => setExpandModal({ title: content.historia.title, content: <div><p style={{ color: P, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>{content.historia.supertitle}</p><p style={{ fontSize: 17, lineHeight: 1.9, color: "#444", marginBottom: 20 }}>{content.historia.text1}</p><p style={{ fontSize: 17, lineHeight: 1.9, color: "#444", marginBottom: 32 }}>{content.historia.text2}</p><div style={{ background: "#f0f7ff", borderRadius: 10, padding: "28px 32px", borderLeft: `5px solid ${P}` }}><p style={{ fontStyle: "italic", color: "#333", lineHeight: 1.85, fontSize: 19, margin: "0 0 16px" }}>"{content.historia.quote}"</p><p style={{ color: P, fontWeight: 700, fontSize: 15, margin: 0 }}>{content.historia.quoteAuthor}</p></div></div> })} />
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{content.historia.supertitle}</p>
            <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 20, color: "#222" }}>{content.historia.title}</h2>
            <div style={{ width: 50, height: 3, background: P, margin: "0 auto 32px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <p style={{ lineHeight: 1.8, color: "#555", marginBottom: 16 }}>{content.historia.text1}</p>
                <p style={{ lineHeight: 1.8, color: "#555" }}>{content.historia.text2}</p>
              </div>
              <div style={{ background: "#f0f7ff", borderRadius: 8, padding: 28, borderLeft: `4px solid ${P}` }}>
                <p style={{ fontStyle: "italic", color: "#444", lineHeight: 1.8, fontSize: 15 }}>"{content.historia.quote}"</p>
                <p style={{ marginTop: 16, color: P, fontWeight: 600, fontSize: 13 }}>{content.historia.quoteAuthor}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PROGRAMA ── */}
      {vis("programa") && (
        <section id="programa" style={{ padding: "70px 20px", background: "#f8f9fa" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <p style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>NUESTRO PROGRAMA</p>
            <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>Cómo transformamos vidas</h2>
            <div style={{ width: 50, height: 3, background: P, margin: "0 auto 40px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
              {programa.map(p => (
                <div key={p.id} style={{ position: "relative", background: "#fff", borderRadius: 8, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.06)", borderTop: `3px solid ${P}`, transition: "transform .2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <button onClick={() => setExpandModal({ title: p.title, content: <div style={{ textAlign: "center" }}><div style={{ fontSize: 80, marginBottom: 28 }}>{p.icon}</div><p style={{ fontSize: 19, lineHeight: 1.9, color: "#444" }}>{p.desc}</p></div> })} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.06)", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 12, color: "#777" }}>⤢</button>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EQUIPO ── */}
      {vis("equipo") && (
        <section id="equipo" style={{ padding: "70px 20px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>NUESTRO EQUIPO</p>
            <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>Las personas detrás de ASOL</h2>
            <div style={{ width: 50, height: 3, background: P, margin: "0 auto 40px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 24 }}>
              {team.map(m => (
                <div key={m.id} style={{ position: "relative", textAlign: "center", padding: 20 }}>
                  <button onClick={() => setExpandModal({ title: m.name, content: <div style={{ textAlign: "center" }}><div style={{ width: 130, height: 130, borderRadius: "50%", background: "#e3f0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: P, margin: "0 auto 28px", border: `3px solid ${P}` }}>{m.initials}</div><p style={{ fontSize: 24, fontWeight: 700, color: "#222", marginBottom: 14 }}>{m.name}</p><p style={{ fontSize: 18, color: "#666", lineHeight: 1.7 }}>{m.role}</p></div> })} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.06)", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 12, color: "#777" }}>⤢</button>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e3f0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: P, margin: "0 auto 14px", border: `2px solid ${P}` }}>{m.initials}</div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#222", margin: "0 0 4px" }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, margin: 0 }}>{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINANCIACIÓN ── */}
      {vis("financiacion") && (
        <section id="financiacion" style={{ padding: "70px 20px", background: P, position: "relative" }}>
          <ExpandBtn light onClick={() => setExpandModal({ title: content.financiacion.title, content: <div><p style={{ fontSize: 18, color: "#555", lineHeight: 1.85, marginBottom: 32 }}>{content.financiacion.desc}</p><div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32, justifyContent: "center" }}>{content.financiacion.amounts.map(a => <button key={a} style={{ padding: "16px 32px", background: "#fff", color: P, border: `2px solid ${P}`, borderRadius: 6, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{a}</button>)}</div><div style={{ textAlign: "center" }}><button style={{ padding: "16px 48px", background: P, color: "#fff", border: "none", borderRadius: 6, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{content.financiacion.btnText}</button></div></div> })} />
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#fff" }}>
            <p style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 8, opacity: .85 }}>{content.financiacion.supertitle}</p>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>{content.financiacion.title}</h2>
            <p style={{ opacity: .9, lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>{content.financiacion.desc}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              {content.financiacion.amounts.map(amt => (
                <button key={amt} style={{ padding: "12px 24px", background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.5)", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => { e.target.style.background = "#fff"; e.target.style.color = P; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,.15)"; e.target.style.color = "#fff"; }}>
                  {amt}
                </button>
              ))}
            </div>
            <button style={{ padding: "14px 40px", background: "#fff", color: P, border: "none", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: .5 }}>{content.financiacion.btnText}</button>
          </div>
        </section>
      )}

      {/* ── VOLUNTARIADO ── */}
      {vis("voluntariado") && (
        <section id="voluntariado" style={{ padding: "70px 20px", background: "#f8f9fa", position: "relative" }}>
          <ExpandBtn onClick={() => setExpandModal({ title: content.voluntariado.title, content: <div><p style={{ color: P, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>{content.voluntariado.supertitle}</p><p style={{ fontSize: 17, color: "#555", lineHeight: 1.85, marginBottom: 28 }}>{content.voluntariado.desc}</p><ul style={{ color: "#444", lineHeight: 2.2, paddingLeft: 24, fontSize: 17 }}>{content.voluntariado.list.map((item, i) => <li key={i}>{item}</li>)}</ul></div> })} />
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <p style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>{content.voluntariado.supertitle}</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: "#222" }}>{content.voluntariado.title}</h2>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 20 }}>{content.voluntariado.desc}</p>
              <ul style={{ color: "#555", lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
                {content.voluntariado.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <button style={{ padding: "12px 28px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{content.voluntariado.btnText}</button>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,.07)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#222", marginBottom: 20 }}>Registrarme como voluntario</h3>
              {["Nombre completo", "Correo electrónico", "Teléfono"].map(f => (
                <div key={f} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>{f.toUpperCase()}</label>
                  <input type="text" placeholder={f} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>ÁREA DE INTERÉS</label>
                <select style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box" }}>
                  <option>Seleccionar...</option>
                  <option>Apoyo educativo</option>
                  <option>Arte y manualidades</option>
                  <option>Deporte</option>
                  <option>Administración</option>
                </select>
              </div>
              <button style={{ width: "100%", padding: "12px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>ENVIAR SOLICITUD</button>
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACTO ── */}
      {vis("contacto") && (
        <section id="contacto" style={{ padding: "70px 20px", background: "#fff", position: "relative" }}>
          <ExpandBtn onClick={() => setExpandModal({ title: content.contacto.title, content: <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>{content.contacto.items.map((c, i) => <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}><span style={{ fontSize: 34 }}>{c.icon}</span><div><p style={{ fontWeight: 700, fontSize: 17, color: P, margin: "0 0 6px" }}>{c.title}</p><p style={{ color: "#444", margin: 0, fontSize: 16, lineHeight: 1.7 }}>{c.val}</p></div></div>)}</div> })} />
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{content.contacto.supertitle}</p>
            <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>{content.contacto.title}</h2>
            <div style={{ width: 50, height: 3, background: P, margin: "0 auto 40px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                {content.contacto.items.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                    <span style={{ fontSize: 20, marginTop: 2 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: P, margin: "0 0 3px" }}>{c.title}</p>
                      <p style={{ color: "#555", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {["Nombre", "Correo electrónico", "Asunto"].map(f => (
                  <div key={f} style={{ marginBottom: 14 }}>
                    <input type="text" placeholder={f} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                ))}
                <textarea placeholder="Mensaje" rows={4} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
                <button style={{ marginTop: 12, padding: "12px 28px", background: P, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" }}>ENVIAR MENSAJE</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: DARK, color: "#ccc", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <svg width="28" height="28" viewBox="0 0 36 36">
                <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
                <polygon points="18,4 26,20 10,20" fill={P} opacity=".8" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Casa ASOL</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "#aaa" }}>{content.footer.desc}</p>
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>LA CASA</p>
            {["El Equipo", "Historia", "Programa"].map(l => <p key={l} style={{ margin: "0 0 8px" }}><a href="#" style={{ color: "#aaa", textDecoration: "none", fontSize: 13 }}>{l}</a></p>)}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>AYUDAR</p>
            {["Financiación", "Voluntariado"].map(l => <p key={l} style={{ margin: "0 0 8px" }}><a href="#" style={{ color: "#aaa", textDecoration: "none", fontSize: 13 }}>{l}</a></p>)}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>CONTACTO</p>
            <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>{content.topbar.address}<br />{content.topbar.phone}</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #333", marginTop: 32, paddingTop: 20, textAlign: "center", fontSize: 12, color: "#666" }}>
          © {new Date().getFullYear()} Casa Estudiantil ASOL. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
