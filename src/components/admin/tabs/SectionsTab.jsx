import { DEFAULT_SECTIONS } from "../../../constants/defaults";
import { useApp } from "../../../context/AppContext";
import Toggle from "../../ui/Toggle";

export default function SectionsTab() {
  const { sections, setSections, toggleSection } = useApp();

  return (
    <div>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
        Muestra u oculta secciones completas de la página.
      </p>

      {sections.map((sec) => (
        <div key={sec.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: sec.visible ? "#222" : "#bbb" }}>
            {sec.label}
          </span>
          <Toggle on={sec.visible} onChange={() => toggleSection(sec.id)} />
        </div>
      ))}

      <button
        onClick={() => setSections(DEFAULT_SECTIONS)}
        style={{ padding: "6px 12px", background: "#fff", color: "#555", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 12, cursor: "pointer", width: "100%", marginTop: 8 }}
      >
        ↺ Restaurar visibilidad por defecto
      </button>
    </div>
  );
}
