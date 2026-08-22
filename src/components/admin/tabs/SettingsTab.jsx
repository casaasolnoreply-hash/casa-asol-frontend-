import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { DEFAULT_CONTENT, DEFAULT_STATS, DEFAULT_PROGRAMA, DEFAULT_TEAM, DEFAULT_NAV, DEFAULT_SECTIONS } from "../../../constants/defaults";
import Icon from "../../ui/Icon";

function Card({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function SettingsTab() {
  const { setContent, setStats, setPrograma, setTeam, setNavItems, setSections } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    if (!resetting) { setResetting(true); return; }
    setContent(DEFAULT_CONTENT);
    setStats(DEFAULT_STATS);
    setPrograma(DEFAULT_PROGRAMA);
    setTeam(DEFAULT_TEAM);
    setNavItems(DEFAULT_NAV);
    setSections(DEFAULT_SECTIONS);
    setResetting(false);
  };

  return (
    <div>
      {/* Danger zone */}
      <Card title="Zona de peligro">
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
          Estas acciones son irreversibles. Úsalas solo si quieres volver al estado inicial.
        </p>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 18 }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#991b1b" }}>
            Restablecer todo el contenido al estado original
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#b91c1c" }}>
            Esto borrará todos los cambios de contenido, navegación, secciones, equipo y programa.
          </p>
          <button
            onClick={handleReset}
            style={{ padding: "9px 20px", background: resetting ? "#ef4444" : "#fff", color: resetting ? "#fff" : "#ef4444", border: "1.5px solid #ef4444", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
          >
            {resetting ? <><Icon name="warning" size={14} /> Haz clic de nuevo para confirmar</> : "Restablecer contenido"}
          </button>
          {resetting && (
            <button
              onClick={() => setResetting(false)}
              style={{ marginLeft: 8, padding: "9px 16px", background: "#fff", color: "#6b7280", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 13, cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
