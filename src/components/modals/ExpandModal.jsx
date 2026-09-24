import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

export default function ExpandModal() {
  const { expandModal, setExpandModal } = useApp();
  if (!expandModal) return null;

  return (
    <div
      onClick={() => setExpandModal(null)}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.72)",
        zIndex: 3000, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14,
          maxWidth: 820, width: "100%", maxHeight: "90vh",
          boxShadow: "0 32px 96px rgba(0,0,0,.45)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 16, zIndex: 2 }}>
          <HuipilStripeVertical width={16} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 20, zIndex: 2 }}>
          <NahualesStripeVertical width={20} />
        </div>

        <button
          onClick={() => setExpandModal(null)}
          style={{ position: "absolute", top: 16, right: 32, zIndex: 3, background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#aaa", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ padding: "44px 50px 44px 40px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}>
          <h2 style={{ margin: "0 0 28px", fontSize: 30, fontWeight: 800, color: PRIMARY }}>
            {expandModal.title}
          </h2>
          <div style={{ fontSize: 17, lineHeight: 1.85, color: "#333" }}>
            {expandModal.content}
          </div>
        </div>
      </div>
    </div>
  );
}
