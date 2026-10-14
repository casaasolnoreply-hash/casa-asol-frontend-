import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import Icon from "../../ui/Icon";
import AddItemModal from "../../ui/AddItemModal";
import AddImageBtn from "../AddImageBtn";
import ImageUpload from "../ImageUpload";

const L = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 };
const I = { width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

function MoveButtons({ onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const btnStyle = (enabled) => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 24, height: 20, padding: 0, borderRadius: 5,
    background: enabled ? "#fff" : "#f3f4f6", border: "1px solid #e0e8f0",
    color: enabled ? "#6b7280" : "#d1d5db", cursor: enabled ? "pointer" : "default",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <button onClick={onMoveUp} disabled={!canMoveUp} title="Subir" style={btnStyle(canMoveUp)}>
        <Icon name="chevronDown" size={11} color="currentColor" style={{ transform: "rotate(180deg)" }} />
      </button>
      <button onClick={onMoveDown} disabled={!canMoveDown} title="Bajar" style={btnStyle(canMoveDown)}>
        <Icon name="chevronDown" size={11} color="currentColor" />
      </button>
    </div>
  );
}

function MemberItem({ m, onUpdate, onRemove, onAddPhoto, onRemovePhoto, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const photos = m.photos || [];

  return (
    <div
      style={{
        background: "#fff", border: "1px solid #e0e8f0", borderRadius: 12, overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,.05)",
      }}
    >
      {/* Header */}
      <div style={{ background: `${PRIMARY}0a`, padding: "10px 16px", borderBottom: "1px solid #e8f0f8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MoveButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} canMoveUp={canMoveUp} canMoveDown={canMoveDown} />
          {m.photoUrl
            ? <img src={m.photoUrl} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: `1px solid ${PRIMARY}` }} />
            : <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${PRIMARY}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: PRIMARY, border: `1px solid ${PRIMARY}` }}>
                {m.initials || "?"}
              </div>
          }
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{m.name || "Nuevo miembro"}</span>
        </div>
        <button
          onClick={onRemove}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          <Icon name="trash" size={11} /> Eliminar
        </button>
      </div>

      {/* Form — una sola columna, ancho completo */}
      <div style={{ padding: 18 }}>
        {/* Initials + Name */}
        <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={L}>INICIALES</label>
            <input
              value={m.initials}
              onChange={(e) => onUpdate("initials", e.target.value.toUpperCase().slice(0, 3))}
              maxLength={3}
              placeholder="AB"
              style={{ ...I, textAlign: "center", fontWeight: 700, fontSize: 16, letterSpacing: 1 }}
            />
          </div>
          <div>
            <label style={L}>NOMBRE</label>
            <input value={m.name} onChange={(e) => onUpdate("name", e.target.value)} placeholder="Nombre completo" style={I} />
          </div>
        </div>

        {/* Role */}
        <div style={{ marginBottom: 14 }}>
          <label style={L}>ROL / CARGO</label>
          <input value={m.role} onChange={(e) => onUpdate("role", e.target.value)} placeholder="Descripción del rol" style={I} />
        </div>

        {/* Puesto: descripción breve del cargo */}
        <div style={{ marginBottom: 18 }}>
          <label style={L}>DESCRIPCIÓN BREVE DEL PUESTO</label>
          <textarea
            value={m.puestoDesc || ""}
            onChange={(e) => onUpdate("puestoDesc", e.target.value)}
            placeholder="Ej. Coordina los programas educativos y da seguimiento al equipo docente"
            style={{ ...I, minHeight: 60, resize: "vertical" }}
          />
        </div>

        {/* Foto de perfil — la que aparece en el círculo del avatar */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ ...L, marginBottom: 8 }}>FOTO DE PERFIL — se muestra en el círculo del avatar</label>
          <ImageUpload currentUrl={m.photoUrl || ""} onUpload={(url) => onUpdate("photoUrl", url)} />
          {!m.photoUrl && (
            <p style={{ fontSize: 10, color: "#b0b8c8", margin: "-8px 0 0" }}>
              Se mostrarán las iniciales hasta que subas una foto de perfil
            </p>
          )}
        </div>

        {/* Galería de labor / actividades — NO es el avatar */}
        <div>
          <label style={{ ...L, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            FOTOS DE SU LABOR
            <span style={{ background: photos.length ? PRIMARY : "#e0e0e0", color: photos.length ? "#fff" : "#999", borderRadius: 10, padding: "0 7px", fontSize: 10, fontWeight: 700 }}>
              {photos.length}
            </span>
          </label>
          <p style={{ fontSize: 10, color: "#9ca3af", margin: "-4px 0 8px" }}>
            Fotos de lo que hace en su rol (no son la foto de perfil) — se ven al abrir su tarjeta en el sitio
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            {photos.map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 68, height: 52, objectFit: "cover", borderRadius: 6, border: "2px solid #e0e0e0", display: "block" }} />
                <button
                  onClick={() => onRemovePhoto(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={onAddPhoto} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EquipoEditor() {
  const { team, upTeam, removeTeam, addTeamMember, addTeamPhoto, removeTeamPhoto, reorderTeam } = useApp();
  const [addModal, setAddModal] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Equipo</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
            La vista previa refleja cómo aparece cada miembro en el sitio
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <Icon name="plus" size={14} /> Agregar miembro
        </button>
      </div>

      {addModal && (
        <AddItemModal
          title="Agregar miembro del equipo"
          fields={[
            { key: "initials",   label: "INICIALES (máx. 3)", type: "text", placeholder: "AB" },
            { key: "name",       label: "NOMBRE COMPLETO",    type: "text", placeholder: "Nombre completo" },
            { key: "role",       label: "ROL / CARGO",        type: "text", placeholder: "Descripción del rol" },
            { key: "puestoDesc", label: "DESCRIPCIÓN BREVE DEL PUESTO", type: "textarea", placeholder: "Ej. Coordina los programas educativos y da seguimiento al equipo docente" },
            { key: "photoUrl",   label: "FOTO DE PERFIL (OPCIONAL — si no la agregas, se muestran las iniciales)", type: "image" },
          ]}
          onSave={(d) => addTeamMember({ ...d, initials: d.initials.toUpperCase().slice(0, 3) })}
          onClose={() => setAddModal(false)}
        />
      )}

      {team.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="users" size={32} color="#d1d5db" />
          <p style={{ margin: "12px 0 0", color: "#9ca3af", fontSize: 14 }}>No hay miembros. Agrega uno para empezar.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {team.map((m, index) => (
          <MemberItem
            key={m.id}
            m={m}
            onUpdate={(f, v) => upTeam(m.id, f, v)}
            onRemove={() => removeTeam(m.id)}
            onAddPhoto={(url) => addTeamPhoto(m.id, url)}
            onRemovePhoto={(idx) => removeTeamPhoto(m.id, idx)}
            canMoveUp={index > 0}
            canMoveDown={index < team.length - 1}
            onMoveUp={() => reorderTeam(index, index - 1)}
            onMoveDown={() => reorderTeam(index, index + 1)}
          />
        ))}
      </div>
    </div>
  );
}
