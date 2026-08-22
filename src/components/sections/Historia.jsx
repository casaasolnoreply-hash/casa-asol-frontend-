import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";

export default function Historia() {
  const { content, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("historia")) return null;

  const { historia } = content;
  const paragraphs = historia.paragraphs?.length
    ? historia.paragraphs
    : [historia.text1, historia.text2].filter(Boolean);

  return (
    <section id="historia" style={{ padding: "70px 20px", background: "#fff", position: "relative" }}>
      <ExpandBtn onClick={() => setExpandModal({
        title: historia.title,
        content: (
          <div>
            <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>{historia.supertitle}</p>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.9, color: "#444", marginBottom: i < paragraphs.length - 1 ? 20 : 32 }}>{p}</p>
            ))}
            <div style={{ background: "#f0f7ff", borderRadius: 10, padding: "28px 32px", borderLeft: `5px solid ${PRIMARY}` }}>
              <p style={{ fontStyle: "italic", color: "#333", lineHeight: 1.85, fontSize: 19, margin: "0 0 16px" }}>"{historia.quote}"</p>
              <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 15, margin: 0 }}>{historia.quoteAuthor}</p>
            </div>
          </div>
        ),
      })} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{historia.supertitle}</p>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 20, color: "#222" }}>{historia.title}</h2>
        <div style={{ width: 50, height: 3, background: PRIMARY, margin: "0 auto 32px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ lineHeight: 1.8, color: "#555", marginBottom: i < paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
            ))}
          </div>
          {historia.imageUrl ? (
            <div>
              <img src={historia.imageUrl} alt={historia.title} style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 320, display: "block", marginBottom: 16 }} />
              <div style={{ background: "#f0f7ff", borderRadius: 8, padding: "16px 20px", borderLeft: `4px solid ${PRIMARY}` }}>
                <p style={{ fontStyle: "italic", color: "#444", lineHeight: 1.8, fontSize: 14, margin: 0 }}>"{historia.quote}"</p>
                <p style={{ marginTop: 10, color: PRIMARY, fontWeight: 600, fontSize: 13, margin: "10px 0 0" }}>{historia.quoteAuthor}</p>
              </div>
            </div>
          ) : (
            <div style={{ background: "#f0f7ff", borderRadius: 8, padding: 28, borderLeft: `4px solid ${PRIMARY}` }}>
              <p style={{ fontStyle: "italic", color: "#444", lineHeight: 1.8, fontSize: 15 }}>"{historia.quote}"</p>
              <p style={{ marginTop: 16, color: PRIMARY, fontWeight: 600, fontSize: 13 }}>{historia.quoteAuthor}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
