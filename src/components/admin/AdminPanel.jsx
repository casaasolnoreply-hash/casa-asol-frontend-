import { useState } from "react";
import { PRIMARY, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import NavTab      from "./tabs/NavTab";
import SectionsTab from "./tabs/SectionsTab";
import ContentTab  from "./tabs/ContentTab";
import DataTab     from "./tabs/DataTab";

const TABS = [
  ["nav",      "Navegación"],
  ["sections", "Secciones"],
  ["content",  "Contenido"],
  ["data",     "Datos"],
];

export default function AdminPanel() {
  const { showAdmin, setShowAdmin, setIsAdmin } = useApp();
  const [tab, setTab] = useState("nav");

  if (!showAdmin) return null;

  const logout = () => { setIsAdmin(false); setShowAdmin(false); };

  return (
    <>
      {/* backdrop */}
      <div onClick={() => setShowAdmin(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1400 }} />

      {/* panel */}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 480, background: "#f4f6f8", boxShadow: "-6px 0 32px rgba(0,0,0,.2)", zIndex: 1500, display: "flex", flexDirection: "column" }}>

        {/* header */}
        <div style={{ background: DARK, color: "#fff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>⚙️ Panel de Administración</p>
            <p style={{ margin: 0, fontSize: 11, opacity: .6 }}>Casa ASOL — Editor de contenido</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={logout} style={{ padding: "5px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Cerrar sesión
            </button>
            <button onClick={() => setShowAdmin(false)} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontSize: 18 }}>
              ×
            </button>
          </div>
        </div>

        {/* tab bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", display: "flex", flexShrink: 0 }}>
          {TABS.map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 4px", background: "none", border: "none", borderBottom: tab === id ? `2px solid ${PRIMARY}` : "2px solid transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: tab === id ? PRIMARY : "#666" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* body */}
        <div style={{ overflowY: "auto", flex: 1, padding: 18 }}>
          {tab === "nav"      && <NavTab />}
          {tab === "sections" && <SectionsTab />}
          {tab === "content"  && <ContentTab />}
          {tab === "data"     && <DataTab />}
        </div>

        {/* footer note */}
        <div style={{ padding: "10px 18px", background: "#fff", borderTop: "1px solid #e8e8e8", fontSize: 11, color: "#aaa", textAlign: "center", flexShrink: 0 }}>
          Los cambios se guardan automáticamente en este dispositivo
        </div>
      </div>
    </>
  );
}
