import { PRIMARY, PRIMARY_LIGHT, PRIMARY_DARK, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

export default function Confianza() {
  const { content, isSectionVisible, language, contentTranslations } = useApp();
  if (!isSectionVisible("confianza")) return null;

  const logos = content.confianza?.logos || [];
  if (!logos.length) return null;

  const heading = (language === "es" ? null : contentTranslations[language]?.confianza?.heading)
    || content.confianza?.heading
    || "Quiénes confían en nosotros:";

  // Duplicamos la lista para que la cinta pueda desplazarse de forma
  // continua (al llegar a la mitad, visualmente ya empezó a repetirse).
  const track = [...logos, ...logos];

  return (
    <section style={{ padding: "60px 0 56px", background: "#fff", borderTop: "1px solid #eef1f6", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999, marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
          ALIADOS
        </span>
        <h2 style={{ fontSize: "clamp(20px,2.6vw,27px)", fontWeight: 800, margin: 0, color: DARK, letterSpacing: -.3 }}>
          {heading}
        </h2>
      </div>

      <div className="ca-confianza-fade" style={{ position: "relative" }}>
        <div className="ca-confianza-track" style={{ display: "flex", width: "max-content", gap: 64, alignItems: "center" }}>
          {track.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="ca-confianza-logo"
              style={{ height: 82, maxWidth: 220, objectFit: "contain", flexShrink: 0 }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ca-confianza-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ca-confianza-track {
          animation: ca-confianza-scroll 28s linear infinite;
        }
        .ca-confianza-fade:hover .ca-confianza-track {
          animation-play-state: paused;
        }
        .ca-confianza-fade {
          mask-image: linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%);
        }
        .ca-confianza-logo {
          transition: transform .25s;
        }
        .ca-confianza-logo:hover {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
