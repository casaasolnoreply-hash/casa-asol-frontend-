import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function Equipo() {
  const { team, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("equipo")) return null;

  return (
    <section id="equipo" style={{ padding: "70px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: PRIMARY, fontWeight: 700, fontSize: 13, letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>NUESTRO EQUIPO</p>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginBottom: 12, color: "#222" }}>Las personas detrás de ASOL</h2>
        <div style={{ width: 50, height: 3, background: PRIMARY, margin: "0 auto 40px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 24 }}>
          {team.map((m) => (
            <div key={m.id} style={{ position: "relative", textAlign: "center", padding: 20 }}>
              <button
                onClick={() => setExpandModal({
                  title: m.name,
                  content: (
                    <div style={{ textAlign: "center" }}>
                      {m.photoUrl
                        ? <img src={m.photoUrl} alt={m.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", margin: "0 auto 28px", display: "block", border: `3px solid ${PRIMARY}` }} />
                        : <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#e3f0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: PRIMARY, margin: "0 auto 28px", border: `3px solid ${PRIMARY}` }}>{m.initials}</div>
                      }
                      <p style={{ fontSize: 24, fontWeight: 700, color: "#222", marginBottom: 14 }}>{m.name}</p>
                      <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7 }}>{m.role}</p>
                    </div>
                  ),
                })}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.06)", border: "none", borderRadius: 4, padding: "4px 7px", cursor: "pointer", color: "#777", display: "flex", alignItems: "center" }}
              >
                <Icon name="expand" size={13} />
              </button>

              {/* Avatar — foto o iniciales */}
              {m.photoUrl
                ? <img src={m.photoUrl} alt={m.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 14px", border: `2px solid ${PRIMARY}` }} />
                : <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e3f0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: PRIMARY, margin: "0 auto 14px", border: `2px solid ${PRIMARY}` }}>{m.initials}</div>
              }

              <p style={{ fontWeight: 700, fontSize: 14, color: "#222", margin: "0 0 4px" }}>{m.name}</p>
              <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, margin: 0 }}>{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
