import { useState } from "react";
import Icon from "./Icon";

// Input de contraseña con botón de mostrar/ocultar. Por defecto usa
// autoComplete="new-password" — es el truco que realmente evita que
// Chrome autorellene con una credencial guardada en campos que no
// son el login real (ej. "escribe la contraseña de otra persona").
export default function PasswordInput({ style, autoComplete = "new-password", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative", ...(style?.width ? { width: style.width } : {}) }}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        style={{ ...style, width: "100%", paddingRight: 34, boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", padding: 2,
          display: "flex", alignItems: "center", color: "#9ca3af",
        }}
      >
        <Icon name={visible ? "eyeOff" : "eye"} size={15} />
      </button>
    </div>
  );
}
