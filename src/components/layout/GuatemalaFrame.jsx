import { HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

export const LEFT_STRIPE_WIDTH = 40;
export const RIGHT_STRIPE_WIDTH = 64;

/**
 * Shared page frame: the red corte weave on the left, the Maya nahuales
 * column on the right, running the full height of whatever page it wraps.
 * Used by both the public site (MainPage) and the admin-facing pages
 * (LoginPage, etc.) so the same Guatemalan identity carries through.
 */
export default function GuatemalaFrame({ children, contentStyle, className }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: LEFT_STRIPE_WIDTH, zIndex: 1, pointerEvents: "none" }}>
        <HuipilStripeVertical width={LEFT_STRIPE_WIDTH} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: RIGHT_STRIPE_WIDTH, zIndex: 1, pointerEvents: "none" }}>
        <NahualesStripeVertical width={RIGHT_STRIPE_WIDTH} />
      </div>
      <div className={className} style={{ marginLeft: LEFT_STRIPE_WIDTH, marginRight: RIGHT_STRIPE_WIDTH, minHeight: "100vh", ...contentStyle }}>
        {children}
      </div>
    </div>
  );
}
