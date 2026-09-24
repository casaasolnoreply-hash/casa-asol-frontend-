import { useId } from "react";
import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";

import escudoBlue from "../../assets/escudo-nacional.png";
import escudoWhite from "../../assets/escudo-nacional-white.png";
import quetzalBlue from "../../assets/quetzal.png";
import quetzalWhite from "../../assets/quetzal-white.png";
import tikalBlue from "../../assets/tikal.png";
import tikalWhite from "../../assets/tikal-white.png";
import jaguarBlue from "../../assets/jaguar.png";
import jaguarWhite from "../../assets/jaguar-white.png";
import ceibaBlue from "../../assets/ceiba.png";
import ceibaWhite from "../../assets/ceiba-white.png";
import volcanBlue from "../../assets/volcan-de-agua.png";
import volcanWhite from "../../assets/volcan-de-agua-white.png";
import cafeBlue from "../../assets/cafe.png";
import cafeWhite from "../../assets/cafe-white.png";
import catedralBlue from "../../assets/catedral.png";
import catedralWhite from "../../assets/catedral-white.png";
import nahualesWhite from "../../assets/nahuales-strip-white.png";
import mujerBlue from "../../assets/mujer-tipica.png";
import mujerWhite from "../../assets/mujer-tipica-white.png";

/* Real Guatemalan cross-stitch/embroidery artwork (the user's own images,
   backgrounds made transparent) used as corner watermarks. Each entry's
   `aspect` is that image's cropped height/width ratio. */
const IMAGE_ICONS = {
  escudo:   { blue: escudoBlue,   white: escudoWhite,   aspect: 189 / 196 },
  quetzal:  { blue: quetzalBlue,  white: quetzalWhite,  aspect: 193 / 98 },
  tikal:    { blue: tikalBlue,    white: tikalWhite,    aspect: 150 / 194 },
  jaguar:   { blue: jaguarBlue,   white: jaguarWhite,   aspect: 145 / 136 },
  ceiba:    { blue: ceibaBlue,    white: ceibaWhite,    aspect: 173 / 169 },
  volcan:   { blue: volcanBlue,   white: volcanWhite,   aspect: 129 / 205 },
  cafe:     { blue: cafeBlue,     white: cafeWhite,     aspect: 141 / 144 },
  catedral: { blue: catedralBlue, white: catedralWhite, aspect: 104 / 142 },
  mujer:    { blue: mujerBlue,    white: mujerWhite,    aspect: 1000 / 732 },
};

/**
 * Purely decorative, non-interactive watermark image anchored to a corner.
 * Never intercepts clicks and never affects layout (position: absolute).
 * `size` sets the image's width — height follows its own aspect ratio.
 * `tone` picks the blue or white cutout so it reads on light and dark sections.
 */
export function ImageWatermark({ name, size = 150, tone = "blue", opacity = 0.2, position, rotate = 0, className }) {
  const entry = IMAGE_ICONS[name];
  if (!entry) return null;
  return (
    <img
      src={tone === "white" ? entry.white : entry.blue}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size * entry.aspect,
        opacity,
        pointerEvents: "none",
        zIndex: -1, // stays behind all real content of the nearest positioned ancestor (the section)
        objectFit: "contain",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
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

// Cropped intrinsic size of nahuales-strip-white.png (px)
const NAHUALES_ASPECT = 4479 / 330;

/**
 * Right-side counterpart to the left corte stripe: a chain of Maya day-sign
 * glyphs ("nahuales") — the user's own artwork, background made transparent
 * — tiled down a solid navy panel. Purely decorative, runs the full height
 * of the page as a side border.
 */
export function NahualesStripeVertical({ width = 44, opacity = 1, background = DARK, style }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height: "100%",
        background,
        backgroundImage: `url(${nahualesWhite})`,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "top center",
        backgroundSize: `${width}px ${Math.round(width * NAHUALES_ASPECT)}px`,
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
