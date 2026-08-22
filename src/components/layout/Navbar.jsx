import { useState } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function Navbar() {
  const { navItems, scrollTo, content } = useApp();
  const [openMenu,   setOpenMenu]   = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const visible = navItems.filter((x) => x.enabled);
  const logoUrl = content.brand?.logoUrl;

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => scrollTo("#home")}>
          {logoUrl
            ? <img src={logoUrl} alt="Logo" style={{ height: 44, maxWidth: 140, objectFit: "contain" }} />
            : <>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
                  <polygon points="18,4 26,20 10,20" fill={PRIMARY} opacity=".7" />
                  <line x1="10" y1="30" x2="18" y2="18" stroke={PRIMARY} strokeWidth="2" />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 18, color: PRIMARY, letterSpacing: 1 }}>SOL</span>
              </>
          }
        </div>

        {/* desktop nav */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {visible.map((item) => (
            <div key={item.id} style={{ position: "relative" }}
              onMouseEnter={() => item.dropdown && setOpenMenu(item.id)}
              onMouseLeave={() => setOpenMenu(null)}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.dropdown ? setOpenMenu(openMenu === item.id ? null : item.id) : scrollTo(item.href);
                }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#555", letterSpacing: .5, display: "flex", alignItems: "center", gap: 4, borderBottom: "2px solid transparent", transition: "color .2s" }}
              >
                {item.label}
                {item.dropdown && <Icon name="chevronDown" size={12} color="#888" />}
              </button>

              {item.dropdown && openMenu === item.id && (
                <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 180, background: PRIMARY, borderRadius: "0 0 6px 6px", boxShadow: "0 4px 12px rgba(0,0,0,.15)", zIndex: 200, overflow: "hidden" }}>
                  {item.dropdown.filter((s) => s.enabled).map((sub) => (
                    <button key={sub.id}
                      onClick={(e) => { e.stopPropagation(); scrollTo(sub.href); setOpenMenu(null); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 18px", background: "none", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.15)" }}
                      onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,.15)")}
                      onMouseLeave={(e) => (e.target.style.background = "none")}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "none" }}>
          <Icon name="menu" size={22} />
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "12px 20px" }}>
          {visible.map((item) => (
            <div key={item.id}>
              <button onClick={() => item.href && scrollTo(item.href)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", background: "none", border: "none", fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>
                {item.label}
              </button>
              {item.dropdown && item.dropdown.filter((s) => s.enabled).map((sub) => (
                <button key={sub.id} onClick={() => scrollTo(sub.href)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0 8px 16px", background: "none", border: "none", fontSize: 13, color: PRIMARY, cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                  {sub.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
