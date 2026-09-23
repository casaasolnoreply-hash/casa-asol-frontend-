import { PRIMARY, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { content } = useApp();
  const logoUrl = content.brand?.logoUrl;

  return (
    <footer style={{ background: DARK, color: "#a8b1bf", padding: "52px 20px 0" }}>
      <div className="ca-footer-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 32, paddingBottom: 40 }}>
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
          <p style={{ fontSize: 13, lineHeight: 1.85, color: "#8a93a3", maxWidth: 280 }}>{content.footer.desc}</p>
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1, marginBottom: 16 }}>LA CASA</p>
          {["El Equipo", "Historia", "Programa"].map((l) => (
            <p key={l} style={{ margin: "0 0 10px" }}>
              <a href="#" style={{ color: "#8a93a3", textDecoration: "none", fontSize: 13.5, transition: "color .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY_LIGHT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8a93a3")}>
                {l}
              </a>
            </p>
          ))}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1, marginBottom: 16 }}>AYUDAR</p>
          {["Financiación", "Voluntariado"].map((l) => (
            <p key={l} style={{ margin: "0 0 10px" }}>
              <a href="#" style={{ color: "#8a93a3", textDecoration: "none", fontSize: 13.5, transition: "color .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY_LIGHT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8a93a3")}>
                {l}
              </a>
            </p>
          ))}
        </div>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 12.5, letterSpacing: 1, marginBottom: 16 }}>CONTACTO</p>
          <p style={{ fontSize: 13.5, color: "#8a93a3", lineHeight: 1.9 }}>
            {content.topbar.address}<br />{content.topbar.phone}
          </p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", padding: "20px 0", textAlign: "center", fontSize: 12, color: "#697280" }}>
        © {new Date().getFullYear()} Casa Estudiantil ASOL. Todos los derechos reservados.
      </div>

      <style>{`
        @media (max-width: 760px) {
          .ca-footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}
