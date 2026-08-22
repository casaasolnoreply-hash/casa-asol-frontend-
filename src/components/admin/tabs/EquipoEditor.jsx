import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import Icon from "../../ui/Icon";
import AddItemModal from "../../ui/AddItemModal";
import ImageUpload from "../ImageUpload";

const L = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 };
const I = { width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

/* Mini card matching actual Equipo section style */
function MemberPreview({ m }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 12px" }}>
      {m.photoUrl
        ? <img src={m.photoUrl} alt={m.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${PRIMARY}`, display: "block", margin: "0 auto 10px" }} />
        : <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e3f0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: PRIMARY, margin: "0 auto 10px", border: `2px solid ${PRIMARY}` }}>
            {m.initials || "?"}
          </div>
      }
      <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#222" }}>{m.name || "Nuevo miembro"}</p>
      <p style={{ margin: 0, fontSize: 10, color: "#888", lineHeight: 1.4 }}>{m.role || "Rol"}</p>
    </div>
  );
}

function MemberItem({ m, onUpdate, onRemove }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.05)" }}>
      {/* Header */}
      <div style={{ background: `${PRIMARY}0a`, padding: "10px 16px", borderBottom: "1px solid #e8f0f8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

      {/* Preview + Form split */}
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
        {/* LEFT — live preview */}
        <div style={{ padding: 16, background: "#fafbfd", borderRight: "1px solid #f0f4f8", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#b0b8c8", textTransform: "uppercase" }}>Vista previa</span>
          <MemberPreview m={m} />
        </div>

        {/* RIGHT — edit form */}
        <div style={{ padding: 18 }}>
          {/* Initials + Name */}
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, marginBottom: 12 }}>
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
          <div style={{ marginBottom: 16 }}>
            <label style={L}>ROL / CARGO</label>
            <input value={m.role} onChange={(e) => onUpdate("role", e.target.value)} placeholder="Descripción del rol" style={I} />
          </div>

          {/* Photo */}
          <div>
            <label style={L}>FOTO DE PERFIL</label>
            <ImageUpload
              currentUrl={m.photoUrl || ""}
              onUpload={(url) => onUpdate("photoUrl", url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EquipoEditor() {
  const { team, upTeam, removeTeam, addTeamMember } = useApp();
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
            { key: "initials", label: "INICIALES (máx. 3)", type: "text", placeholder: "AB" },
            { key: "name",     label: "NOMBRE COMPLETO",    type: "text", placeholder: "Nombre completo" },
            { key: "role",     label: "ROL / CARGO",        type: "text", placeholder: "Descripción del rol" },
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
        {team.map((m) => (
          <MemberItem
            key={m.id}
            m={m}
            onUpdate={(f, v) => upTeam(m.id, f, v)}
            onRemove={() => removeTeam(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
