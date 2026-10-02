import { useState, useEffect } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { UI } from "../../i18n/translations";
import { trimLogo } from "../../utils/cloudinary";
import Icon from "../ui/Icon";
import { HuipilStripeVertical } from "../ui/GuatemalanMotifs";

export default function Navbar() {
  const { navItems, scrollTo, content, programa, language, contentTranslations } = useApp();
  const t = UI[language];
  const label = (item) => t.nav[item.id] || item.label;
  const progTitle = (p) => contentTranslations[language]?.programa?.[p.id]?.title || p.title;
  const [openMenu,   setOpenMenu]   = useState(null);
  const [openSub,    setOpenSub]    = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAll = () => { setOpenMenu(null); setOpenSub(null); };

  const visible = navItems.filter((x) => x.enabled);
  const logoUrl = trimLogo(content.brand?.logoUrl);
  const siteName = content.brand?.siteName || "Casa ASOL";
  const nameWords = siteName.trim().split(/\s+/);
  const nameLast = nameWords.pop();
  const nameRest = nameWords.join(" ");

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,.92)" : "#fff",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid #e8e8e8" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 18px rgba(15,64,140,.08)" : "none",
        transition: "background .25s, box-shadow .25s, border-color .25s",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 130 }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => scrollTo("#home")}>
          {logoUrl
            ? <img src={logoUrl} alt="Logo" style={{ height: 108, maxWidth: 320, objectFit: "contain" }} />
            : <>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <polygon points="18,4 32,30 4,30" fill="none" stroke="#e53935" strokeWidth="2.5" />
                  <polygon points="18,4 26,20 10,20" fill={PRIMARY} opacity=".7" />
                  <line x1="10" y1="30" x2="18" y2="18" stroke={PRIMARY} strokeWidth="2" />
                </svg>
                <span style={{ fontWeight: 800, fontSize: 19, color: "#111", letterSpacing: .3 }}>{nameRest ? nameRest + " " : ""}<span style={{ color: PRIMARY }}>{nameLast}</span></span>
              </>
          }
        </div>

        {/* desktop nav */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="ca-nav-desktop">
          {visible.map((item) => (
            <div key={item.id} style={{ position: "relative" }}
              onMouseEnter={() => item.dropdown && setOpenMenu(item.id)}
              onMouseLeave={() => { setOpenMenu(null); setOpenSub(null); }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.dropdown ? setOpenMenu(openMenu === item.id ? null : item.id) : scrollTo(item.href);
                }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 13.5, fontWeight: 600, color: "#374151", letterSpacing: .3, display: "flex", alignItems: "center", gap: 4, borderRadius: 8, transition: "background .15s, color .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#eaf3fd"; e.currentTarget.style.color = PRIMARY; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}
              >
                {label(item)}
                {item.dropdown && <Icon name="chevronDown" size={12} color="currentColor" />}
              </button>

              {item.dropdown && openMenu === item.id && (
                <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 190, background: "#fff", borderRadius: 12, boxShadow: "0 14px 34px rgba(15,64,140,.16)", border: "1px solid #eef2f7", zIndex: 200, overflow: "visible", padding: "6px 6px 6px 12px" }}>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 6, pointerEvents: "none", borderRadius: "12px 0 0 12px", overflow: "hidden" }}>
                    <HuipilStripeVertical width={6} />
                  </div>
                  {item.dropdown.filter((s) => s.enabled).map((sub) => {
                    const hasNested = sub.id === "programa" && programa?.length > 0;
                    return (
                      <div key={sub.id} style={{ position: "relative" }}
                        onMouseEnter={() => hasNested && setOpenSub(sub.id)}
                        onMouseLeave={() => hasNested && setOpenSub(null)}>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (!hasNested) { scrollTo(sub.href); closeAll(); } }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 8 }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#eaf3fd"; e.currentTarget.style.color = PRIMARY; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}>
                          {label(sub)}
                          {hasNested && <Icon name="chevronDown" size={11} color="currentColor" style={{ transform: "rotate(-90deg)" }} />}
                        </button>

                        {hasNested && openSub === sub.id && (
                          <div style={{ position: "absolute", top: -6, left: "100%", minWidth: 210, background: "#fff", borderRadius: 12, boxShadow: "0 14px 34px rgba(15,64,140,.16)", border: "1px solid #eef2f7", zIndex: 201, padding: "6px" }}>
                            {programa.map((p) => (
                              <button key={p.id}
                                onClick={(e) => { e.stopPropagation(); scrollTo(sub.href); closeAll(); }}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 8 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#eaf3fd"; e.currentTarget.style.color = PRIMARY; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}>
                                {progTitle(p)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", display: "none" }} className="ca-nav-toggle">
          <Icon name="menu" size={22} />
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "12px 20px" }}>
          {visible.map((item) => (
            <div key={item.id}>
              <button onClick={() => item.href && scrollTo(item.href)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", background: "none", border: "none", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>
                {label(item)}
              </button>
              {item.dropdown && item.dropdown.filter((s) => s.enabled).map((sub) => (
                <div key={sub.id}>
                  <button onClick={() => scrollTo(sub.href)}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0 8px 16px", background: "none", border: "none", fontSize: 13, color: PRIMARY, cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                    {label(sub)}
                  </button>
                  {sub.id === "programa" && programa?.map((p) => (
                    <button key={p.id} onClick={() => scrollTo(sub.href)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 0 7px 32px", background: "none", border: "none", fontSize: 12.5, color: "#6b7280", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                      {progTitle(p)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .ca-nav-desktop { display: none !important; }
          .ca-nav-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
