import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import Icon from "../../ui/Icon";

const TYPE_LABEL = { contacto: "Contacto", voluntario: "Voluntario" };
const TYPE_COLOR = { contacto: "#3b82f6", voluntario: "#22c55e" };

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
}

function MessageCard({ msg, onDelete, onMarkRead }) {
  const [open, setOpen] = useState(!msg.read);
  const color = TYPE_COLOR[msg.type] || PRIMARY;

  return (
    <div
      style={{ background: "#fff", border: `1px solid ${msg.read ? "#e0e0e0" : "#bae6fd"}`, borderLeft: `3px solid ${msg.read ? "#e0e0e0" : color}`, borderRadius: 8, marginBottom: 10, overflow: "hidden", transition: "border-color .2s" }}
    >
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", background: msg.read ? "#fff" : "#f0f9ff" }}
        onClick={() => { setOpen((o) => !o); if (!msg.read) onMarkRead(); }}
      >
        {/* Type badge */}
        <span style={{ background: color + "18", color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: .5, flexShrink: 0 }}>
          {TYPE_LABEL[msg.type] || msg.type}
        </span>

        {!msg.read && (
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
        )}

        <span style={{ fontWeight: msg.read ? 400 : 700, fontSize: 13, color: "#1a1a2e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {msg.name}
          {msg.subject && <span style={{ color: "#9ca3af", fontWeight: 400 }}> — {msg.subject}</span>}
        </span>

        <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>{formatDate(msg.date)}</span>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "2px 4px", display: "flex", alignItems: "center", flexShrink: 0 }}
          title="Eliminar"
        >
          <Icon name="trash" size={13} />
        </button>

        <Icon name="chevronDown" size={14} color="#9ca3af" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s", flexShrink: 0 }} />
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, marginBottom: msg.message ? 12 : 0 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: .5 }}>CORREO</p>
              <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>
                <a href={`mailto:${msg.email}`} style={{ color: PRIMARY, textDecoration: "none" }}>{msg.email}</a>
              </p>
            </div>
            {msg.phone && (
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: .5 }}>TELÉFONO</p>
                <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{msg.phone}</p>
              </div>
            )}
            {msg.area && (
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: .5 }}>ÁREA DE INTERÉS</p>
                <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{msg.area}</p>
              </div>
            )}
          </div>

          {msg.message && (
            <div style={{ background: "#f9fafb", borderRadius: 6, padding: "12px 14px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: .5 }}>MENSAJE</p>
              <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MensajesTab() {
  const { messages, deleteMessage, markRead, markAllRead, unreadCount } = useApp();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? messages : messages.filter((m) => m.type === filter);
  const chip = (id, label) => (
    <button
      onClick={() => setFilter(id)}
      style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${filter === id ? PRIMARY : "#ddd"}`, background: filter === id ? PRIMARY : "#fff", color: filter === id ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e", display: "flex", alignItems: "center", gap: 10 }}>
            Mensajes recibidos
            {unreadCount > 0 && (
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10 }}>
                {unreadCount} nuevo{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
            Formularios de contacto y solicitudes de voluntariado
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", color: "#6b7280", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 12, cursor: "pointer" }}
          >
            <Icon name="check" size={13} /> Marcar todo como leído
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {chip("all", `Todos (${messages.length})`)}
        {chip("contacto", `Contacto (${messages.filter((m) => m.type === "contacto").length})`)}
        {chip("voluntario", `Voluntarios (${messages.filter((m) => m.type === "voluntario").length})`)}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="mail" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            {filter === "all" ? "Aún no hay mensajes." : `No hay mensajes de tipo "${TYPE_LABEL[filter]}".`}
          </p>
        </div>
      )}

      {/* Message list */}
      <div>
        {filtered.map((msg) => (
          <MessageCard
            key={msg.id}
            msg={msg}
            onDelete={() => deleteMessage(msg.id)}
            onMarkRead={() => markRead(msg.id)}
          />
        ))}
      </div>
    </div>
  );
}
