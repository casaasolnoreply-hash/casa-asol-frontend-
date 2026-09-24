import { useState } from "react";
import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import Icon from "../ui/Icon";
import { ImageWatermark } from "../ui/GuatemalanMotifs";
import useRotatingIndex from "../../hooks/useRotatingIndex";

export default function Voluntariado() {
  const { content, isSectionVisible, setExpandModal, addMessage } = useApp();
  const [form, setForm]       = useState({ name: "", email: "", phone: "", area: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  if (!isSectionVisible("voluntariado")) return null;
  const { voluntariado } = content;
  const volImages = voluntariado.images || [];
  const activeImg = useRotatingIndex(volImages.length, 5400);

  const upField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true);
    try {
      await addMessage({ type: "voluntario", name: form.name, email: form.email, phone: form.phone, area: form.area });
      setForm({ name: "", email: "", phone: "", area: "" });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch {
      // El backend no respondió — el usuario puede reintentar
    } finally {
      setSending(false);
    }
  };

  const inp = { width: "100%", padding: "11px 14px", border: "1.5px solid #e6eaf0", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", outline: "none" };

  return (
    <section id="voluntariado" style={{ padding: "80px 20px", background: "#f7f9fc", position: "relative", zIndex: 0, overflow: "hidden" }}>
      <ImageWatermark name="ceiba" tone="blue" size={280} opacity={.18} position={{ top: -30, right: -30 }} />
      <ImageWatermark name="mujer" tone="blue" size={170} opacity={.16} position={{ bottom: -20, right: -10 }} />

      <ExpandBtn onClick={() => setExpandModal({
        title: voluntariado.title,
        content: (
          <div>
            {volImages.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: volImages.length === 1 ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 24 }}>
                {volImages.map((img, i) => (
                  <img key={i} src={img} alt={voluntariado.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12 }} />
                ))}
              </div>
            )}
            <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>{voluntariado.supertitle}</p>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.85, marginBottom: 28 }}>{voluntariado.desc}</p>
            <ul style={{ color: "#444", lineHeight: 2.2, paddingLeft: 24, fontSize: 17 }}>
              {voluntariado.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ),
      })} />

      <div className="ca-vol-grid" style={{ maxWidth: 1050, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        {/* Info side */}
        <div>
          {volImages.length > 0 && (
            <div style={{ position: "relative", width: "100%", height: 200, borderRadius: 18, overflow: "hidden", marginBottom: 22, boxShadow: "0 14px 34px rgba(15,64,140,.14)" }}>
              {volImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={voluntariado.title}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    opacity: i === activeImg ? 1 : 0,
                    transform: i === activeImg ? "translateX(0) scale(1)" : "translateX(16px) scale(1.04)",
                    transition: "opacity 1.2s ease, transform 1.2s ease",
                  }}
                />
              ))}
            </div>
          )}

          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
            {voluntariado.supertitle}
          </span>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, margin: "16px 0 16px", color: DARK, letterSpacing: -.4 }}>{voluntariado.title}</h2>
          <p style={{ color: "#5b6472", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>{voluntariado.desc}</p>
          <ul style={{ color: "#5b6472", lineHeight: 2, paddingLeft: 0, marginBottom: 26, listStyle: "none" }}>
            {voluntariado.list.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6, fontSize: 14.5 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon name="check" size={11} color={PRIMARY_DARK} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button style={{ padding: "12px 30px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 10px 24px ${PRIMARY}40` }}>
            {voluntariado.btnText}
          </button>
        </div>

        {/* Form side */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 14px 40px rgba(15,64,140,.1)", border: "1px solid #eef1f6" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 20 }}>Registrarme como voluntario</h3>

          {sent ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <Icon name="check" size={36} color="#22c55e" />
              <p style={{ margin: "14px 0 0", fontWeight: 700, color: "#15803d", fontSize: 16 }}>¡Solicitud recibida!</p>
              <p style={{ margin: "6px 0 0", color: "#166534", fontSize: 14 }}>Te contactaremos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>NOMBRE COMPLETO *</label>
                <input value={form.name} onChange={(e) => upField("name", e.target.value)} placeholder="Tu nombre" required style={inp} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>CORREO ELECTRÓNICO *</label>
                <input type="email" value={form.email} onChange={(e) => upField("email", e.target.value)} placeholder="tu@correo.com" required style={inp} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>TELÉFONO</label>
                <input value={form.phone} onChange={(e) => upField("phone", e.target.value)} placeholder="(+502) 0000-0000" style={inp} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>ÁREA DE INTERÉS</label>
                <select value={form.area} onChange={(e) => upField("area", e.target.value)} style={inp}>
                  <option value="">Seleccionar...</option>
                  <option>Apoyo educativo</option>
                  <option>Arte y manualidades</option>
                  <option>Deporte</option>
                  <option>Administración</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={sending}
                style={{ width: "100%", padding: "13px", background: sending ? "#93c5fd" : PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: sending ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: sending ? "none" : `0 10px 24px ${PRIMARY}40` }}
              >
                {sending ? "Enviando..." : <><Icon name="users" size={15} color="#fff" /> ENVIAR SOLICITUD</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .ca-vol-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
