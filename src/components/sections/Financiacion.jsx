import { useState } from "react";
import { PRIMARY, PRIMARY_DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import { ImageWatermark, HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

function BankDetails({ bank, light }) {
  if (!bank) return null;
  const rowStyle = { display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: light ? "1px solid rgba(255,255,255,.14)" : "1px solid #eef2f7" };
  const labelStyle = { fontSize: 12, opacity: light ? .75 : .6, color: light ? "#fff" : "#6b7280" };
  const valueStyle = { fontSize: 13.5, fontWeight: 700, color: light ? "#fff" : "#1a1a2e", textAlign: "right" };
  const rows = [
    ["Titular",       bank.accountHolder],
    ["Banco",         bank.bankName],
    ["N.º de cuenta", bank.accountNumber],
    ["Código bancario", bank.bankCode],
    ["IBAN",          bank.iban],
    ["BIC",           bank.bic],
    ["Referencia",    bank.reference],
  ].filter(([, v]) => v);

  return (
    <div style={{ textAlign: "left" }}>
      {(bank.heading || bank.intro) && (
        <div style={{ marginBottom: 18 }}>
          {bank.heading && <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: light ? 18 : 16, color: light ? "#fff" : "#1a1a2e" }}>{bank.heading}</p>}
          {bank.intro && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, opacity: light ? .9 : 1, color: light ? "#fff" : "#5b6472" }}>{bank.intro}</p>}
        </div>
      )}
      {rows.map(([label, value]) => (
        <div key={label} style={rowStyle}>
          <span style={labelStyle}>{label}</span>
          <span style={valueStyle}>{value}</span>
        </div>
      ))}
      {bank.note && <p style={{ margin: "14px 0 0", fontSize: 12.5, fontStyle: "italic", opacity: light ? .8 : .7, color: light ? "#fff" : "#6b7280" }}>{bank.note}</p>}
    </div>
  );
}

/**
 * Big themed modal for the bank-transfer details: framed by the same
 * corte/nahuales side stripes and cultural watermarks used throughout
 * the site, so it never feels like a plain generic popup.
 */
function BankModal({ bank, docUrl, docLabel, onOpenDoc, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,.72)", zIndex: 3500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 680, maxHeight: "88vh", overflow: "hidden",
          borderRadius: 22, background: `linear-gradient(150deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
          boxShadow: "0 40px 100px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 18, zIndex: 2 }}>
          <HuipilStripeVertical width={18} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 22, zIndex: 2 }}>
          <NahualesStripeVertical width={22} />
        </div>

        <ImageWatermark name="quetzal" tone="white" size={100} opacity={.16} position={{ top: 24, right: 40 }} />
        <ImageWatermark name="tikal" tone="white" size={180} opacity={.14} position={{ bottom: -20, left: 10 }} />

        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 34, zIndex: 3, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ position: "relative", zIndex: 1, padding: "48px 50px", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" }}>
          <BankDetails bank={bank} light />
          {docUrl && (
            <button
              onClick={onOpenDoc}
              style={{ marginTop: 24, padding: "14px 36px", background: "#fff", color: PRIMARY_DARK, border: "none", borderRadius: 999, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}
            >
              {docLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HowToDonateButton({ onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "14px 40px", background: "#fff", color: PRIMARY_DARK, border: "none", borderRadius: 999, fontSize: 14.5, fontWeight: 700, cursor: "pointer", letterSpacing: .3, boxShadow: "0 14px 30px rgba(0,0,0,.18)", ...style }}
    >
      ¿CÓMO DONAR?
    </button>
  );
}

export default function Financiacion() {
  const { content, isSectionVisible, setExpandModal } = useApp();
  const [showBank, setShowBank] = useState(false);
  if (!isSectionVisible("financiacion")) return null;

  const { financiacion } = content;

  const openDoc = () => {
    if (financiacion.docUrl) window.open(financiacion.docUrl, "_blank", "noreferrer");
  };

  return (
    <section id="financiacion" style={{ padding: "80px 20px", background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`, position: "relative", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,.08)", filter: "blur(10px)", pointerEvents: "none" }} />
      <ImageWatermark name="volcan" tone="white" size={320} opacity={.2} position={{ bottom: -40, left: -40 }} />
      <ImageWatermark name="escudo" tone="white" size={170} opacity={.24} position={{ top: 20, right: 30 }} />
      <ImageWatermark name="cafe" tone="white" size={110} opacity={.18} position={{ bottom: 30, right: 60 }} rotate={8} />

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
                onClick={() => setShowBank(true)}
                style={{ padding: "16px 48px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 18, fontWeight: 700, cursor: "pointer" }}
              >
                ¿CÓMO DONAR?
              </button>
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

        {financiacion.bank && <HowToDonateButton onClick={() => setShowBank(true)} />}
      </div>

      {showBank && (
        <BankModal
          bank={financiacion.bank}
          docUrl={financiacion.docUrl}
          docLabel={financiacion.btnText}
          onOpenDoc={openDoc}
          onClose={() => setShowBank(false)}
        />
      )}
    </section>
  );
}
