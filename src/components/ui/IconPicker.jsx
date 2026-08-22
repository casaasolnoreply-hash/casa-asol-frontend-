import { useState } from "react";
import { PRIMARY } from "../../constants/theme";
import Icon, { ICON_NAMES } from "./Icon";

export default function IconPicker({ value, onChange, label = "ÍCONO" }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6, letterSpacing: .5 }}>{label}</label>

      {/* Selected icon — click to toggle grid */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "8px 12px", textAlign: "left",
          background: "#fff", border: `2px solid ${open ? PRIMARY : "#d0d7de"}`,
          borderRadius: 7, cursor: "pointer", fontSize: 13, color: "#374151",
          transition: "border-color .15s",
        }}
      >
        {value ? (
          <>
            <Icon name={value} size={17} color={PRIMARY} />
            <span style={{ fontWeight: 600, flex: 1 }}>{value}</span>
          </>
        ) : (
          <span style={{ color: "#9ca3af", flex: 1 }}>Seleccionar ícono…</span>
        )}
        <Icon
          name="chevronDown" size={13} color="#9ca3af"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}
        />
      </button>

      {/* Icon grid */}
      {open && (
        <div style={{
          marginTop: 6, padding: 10,
          background: "#fff", border: "1.5px solid #d0d7de", borderRadius: 8,
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(58px, 1fr))", gap: 5,
        }}>
          {ICON_NAMES.map((name) => {
            const active = value === name;
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "9px 4px",
                  background: active ? `${PRIMARY}18` : "#f8f9fa",
                  border: `1.5px solid ${active ? PRIMARY : "#e8e8e8"}`,
                  borderRadius: 7, cursor: "pointer", transition: "all .1s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#eef2ff";
                    e.currentTarget.style.borderColor = `${PRIMARY}66`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#f8f9fa";
                    e.currentTarget.style.borderColor = "#e8e8e8";
                  }
                }}
              >
                <Icon name={name} size={19} color={active ? PRIMARY : "#6b7280"} />
                <span style={{
                  fontSize: 8, lineHeight: 1, textAlign: "center",
                  color: active ? PRIMARY : "#9ca3af",
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", maxWidth: "100%",
                }}>{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
