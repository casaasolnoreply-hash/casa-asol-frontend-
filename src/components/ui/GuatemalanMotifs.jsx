import { useId } from "react";
import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import mujerTipicaBlue from "../../assets/mujer-tipica.png";
import mujerTipicaWhite from "../../assets/mujer-tipica-white.png";

/* Decorative Guatemalan cultural glyphs — watermarks only, purely visual.
   Drawn as solid filled silhouettes (not traced from any existing artwork)
   so they stay legible even at low opacity. */
const GLYPHS = {
  tikal: (
    <path
      fillRule="evenodd"
      d="M2 21 2 19 4 19 4 17 6 17 6 15 8 15 8 13 10 13 10 11 10 7 11 7 11 4 13 4 13 7 14 7 14 11 14 13 16 13 16 15 18 15 18 17 20 17 20 19 22 19 22 21ZM11 21 11 11 13 11 13 21Z"
    />
  ),
  quetzal: (
    <g>
      <path d="M8 7 9 3 10 5.5 11 1.5 12 5 13 1 14 5 15 2 16 5.5 17 4 17 7 19 7.6 21.5 8.4 19.5 9.3 17.6 9.4 18.2 11.5 17.6 14 19 16.5 18 19.5 15.5 21 13 21.5 10.5 21 8 19.5 7 16.5 8.4 14 7.8 11.5 8.4 9.4Z" />
      <path d="M14 8.6h1.4v1.4H14Z" fill="#fff" />
      <path d="M4 21.2h16v1H4Z" />
      <path d="M8 19 3 17.5 5 20ZM7.5 20 1.5 20 5 21.3ZM8 21 3 23.5 5.5 21.8Z" />
      <path d="M16 19 21 17.5 19 20ZM16.5 20 22.5 20 19 21.3ZM16 21 21 23.5 18.5 21.8Z" />
      <path d="M12 21 C10 27 9 34 10 41 C10.5 45 11.5 48 11 52" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M13.2 21 C14.5 28 12.5 35 13.5 42 C14.2 46 15 49 14.4 53" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M14.6 21 C16.3 27 15 34 16 41 C16.7 45 17.6 48 17 52" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M14.4 53 c1.6 0.2 1.8 -1.8 0.2 -2.1 c-1.1 -0.2 -1.2 1.1 -0.3 1.3" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="15" r="1.9" fill="#c0392b" />
      <circle cx="13" cy="15" r=".85" />
    </g>
  ),
  sunStone: (
    <g>
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="9.2" />
        <circle cx="12" cy="12" r="6" />
        <path d="M12 2.8v2.2M12 19v2.2M2.8 12h2.2M19 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
      </g>
      <circle cx="12" cy="12" r="2.4" />
    </g>
  ),
  ceiba: (
    <g>
      <circle cx="12" cy="9.2" r="5.1" />
      <circle cx="7" cy="10.8" r="3.9" />
      <circle cx="17" cy="10.8" r="3.9" />
      <circle cx="9" cy="5.6" r="3.3" />
      <circle cx="15" cy="5.6" r="3.3" />
      <path d="M11 15.5h2v7.3c0 .5-.4.9-.9.9h-.2c-.5 0-.9-.4-.9-.9Z" />
    </g>
  ),
  volcano: (
    <g>
      <path d="M2 21h20L14.5 6.5c-.5-1-1.9-1-2.4 0L9 12.2 7.4 9.6c-.4-.7-1.4-.7-1.8.1Z" />
      <ellipse cx="12.6" cy="3.4" rx="1.6" ry="1" opacity=".8" />
      <ellipse cx="14.6" cy="2" rx="1.3" ry=".8" opacity=".55" />
      <ellipse cx="10.9" cy="1.7" rx="1.1" ry=".7" opacity=".4" />
    </g>
  ),
  coffee: (
    <g>
      <ellipse cx="11.5" cy="19.6" rx="8" ry="1.7" />
      <path
        fillRule="evenodd"
        d="M18.2 10.4c2 0 3.6 1.5 3.6 3.4s-1.6 3.4-3.6 3.4c-.4 0-.8-.1-1.1-.2l.3-1.8c.2.1.5.1.8.1 1 0 1.8-.7 1.8-1.5s-.8-1.5-1.8-1.5c-.3 0-.6 0-.8.1Z"
      />
      <path d="M4.5 9h14l-1 6.2C17 18 14.6 20 11.5 20S6 18 5.5 15.2Z" />
      <path d="M8.3 6.6c-.9-.8-.9-1.8 0-2.7M11.6 6.6c-.9-.8-.9-1.8 0-2.7" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  ),
  jaguar: (
    <g>
      <path d="M12 3.6c-3.5 0-6.2 2.6-6.2 6 0 2.4 1.2 4.4 2.8 5.8.8.7 1.6 1.9 3.4 1.9s2.6-1.2 3.4-1.9c1.6-1.4 2.8-3.4 2.8-5.8 0-3.4-2.7-6-6.2-6Z" />
      <path d="M7 5.4 4.4 1.6 8.4 3.8Z" />
      <path d="M17 5.4 19.6 1.6 15.6 3.8Z" />
      <g fill="#fff">
        <ellipse cx="9.4" cy="9.6" rx="1" ry="1.3" />
        <ellipse cx="14.6" cy="9.6" rx="1" ry="1.3" />
      </g>
      <path d="M11 14.2 10.3 16.2 11.6 15.6Z" fill="#fff" opacity=".9" />
      <path d="M13 14.2 13.7 16.2 12.4 15.6Z" fill="#fff" opacity=".9" />
      <path d="M9.4 13.6c.9.5 1.8.8 2.6.8s1.7-.3 2.6-.8" stroke="#fff" strokeWidth=".55" fill="none" strokeLinecap="round" opacity=".8" />
      <g fill="#fff" opacity=".85">
        <circle cx="6.6" cy="11.4" r=".5" /><circle cx="6.1" cy="13.4" r=".5" />
        <circle cx="17.4" cy="11.4" r=".5" /><circle cx="17.9" cy="13.4" r=".5" />
      </g>
    </g>
  ),
  arch: (
    <g fillRule="evenodd">
      <path d="M4 22v-2h1V9.5C5 6.5 7 4 12 3.6c5-.4 7 2.9 7 5.9V20h1v2ZM8 20h8V9.5C16 7.7 14.6 7 12 7.2 9.4 7.4 8 8.1 8 9.5Z" />
      <rect x="10.6" y="1" width="2.8" height="3.2" />
      <circle cx="12" cy="1.6" r="1.1" fill="none" stroke="currentColor" strokeWidth=".8" />
    </g>
  ),
};

// Glyphs that aren't square get their own viewBox; width:height ratio drives
// how tall the rendered icon (and its watermark box) become for a given size.
const GLYPH_VIEWBOX = {
  quetzal: "0 0 24 58",
};

function glyphAspect(name) {
  const vb = GLYPH_VIEWBOX[name];
  if (!vb) return 1;
  const [, , w, h] = vb.split(" ").map(Number);
  return h / w;
}

export function CulturalIcon({ name, size = 24, color = "currentColor", style }) {
  const content = GLYPHS[name];
  if (!content) return null;
  const viewBox = GLYPH_VIEWBOX[name] || "0 0 24 24";
  const height = size * glyphAspect(name);
  return (
    <svg
      width={size} height={height} viewBox={viewBox}
      fill={color} stroke="none"
      style={{ color, ...style }}
    >
      {content}
    </svg>
  );
}

/**
 * Purely decorative, non-interactive watermark icon anchored to a corner.
 * Never intercepts clicks and never affects layout (position: absolute).
 * `size` sets the icon's width — height follows the glyph's own aspect ratio.
 */
export function CulturalWatermark({ icon = "tikal", size = 220, color = "currentColor", opacity = 0.2, position, rotate = 0, className }) {
  const height = size * glyphAspect(icon);
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: size,
        height,
        opacity,
        pointerEvents: "none",
        zIndex: -1, // stays behind all real content of the nearest positioned ancestor (the section)
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...position,
      }}
    >
      <CulturalIcon name={icon} size={size} color={color} />
    </div>
  );
}

// Cropped intrinsic size of mujer-tipica.png / mujer-tipica-white.png (px)
const MUJER_TIPICA_ASPECT = 1000 / 732;

/**
 * Real embroidery-portrait artwork (the user's own image, background made
 * transparent) used as a corner watermark. `tone` picks the blue or white
 * cutout so it reads on both light and dark sections.
 */
export function MujerTipicaWatermark({ size = 150, tone = "blue", opacity = 0.2, position, className }) {
  return (
    <img
      src={tone === "white" ? mujerTipicaWhite : mujerTipicaBlue}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size * MUJER_TIPICA_ASPECT,
        opacity,
        pointerEvents: "none",
        zIndex: -1,
        objectFit: "contain",
        ...position,
      }}
    />
  );
}

/**
 * Thin repeating "step-fret" strip inspired by Maya textile motifs.
 * Purely decorative — a 1-D pattern bar meant for section edges/dividers.
 */
export function MayaPatternBar({ height = 10, color = "currentColor", opacity = 0.25, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg aria-hidden="true" width="100%" height={height} preserveAspectRatio="none" style={{ display: "block", pointerEvents: "none", ...style }}>
      <pattern id={`maya-pat-${uid}`} width="24" height={height} patternUnits="userSpaceOnUse">
        <path
          d={`M0 ${height} V${height * 0.3} H6 V${height * 0.7} H12 V${height * 0.3} H18 V${height * 0.7} H24 V${height}`}
          fill="none" stroke={color} strokeWidth="1.6" opacity={opacity}
        />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#maya-pat-${uid})`} />
    </svg>
  );
}

/**
 * Colorful woven-stripe band inspired by traditional Guatemalan huipil/corte
 * textiles (vertical color bars + a zigzag weave line). Purely decorative.
 */
export function HuipilStripe({ height = 16, opacity = 1, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg aria-hidden="true" width="100%" height={height} preserveAspectRatio="none" style={{ display: "block", pointerEvents: "none", opacity, ...style }}>
      <pattern id={`huipil-${uid}`} width="20" height={height} patternUnits="userSpaceOnUse">
        <rect width="20" height={height} fill={PRIMARY} />
        <rect x="0" width="3" height={height} fill={PRIMARY_DARK} />
        <rect x="7" width="2" height={height} fill="#c0392b" />
        <rect x="12" width="4" height={height} fill={PRIMARY_LIGHT} />
        <rect x="17" width="1.4" height={height} fill={PRIMARY_DARK} />
        <path
          d={`M0 ${height * 0.5} L5 ${height * 0.2} L10 ${height * 0.5} L15 ${height * 0.2} L20 ${height * 0.5}`}
          stroke={DARK} strokeWidth="1" fill="none" opacity=".5"
        />
        <path
          d={`M0 ${height * 0.7} L5 ${height} L10 ${height * 0.7} L15 ${height} L20 ${height * 0.7}`}
          stroke={DARK} strokeWidth="1" fill="none" opacity=".3"
        />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#huipil-${uid})`} />
    </svg>
  );
}

/**
 * Vertical version of the huipil/corte stripe band: a red-ground warp-striped
 * "corte" weave — many thin parallel color threads plus one embroidered
 * diamond-chain band — modeled on traditional Guatemalan textile weaving,
 * not traced from any single piece. Purely decorative — runs the full
 * height of the page as a side border.
 */
export function HuipilStripeVertical({ width = 40, opacity = 1, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `huipilv-${uid}`;
  const RED = "#a51c2c";
  const BLACK = "#111111";
  const CREAM = "#f2e8d8";
  const PURPLE = "#6a3fa0";
  const TEAL = "#1f8fa8";
  const GREEN = "#2f7d4f";
  const GOLD = "#e0a52c";
  const MAGENTA = "#c81e6b";
  const WHITE = "#f4f7fb";

  const H = width * 0.4; // repeat unit length along the stripe
  // thin warp threads, as fractions of the stripe width
  const threads = [
    { x: 0.05,   w: 0.04,  color: BLACK },
    { x: 0.105,  w: 0.03,  color: CREAM },
    { x: 0.15,   w: 0.035, color: PURPLE },
    { x: 0.2,    w: 0.11,  color: TEAL },
    { x: 0.325,  w: 0.03,  color: PURPLE },
    { x: 0.37,   w: 0.03,  color: CREAM },
    { x: 0.54,   w: 0.04,  color: GREEN },
    { x: 0.595,  w: 0.04,  color: GOLD },
    { x: 0.65,   w: 0.035, color: BLACK },
    { x: 0.765,  w: 0.03,  color: CREAM },
    { x: 0.805,  w: 0.03,  color: BLACK },
  ];

  // embroidered diamond-chain band near the outer edge
  const bandX = width * 0.88, bandW = width * 0.09, borderW = width * 0.0175;
  const dcx = bandX + bandW / 2, dr = width * 0.0475;
  const diamondPath = (cy) => `M${dcx} ${cy - dr} L${dcx + dr} ${cy} L${dcx} ${cy + dr} L${dcx - dr} ${cy} Z`;

  return (
    <svg aria-hidden="true" width={width} height="100%" preserveAspectRatio="none" style={{ display: "block", pointerEvents: "none", opacity, ...style }}>
      <pattern id={patternId} width={width} height={H} patternUnits="userSpaceOnUse">
        <rect width={width} height={H} fill={RED} />
        {threads.map((t, i) => (
          <rect key={i} x={width * t.x} width={width * t.w} height={H} fill={t.color} />
        ))}
        <rect x={bandX - borderW} width={borderW} height={H} fill={WHITE} />
        <rect x={bandX + bandW} width={borderW} height={H} fill={WHITE} />
        <rect x={bandX} width={bandW} height={H} fill={RED} />
        <path d={diamondPath(H * 0.25)} fill={TEAL} />
        <path d={diamondPath(H * 0.75)} fill={MAGENTA} />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
