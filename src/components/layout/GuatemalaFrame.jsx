import { useState, useEffect } from "react";
import { HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

export const LEFT_STRIPE_WIDTH = 40;
export const RIGHT_STRIPE_WIDTH = 64;

const MOBILE_LEFT_STRIPE_WIDTH = 14;
const MOBILE_RIGHT_STRIPE_WIDTH = 20;

/**
 * Shared page frame: the red corte weave on the left, the Maya nahuales
 * column on the right, running the full height of whatever page it wraps.
 * Used by both the public site (MainPage) and the admin-facing pages
 * (LoginPage, etc.) so the same Guatemalan identity carries through.
 *
 * Las franjas se redibujan a un ancho menor en celular (no solo se
 * recortan por CSS) porque los patrones de GuatemalanMotifs usan ese
 * ancho como unidad de medida interna — achicar solo el contenedor
 * dejaría el dibujo cortado en vez de verse proporcional.
 */
export default function GuatemalaFrame({ children, contentStyle, className }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handle = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const leftWidth = isMobile ? MOBILE_LEFT_STRIPE_WIDTH : LEFT_STRIPE_WIDTH;
  const rightWidth = isMobile ? MOBILE_RIGHT_STRIPE_WIDTH : RIGHT_STRIPE_WIDTH;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: leftWidth, zIndex: 1, pointerEvents: "none", transition: "width .15s" }}>
        <HuipilStripeVertical width={leftWidth} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: rightWidth, zIndex: 1, pointerEvents: "none", transition: "width .15s" }}>
        <NahualesStripeVertical width={rightWidth} />
      </div>
      <div className={className} style={{ marginLeft: leftWidth, marginRight: rightWidth, minHeight: "100vh", transition: "margin .15s", ...contentStyle }}>
        {children}
      </div>
    </div>
  );
}
