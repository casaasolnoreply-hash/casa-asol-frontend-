import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SmartIcon } from "../ui/Icon";
import Icon from "../ui/Icon";

export default function Programa() {
  const { programa, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("programa")) return null;

  return (
    <section id="programa" style={{ padding: "70px 20px", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>NUESTRO PROGRAMA</p>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>Cómo transformamos vidas</h2>
        <div style={{ width: 50, height: 3, background: PRIMARY, margin: "0 auto 40px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {programa.map((p) => {
            const imgs = p.images?.length ? p.images : (p.imageUrl ? [p.imageUrl] : []);
            const firstImg = imgs[0];
            return (
              <div
                key={p.id}
                style={{ position: "relative", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)", borderTop: `3px solid ${PRIMARY}`, transition: "transform .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {firstImg && (
                  <div style={{ position: "relative" }}>
                    <img src={firstImg} alt={p.title} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    {imgs.length > 1 && (
                      <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 600 }}>
                        +{imgs.length - 1} fotos
                      </span>
                    )}
                  </div>
                )}

                <div style={{ padding: 28 }}>
                  <button
                    onClick={() => setExpandModal({
                      title: p.title,
                      content: (
                        <div>
                          {imgs.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: imgs.length === 1 ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 28 }}>
                              {imgs.map((img, i) => (
                                <img key={i} src={img} alt={p.title} style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 8 }} />
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
                    })}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.06)", border: "none", borderRadius: 4, padding: "4px 7px", cursor: "pointer", color: "#777", zIndex: 2, display: "flex", alignItems: "center" }}
                  >
                    <Icon name="expand" size={13} />
                  </button>

                  {!firstImg && <div style={{ marginBottom: 12 }}><SmartIcon value={p.icon} size={36} color={PRIMARY} /></div>}
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
