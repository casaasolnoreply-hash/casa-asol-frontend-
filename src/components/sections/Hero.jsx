import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";

export default function Hero() {
  const { content, isSectionVisible, setExpandModal, scrollTo } = useApp();
  if (!isSectionVisible("home")) return null;

  const { hero } = content;

  const buttons = hero.buttons?.length
    ? hero.buttons
    : [
        { text: hero.btn1Text, href: hero.btn1Href, style: "primary" },
        { text: hero.btn2Text, href: hero.btn2Href, style: "outline" },
      ];

  const btnStyle = (style) =>
    style === "outline"
      ? { padding: "12px 28px", background: "transparent", color: "#fff", border: "2px solid #fff", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .5 }
      : { padding: "12px 28px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: .5 };

  const btnStyleModal = (style) =>
    style === "outline"
      ? { padding: "14px 32px", background: "transparent", color: PRIMARY, border: `2px solid ${PRIMARY}`, borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: "pointer" }
      : { padding: "14px 32px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: "pointer" };

  return (
    <section
      id="home"
      style={{
        position: "relative", minHeight: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${hero.bgUrl}')center/cover no-repeat`,
        color: "#fff", textAlign: "center", padding: "80px 20px",
      }}
    >
      <ExpandBtn light onClick={() => setExpandModal({
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

      <div>
        <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, margin: "0 0 18px", letterSpacing: 2, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
          {hero.title}
        </h1>
        <p style={{ fontSize: "clamp(15px,2vw,20px)", maxWidth: 600, margin: "0 auto 32px", opacity: .95, lineHeight: 1.6 }}>
          {hero.subtitle}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {buttons.map((btn, i) => (
            <button key={i} onClick={() => scrollTo(btn.href)} style={btnStyle(btn.style)}>
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
