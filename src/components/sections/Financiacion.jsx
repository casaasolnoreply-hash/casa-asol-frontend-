import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";

export default function Financiacion() {
  const { content, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("financiacion")) return null;

  const { financiacion } = content;

  const openDoc = () => {
    if (financiacion.docUrl) window.open(financiacion.docUrl, "_blank", "noreferrer");
  };

  return (
    <section id="financiacion" style={{ padding: "70px 20px", background: PRIMARY, position: "relative" }}>
      <ExpandBtn light onClick={() => setExpandModal({
        title: financiacion.title,
        content: (
          <div>
            <p style={{ fontSize: 18, color: "#555", lineHeight: 1.85, marginBottom: 32 }}>{financiacion.desc}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32, justifyContent: "center" }}>
              {financiacion.amounts.map((a) => (
                <button key={a} style={{ padding: "16px 32px", background: "#fff", color: PRIMARY, border: `2px solid ${PRIMARY}`, borderRadius: 6, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{a}</button>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={openDoc}
                style={{ padding: "16px 48px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 18, fontWeight: 700, cursor: financiacion.docUrl ? "pointer" : "default", opacity: financiacion.docUrl ? 1 : .6 }}
              >
                {financiacion.btnText}
              </button>
              {!financiacion.docUrl && (
                <p style={{ marginTop: 12, fontSize: 13, color: "#9ca3af" }}>El administrador aún no ha subido el documento de cuentas.</p>
              )}
            </div>
          </div>
        ),
      })} />

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#fff" }}>
        <p style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 8, opacity: .85 }}>{financiacion.supertitle}</p>
        <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>{financiacion.title}</h2>
        <p style={{ opacity: .9, lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>{financiacion.desc}</p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          {financiacion.amounts.map((amt) => (
            <button key={amt}
              style={{ padding: "12px 24px", background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.5)", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={(e) => { e.target.style.background = "#fff"; e.target.style.color = PRIMARY; }}
              onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,.15)"; e.target.style.color = "#fff"; }}>
              {amt}
            </button>
          ))}
        </div>

        <button
          onClick={openDoc}
          style={{ padding: "14px 48px", background: "#fff", color: PRIMARY, border: "none", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: financiacion.docUrl ? "pointer" : "default", letterSpacing: .5, opacity: financiacion.docUrl ? 1 : .75 }}
          onMouseEnter={(e) => { if (financiacion.docUrl) e.currentTarget.style.background = "#f0f8ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
        >
          {financiacion.btnText}
        </button>
      </div>
    </section>
  );
}
