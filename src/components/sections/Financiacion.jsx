import { PRIMARY, PRIMARY_DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import { CulturalWatermark } from "../ui/GuatemalanMotifs";

export default function Financiacion() {
  const { content, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("financiacion")) return null;

  const { financiacion } = content;

  const openDoc = () => {
    if (financiacion.docUrl) window.open(financiacion.docUrl, "_blank", "noreferrer");
  };

  return (
    <section id="financiacion" style={{ padding: "80px 20px", background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`, position: "relative", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,.08)", filter: "blur(10px)", pointerEvents: "none" }} />
      <CulturalWatermark icon="volcano" size={320} color="#fff" opacity={.2} position={{ bottom: -40, left: -40 }} />
      <CulturalWatermark icon="sunStone" size={170} color="#fff" opacity={.24} position={{ top: 20, right: 30 }} />
      <CulturalWatermark icon="coffee" size={110} color="#fff" opacity={.18} position={{ bottom: 30, right: 60 }} rotate={8} />

      <ExpandBtn light onClick={() => setExpandModal({
        title: financiacion.title,
        content: (
          <div>
            <p style={{ fontSize: 18, color: "#555", lineHeight: 1.85, marginBottom: 32 }}>{financiacion.desc}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32, justifyContent: "center" }}>
              {financiacion.amounts.map((a) => (
                <button key={a} style={{ padding: "16px 32px", background: "#fff", color: PRIMARY, border: `2px solid ${PRIMARY}`, borderRadius: 999, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{a}</button>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={openDoc}
                style={{ padding: "16px 48px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 18, fontWeight: 700, cursor: financiacion.docUrl ? "pointer" : "default", opacity: financiacion.docUrl ? 1 : .6 }}
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

      <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#fff" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          {financiacion.supertitle}
        </span>
        <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "18px 0 16px", letterSpacing: -.4 }}>{financiacion.title}</h2>
        <p style={{ opacity: .92, lineHeight: 1.8, marginBottom: 36, fontSize: 15.5 }}>{financiacion.desc}</p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          {financiacion.amounts.map((amt) => (
            <button key={amt}
              style={{ padding: "12px 26px", background: "rgba(255,255,255,.14)", color: "#fff", border: "1.5px solid rgba(255,255,255,.4)", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background .2s, color .2s" }}
              onMouseEnter={(e) => { e.target.style.background = "#fff"; e.target.style.color = PRIMARY_DARK; }}
              onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,.14)"; e.target.style.color = "#fff"; }}>
              {amt}
            </button>
          ))}
        </div>

        <button
          onClick={openDoc}
          style={{ padding: "14px 48px", background: "#fff", color: PRIMARY_DARK, border: "none", borderRadius: 999, fontSize: 14.5, fontWeight: 700, cursor: financiacion.docUrl ? "pointer" : "default", letterSpacing: .3, opacity: financiacion.docUrl ? 1 : .75, boxShadow: "0 14px 30px rgba(0,0,0,.18)" }}
          onMouseEnter={(e) => { if (financiacion.docUrl) e.currentTarget.style.background = "#f0f8ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
        >
          {financiacion.btnText}
        </button>
      </div>
    </section>
  );
}
