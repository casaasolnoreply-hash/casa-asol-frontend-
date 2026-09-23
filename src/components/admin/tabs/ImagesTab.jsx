import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import ImageUpload from "../ImageUpload";
import AddImageBtn from "../AddImageBtn";
import Icon from "../../ui/Icon";

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
  const { content, upC, addHeroImage, removeHeroImage } = useApp();
  const heroImages = content.hero.images?.length ? content.hero.images : (content.hero.bgUrl ? [content.hero.bgUrl] : []);

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

      {/* Hero — galería rotativa */}
      <Card title="Imágenes — Hero" desc="Aparecen en la sección principal (Hero) del sitio. Si agregas más de una, van rotando automáticamente.">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 12 }}>
          {heroImages.map((img, idx) => (
            <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
              <img src={img} alt="" style={{ width: 96, height: 68, objectFit: "cover", borderRadius: 8, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
              <button
                onClick={() => removeHeroImage(idx)}
                style={{ position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
              >
                <Icon name="x" size={10} />
              </button>
            </div>
          ))}
          <AddImageBtn onAdd={addHeroImage} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 }}>O PEGA UNA URL Y PRESIONA ENTER</label>
          <input
            placeholder="https://…"
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                addHeroImage(e.target.value.trim());
                e.target.value = "";
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}
