import { PRIMARY } from "../../constants/theme";

export default function Toggle({ on, onChange, sm = false }) {
  const w = sm ? 32 : 42, h = sm ? 18 : 24, d = sm ? 14 : 18;
  return (
    <div
      onClick={onChange}
      style={{
        width: w, height: h, borderRadius: h,
        background: on ? PRIMARY : "#ccc",
        position: "relative", cursor: "pointer",
        transition: "background .2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: (h - d) / 2,
        left: on ? w - d - (h - d) / 2 : (h - d) / 2,
        width: d, height: d, borderRadius: "50%",
        background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.25)",
      }} />
    </div>
  );
}
