import { useState } from "react";
import { PRIMARY, PRIMARY_DARK, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { UI, formatAmount } from "../../i18n/translations";
import ExpandBtn from "../ui/ExpandBtn";
import { HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

function BankDetails({ bank, light, t, bankText }) {
  if (!bank) return null;
  const rowStyle = { display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: light ? "1px solid rgba(255,255,255,.14)" : "1px solid #eef2f7" };
  const labelStyle = { fontSize: 12, opacity: light ? .75 : .6, color: light ? "#fff" : "#6b7280" };
  const valueStyle = { fontSize: 13.5, fontWeight: 700, color: light ? "#fff" : "#1a1a2e", textAlign: "right" };
  const bl = t.financiacion.bankLabels;
  const rows = [
    [bl["Titular"],       bank.accountHolder],
    [bl["Banco"],         bank.bankName],
    [bl["N.º de cuenta"], bank.accountNumber],
    [bl["Código bancario"], bank.bankCode],
    [bl["IBAN"],          bank.iban],
    [bl["BIC"],           bank.bic],
    [bl["Referencia"],    bank.reference],
  ].filter(([, v]) => v);

  return (
    <div style={{ textAlign: "left" }}>
      {(bankText.heading || bankText.intro) && (
        <div style={{ marginBottom: 18 }}>
          {bankText.heading && <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: light ? 18 : 16, color: light ? "#fff" : "#1a1a2e" }}>{bankText.heading}</p>}
          {bankText.intro && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, opacity: light ? .9 : 1, color: light ? "#fff" : "#5b6472" }}>{bankText.intro}</p>}
        </div>
      )}
      {rows.map(([label, value]) => (
        <div key={label} style={rowStyle}>
          <span style={labelStyle}>{label}</span>
          <span style={valueStyle}>{value}</span>
        </div>
      ))}
      {bankText.note && <p style={{ margin: "14px 0 0", fontSize: 12.5, fontStyle: "italic", opacity: light ? .8 : .7, color: light ? "#fff" : "#6b7280" }}>{bankText.note}</p>}
    </div>
  );
}

/**
 * Big themed modal for the bank-transfer details: framed by the same
 * corte/nahuales side stripes used throughout the site, so it never
 * feels like a plain generic popup.
 */
function BankModal({ bank, docUrl, docLabel, onOpenDoc, onClose, t, bankText }) {
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

        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 34, zIndex: 3, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ position: "relative", zIndex: 1, padding: "48px 50px", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" }}>
          <BankDetails bank={bank} light t={t} bankText={bankText} />
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

function HowToDonateButton({ onClick, style, t }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "14px 40px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 14.5, fontWeight: 700, cursor: "pointer", letterSpacing: .3, boxShadow: `0 14px 30px ${PRIMARY}40`, ...style }}
    >
      {t.financiacion.comoDonar}
    </button>
  );
}

function PriceRow({ label, eur, gtq, lang }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: "1px solid #eef2f7" }}>
      <span style={{ fontSize: 14, color: "#3a4250" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY_DARK, whiteSpace: "nowrap" }}>{formatAmount(eur, gtq, lang)}</span>
    </div>
  );
}

function StripCard({ id, heading, children }) {
  return (
    <div id={id} style={{ background: "#fff", borderRadius: 18, border: "1px solid #eef1f6", boxShadow: "0 6px 20px rgba(15,64,140,.06)", padding: "32px 34px", scrollMarginTop: 150 }}>
      <h3 style={{ fontSize: 19, fontWeight: 800, color: DARK, margin: "0 0 14px" }}>{heading}</h3>
      {children}
    </div>
  );
}

export default function Financiacion() {
  const { content, isSectionVisible, setExpandModal, language, contentTranslations } = useApp();
  const [showBank, setShowBank] = useState(false);
  if (!isSectionVisible("financiacion")) return null;

  const t = UI[language];
  const { financiacion } = content;
  const { patrocinioIndividual: pi, patrocinioEmpresarial: pe, donacionesEspecie: de, practicasEps: eps } = financiacion;
  const ct = language === "es" ? null : contentTranslations[language]?.financiacion;

  const title = ct?.title || financiacion.title;
  const desc = ct?.desc || financiacion.desc;
  const supertitle = t.nav.ayudar;
  const bankText = ct?.bank || financiacion.bank || {};

  const piHeading = t.nav["patrocinio-individual"];
  const piIntro = ct?.patrocinioIndividual?.intro || pi?.intro;
  const piIndividualHeading = ct?.patrocinioIndividual?.individualHeading || pi?.individualHeading;
  const monthlyLabels = ct?.patrocinioIndividual?.monthlyLabels;
  const individualLabels = ct?.patrocinioIndividual?.individualLabels;

  const peHeading = t.nav["patrocinio-empresarial"];
  const peText = ct?.patrocinioEmpresarial?.text || pe?.text;
  const deHeading = t.nav["donaciones-especie"];
  const deText = ct?.donacionesEspecie?.text || de?.text;
  const epsHeading = t.nav["practicas-eps"];
  const epsText = ct?.practicasEps?.text || eps?.text;

  const openDoc = () => {
    if (financiacion.docUrl) window.open(financiacion.docUrl, "_blank", "noreferrer");
  };

  return (
    <section id="financiacion" style={{ position: "relative", zIndex: 0 }}>
      {/* ── Banner principal ── */}
      <div style={{ padding: "80px 20px 64px", background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,.08)", filter: "blur(10px)", pointerEvents: "none" }} />

        <ExpandBtn light onClick={() => setExpandModal({
          title,
          content: (
            <div>
              <p style={{ fontSize: 18, color: "#555", lineHeight: 1.85, marginBottom: 32 }}>{desc}</p>
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setShowBank(true)}
                  style={{ padding: "16px 48px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 18, fontWeight: 700, cursor: "pointer" }}
                >
                  {t.financiacion.comoDonar}
                </button>
              </div>
            </div>
          ),
        })} />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#fff" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
            {supertitle}
          </span>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "18px 0 16px", letterSpacing: -.4 }}>{title}</h2>
          <p style={{ opacity: .92, lineHeight: 1.8, margin: 0, fontSize: 15.5 }}>{desc}</p>
        </div>
      </div>

      {/* ── Franjas de apoyo ── */}
      <div style={{ background: "#f7f9fc", padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {pi && (
            <StripCard id="patrocinio-individual" heading={piHeading}>
              {piIntro && <p style={{ fontSize: 13.5, fontWeight: 700, color: PRIMARY_DARK, letterSpacing: .3, margin: "0 0 4px" }}>{piIntro}</p>}
              <div style={{ marginBottom: 22 }}>
                {pi.monthly?.map((row, i) => <PriceRow key={row.label} {...row} label={monthlyLabels?.[i] || row.label} lang={language} />)}
              </div>
              {piIndividualHeading && <p style={{ fontSize: 13.5, fontWeight: 700, color: PRIMARY_DARK, letterSpacing: .3, margin: "0 0 4px" }}>{piIndividualHeading}</p>}
              <div style={{ marginBottom: 26 }}>
                {pi.individual?.map((row, i) => <PriceRow key={row.label} {...row} label={individualLabels?.[i] || row.label} lang={language} />)}
              </div>
              <HowToDonateButton onClick={() => setShowBank(true)} t={t} />
            </StripCard>
          )}

          {pe && (
            <StripCard id="patrocinio-empresarial" heading={peHeading}>
              <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#5b6472", margin: 0 }}>{peText}</p>
            </StripCard>
          )}

          {de && (
            <StripCard id="donaciones-especie" heading={deHeading}>
              <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#5b6472", margin: 0 }}>{deText}</p>
            </StripCard>
          )}

          {eps && (
            <StripCard id="practicas-eps" heading={epsHeading}>
              <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#5b6472", margin: 0 }}>{epsText}</p>
            </StripCard>
          )}
        </div>
      </div>

      {showBank && (
        <BankModal
          bank={financiacion.bank}
          docUrl={financiacion.docUrl}
          docLabel={financiacion.btnText}
          onOpenDoc={openDoc}
          onClose={() => setShowBank(false)}
          t={t}
          bankText={bankText}
        />
      )}
    </section>
  );
}
