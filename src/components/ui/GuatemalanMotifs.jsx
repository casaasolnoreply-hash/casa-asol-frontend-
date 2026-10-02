import { useId } from "react";
import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, DARK } from "../../constants/theme";
import nahualesWhite from "../../assets/nahuales-strip-white.png";

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

// Una sola línea en zigzag ("jaspe"), trazada varias veces sobre el mismo
// trazo con ancho decreciente (de más ancho/atrás a más angosto/al frente),
// para que cada color se vea como una banda anidada dentro de la anterior
// — el efecto de "montañas" o "llama" típico de los tejidos ikat
// guatemaltecos que se ve en las fotos de referencia.
function ChevronThreads({ x, w, H, colors, waves = 3 }) {
  const period = H / waves;
  const margin = w * 0.08; // deja aire para que el trazo más ancho no se salga de la banda
  const left = x + margin, right = x + w - margin;
  let d = `M${left} ${-period}`;
  for (let k = -1; k <= waves + 1; k++) {
    const yTop = k * period;
    d += ` L${right} ${yTop + period / 2} L${left} ${yTop + period}`;
  }
  const n = colors.length;
  return colors.map((color, i) => (
    <path
      key={i} d={d} fill="none" stroke={color}
      strokeWidth={(w - margin) * ((n - i) / n)}
      strokeLinejoin="round" strokeLinecap="round"
    />
  ));
}

/**
 * Vertical version of the huipil/corte stripe band — varias bandas de zigzag
 * "jaspe" en distintas paletas, separadas por líneas delgadas de acento
 * (verde lima, morado, turquesa, oro), más una banda bordada de diamantes
 * sobre fondo rojo. Inspirado en tejidos guatemaltecos reales, no calcado de
 * ninguna pieza en particular. Puramente decorativo — corre a lo largo de
 * toda la página como borde lateral.
 */
export function HuipilStripeVertical({ width = 40, opacity = 1, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `huipilv-${uid}`;
  const RED = "#a51c2c";
  const DARK_RED = "#6e1420";
  const BLACK = "#15131a";
  const NAVY = "#1b1f3b";
  const PURPLE = "#6a3fa0";
  const DEEP_PURPLE = "#4a2272";
  const TEAL = "#1f8fa8";
  const AQUA = "#3fc1c9";
  const GREEN = "#2f7d4f";
  const LIME = "#8fd13f";
  const GOLD = "#e0a52c";
  const ORANGE = "#e2622b";
  const MAGENTA = "#c81e6b";
  const PINK = "#ef7fb0";
  const CREAM = "#f2e8d8";
  const WHITE = "#f4f7fb";

  const H = width * 1.1; // largo de la unidad que se repite a lo largo de la franja

  // Líneas finas de acento, muy brillantes, igual que las que separan las
  // bandas en los tejidos de referencia.
  const accents = [
    { x: 0.0,   w: 0.018, color: LIME },
    { x: 0.238, w: 0.014, color: DEEP_PURPLE },
    { x: 0.476, w: 0.014, color: AQUA },
    { x: 0.714, w: 0.014, color: GOLD },
    { x: 0.952, w: 0.014, color: LIME },
  ];

  // Tres bandas de zigzag "jaspe", cada una con su propia paleta — así se ve
  // variado en vez de un solo color repetido, como en las fotos.
  const bandA = { x: 0.028, w: 0.19 }; // morado / turquesa / rosa
  const bandB = { x: 0.258, w: 0.19 }; // rojo / naranja / dorado
  const bandC = { x: 0.73,  w: 0.2  }; // rosa / morado / turquesa

  // Banda bordada de diamantes sobre fondo rojo (como el tejido cruzado de
  // la foto de referencia), entre la banda B y la C.
  const diamondBand = { x: 0.5, w: 0.2 };
  const dcx = (diamondBand.x + diamondBand.w / 2) * width, dr = width * 0.05;
  const diamondPath = (cy) => `M${dcx} ${cy - dr} L${dcx + dr} ${cy} L${dcx} ${cy + dr} L${dcx - dr} ${cy} Z`;
  const diamondColors = [TEAL, MAGENTA, GOLD, GREEN];

  return (
    <svg aria-hidden="true" width={width} height="100%" preserveAspectRatio="none" style={{ display: "block", pointerEvents: "none", opacity, ...style }}>
      <pattern id={patternId} width={width} height={H} patternUnits="userSpaceOnUse">
        <rect width={width} height={H} fill={DARK_RED} />

        <clipPath id={`${patternId}-a`}><rect x={bandA.x * width} width={bandA.w * width} height={H} /></clipPath>
        <g clipPath={`url(#${patternId}-a)`}>
          <rect x={bandA.x * width} width={bandA.w * width} height={H} fill={NAVY} />
          <ChevronThreads x={bandA.x * width} w={bandA.w * width} H={H} colors={[PURPLE, TEAL, PINK, CREAM]} waves={4} />
        </g>

        <clipPath id={`${patternId}-b`}><rect x={bandB.x * width} width={bandB.w * width} height={H} /></clipPath>
        <g clipPath={`url(#${patternId}-b)`}>
          <rect x={bandB.x * width} width={bandB.w * width} height={H} fill={BLACK} />
          <ChevronThreads x={bandB.x * width} w={bandB.w * width} H={H} colors={[RED, ORANGE, GOLD, CREAM]} waves={4} />
        </g>

        <rect x={diamondBand.x * width} width={diamondBand.w * width} height={H} fill={RED} />
        {Array.from({ length: 3 }).map((_, i) => (
          <path key={i} d={diamondPath(H * ((i + 0.5) / 3))} fill={diamondColors[i % diamondColors.length]} />
        ))}

        <clipPath id={`${patternId}-c`}><rect x={bandC.x * width} width={bandC.w * width} height={H} /></clipPath>
        <g clipPath={`url(#${patternId}-c)`}>
          <rect x={bandC.x * width} width={bandC.w * width} height={H} fill={DEEP_PURPLE} />
          <ChevronThreads x={bandC.x * width} w={bandC.w * width} H={H} colors={[MAGENTA, PURPLE, TEAL, WHITE]} waves={4} />
        </g>

        {accents.map((a, i) => (
          <rect key={i} x={a.x * width} width={a.w * width} height={H} fill={a.color} />
        ))}
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
