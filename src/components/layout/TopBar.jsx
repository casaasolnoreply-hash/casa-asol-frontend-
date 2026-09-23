import { useNavigate } from "react-router-dom";
import { DARK, PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function TopBar() {
  const { content, isAdmin, saving } = useApp();
  const navigate = useNavigate();

  const { topbar } = content;

  const socialLinks = [
    { key: "facebook",  icon: "facebook"  },
    { key: "linkedin",  icon: "linkedin"  },
    { key: "instagram", icon: "instagram" },
  ];

  const iconBox = { width: 26, height: 26, background: "rgba(30,136,229,.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

  return (
    <div style={{ background: DARK, padding: "8px 0", fontSize: 12.5, color: "#c6ceda" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {topbar.locationUrl ? (
            <a href={topbar.locationUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <span><strong>Dirección</strong> {topbar.address}</span>
            </a>
          ) : (
            <span><strong>Dirección</strong> {topbar.address}</span>
          )}
          <span><strong>Teléfono</strong> {topbar.phone}</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {socialLinks.map(({ key, icon }) => {
            const url = topbar[key];
            const box = <span style={iconBox}><Icon name={icon} size={13} color="#cfe4fb" /></span>;
            return url ? (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                {box}
              </a>
            ) : (
              <span key={key} style={iconBox}><Icon name={icon} size={13} color="#5b6472" /></span>
            );
          })}

          {isAdmin && saving && (
            <span style={{ fontSize: 11, color: "#8a93a3", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="refresh" size={11} color="#8a93a3" /> Guardando...
            </span>
          )}

          {isAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              <Icon name="settings" size={13} color="#fff" /> Panel admin
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "transparent", color: "#c6ceda", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              <Icon name="logout" size={13} color="#c6ceda" /> Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
