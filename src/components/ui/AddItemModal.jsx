import { useState, useEffect } from "react";
import { PRIMARY } from "../../constants/theme";
import Icon from "./Icon";
import IconPicker from "./IconPicker";
import ImageUpload from "../admin/ImageUpload";

export default function AddItemModal({ title, fields = [], onSave, onClose }) {
  const [data, setData] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f.key] = f.default ?? ""; });
    return init;
  });

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const inp = {
    width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
    border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 480, maxWidth: "92vw", maxHeight: "90vh", overflowY: "auto",
        background: "#fff", borderRadius: 14, zIndex: 401,
        boxShadow: "0 24px 64px rgba(0,0,0,.22)",
        padding: "26px 28px 22px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Fields */}
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: f.type === "icon" ? 0 : 18 }}>
            {f.type === "icon" ? (
              <IconPicker label={f.label} value={data[f.key]} onChange={(v) => set(f.key, v)} />
            ) : f.type === "image" ? (
              <>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, letterSpacing: .5 }}>{f.label}</label>
                <ImageUpload currentUrl={data[f.key]} onUpload={(url) => set(f.key, url)} />
              </>
            ) : f.type === "textarea" ? (
              <>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, letterSpacing: .5 }}>{f.label}</label>
                <textarea
                  value={data[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  style={{ ...inp, minHeight: 90, resize: "vertical" }}
                />
              </>
            ) : (
              <>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, letterSpacing: .5 }}>{f.label}</label>
                <input
                  value={data[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  style={inp}
                />
              </>
            )}
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 22px", background: "#fff", color: "#555", border: "1.5px solid #d0d7de", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { onSave(data); onClose(); }}
            style={{ padding: "9px 24px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}
