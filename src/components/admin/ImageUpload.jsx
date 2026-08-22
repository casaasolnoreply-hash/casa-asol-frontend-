import { useState, useRef } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function ImageUpload({ label, currentUrl, onUpload }) {
  const { uploadImage } = useApp();
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");
  const [preview,   setPreview]   = useState("");
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo no debe superar 10 MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(30);

    try {
      setProgress(60);
      const url = await uploadImage(file);
      onUpload(url);
      setPreview(url);
      setProgress(100);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setPreview("");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const displayUrl = preview || currentUrl;

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, letterSpacing: .5 }}>
          {label}
        </label>
      )}

      {displayUrl && (
        <div style={{ marginBottom: 10, position: "relative", display: "inline-block" }}>
          <img
            src={displayUrl}
            alt="preview"
            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #e0e0e0", display: "block" }}
          />
          {uploading && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{progress}%</span>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div style={{ height: 4, background: "#e0e0e0", borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: PRIMARY, transition: "width .3s", borderRadius: 4 }} />
        </div>
      )}

      {error && (
        <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 8px", background: "#fef2f2", padding: "6px 10px", borderRadius: 4 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: "7px 14px", background: uploading ? "#e0e0e0" : PRIMARY,
            color: uploading ? "#999" : "#fff", border: "none", borderRadius: 6,
            fontSize: 12, fontWeight: 700, cursor: uploading ? "wait" : "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          {uploading ? "Subiendo..." : <><Icon name="upload" size={13} /> Subir imagen</>}
        </button>

        {displayUrl && (
          <button
            onClick={() => { onUpload(""); setPreview(""); }}
            style={{ padding: "7px 12px", background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
          >
            × Quitar
          </button>
        )}
      </div>
    </div>
  );
}
