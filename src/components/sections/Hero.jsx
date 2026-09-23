import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import Icon from "../ui/Icon";
import { CulturalWatermark, MujerTipicaWatermark } from "../ui/GuatemalanMotifs";
import useRotatingIndex from "../../hooks/useRotatingIndex";

export default function Hero() {
  const { content, isSectionVisible, setExpandModal, scrollTo } = useApp();
  if (!isSectionVisible("home")) return null;

  const { hero } = content;
  const heroImages = hero.images?.length ? hero.images : (hero.bgUrl ? [hero.bgUrl] : []);
  const activeImg = useRotatingIndex(heroImages.length, 6500);

  const buttons = hero.buttons?.length
    ? hero.buttons
    : [
        { text: hero.btn1Text, href: hero.btn1Href, style: "primary" },
        { text: hero.btn2Text, href: hero.btn2Href, style: "outline" },
      ];

  const btnStyle = (style) =>
    style === "outline"
      ? { padding: "13px 30px", background: "#fff", color: PRIMARY_DARK, border: `2px solid ${PRIMARY_LIGHT}`, borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .2 }
      : { padding: "13px 30px", background: PRIMARY, color: "#fff", border: "2px solid transparent", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .2, boxShadow: `0 10px 24px ${PRIMARY}40` };

  const btnStyleModal = (style) =>
    style === "outline"
      ? { padding: "14px 32px", background: "transparent", color: PRIMARY, border: `2px solid ${PRIMARY}`, borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: "pointer" }
      : { padding: "14px 32px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: "pointer" };

  return (
    <section
      id="home"
      style={{
        position: "relative", zIndex: 0, overflow: "hidden",
        background: `linear-gradient(150deg, ${PRIMARY_LIGHT} 0%, #fff 55%)`,
        padding: "88px 20px 120px",
      }}
    >
      {/* decorative blurred blobs */}
      <div style={{ position: "absolute", top: -120, right: -100, width: 420, height: 420, borderRadius: "50%", background: PRIMARY, opacity: .16, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -160, left: -120, width: 380, height: 380, borderRadius: "50%", background: PRIMARY_DARK, opacity: .12, filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Guatemalan cultural watermarks */}
      <CulturalWatermark icon="tikal" size={430} color={PRIMARY_DARK} opacity={.24} position={{ bottom: -30, right: -40 }} />
      <MujerTipicaWatermark tone="blue" size={123} opacity={.32} position={{ top: 26, left: 14 }} />
      <CulturalWatermark icon="sunStone" size={110} color={PRIMARY} opacity={.2} position={{ bottom: -20, left: -20 }} />

      <ExpandBtn onClick={() => setExpandModal({
        title: hero.title,
        content: (
          <div>
            <p style={{ fontSize: 20, color: "#555", lineHeight: 1.8, marginBottom: 28 }}>{hero.subtitle}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {buttons.map((btn, i) => (
                <button key={i} style={btnStyleModal(btn.style)}>{btn.text}</button>
              ))}
            </div>
          </div>
        ),
      })} />

      <div className="ca-hero-grid" style={{ position: "relative", maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 52, alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${PRIMARY_LIGHT}`, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "7px 16px", borderRadius: 999, boxShadow: "0 4px 14px rgba(30,136,229,.12)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: PRIMARY }} />
            ORGANIZACIÓN SIN FINES DE LUCRO
          </span>

          <h1 style={{ fontSize: "clamp(30px,4.4vw,48px)", fontWeight: 800, margin: "20px 0 18px", lineHeight: 1.12, color: DARK, letterSpacing: -.5 }}>
            {hero.title}
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", maxWidth: 520, margin: "0 0 34px", color: "#5b6472", lineHeight: 1.7 }}>
            {hero.subtitle}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {buttons.map((btn, i) => (
              <button key={i} onClick={() => scrollTo(btn.href)} style={btnStyle(btn.style)}>
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: "14px -14px -14px 14px", border: `2px solid ${PRIMARY}`, borderRadius: 22, opacity: .35 }} />
          {heroImages.length ? (
            <div style={{ position: "relative", width: "100%", height: 380, borderRadius: 22, overflow: "hidden", boxShadow: "0 24px 60px rgba(15,64,140,.22)", background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` }}>
              <img
                key={activeImg}
                src={heroImages[activeImg]}
                alt={hero.title}
                className="ca-hero-kenburns"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", height: 380, borderRadius: 22, background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 60px rgba(15,64,140,.22)" }}>
              <Icon name="home" size={72} color="rgba(255,255,255,.85)" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .ca-hero-grid { grid-template-columns: 1fr !important; text-align: center; }
        }
        @keyframes ca-hero-kenburns {
          from { opacity: 0; transform: scale(1); }
          8%   { opacity: 1; }
          to   { opacity: 1; transform: scale(1.09); }
        }
        .ca-hero-kenburns { animation: ca-hero-kenburns 6.5s ease-out both; }
      `}</style>
    </section>
  );
}
