import Icon from "./Icon";

export default function ExpandBtn({ onClick, light = false }) {
  return (
    <button
      onClick={onClick}
      title="Ver más grande"
      style={{
        position: "absolute", top: 14, right: 14,
        background: light ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.07)",
        border: light ? "1px solid rgba(255,255,255,.4)" : "none",
        color: light ? "#fff" : "#666",
        borderRadius: 6, padding: "5px 10px",
        cursor: "pointer", fontWeight: 600,
        backdropFilter: "blur(4px)", zIndex: 5,
        display: "inline-flex", alignItems: "center", gap: 5,
      }}
    >
      <Icon name="expand" size={13} color={light ? "#fff" : "#666"} />
      <span style={{ fontSize: 12 }}>Ver más</span>
    </button>
  );
}
