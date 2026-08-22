import { useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../ui/Icon";

export default function AddImageBtn({ onAdd }) {
  const { uploadImage } = useApp();
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo no debe superar 10 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setProgress(30);

    try {
      setProgress(60);
      const url = await uploadImage(file);
      setProgress(100);
      onAdd(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
      setTimeout(() => setProgress(0), 600);
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title={error || "Agregar imagen"}
        style={{
          width: 68, height: 52, border: `2px dashed ${error ? "#ef4444" : "#d0d7de"}`,
          borderRadius: 6, background: error ? "#fef2f2" : "#f9fafb",
          cursor: uploading ? "wait" : "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
          transition: "border-color .2s",
        }}
        onMouseEnter={(e) => !uploading && !error && (e.currentTarget.style.borderColor = "#1e88e5")}
        onMouseLeave={(e) => !uploading && !error && (e.currentTarget.style.borderColor = "#d0d7de")}
      >
        {uploading
          ? <>
              <Icon name="upload" size={14} color="#93c5fd" />
              <span style={{ fontSize: 9, color: "#93c5fd", fontWeight: 700 }}>{progress}%</span>
            </>
          : error
            ? <Icon name="warning" size={14} color="#ef4444" />
            : <>
                <Icon name="plus" size={14} color="#9ca3af" />
                <span style={{ fontSize: 9, color: "#9ca3af" }}>Agregar</span>
              </>
        }
      </button>
    </div>
  );
}
