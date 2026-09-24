import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";
import { ImageWatermark } from "../ui/GuatemalanMotifs";

function Avatar({ photoUrl, initials, size, ring }) {
  if (!photoUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .3, fontWeight: 700, color: PRIMARY, margin: "0 auto", boxShadow: `0 0 0 ${ring}px ${PRIMARY}` }}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt=""
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto", boxShadow: `0 0 0 ${ring}px ${PRIMARY}` }}
    />
  );
}

function MemberCard({ m, setExpandModal }) {
  const { content } = useApp();
  const siteName = content.brand?.siteName || "Casa ASOL";
  const workPhotos = m.photos || [];

  return (
    <div
      style={{ position: "relative", textAlign: "center", padding: "26px 18px", background: "#f7f9fc", borderRadius: 18, border: "1px solid #eef1f6", transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 30px rgba(15,64,140,.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <button
        onClick={() => setExpandModal({
          title: m.name,
          content: (
            <div style={{ textAlign: "center" }}>
              {m.photoUrl
                ? <img src={m.photoUrl} alt={m.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", margin: "0 auto 24px", display: "block", border: `3px solid ${PRIMARY}` }} />
                : <div style={{ width: 130, height: 130, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: PRIMARY, margin: "0 auto 24px", border: `3px solid ${PRIMARY}` }}>{m.initials}</div>
              }
              <p style={{ fontSize: 24, fontWeight: 700, color: "#222", marginBottom: 8 }}>{m.name}</p>
              <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, marginBottom: workPhotos.length ? 28 : 0 }}>{m.role}</p>

              {workPhotos.length > 0 && (
                <>
                  <p style={{ textAlign: "left", fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: 1, margin: "0 0 12px" }}>SU LABOR EN {siteName.toUpperCase()}</p>
                  <div style={{ display: "grid", gridTemplateColumns: workPhotos.length === 1 ? "1fr" : "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
                    {workPhotos.map((src, i) => (
                      <img key={i} src={src} alt={m.name} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12 }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ),
        })}
        style={{ position: "absolute", top: 10, right: 10, background: "#fff", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#667", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}
      >
        <Icon name="expand" size={13} />
      </button>

      {workPhotos.length > 0 && (
        <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: `${PRIMARY}12`, color: PRIMARY_DARK, fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 20 }}>
          <Icon name="image" size={9} color={PRIMARY_DARK} /> {workPhotos.length}
        </span>
      )}

      <div style={{ marginBottom: 16 }}>
        <Avatar photoUrl={m.photoUrl} initials={m.initials} size={76} ring={3} />
      </div>

      <p style={{ fontWeight: 700, fontSize: 14, color: DARK, margin: "0 0 4px" }}>{m.name}</p>
      <p style={{ fontSize: 12, color: PRIMARY_DARK, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>{m.role}</p>
    </div>
  );
}

export default function Equipo() {
  const { team, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("equipo")) return null;

  return (
    <section id="equipo" style={{ padding: "80px 20px", background: "#fff", position: "relative", zIndex: 0, overflow: "hidden" }}>
      <ImageWatermark name="mujer" tone="blue" size={148} opacity={.2} position={{ bottom: -20, right: -20 }} />
      <ImageWatermark name="jaguar" tone="blue" size={150} opacity={.15} position={{ top: -10, left: 24 }} rotate={-8} />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
            NUESTRO EQUIPO
          </span>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "16px 0 0", color: DARK, letterSpacing: -.4 }}>Las personas detrás de ASOL</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 22 }}>
          {team.map((m) => (
            <MemberCard key={m.id} m={m} setExpandModal={setExpandModal} />
          ))}
        </div>
      </div>
    </section>
  );
}
