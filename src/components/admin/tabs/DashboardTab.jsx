import { useState, useEffect } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";

const STATUS_LABEL = { borrador: "Borrador", enviado: "Enviado", aceptado: "Aceptado", devuelto: "Devuelto" };
const STATUS_COLOR = { borrador: "#d97706", enviado: "#2563eb", aceptado: "#16a34a", devuelto: "#dc2626" };

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-GT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatTile({ icon, color, value, label }) {
  return (
    <div style={{ flex: "1 1 140px", background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={17} color={color} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a1a2e", lineHeight: 1 }}>{value}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>{label}</p>
      </div>
    </div>
  );
}

// Panel de KPIs para quien revisa informes de todas las áreas
// (directoras, admin, desarrollador) — un vistazo de cuántos informes
// hay, en qué estado, por área, y cuáles están esperando su revisión
// ahora mismo, sin tener que entrar a "Informes" y elegir rol por rol.
export default function DashboardTab({ onGoToReports }) {
  const { authUser } = useApp();
  const [reports, setReports] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getReports(), api.getPublicRoles()])
      .then(([r, ro]) => { setReports(r); setRoles(ro); })
      .catch((e) => setError(e.message || "No se pudieron cargar los informes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando métricas...</p>;
  if (error) return <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>;

  const roleLabel = (name) => roles.find((r) => r.name === name)?.label || name;

  const byStatus = { borrador: 0, enviado: 0, aceptado: 0, devuelto: 0 };
  const byRole = {};
  for (const r of reports) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    byRole[r.role] ??= { borrador: 0, enviado: 0, aceptado: 0, devuelto: 0, total: 0 };
    byRole[r.role][r.status] = (byRole[r.role][r.status] || 0) + 1;
    byRole[r.role].total += 1;
  }
  const roleRows = Object.entries(byRole).sort((a, b) => roleLabel(a[0]).localeCompare(roleLabel(b[0])));

  const pending = reports
    .filter((r) => r.status === "enviado")
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Bienvenida, {authUser?.user}</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Resumen de los informes de todas las áreas</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatTile icon="list" color={PRIMARY} value={reports.length} label="Informes totales" />
        <StatTile icon="clock" color={STATUS_COLOR.enviado} value={byStatus.enviado} label="Esperando revisión" />
        <StatTile icon="check" color={STATUS_COLOR.aceptado} value={byStatus.aceptado} label="Aceptados" />
        <StatTile icon="warning" color={STATUS_COLOR.devuelto} value={byStatus.devuelto} label="Devueltos" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Pendientes de revisión</h3>
        {onGoToReports && (
          <button onClick={onGoToReports} style={{ background: "none", border: "none", color: PRIMARY, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Ver todos los informes →
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign: "center", padding: "36px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0", marginBottom: 28 }}>
          <Icon name="check" size={28} color="#d1d5db" />
          <p style={{ margin: "10px 0 0", color: "#9ca3af", fontSize: 13 }}>No hay informes esperando revisión.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {pending.map((r) => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, minWidth: 70 }}>{r.report_code || "—"}</span>
              <span style={{ fontSize: 13, color: "#1a1a2e", flex: 1, minWidth: 120 }}>{roleLabel(r.role)}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Enviado el {formatDateTime(r.submitted_at)}</span>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Por área</h3>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Área</th>
                <th style={{ textAlign: "center", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "#6b7280" }}>Total</th>
                {Object.keys(STATUS_LABEL).map((s) => (
                  <th key={s} style={{ textAlign: "center", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: STATUS_COLOR[s] }}>{STATUS_LABEL[s]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleRows.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>Todavía no hay informes.</td></tr>
              )}
              {roleRows.map(([role, counts]) => (
                <tr key={role} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 600, color: "#1a1a2e" }}>{roleLabel(role)}</td>
                  <td style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700 }}>{counts.total}</td>
                  {Object.keys(STATUS_LABEL).map((s) => (
                    <td key={s} style={{ textAlign: "center", padding: "10px 12px", color: counts[s] ? "#1a1a2e" : "#d1d5db" }}>{counts[s] || 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
