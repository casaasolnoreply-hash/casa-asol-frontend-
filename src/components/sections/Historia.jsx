import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import useRotatingIndex from "../../hooks/useRotatingIndex";

function Kicker({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
      {children}
    </span>
  );
}

export default function Historia() {
  const { content, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("historia")) return null;

  const { historia } = content;
  const paragraphs = historia.paragraphs?.length
    ? historia.paragraphs
    : [historia.text1, historia.text2].filter(Boolean);
  const historiaImages = historia.images?.length ? historia.images : (historia.imageUrl ? [historia.imageUrl] : []);
  const activeImg = useRotatingIndex(historiaImages.length, 5000);

  return (
    <section id="historia" style={{ padding: "80px 20px", background: "#fff", position: "relative" }}>
      <ExpandBtn onClick={() => setExpandModal({
        title: historia.title,
        content: (
          <div>
            <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>{historia.supertitle}</p>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.9, color: "#444", marginBottom: i < paragraphs.length - 1 ? 20 : 32 }}>{p}</p>
            ))}
            <div style={{ background: PRIMARY_LIGHT, borderRadius: 10, padding: "28px 32px", borderLeft: `5px solid ${PRIMARY}` }}>
              <p style={{ fontStyle: "italic", color: "#333", lineHeight: 1.85, fontSize: 19, margin: "0 0 16px" }}>"{historia.quote}"</p>
              <p style={{ color: PRIMARY_DARK, fontWeight: 700, fontSize: 15, margin: 0 }}>{historia.quoteAuthor}</p>
            </div>
          </div>
        ),
      })} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Kicker>{historia.supertitle}</Kicker>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "16px 0 0", color: DARK, letterSpacing: -.4 }}>{historia.title}</h2>
        </div>

        <div className="ca-historia-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ lineHeight: 1.85, color: "#5b6472", fontSize: 15.5, marginBottom: i < paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
            ))}
          </div>
          {historiaImages.length ? (
            <div>
              <div style={{ position: "relative", width: "100%", height: 320, borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 40px rgba(15,64,140,.14)", marginBottom: 18 }}>
                {historiaImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={historia.title}
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                      opacity: i === activeImg ? 1 : 0,
                      transform: i === activeImg ? "translateY(0)" : "translateY(10px)",
                      transition: "opacity 1.1s ease, transform 1.1s ease",
                    }}
                  />
                ))}
              </div>
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 14, padding: "18px 22px", borderLeft: `4px solid ${PRIMARY}` }}>
                <p style={{ fontStyle: "italic", color: "#3a4250", lineHeight: 1.8, fontSize: 14, margin: 0 }}>"{historia.quote}"</p>
                <p style={{ color: PRIMARY_DARK, fontWeight: 700, fontSize: 13, margin: "10px 0 0" }}>{historia.quoteAuthor}</p>
              </div>
            </div>
          ) : (
            <div style={{ background: PRIMARY_LIGHT, borderRadius: 18, padding: 30, borderLeft: `4px solid ${PRIMARY}` }}>
              <p style={{ fontStyle: "italic", color: "#3a4250", lineHeight: 1.8, fontSize: 15 }}>"{historia.quote}"</p>
              <p style={{ marginTop: 16, color: PRIMARY_DARK, fontWeight: 700, fontSize: 13 }}>{historia.quoteAuthor}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .ca-historia-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
