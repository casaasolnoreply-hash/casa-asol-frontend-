import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import ExpandBtn from "../ui/ExpandBtn";

export default function Stats() {
  const { stats, isSectionVisible, setExpandModal } = useApp();
  if (!isSectionVisible("stats")) return null;

  return (
    <section style={{ background: PRIMARY, padding: "40px 20px", position: "relative" }}>
      <ExpandBtn light onClick={() => setExpandModal({
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
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24, textAlign: "center" }}>
        {stats.map((s) => (
          <div key={s.id}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
