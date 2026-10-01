import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { UI } from "../../i18n/translations";
import { SmartIcon } from "../ui/Icon";
import Icon from "../ui/Icon";
import useRotatingIndex from "../../hooks/useRotatingIndex";

function ModalGallery({ images, title }) {
  const activeImg = useRotatingIndex(images.length, 4200);
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360, height: 260, margin: "0 auto 28px", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 40px rgba(15,64,140,.16)" }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={title}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === activeImg ? 1 : 0,
            transition: "opacity 1.1s ease",
          }}
        />
      ))}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
          {images.map((_, i) => (
            <span key={i} style={{ width: i === activeImg ? 14 : 6, height: 6, borderRadius: 4, background: i === activeImg ? "#fff" : "rgba(255,255,255,.55)", transition: "all .35s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramCard({ p, setExpandModal, language, t }) {
  const { contentTranslations } = useApp();
  const imgs = p.images?.length ? p.images : (p.imageUrl ? [p.imageUrl] : []);
  const activeImg = useRotatingIndex(imgs.length, 4200);

  const tr = language === "es" ? null : contentTranslations[language]?.programa?.[p.id];
  const title = tr?.title || p.title;
  const desc = tr?.desc || p.desc;
  const full = tr?.full || p.full;

  const openGallery = () => setExpandModal({
    title,
    content: (
      <div>
        {imgs.length > 0 ? (
          <ModalGallery images={imgs} title={title} />
        ) : (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <SmartIcon value={p.icon} size={80} color={PRIMARY} />
          </div>
        )}
        {full?.length > 0 ? (
          <div style={{ textAlign: "left" }}>
            {full.map((block, i) =>
              block.startsWith("•") ? (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#444", margin: "0 0 8px", paddingLeft: 22, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: PRIMARY, fontWeight: 700 }}>•</span>
                  {block.slice(1)}
                </p>
              ) : (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#444", margin: "0 0 16px" }}>{block}</p>
              )
            )}
          </div>
        ) : (
          <p style={{ fontSize: 19, lineHeight: 1.9, color: "#444", textAlign: "center" }}>{desc}</p>
        )}
      </div>
    ),
  });

  return (
    <div
      onClick={openGallery}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") openGallery(); }}
      style={{ position: "relative", background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #eef1f6", boxShadow: "0 6px 20px rgba(15,64,140,.06)", transition: "transform .2s, box-shadow .2s", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(15,64,140,.14)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,64,140,.06)"; }}
    >
      {imgs.length > 0 && (
        <div style={{ position: "relative", height: 150 }}>
          {imgs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={title}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
                opacity: i === activeImg ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          ))}
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
              {imgs.map((_, i) => (
                <span key={i} style={{ width: i === activeImg ? 14 : 6, height: 6, borderRadius: 4, background: i === activeImg ? "#fff" : "rgba(255,255,255,.55)", transition: "all .35s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
              ))}
            </div>
          )}
          {imgs.length > 1 && (
            <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
              <Icon name="image" size={10} color="#fff" /> {imgs.length}
            </span>
          )}
        </div>
      )}

      <span
        style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,.85)", border: "none", borderRadius: 8, padding: "5px 8px", color: "#667", zIndex: 2, display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
      >
        <Icon name="expand" size={13} />
      </span>

      <div style={{ padding: 26, display: "flex", flexDirection: "column", flex: 1 }}>
        {imgs.length === 0 && (
          <div style={{ width: 50, height: 50, borderRadius: 13, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <SmartIcon value={p.icon} size={24} color={PRIMARY} />
          </div>
        )}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "#7a8394", lineHeight: 1.7, margin: "0 0 14px" }}>{desc}</p>
        <button
          onClick={(e) => { e.stopPropagation(); openGallery(); }}
          style={{ marginTop: "auto", alignSelf: "flex-start", background: PRIMARY, border: "none", padding: "9px 18px", color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: .2, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, boxShadow: `0 8px 18px ${PRIMARY}4d`, transition: "transform .15s, box-shadow .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 22px ${PRIMARY}66`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 18px ${PRIMARY}4d`; }}
        >
          {t.programa.leerMas} <Icon name="chevronDown" size={11} color="#fff" style={{ transform: "rotate(-90deg)" }} />
        </button>
      </div>
    </div>
  );
}

export default function Programa() {
  const { programa, isSectionVisible, setExpandModal, language } = useApp();
  if (!isSectionVisible("programa")) return null;
  const t = UI[language];

  return (
    <section id="programa" style={{ padding: "80px 20px", background: "#f7f9fc", position: "relative", zIndex: 0, overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 12, fontWeight: 700, letterSpacing: .6, padding: "6px 15px", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY }} />
            {t.programa.kicker}
          </span>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, margin: "16px 0 0", color: DARK, letterSpacing: -.4 }}>{t.programa.heading}</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 24 }}>
          {programa.map((p) => (
            <ProgramCard key={p.id} p={p} setExpandModal={setExpandModal} language={language} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
