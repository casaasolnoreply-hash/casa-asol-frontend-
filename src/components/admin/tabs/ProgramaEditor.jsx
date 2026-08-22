import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { SmartIcon } from "../../ui/Icon";
import Icon from "../../ui/Icon";
import IconPicker from "../../ui/IconPicker";
import AddItemModal from "../../ui/AddItemModal";
import AddImageBtn from "../AddImageBtn";

const L = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 };
const I = { width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

/* Mini card that looks exactly like the real Programa section card */
function PreviewCard({ p }) {
  const imgs = p.images?.length ? p.images : [];
  const first = imgs[0];
  return (
    <div style={{ background: "#f8f9fa", borderRadius: 8, overflow: "hidden", border: `2px solid ${PRIMARY}`, fontSize: 13 }}>
      {first
        ? <div style={{ position: "relative" }}>
            <img src={first} alt={p.title} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
            {imgs.length > 1 && (
              <span style={{ position: "absolute", bottom: 5, right: 5, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 8, fontWeight: 600 }}>
                +{imgs.length - 1} fotos
              </span>
            )}
          </div>
        : <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: `${PRIMARY}10`, borderBottom: `3px solid ${PRIMARY}` }}>
            <SmartIcon value={p.icon} size={28} color={PRIMARY} />
          </div>
      }
      <div style={{ padding: "12px 14px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#222" }}>{p.title || "Sin título"}</p>
        <p style={{ margin: 0, fontSize: 10, color: "#888", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
      </div>
    </div>
  );
}

function ProgramItem({ p, onUpdate, onRemove, onAddImage, onRemoveImage }) {
  const imgs = p.images || [];

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.05)" }}>
      {/* Row header */}
      <div style={{ background: `${PRIMARY}0a`, padding: "10px 16px", borderBottom: "1px solid #e8f0f8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SmartIcon value={p.icon} size={15} color={PRIMARY} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{p.title || "Nuevo programa"}</span>
        </div>
        <button
          onClick={onRemove}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          <Icon name="trash" size={11} /> Eliminar
        </button>
      </div>

      {/* Preview + Form split */}
      <div style={{ display: "grid", gridTemplateColumns: "190px 1fr" }}>
        {/* LEFT — live preview */}
        <div style={{ padding: 16, background: "#fafbfd", borderRight: "1px solid #f0f4f8", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#b0b8c8", textTransform: "uppercase" }}>Vista previa</span>
          <PreviewCard p={p} />
          {imgs.length === 0 && (
            <p style={{ fontSize: 10, color: "#b0b8c8", margin: 0, textAlign: "center", lineHeight: 1.4 }}>
              Se mostrará el ícono hasta que agregues imágenes
            </p>
          )}
        </div>

        {/* RIGHT — edit form */}
        <div style={{ padding: 18 }}>
          {/* Icon + Title */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <IconPicker value={p.icon} onChange={(v) => onUpdate("icon", v)} />
            <div>
              <label style={L}>TÍTULO</label>
              <input value={p.title} onChange={(e) => onUpdate("title", e.target.value)} placeholder="Nombre del programa" style={I} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={L}>DESCRIPCIÓN</label>
            <textarea value={p.desc} onChange={(e) => onUpdate("desc", e.target.value)} rows={3}
              style={{ ...I, resize: "vertical" }} placeholder="Descripción del programa…" />
          </div>

          {/* Image gallery */}
          <div>
            <label style={{ ...L, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              IMÁGENES
              <span style={{ background: imgs.length ? PRIMARY : "#e0e0e0", color: imgs.length ? "#fff" : "#999", borderRadius: 10, padding: "0 7px", fontSize: 10, fontWeight: 700 }}>
                {imgs.length}
              </span>
              <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 400, letterSpacing: 0 }}>
                — la primera se muestra como portada
              </span>
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
              {imgs.map((img, idx) => (
                <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: 68, height: 52, objectFit: "cover", borderRadius: 6, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
                  <button
                    onClick={() => onRemoveImage(idx)}
                    style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    <Icon name="x" size={9} />
                  </button>
                  {idx === 0 && imgs.length > 1 && (
                    <span style={{ position: "absolute", bottom: 2, left: 2, background: PRIMARY, color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: 2 }}>1ª</span>
                  )}
                </div>
              ))}
              <AddImageBtn onAdd={onAddImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgramaEditor() {
  const { programa, upProg, removeProg, addProg, addProgImage, removeProgImage } = useApp();
  const [addModal, setAddModal] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Programa</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
            La vista previa refleja cómo aparece cada programa en el sitio
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <Icon name="plus" size={14} /> Agregar programa
        </button>
      </div>

      {addModal && (
        <AddItemModal
          title="Agregar programa"
          fields={[
            { key: "icon",  label: "ÍCONO",       type: "icon",     default: "star" },
            { key: "title", label: "NOMBRE",       type: "text",     placeholder: "Nombre del programa" },
            { key: "desc",  label: "DESCRIPCIÓN",  type: "textarea", placeholder: "Descripción breve del programa…" },
          ]}
          onSave={(d) => addProg({ ...d, images: [] })}
          onClose={() => setAddModal(false)}
        />
      )}

      {programa.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="list" size={32} color="#d1d5db" />
          <p style={{ margin: "12px 0 0", color: "#9ca3af", fontSize: 14 }}>No hay programas. Agrega uno para empezar.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {programa.map((p) => (
          <ProgramItem
            key={p.id}
            p={p}
            onUpdate={(f, v) => upProg(p.id, f, v)}
            onRemove={() => removeProg(p.id)}
            onAddImage={(url) => addProgImage(p.id, url)}
            onRemoveImage={(idx) => removeProgImage(p.id, idx)}
          />
        ))}
      </div>
    </div>
  );
}
