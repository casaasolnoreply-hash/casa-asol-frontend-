import Icon from "../ui/Icon";

// Visor simple de fotos: clic en una miniatura abre la imagen en grande,
// con flechas para pasar a la siguiente/anterior si hay varias.
export default function ImageLightbox({ images, index, onClose, onChangeIndex }) {
  if (index == null) return null;
  const go = (delta) => onChangeIndex((index + delta + images.length) % images.length);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="x" size={18} color="#fff" />
      </button>
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); go(-1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18 }}>‹</button>
      )}
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "88vw", maxHeight: "86vh", objectFit: "contain", borderRadius: 8 }} />
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); go(1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18 }}>›</button>
      )}
      {images.length > 1 && (
        <span style={{ position: "absolute", bottom: 20, color: "#fff", fontSize: 12, opacity: .8 }}>{index + 1} / {images.length}</span>
      )}
    </div>
  );
}
