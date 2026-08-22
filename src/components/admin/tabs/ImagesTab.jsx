import { useApp } from "../../../context/AppContext";
import ImageUpload from "../ImageUpload";

function Card({ title, desc, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{title}</h3>
      {desc && <p style={{ margin: "0 0 18px", fontSize: 13, color: "#6b7280" }}>{desc}</p>}
      {!desc && <div style={{ marginBottom: 18 }} />}
      {children}
    </div>
  );
}

export default function ImagesTab() {
  const { content, upC } = useApp();

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Logo e Imágenes</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Las fotos del equipo y las imágenes de programas se gestionan en sus respectivas secciones</p>
      </div>

      {/* Logo */}
      <Card title="Logo del sitio" desc="Aparece en la barra de navegación y el pie de página. Deja vacío para usar el logo predeterminado.">
        {content.brand?.logoUrl && (
          <div style={{ marginBottom: 16, padding: "12px 16px", background: "#f9fafb", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 14 }}>
            <img src={content.brand.logoUrl} alt="Logo actual" style={{ height: 52, maxWidth: 180, objectFit: "contain" }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>Logo actual</span>
          </div>
        )}
        <ImageUpload
          label="SUBIR LOGO"
          currentUrl={content.brand?.logoUrl || ""}
          onUpload={(url) => upC("brand", "logoUrl", url)}
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 }}>O PEGA UNA URL</label>
          <input
            value={content.brand?.logoUrl || ""}
            onChange={(e) => upC("brand", "logoUrl", e.target.value)}
            placeholder="https://…"
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>
      </Card>

      {/* Hero background */}
      <Card title="Imagen de fondo — Hero" desc="Aparece como fondo de la sección principal (Hero) del sitio.">
        <ImageUpload
          label="SUBIR IMAGEN"
          currentUrl={content.hero.bgUrl}
          onUpload={(url) => upC("hero", "bgUrl", url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400")}
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 }}>O PEGA UNA URL</label>
          <input
            value={content.hero.bgUrl}
            onChange={(e) => upC("hero", "bgUrl", e.target.value)}
            placeholder="https://…"
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>
      </Card>
    </div>
  );
}
