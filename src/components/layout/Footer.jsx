import { PRIMARY, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { content } = useApp();
  const logoUrl = content.brand?.logoUrl;

  return (
    <footer style={{ background: DARK, color: "#ccc", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            {logoUrl
              ? <img src={logoUrl} alt="Logo" style={{ height: 36, maxWidth: 120, objectFit: "contain" }} />
              : <>
                  <svg width="28" height="28" viewBox="0 0 36 36">
                    <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
                    <polygon points="18,4 26,20 10,20" fill={PRIMARY} opacity=".8" />
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Casa ASOL</span>
                </>
            }
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#aaa" }}>{content.footer.desc}</p>
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>LA CASA</p>
          {["El Equipo", "Historia", "Programa"].map((l) => (
            <p key={l} style={{ margin: "0 0 8px" }}>
              <a href="#" style={{ color: "#aaa", textDecoration: "none", fontSize: 13 }}>{l}</a>
            </p>
          ))}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>AYUDAR</p>
          {["Financiación", "Voluntariado"].map((l) => (
            <p key={l} style={{ margin: "0 0 8px" }}>
              <a href="#" style={{ color: "#aaa", textDecoration: "none", fontSize: 13 }}>{l}</a>
            </p>
          ))}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>CONTACTO</p>
          <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>
            {content.topbar.address}<br />{content.topbar.phone}
          </p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #333", marginTop: 32, paddingTop: 20, textAlign: "center", fontSize: 12, color: "#666" }}>
        © {new Date().getFullYear()} Casa Estudiantil ASOL. Todos los derechos reservados.
      </div>
    </footer>
  );
}
