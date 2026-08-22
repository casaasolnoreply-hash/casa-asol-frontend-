import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { SmartIcon } from "../../ui/Icon";

const inp = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 4, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };
const btnP = { padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" };
const btnD = { padding: "4px 9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" };
const chip = (active) => ({ padding: "5px 16px", borderRadius: 20, border: `1px solid ${active ? PRIMARY : "#ddd"}`, background: active ? PRIMARY : "#fff", color: active ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" });

export default function DataTab() {
  const [sub, setSub] = useState("stats");
  const { stats, programa, team, upStat, removeStat, addStat, upProg, removeProg, addProg, upTeam, removeTeam, addTeamMember } = useApp();

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {[["stats", "Estadísticas"], ["programa", "Programa"], ["equipo", "Equipo"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setSub(id)} style={chip(sub === id)}>{lbl}</button>
        ))}
      </div>

      {sub === "stats" && (
        <>
          {stats.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={s.value} onChange={(e) => upStat(s.id, "value", e.target.value)} style={{ ...inp, width: 80, flex: "none", fontWeight: 700 }} placeholder="120+" />
                <input value={s.label} onChange={(e) => upStat(s.id, "label", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Etiqueta" />
                <button onClick={() => removeStat(s.id)} style={btnD}>×</button>
              </div>
            </div>
          ))}
          <button onClick={addStat} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar estadística</button>
        </>
      )}

      {sub === "programa" && (
        <>
          {programa.map((p) => (
            <div key={p.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <input value={p.icon} onChange={(e) => upProg(p.id, "icon", e.target.value)} style={{ ...inp, width: 96, flex: "none" }} placeholder="book, star…" title="Nombre del ícono (book, home, star, palette, utensils…)" />
                  <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SmartIcon value={p.icon} size={20} color={PRIMARY} />
                  </span>
                </div>
                <input value={p.title} onChange={(e) => upProg(p.id, "title", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Título" />
                <button onClick={() => removeProg(p.id)} style={btnD}>×</button>
              </div>
              <textarea value={p.desc} onChange={(e) => upProg(p.id, "desc", e.target.value)}
                style={{ ...inp, resize: "vertical", minHeight: 56, display: "block" }} placeholder="Descripción" />
            </div>
          ))}
          <button onClick={addProg} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar programa</button>
        </>
      )}

      {sub === "equipo" && (
        <>
          {team.map((m) => (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <input value={m.initials} onChange={(e) => upTeam(m.id, "initials", e.target.value)} style={{ ...inp, width: 52, flex: "none", fontWeight: 700, textTransform: "uppercase" }} maxLength={3} placeholder="XX" />
                <input value={m.name} onChange={(e) => upTeam(m.id, "name", e.target.value)} style={{ ...inp, flex: 1 }} placeholder="Nombre / Cargo" />
                <button onClick={() => removeTeam(m.id)} style={btnD}>×</button>
              </div>
              <input value={m.role} onChange={(e) => upTeam(m.id, "role", e.target.value)} style={{ ...inp, width: "100%" }} placeholder="Descripción del rol" />
            </div>
          ))}
          <button onClick={addTeamMember} style={{ ...btnP, width: "100%", marginTop: 4 }}>+ Agregar miembro</button>
        </>
      )}
    </div>
  );
}
