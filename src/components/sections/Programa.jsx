import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SmartIcon } from "../ui/Icon";
import Icon from "../ui/Icon";
import { ImageWatermark } from "../ui/GuatemalanMotifs";
import useRotatingIndex from "../../hooks/useRotatingIndex";

function ProgramCard({ p, setExpandModal }) {
  const imgs = p.images?.length ? p.images : (p.imageUrl ? [p.imageUrl] : []);
  const activeImg = useRotatingIndex(imgs.length, 4200);

  const openGallery = () => setExpandModal({
    title: p.title,
    content: (
      <div>
        {imgs.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: imgs.length === 1 ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {imgs.map((img, i) => (
              <img key={i} src={img} alt={p.title} style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <SmartIcon value={p.icon} size={80} color={PRIMARY} />
          </div>
        )}
        <p style={{ fontSize: 19, lineHeight: 1.9, color: "#444", textAlign: "center" }}>{p.desc}</p>
      </div>
    ),
  });

  return (
    <div
      onClick={openGallery}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") openGallery(); }}
      style={{ position: "relative", background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #eef1f6", boxShadow: "0 6px 20px rgba(15,64,140,.06)", transition: "transform .2s, box-shadow .2s", cursor: "pointer" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(15,64,140,.14)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,64,140,.06)"; }}
    >
      {imgs.length > 0 && (
        <div style={{ position: "relative", height: 150 }}>
          {imgs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={p.title}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
                opacity: i === activeImg ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          ))}
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
              {imgs.map((_, i) => (
                <span key={i} style={{ width: i === activeImg ? 14 : 6, height: 6, borderRadius: 4, background: i === activeImg ? "#fff" : "rgba(255,255,255,.55)", transition: "all .35s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
              ))}
            </div>
          )}
          {imgs.length > 1 && (
            <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
              <Icon name="image" size={10} color="#fff" /> {imgs.length}
            </span>
          )}
        </div>
      )}

      <span
        style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,.85)", border: "none", borderRadius: 8, padding: "5px 8px", color: "#667", zIndex: 2, display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
      >
        <Icon name="expand" size={13} />
      </span>

      <div style={{ padding: 26 }}>
        {imgs.length === 0 && (
          <div style={{ width: 50, height: 50, borderRadius: 13, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <SmartIcon value={p.icon} size={24} color={PRIMARY} />
          </div>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>{p.title}</h3>
        <p style={{ fontSize: 13.5, color: "#7a8394", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
      </div>
    </div>
  );
}

export default function Programa() {
  const { programa, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("programa")) return null;

  return (
    <section id="programa" style={{ padding: "80px 20px", background: "#f7f9fc", position: "relative", zIndex: 0, overflow: "hidden" }}>
      <ImageWatermark name="escudo" tone="blue" size={320} opacity={.18} position={{ top: -50, right: -50 }} />
      <ImageWatermark name="cafe" tone="blue" size={150} opacity={.16} position={{ bottom: -10, left: 20 }} rotate={-6} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
            NUESTRO PROGRAMA
          </span>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "16px 0 0", color: DARK, letterSpacing: -.4 }}>Cómo transformamos vidas</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 24 }}>
          {programa.map((p) => (
            <ProgramCard key={p.id} p={p} setExpandModal={setExpandModal} />
          ))}
        </div>
      </div>
    </section>
  );
}
