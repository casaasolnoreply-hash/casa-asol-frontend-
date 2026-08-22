import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { api } from "../api/client";
import {
  DEFAULT_CONTENT, DEFAULT_STATS, DEFAULT_PROGRAMA,
  DEFAULT_TEAM, DEFAULT_NAV, DEFAULT_SECTIONS,
} from "../constants/defaults";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── Contenido del sitio ── */
  const [content,  setContent]  = useState(DEFAULT_CONTENT);
  const [stats,    setStats]    = useState(DEFAULT_STATS);
  const [programa, setPrograma] = useState(DEFAULT_PROGRAMA);
  const [team,     setTeam]     = useState(DEFAULT_TEAM);
  const [navItems, setNavItems] = useState(DEFAULT_NAV);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [messages, setMessages] = useState([]);

  /* ── Estado de UI ── */
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [backendError, setBackendError] = useState(false);

  /* ── Refs para el guardado ── */
  // useRef para el flag de inicialización: siempre lee el valor actual sin depender de closures
  const initialized = useRef(false);
  const saveTimers  = useRef({});

  /* ── Auth ── */
  const [isAdmin,  setIsAdmin]  = useState(() => !!sessionStorage.getItem("ca-token"));
  const [authUser, setAuthUser] = useState(null);

  /* ── Carga inicial desde backend ── */
  useEffect(() => {
    const token = sessionStorage.getItem("ca-token");

    if (token) {
      api.me()
        .then((d) => {
          setIsAdmin(true);
          setAuthUser({ user: d.user, role: d.role, photoUrl: d.photoUrl, mustChangePassword: d.mustChangePassword, permissions: d.permissions });
          // Solo se piden mensajes si el rol de verdad tiene el permiso —
          // evita un 403 innecesario en cada carga para el resto de roles.
          if (d.role === "desarrollador" || d.permissions?.viewMessages) {
            api.getMessages().then(setMessages).catch(() => {});
          }
        })
        .catch(() => { sessionStorage.removeItem("ca-token"); setIsAdmin(false); });
    }

    const loadAll = async () => {
      try {
        const [cRes, sRes, pRes, tRes, nRes, secRes] = await Promise.all([
          api.getData("content"),
          api.getData("stats"),
          api.getData("programa"),
          api.getData("team"),
          api.getData("nav"),
          api.getData("sections"),
        ]);

        if (cRes.value != null) {
          const loaded = cRes.value;
          // Migrate legacy btn1/btn2 fields → buttons array for data saved before this feature
          if (!loaded.hero?.buttons?.length) {
            loaded.hero = { ...(loaded.hero || {}) };
            loaded.hero.buttons = [
              { text: loaded.hero.btn1Text || "CONOCER MÁS",    href: loaded.hero.btn1Href || "#programa",     style: "primary" },
              { text: loaded.hero.btn2Text || "AYUDAR Y DONAR", href: loaded.hero.btn2Href || "#financiacion", style: "outline" },
            ];
          }
          setContent(loaded);
        }
        if (sRes.value   != null) setStats(sRes.value);
        if (pRes.value   != null) setPrograma(pRes.value);
        if (tRes.value   != null) setTeam(tRes.value);
        if (nRes.value   != null) setNavItems(nRes.value);
        if (secRes.value != null) setSections(secRes.value);
      } catch (err) {
        // TypeError = sin red / backend caído
        if (err instanceof TypeError || err.message?.toLowerCase().includes("fetch")) {
          setBackendError(true);
        } else {
          console.warn("Error cargando datos:", err.message);
        }
      } finally {
        // Marcar como listo DESPUÉS de que React procese los setState anteriores
        // usando setTimeout(0) garantiza que los efectos de la carga no disparen guardados
        setTimeout(() => {
          initialized.current = true;
          setLoading(false);
        }, 0);
      }
    };

    loadAll();
  }, []);

  /* ── scheduleSave: usa refs, no depende de closures de estado ── */
  const scheduleSave = useCallback((key, value) => {
    // initialized.current siempre lee el valor actual (ref, no closure)
    if (!initialized.current) return;
    if (!sessionStorage.getItem("ca-token")) return;

    // Mostrar indicador inmediatamente al hacer el cambio
    setSaving(true);

    clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      try {
        await api.setData(key, value);
      } catch (err) {
        console.error(`Error al guardar "${key}":`, err.message);
      } finally {
        saveTimers.current[key] = null;
        // Ocultar indicador solo cuando no haya más guardados pendientes
        const anyPending = Object.values(saveTimers.current).some(Boolean);
        if (!anyPending) setSaving(false);
      }
    }, 1500);
  }, []); // deps vacías: es estable porque solo lee refs

  /* ── Efectos de auto-guardado (uno por clave) ── */
  useEffect(() => { scheduleSave("content",  content);  }, [content,  scheduleSave]);
  useEffect(() => { scheduleSave("stats",    stats);    }, [stats,    scheduleSave]);
  useEffect(() => { scheduleSave("programa", programa); }, [programa, scheduleSave]);
  useEffect(() => { scheduleSave("team",     team);     }, [team,     scheduleSave]);
  useEffect(() => { scheduleSave("nav",      navItems); }, [navItems, scheduleSave]);
  useEffect(() => { scheduleSave("sections", sections); }, [sections, scheduleSave]);

  /* ── Auth ── */
  const login = (token, userData) => {
    sessionStorage.setItem("ca-token", token);
    setIsAdmin(true);
    setAuthUser(userData); // { user, role, photoUrl, permissions }
    if (userData.role === "desarrollador" || userData.permissions?.viewMessages) {
      api.getMessages().then(setMessages).catch(() => {});
    }
  };
  const logout = () => {
    sessionStorage.removeItem("ca-token");
    setIsAdmin(false);
    setAuthUser(null);
    setMessages([]);
  };

  /* ── Subir imagen via backend ── */
  const uploadImage = async (file) => {
    const token = sessionStorage.getItem("ca-token");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/upload`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al subir imagen");
    return data.url;
  };

  /* ── UI ── */
  const [expandModal, setExpandModal] = useState(null);

  const scrollTo = (href) => {
    const el = document.getElementById((href || "").replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isSectionVisible = (id) => {
    const s = sections.find((x) => x.id === id);
    return !s || s.visible;
  };

  /* ── Actualizadores de contenido ── */
  const upC = (sec, field, val) =>
    setContent((c) => ({ ...c, [sec]: { ...c[sec], [field]: val } }));

  const upAmt = (i, v) =>
    setContent((c) => ({ ...c, financiacion: { ...c.financiacion, amounts: c.financiacion.amounts.map((a, j) => j === i ? v : a) } }));
  const removeAmt = (i) =>
    setContent((c) => ({ ...c, financiacion: { ...c.financiacion, amounts: c.financiacion.amounts.filter((_, j) => j !== i) } }));
  const addAmt = (val = "") =>
    setContent((c) => ({ ...c, financiacion: { ...c.financiacion, amounts: [...c.financiacion.amounts, val] } }));

  const upVol = (i, v) =>
    setContent((c) => ({ ...c, voluntariado: { ...c.voluntariado, list: c.voluntariado.list.map((a, j) => j === i ? v : a) } }));
  const removeVol = (i) =>
    setContent((c) => ({ ...c, voluntariado: { ...c.voluntariado, list: c.voluntariado.list.filter((_, j) => j !== i) } }));
  const addVol = (val = "") =>
    setContent((c) => ({ ...c, voluntariado: { ...c.voluntariado, list: [...c.voluntariado.list, val] } }));

  const upContact = (i, field, val) =>
    setContent((c) => ({ ...c, contacto: { ...c.contacto, items: c.contacto.items.map((x, j) => j === i ? { ...x, [field]: val } : x) } }));
  const addContactItem = (item = {}) =>
    setContent((c) => ({ ...c, contacto: { ...c.contacto, items: [...c.contacto.items, { icon: "mail", title: "Título", val: "Valor", ...item }] } }));
  const removeContactItem = (i) =>
    setContent((c) => ({ ...c, contacto: { ...c.contacto, items: c.contacto.items.filter((_, j) => j !== i) } }));

  const addDonacionImage    = (url) => setContent((c) => ({ ...c, financiacion: { ...c.financiacion, donacionImages: [...(c.financiacion.donacionImages || []), url] } }));
  const removeDonacionImage = (idx) => setContent((c) => ({ ...c, financiacion: { ...c.financiacion, donacionImages: (c.financiacion.donacionImages || []).filter((_, i) => i !== idx) } }));

  const _getParas = (h) => h.paragraphs !== undefined ? h.paragraphs : [h.text1, h.text2].filter(Boolean);
  const addHistoriaParagraph    = (text) => setContent((c) => ({ ...c, historia: { ...c.historia, paragraphs: [..._getParas(c.historia), text] } }));
  const removeHistoriaParagraph = (idx)  => setContent((c) => ({ ...c, historia: { ...c.historia, paragraphs: _getParas(c.historia).filter((_, i) => i !== idx) } }));
  const upHistoriaParagraph     = (idx, val) => setContent((c) => ({ ...c, historia: { ...c.historia, paragraphs: _getParas(c.historia).map((p, i) => i === idx ? val : p) } }));

  /* ── Hero buttons ── */
  const _getButtons = (h) => h.buttons || [];
  const addHeroButton    = ()           => setContent((c) => ({ ...c, hero: { ...c.hero, buttons: [..._getButtons(c.hero), { text: "NUEVO BOTÓN", href: "#home", style: "primary" }] } }));
  const removeHeroButton = (idx)        => setContent((c) => ({ ...c, hero: { ...c.hero, buttons: _getButtons(c.hero).filter((_, i) => i !== idx) } }));
  const upHeroButton     = (idx, f, v)  => setContent((c) => ({ ...c, hero: { ...c.hero, buttons: _getButtons(c.hero).map((b, i) => i === idx ? { ...b, [f]: v } : b) } }));

  /* ── Stats ── */
  const upStat     = (id, f, v) => setStats((s) => s.map((x) => x.id === id ? { ...x, [f]: v } : x));
  const removeStat = (id)       => setStats((s) => s.filter((x) => x.id !== id));
  const addStat    = (d = {})   => setStats((s) => [...s, { id: Date.now(), value: "0", label: "Nueva estadística", ...d }]);

  /* ── Programa ── */
  const upProg          = (id, f, v) => setPrograma((p) => p.map((x) => x.id === id ? { ...x, [f]: v } : x));
  const removeProg      = (id)       => setPrograma((p) => p.filter((x) => x.id !== id));
  const addProg         = (d = {})   => setPrograma((p) => [...p, { id: Date.now(), icon: "star", title: "Nuevo Programa", desc: "Descripción del programa.", images: [], ...d }]);
  const addProgImage    = (id, url)  => setPrograma((p) => p.map((x) => x.id === id ? { ...x, images: [...(x.images || []), url] } : x));
  const removeProgImage = (id, idx)  => setPrograma((p) => p.map((x) => x.id === id ? { ...x, images: (x.images || []).filter((_, i) => i !== idx) } : x));

  /* ── Equipo ── */
  const upTeam        = (id, f, v) => setTeam((t) => t.map((x) => x.id === id ? { ...x, [f]: v } : x));
  const removeTeam    = (id)       => setTeam((t) => t.filter((x) => x.id !== id));
  const addTeamMember = (d = {})   => setTeam((t) => [...t, { id: Date.now(), initials: "NM", name: "Nuevo Miembro", role: "Descripción del rol", photoUrl: "", ...d }]);

  /* ── Nav ── */
  const toggleNav   = (id)          => setNavItems((n) => n.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  const upNavLabel  = (id, label)   => setNavItems((n) => n.map((x) => x.id === id ? { ...x, label }  : x));
  const upNavHref   = (id, href)    => setNavItems((n) => n.map((x) => x.id === id ? { ...x, href }   : x));
  const removeNav   = (id)          => setNavItems((n) => n.filter((x) => x.id !== id));
  const addNavItem  = (label, href) => setNavItems((n) => [...n, { id: Date.now().toString(), label: label.toUpperCase(), href, enabled: true }]);

  const toggleSub  = (pid, cid)         => setNavItems((n) => n.map((x) => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map((d) => d.id === cid ? { ...d, enabled: !d.enabled } : d) } : x));
  const upSubLabel = (pid, cid, label)  => setNavItems((n) => n.map((x) => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map((d) => d.id === cid ? { ...d, label } : d) } : x));
  const upSubHref  = (pid, cid, href)   => setNavItems((n) => n.map((x) => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.map((d) => d.id === cid ? { ...d, href }  : d) } : x));
  const removeSub  = (pid, cid)         => setNavItems((n) => n.map((x) => x.id === pid && x.dropdown ? { ...x, dropdown: x.dropdown.filter((d) => d.id !== cid) } : x));
  const addSubItem = (pid, label, href) => setNavItems((n) => n.map((x) => x.id === pid && x.dropdown ? { ...x, dropdown: [...x.dropdown, { id: Date.now().toString(), label: label.toUpperCase(), href, enabled: true }] } : x));

  /* ── Secciones ── */
  const toggleSection = (id) => setSections((s) => s.map((x) => x.id === id ? { ...x, visible: !x.visible } : x));

  /* ── Mensajes via backend ── */
  const addMessage = async (msg) => {
    const result = await api.createMessage(msg);
    setMessages((m) => [{ id: result.id, date: new Date().toISOString(), read: false, ...msg }, ...m]);
  };
  const deleteMessage = async (id) => {
    await api.deleteMessage(id);
    setMessages((m) => m.filter((x) => x.id !== id));
  };
  const markRead = async (id) => {
    await api.markRead(id);
    setMessages((m) => m.map((x) => x.id === id ? { ...x, read: true } : x));
  };
  const markAllRead = async () => {
    await api.markAllRead();
    setMessages((m) => m.map((x) => ({ ...x, read: true })));
  };
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AppContext.Provider value={{
      content, stats, programa, team, navItems, sections,
      messages, isAdmin, authUser, expandModal, loading, saving, backendError,
      setContent, setStats, setPrograma, setTeam, setNavItems, setSections,
      setExpandModal, setMessages, setAuthUser,
      login, logout, uploadImage,
      scrollTo, isSectionVisible,
      upC, upAmt, removeAmt, addAmt, upVol, removeVol, addVol,
      upContact, addContactItem, removeContactItem,
      addHistoriaParagraph, removeHistoriaParagraph, upHistoriaParagraph,
      addHeroButton, removeHeroButton, upHeroButton,
      addDonacionImage, removeDonacionImage,
      upStat, removeStat, addStat,
      upProg, removeProg, addProg, addProgImage, removeProgImage,
      upTeam, removeTeam, addTeamMember,
      toggleNav, upNavLabel, upNavHref, removeNav, addNavItem,
      toggleSub, upSubLabel, upSubHref, removeSub, addSubItem,
      toggleSection,
      addMessage, deleteMessage, markRead, markAllRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
