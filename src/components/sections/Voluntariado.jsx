import { useState } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import Icon from "../ui/Icon";

export default function Voluntariado() {
  const { content, isSectionVisible, setExpandModal, addMessage } = useApp();
  const [form, setForm]       = useState({ name: "", email: "", phone: "", area: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  if (!isSectionVisible("voluntariado")) return null;
  const { voluntariado } = content;

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

  const inp = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <section id="voluntariado" style={{ padding: "70px 20px", background: "#f8f9fa", position: "relative" }}>
      <ExpandBtn onClick={() => setExpandModal({
        title: voluntariado.title,
        content: (
          <div>
            <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>{voluntariado.supertitle}</p>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.85, marginBottom: 28 }}>{voluntariado.desc}</p>
            <ul style={{ color: "#444", lineHeight: 2.2, paddingLeft: 24, fontSize: 17 }}>
              {voluntariado.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ),
      })} />

      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        {/* Info side */}
        <div>
          <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>{voluntariado.supertitle}</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: "#222" }}>{voluntariado.title}</h2>
          <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 20 }}>{voluntariado.desc}</p>
          <ul style={{ color: "#555", lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
            {voluntariado.list.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <button style={{ padding: "12px 28px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {voluntariado.btnText}
          </button>
        </div>

        {/* Form side */}
        <div style={{ background: "#fff", borderRadius: 8, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,.07)" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#222", marginBottom: 20 }}>Registrarme como voluntario</h3>

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
                style={{ width: "100%", padding: "12px", background: sending ? "#93c5fd" : PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: sending ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {sending ? "Enviando..." : <><Icon name="users" size={15} color="#fff" /> ENVIAR SOLICITUD</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
