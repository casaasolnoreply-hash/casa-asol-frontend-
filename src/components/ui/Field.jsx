export default function Field({ label, value, onChange, textarea, placeholder }) {
  const base = {
    width: "100%", padding: "7px 10px", border: "1px solid #d0d7de",
    borderRadius: 4, fontSize: 13, boxSizing: "border-box",
    fontFamily: "inherit", resize: "vertical",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 4, letterSpacing: .5 }}>
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} style={{ ...base, minHeight: 72 }} placeholder={placeholder} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} style={base} placeholder={placeholder} />
      }
    </div>
  );
}
