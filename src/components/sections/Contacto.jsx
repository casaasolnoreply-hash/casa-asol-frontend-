import { useState } from "react";
import { PRIMARY, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import { SmartIcon } from "../ui/Icon";
import Icon from "../ui/Icon";
import { ImageWatermark } from "../ui/GuatemalanMotifs";

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

  const inp = { width: "100%", padding: "12px 15px", border: "1px solid rgba(255,255,255,.18)", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", background: "rgba(255,255,255,.06)", color: "#fff", outline: "none" };

  return (
    <section id="contacto" style={{ padding: "80px 20px", background: DARK, position: "relative", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -140, left: -100, width: 360, height: 360, borderRadius: "50%", background: PRIMARY, opacity: .18, filter: "blur(90px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -160, right: -100, width: 320, height: 320, borderRadius: "50%", background: PRIMARY, opacity: .12, filter: "blur(90px)", pointerEvents: "none" }} />
      <ImageWatermark name="tikal" tone="white" size={290} opacity={.17} position={{ bottom: -20, right: 20 }} />
      <ImageWatermark name="mujer" tone="white" size={112} opacity={.24} position={{ top: 20, left: 18 }} />
      <ImageWatermark name="jaguar" tone="white" size={110} opacity={.18} position={{ bottom: 30, left: -10 }} rotate={6} />

      <ExpandBtn light onClick={() => setExpandModal({
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

      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.08)", color: "#cfe4fb", fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999, border: "1px solid rgba(255,255,255,.12)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
            {contacto.supertitle}
          </span>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "16px 0 0", color: "#fff", letterSpacing: -.4 }}>{contacto.title}</h2>
        </div>

        <div className="ca-contacto-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          {/* Contact info */}
          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 30, backdropFilter: "blur(6px)" }}>
            {contacto.items.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < contacto.items.length - 1 ? 24 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SmartIcon value={c.icon} size={18} color={PRIMARY_LIGHT} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#fff", margin: "0 0 3px" }}>{c.title}</p>
                  <p style={{ color: "#a8b1bf", margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 30, backdropFilter: "blur(6px)" }}>
            {sent ? (
              <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.35)", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                <Icon name="check" size={32} color="#4ade80" />
                <p style={{ margin: "12px 0 0", fontWeight: 700, color: "#4ade80", fontSize: 16 }}>¡Mensaje enviado!</p>
                <p style={{ margin: "6px 0 0", color: "#a8b1bf", fontSize: 14 }}>Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <input className="ca-dark-input" value={form.name} onChange={(e) => upField("name", e.target.value)} placeholder="Nombre *" required style={inp} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input className="ca-dark-input" type="email" value={form.email} onChange={(e) => upField("email", e.target.value)} placeholder="Correo electrónico *" required style={inp} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input className="ca-dark-input" value={form.subject} onChange={(e) => upField("subject", e.target.value)} placeholder="Asunto" style={inp} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <textarea className="ca-dark-input" value={form.message} onChange={(e) => upField("message", e.target.value)} placeholder="Mensaje *" required rows={4} style={{ ...inp, resize: "vertical" }} />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  style={{ padding: "13px 28px", background: sending ? "#3f6ea8" : PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: sending ? "wait" : "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: sending ? "none" : `0 10px 24px ${PRIMARY}55` }}
                >
                  {sending ? "Enviando..." : <><Icon name="mail" size={15} color="#fff" /> ENVIAR MENSAJE</>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .ca-dark-input::placeholder { color: #7c8798; }
        @media (max-width: 780px) {
          .ca-contacto-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
