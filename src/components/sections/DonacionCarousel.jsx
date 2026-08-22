import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function DonacionCarousel() {
  const { content, isSectionVisible } = useApp();
  const images = content.financiacion?.donacionImages || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  if (!isSectionVisible("financiacion")) return null;
  if (!images.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div style={{ position: "relative", overflow: "hidden", height: 400, background: "#111" }}>
      {/* Images */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.6s ease-in-out",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Bottom gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 55%)", pointerEvents: "none" }} />

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,.22)", backdropFilter: "blur(4px)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.38)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.22)")}
          >
            <Icon name="chevronDown" size={18} color="#fff" style={{ transform: "rotate(90deg)" }} />
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,.22)", backdropFilter: "blur(4px)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.38)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.22)")}
          >
            <Icon name="chevronDown" size={18} color="#fff" style={{ transform: "rotate(-90deg)" }} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8,
                borderRadius: 4, border: "none", padding: 0,
                background: i === current ? "#fff" : "rgba(255,255,255,.42)",
                cursor: "pointer", transition: "all .35s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
