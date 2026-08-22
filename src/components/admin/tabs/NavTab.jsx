import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { DEFAULT_NAV } from "../../../constants/defaults";
import { useApp } from "../../../context/AppContext";
import Toggle from "../../ui/Toggle";

const inp = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };
const btnP = { padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" };
const btnD = { padding: "4px 9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" };
const btnG = { padding: "6px 12px", background: "#fff", color: "#555", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 12, cursor: "pointer" };

export default function NavTab() {
  const { navItems, setNavItems, toggleNav, upNavLabel, upNavHref, removeNav, addNavItem, toggleSub, upSubLabel, upSubHref, removeSub, addSubItem } = useApp();
  const [addNav,  setAddNav]  = useState({ show: false, label: "", href: "" });
  const [addSub,  setAddSub]  = useState({ show: null,  label: "", href: "" });

  const commitNav = () => { if (addNav.label.trim()) { addNavItem(addNav.label, addNav.href); setAddNav({ show: false, label: "", href: "" }); } };
  const commitSub = (pid) => { if (addSub.label.trim()) { addSubItem(pid, addSub.label, addSub.href); setAddSub({ show: null, label: "", href: "" }); } };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
        Gestiona las pestañas del menú principal. Los cambios se aplican en tiempo real.
      </p>

      {navItems.map((item) => (
        <div key={item.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
          {/* row */}
          <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 7 }}>
            <Toggle on={item.enabled} onChange={() => toggleNav(item.id)} sm />
            <input value={item.label} onChange={(e) => upNavLabel(item.id, e.target.value)}
              style={{ ...inp, flex: 1, opacity: item.enabled ? 1 : .45 }} />
            {item.dropdown
              ? <span style={{ fontSize: 10, background: "#e3f0fb", color: PRIMARY, borderRadius: 10, padding: "2px 7px", whiteSpace: "nowrap" }}>Menú</span>
              : <input value={item.href || ""} onChange={(e) => upNavHref(item.id, e.target.value)} placeholder="#link"
                  style={{ ...inp, width: 88, flex: "none" }} />
            }
            <button onClick={() => removeNav(item.id)} style={btnD}>×</button>
          </div>

          {/* dropdown sub-items */}
          {item.dropdown && (
            <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 12px 10px", background: "#fafafa" }}>
              {item.dropdown.map((sub) => (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <span style={{ color: "#ccc", fontSize: 13 }}>└</span>
                  <Toggle on={sub.enabled} onChange={() => toggleSub(item.id, sub.id)} sm />
                  <input value={sub.label} onChange={(e) => upSubLabel(item.id, sub.id, e.target.value)}
                    style={{ ...inp, flex: 1, fontSize: 12, opacity: sub.enabled ? 1 : .45 }} />
                  <input value={sub.href || ""} onChange={(e) => upSubHref(item.id, sub.id, e.target.value)}
                    placeholder="#link" style={{ ...inp, width: 80, flex: "none", fontSize: 12 }} />
                  <button onClick={() => removeSub(item.id, sub.id)} style={{ ...btnD, padding: "3px 7px" }}>×</button>
                </div>
              ))}
              {addSub.show === item.id ? (
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  <input autoFocus placeholder="Etiqueta" value={addSub.label}
                    onChange={(e) => setAddSub((f) => ({ ...f, label: e.target.value }))}
                    style={{ ...inp, flex: 1, fontSize: 12 }} />
                  <input placeholder="#link" value={addSub.href}
                    onChange={(e) => setAddSub((f) => ({ ...f, href: e.target.value }))}
                    style={{ ...inp, width: 76, flex: "none", fontSize: 12 }} />
                  <button onClick={() => commitSub(item.id)} style={{ ...btnP, padding: "5px 10px" }}>+</button>
                  <button onClick={() => setAddSub({ show: null, label: "", href: "" })} style={btnG}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAddSub({ show: item.id, label: "", href: "" })}
                  style={{ background: "none", border: "none", color: PRIMARY, fontSize: 12, cursor: "pointer", padding: "2px 0", marginTop: 4 }}>
                  + Agregar subpestaña
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {addNav.show ? (
        <div style={{ background: "#fff", border: `1px solid ${PRIMARY}`, borderRadius: 8, padding: 14, marginTop: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, letterSpacing: .5, margin: "0 0 10px" }}>NUEVA PESTAÑA</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <input autoFocus placeholder="Etiqueta" value={addNav.label}
              onChange={(e) => setAddNav((f) => ({ ...f, label: e.target.value }))}
              style={{ ...inp, flex: 1 }} />
            <input placeholder="#link o URL" value={addNav.href}
              onChange={(e) => setAddNav((f) => ({ ...f, href: e.target.value }))}
              style={{ ...inp, width: 120, flex: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={commitNav} style={btnP}>Agregar</button>
            <button onClick={() => setAddNav({ show: false, label: "", href: "" })} style={btnG}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAddNav({ show: true, label: "", href: "" })}
          style={{ ...btnP, width: "100%", marginTop: 6 }}>
          + Agregar pestaña
        </button>
      )}

      <button onClick={() => setNavItems(DEFAULT_NAV)} style={{ ...btnG, width: "100%", marginTop: 8, fontSize: 12 }}>
        ↺ Restaurar navegación por defecto
      </button>
    </div>
  );
}
