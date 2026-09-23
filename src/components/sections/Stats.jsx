import { PRIMARY, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";
import Icon from "../ui/Icon";
import { CulturalWatermark, MujerTipicaWatermark } from "../ui/GuatemalanMotifs";

const TILE_ICONS = ["users", "home", "book", "star"];

export default function Stats() {
  const { stats, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("stats")) return null;

  return (
    <section style={{ padding: "0 20px", position: "relative", marginTop: -64, marginBottom: 40 }}>
      <div style={{ position: "relative", zIndex: 0, maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 20, boxShadow: "0 20px 50px rgba(15,64,140,.14)", border: "1px solid #eef2f7", padding: "30px 28px", overflow: "hidden" }}>
        <CulturalWatermark icon="sunStone" size={190} color={PRIMARY} opacity={.14} position={{ top: -40, right: -40 }} />
        <MujerTipicaWatermark tone="blue" size={58} opacity={.12} position={{ bottom: -20, left: -10 }} />

        <ExpandBtn onClick={() => setExpandModal({
          title: "Estadísticas",
          content: (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 36, textAlign: "center", padding: "16px 0" }}>
              {stats.map((s) => (
                <div key={s.id}>
                  <div style={{ fontSize: 72, fontWeight: 800, color: PRIMARY }}>{s.value}</div>
                  <div style={{ fontSize: 20, color: "#444", marginTop: 10 }}>{s.label}</div>
                </div>
              ))}
            </div>
          ),
        })} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 18 }}>
          {stats.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 10px" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={TILE_ICONS[i % TILE_ICONS.length]} size={19} color={PRIMARY} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: DARK, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#8a93a3", marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
