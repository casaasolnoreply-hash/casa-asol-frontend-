import { useState } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import { SmartIcon } from "../ui/Icon";
import Icon from "../ui/Icon";

export default function Contacto() {
  const { content, isSectionVisible, setExpandModal, addMessage } = useApp();
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);

  if (!isSectionVisible("contacto")) return null;
  const { contacto } = content;

  const upField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await addMessage({ type: "contacto", name: form.name, email: form.email, subject: form.subject, message: form.message });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch {
      // El backend no respondió — el usuario puede reintentar
    } finally {
      setSending(false);
    }
  };

  const inp = { width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <section id="contacto" style={{ padding: "70px 20px", background: "#fff", position: "relative" }}>
      <ExpandBtn onClick={() => setExpandModal({
        title: contacto.title,
        content: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {contacto.items.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <SmartIcon value={c.icon} size={34} color={PRIMARY} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 17, color: PRIMARY, margin: "0 0 6px" }}>{c.title}</p>
                  <p style={{ color: "#444", margin: 0, fontSize: 16, lineHeight: 1.7 }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      })} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{contacto.supertitle}</p>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>{contacto.title}</h2>
        <div style={{ width: 50, height: 3, background: PRIMARY, margin: "0 auto 40px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Contact info */}
          <div>
            {contacto.items.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <SmartIcon value={c.icon} size={20} color={PRIMARY} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: PRIMARY, margin: "0 0 3px" }}>{c.title}</p>
                  <p style={{ color: "#555", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit}>
            {sent ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "24px", textAlign: "center" }}>
                <Icon name="check" size={32} color="#22c55e" />
                <p style={{ margin: "12px 0 0", fontWeight: 700, color: "#15803d", fontSize: 16 }}>¡Mensaje enviado!</p>
                <p style={{ margin: "6px 0 0", color: "#166534", fontSize: 14 }}>Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <input value={form.name} onChange={(e) => upField("name", e.target.value)} placeholder="Nombre *" required style={inp} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input type="email" value={form.email} onChange={(e) => upField("email", e.target.value)} placeholder="Correo electrónico *" required style={inp} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input value={form.subject} onChange={(e) => upField("subject", e.target.value)} placeholder="Asunto" style={inp} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <textarea value={form.message} onChange={(e) => upField("message", e.target.value)} placeholder="Mensaje *" required rows={4} style={{ ...inp, resize: "vertical" }} />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  style={{ padding: "12px 28px", background: sending ? "#93c5fd" : PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: sending ? "wait" : "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {sending ? "Enviando..." : <><Icon name="mail" size={15} color="#fff" /> ENVIAR MENSAJE</>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
