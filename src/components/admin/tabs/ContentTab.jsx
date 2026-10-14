import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import Field from "../../ui/Field";
import Icon from "../../ui/Icon";
import IconPicker from "../../ui/IconPicker";
import AddItemModal from "../../ui/AddItemModal";
import AddImageBtn from "../AddImageBtn";
import Toggle from "../../ui/Toggle";

const inp = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };
const btnD = { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 9px", background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer" };
const chip = (active) => ({ padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? PRIMARY : "#ddd"}`, background: active ? PRIMARY : "#fff", color: active ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" });
const addBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 };
const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 };

// Fuente única de verdad para las 7 secciones que vive este editor —
// AdminPage la importa para que el encabezado (ícono/título/descripción)
// siempre coincida con la pestaña realmente activa, sin importar si se
// navegó por el sidebar o por los chips internos de este componente.
export const SITE_SECTIONS = [
  { id: "topbar",       icon: "globe",    chipLabel: "Barra superior", label: "Barra superior", description: "Dirección, teléfono y redes sociales que aparecen arriba del todo" },
  { id: "hero",         icon: "image",    chipLabel: "Hero",           label: "Hero / Inicio",   description: "Título, subtítulo y fondo de la sección principal" },
  { id: "historia",     icon: "book",     chipLabel: "Historia",       label: "Historia",        description: "Textos y cita de la sección Historia" },
  { id: "financiacion", icon: "star",     chipLabel: "Financiación",   label: "Financiación",    description: "Montos de donación, cuentas bancarias y pagos en línea" },
  { id: "voluntariado", icon: "check",    chipLabel: "Voluntariado",   label: "Voluntariado",    description: "Texto e ítems de la sección Voluntariado" },
  { id: "contacto",     icon: "phone",    chipLabel: "Contacto",       label: "Contacto",        description: "Ítems de información de contacto" },
  { id: "confianza",    icon: "star",     chipLabel: "Confían en nosotros", label: "Quiénes confían en nosotros", description: "Franja de logos de aliados/patrocinadores, al final de la página" },
  { id: "footer",       icon: "fileText", chipLabel: "Footer",         label: "Footer",          description: "Contenido del pie de página del sitio" },
];

/* ── Selector de destino para botones del Hero ── */
function LinkPicker({ value, onChange, navItems }) {
  const sections = [];
  navItems.forEach((n) => {
    if (n.href) sections.push({ label: n.label, href: n.href });
    (n.dropdown || []).forEach((d) => {
      if (d.href) sections.push({ label: `↳ ${d.label}`, href: d.href });
    });
  });

  const isKnown = sections.some((s) => s.href === value);

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>DESTINO (SECCIÓN O URL)</label>
      <select
        value={isKnown ? value : "__custom__"}
        onChange={(e) => { if (e.target.value !== "__custom__") onChange(e.target.value); }}
        style={{ ...inp, marginBottom: 6 }}
      >
        <option value="__custom__">— URL personalizada —</option>
        {sections.map((s) => (
          <option key={s.href} value={s.href}>{s.label}  ({s.href})</option>
        ))}
      </select>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ej: #programa  o  https://..."
        style={inp}
      />
    </div>
  );
}

export default function ContentTab({ sub, onChangeSub }) {
  const [paraModal,    setParaModal]    = useState(false);
  const [volModal,     setVolModal]     = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const {
    content, upC, navItems,
    upPatrocinioRow, addPatrocinioRow, removePatrocinioRow,
    upVol, removeVol, addVol,
    addVolImage, removeVolImage,
    upContact, addContactItem, removeContactItem,
    addHistoriaParagraph, removeHistoriaParagraph, upHistoriaParagraph,
    addHistoriaImage, removeHistoriaImage,
    addDonacionImage, removeDonacionImage,
    addConfianzaLogo, removeConfianzaLogo,
    addHeroButton, removeHeroButton, upHeroButton,
    addHeroImage, removeHeroImage,
  } = useApp();

  const upBank = (field, v) => upC("financiacion", "bank", { ...content.financiacion.bank, [field]: v });
  const upBankGT = (field, v) => upC("financiacion", "bankGT", { ...content.financiacion.bankGT, [field]: v });
  const upFinSub = (key, field, v) => upC("financiacion", key, { ...content.financiacion[key], [field]: v });

  const paragraphs = content.historia.paragraphs?.length
    ? content.historia.paragraphs
    : [content.historia.text1, content.historia.text2].filter(Boolean);

  const heroButtons = content.hero.buttons || [];
  const heroImages = content.hero.images?.length ? content.hero.images : (content.hero.bgUrl ? [content.hero.bgUrl] : []);
  const historiaImages = content.historia.images?.length ? content.historia.images : (content.historia.imageUrl ? [content.historia.imageUrl] : []);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 18 }}>
        {SITE_SECTIONS.map(({ id, chipLabel }) => (
          <button key={id} onClick={() => onChangeSub(id)} style={chip(sub === id)}>{chipLabel}</button>
        ))}
      </div>

      {/* ── TOPBAR ── */}
      {sub === "topbar" && <>
        <Field label="DIRECCIÓN" value={content.topbar.address} onChange={(v) => upC("topbar", "address", v)} />
        <Field label="LINK DE UBICACIÓN (Google Maps u otro)" value={content.topbar.locationUrl || ""} onChange={(v) => upC("topbar", "locationUrl", v)} />
        <Field label="TELÉFONO" value={content.topbar.phone} onChange={(v) => upC("topbar", "phone", v)} />

        <div style={{ marginTop: 18, padding: "16px 18px", background: "#f8f9fa", border: "1px solid #e8e8e8", borderRadius: 8 }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="external" size={13} color="#374151" /> Redes sociales
          </p>
          <Field label="FACEBOOK (URL completa)" value={content.topbar.facebook || ""} onChange={(v) => upC("topbar", "facebook", v)} />
          <Field label="LINKEDIN (URL completa)" value={content.topbar.linkedin || ""} onChange={(v) => upC("topbar", "linkedin", v)} />
          <Field label="INSTAGRAM (URL completa)" value={content.topbar.instagram || ""} onChange={(v) => upC("topbar", "instagram", v)} />
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>Deja en blanco los que no uses. Cuando hay URL el ícono se vuelve clickeable.</p>
        </div>
      </>}

      {/* ── HERO ── */}
      {sub === "hero" && <>
        <Field label="TÍTULO PRINCIPAL" value={content.hero.title}    onChange={(v) => upC("hero", "title", v)} />
        <Field label="SUBTÍTULO"        value={content.hero.subtitle}  onChange={(v) => upC("hero", "subtitle", v)} textarea />

        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>IMÁGENES DE PORTADA</p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>
            Si agregas más de una, van rotando automáticamente en el hero del sitio público.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            {heroImages.map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
                <button
                  onClick={() => removeHeroImage(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={addHeroImage} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="O pega una URL de imagen aquí y pulsa +"
              id="hero-url-inp"
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addHeroImage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById("hero-url-inp");
                if (el?.value.trim()) { addHeroImage(el.value.trim()); el.value = ""; }
              }}
              style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <Icon name="plus" size={13} /> Agregar
            </button>
          </div>
        </div>

        {/* ── Botones dinámicos ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={labelStyle}>BOTONES</label>
            <button style={addBtn} onClick={addHeroButton}>
              <Icon name="plus" size={12} /> Agregar botón
            </button>
          </div>

          {heroButtons.length === 0 && (
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 10px" }}>Sin botones. Agrega uno con el botón de arriba.</p>
          )}

          {heroButtons.map((btn, i) => (
            <div key={i} style={{ background: "#f8f9fa", border: "1px solid #e0e0e0", borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Botón {i + 1}</span>
                <button onClick={() => removeHeroButton(i)} style={btnD}>
                  <Icon name="trash" size={11} /> Eliminar
                </button>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>TEXTO</label>
                <input
                  value={btn.text}
                  onChange={(e) => upHeroButton(i, "text", e.target.value)}
                  placeholder="Ej: CONOCER MÁS"
                  style={inp}
                />
              </div>

              <LinkPicker
                value={btn.href}
                onChange={(v) => upHeroButton(i, "href", v)}
                navItems={navItems}
              />

              <div>
                <label style={labelStyle}>ESTILO</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["primary", "Principal (relleno)"], ["outline", "Contorno"]].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => upHeroButton(i, "style", val)}
                      style={{
                        padding: "5px 12px", borderRadius: 6,
                        border: `1.5px solid ${btn.style === val ? PRIMARY : "#d0d7de"}`,
                        background: btn.style === val ? PRIMARY : "#fff",
                        color: btn.style === val ? "#fff" : "#555",
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── HISTORIA ── */}
      {sub === "historia" && <>
        <Field label="SUPERTÍTULO" value={content.historia.supertitle}  onChange={(v) => upC("historia", "supertitle", v)} />
        <Field label="TÍTULO"      value={content.historia.title}       onChange={(v) => upC("historia", "title", v)} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>PÁRRAFOS</label>
            <button style={addBtn} onClick={() => setParaModal(true)}>
              <Icon name="plus" size={12} /> Agregar párrafo
            </button>
          </div>
          {paragraphs.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "flex-start" }}>
              <textarea
                value={p}
                onChange={(e) => upHistoriaParagraph(i, e.target.value)}
                rows={3}
                style={{ ...inp, flex: 1, resize: "vertical" }}
              />
              {paragraphs.length > 1 && (
                <button onClick={() => removeHistoriaParagraph(i)} style={{ ...btnD, marginTop: 2, flexShrink: 0 }}>
                  <Icon name="trash" size={11} />
                </button>
              )}
            </div>
          ))}
        </div>

        <Field label="CITA"   value={content.historia.quote}       onChange={(v) => upC("historia", "quote", v)} textarea />
        <Field label="AUTOR"  value={content.historia.quoteAuthor} onChange={(v) => upC("historia", "quoteAuthor", v)} />

        <div style={{ marginTop: 4 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>IMÁGENES DE LA SECCIÓN</p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>
            Si agregas más de una, van rotando automáticamente junto a la historia.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            {historiaImages.map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
                <button
                  onClick={() => removeHistoriaImage(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={addHistoriaImage} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="O pega una URL de imagen aquí y pulsa +"
              id="historia-url-inp"
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addHistoriaImage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById("historia-url-inp");
                if (el?.value.trim()) { addHistoriaImage(el.value.trim()); el.value = ""; }
              }}
              style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <Icon name="plus" size={13} /> Agregar
            </button>
          </div>
        </div>

        {paraModal && (
          <AddItemModal
            title="Agregar párrafo"
            fields={[{ key: "text", label: "TEXTO DEL PÁRRAFO", type: "textarea", placeholder: "Escribe el contenido del párrafo…" }]}
            onSave={(d) => addHistoriaParagraph(d.text)}
            onClose={() => setParaModal(false)}
          />
        )}
      </>}

      {/* ── FINANCIACIÓN ── */}
      {sub === "financiacion" && <>
        <Field label="SUPERTÍTULO" value={content.financiacion.supertitle} onChange={(v) => upC("financiacion", "supertitle", v)} />
        <Field label="TÍTULO"      value={content.financiacion.title}      onChange={(v) => upC("financiacion", "title", v)} />
        <Field label="DESCRIPCIÓN" value={content.financiacion.desc}       onChange={(v) => upC("financiacion", "desc", v)} textarea />
        <Field label="TEXTO BOTÓN DONAR" value={content.financiacion.btnText} onChange={(v) => upC("financiacion", "btnText", v)} />

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", gap: 7 }}>
              <Icon name="star" size={14} color="#92400e" /> Patrocinio individual
            </p>
            <Toggle sm on={content.financiacion.patrocinioIndividual?.enabled !== false} onChange={() => upFinSub("patrocinioIndividual", "enabled", content.financiacion.patrocinioIndividual?.enabled === false)} />
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#92400e" }}>Las tablas de montos que se muestran en la franja "Patrocinio Individual" del sitio. Apaga el interruptor para ocultar toda la franja del sitio.</p>

          <Field label="TÍTULO DE LA FRANJA" value={content.financiacion.patrocinioIndividual?.heading || ""} onChange={(v) => upFinSub("patrocinioIndividual", "heading", v)} />
          <Field label="TEXTO INTRODUCTORIO (arriba de la tabla mensual)" value={content.financiacion.patrocinioIndividual?.intro || ""} onChange={(v) => upC("financiacion", "patrocinioIndividual", { ...content.financiacion.patrocinioIndividual, intro: v })} />

          <label style={{ ...labelStyle, display: "block", marginTop: 10 }}>MONTOS MENSUALES</label>
          {(content.financiacion.patrocinioIndividual?.monthly || []).map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input value={row.label} onChange={(e) => upPatrocinioRow("monthly", i, "label", e.target.value)} placeholder="Descripción" style={{ ...inp, flex: 2 }} />
              <input value={row.gtq} onChange={(e) => upPatrocinioRow("monthly", i, "gtq", e.target.value)} placeholder="Q" style={{ ...inp, width: 70 }} />
              <input value={row.eur} onChange={(e) => upPatrocinioRow("monthly", i, "eur", e.target.value)} placeholder="€" style={{ ...inp, width: 70 }} />
              <button onClick={() => removePatrocinioRow("monthly", i)} style={btnD}><Icon name="trash" size={11} /></button>
            </div>
          ))}
          <button style={addBtn} onClick={() => addPatrocinioRow("monthly")}>
            <Icon name="plus" size={12} /> Agregar fila mensual
          </button>

          <Field label="TÍTULO DE LA SEGUNDA TABLA (ej. Apoyos únicos)" value={content.financiacion.patrocinioIndividual?.individualHeading || ""} onChange={(v) => upC("financiacion", "patrocinioIndividual", { ...content.financiacion.patrocinioIndividual, individualHeading: v })} />

          <label style={{ ...labelStyle, display: "block", marginTop: 10 }}>MONTOS DE APOYOS ÚNICOS</label>
          {(content.financiacion.patrocinioIndividual?.individual || []).map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input value={row.label} onChange={(e) => upPatrocinioRow("individual", i, "label", e.target.value)} placeholder="Descripción" style={{ ...inp, flex: 2 }} />
              <input value={row.gtq} onChange={(e) => upPatrocinioRow("individual", i, "gtq", e.target.value)} placeholder="Q" style={{ ...inp, width: 70 }} />
              <input value={row.eur} onChange={(e) => upPatrocinioRow("individual", i, "eur", e.target.value)} placeholder="€" style={{ ...inp, width: 70 }} />
              <button onClick={() => removePatrocinioRow("individual", i)} style={btnD}><Icon name="trash" size={11} /></button>
            </div>
          ))}
          <button style={addBtn} onClick={() => addPatrocinioRow("individual")}>
            <Icon name="plus" size={12} /> Agregar fila de apoyo único
          </button>
        </div>

        {[
          { key: "patrocinioEmpresarial", icon: "star",    color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe", label: "Patrocinio empresarial" },
          { key: "donacionesEspecie",     icon: "cloud",    color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8", label: "Donaciones en especie" },
          { key: "practicasEps",          icon: "book",     color: "#0e7490", bg: "#ecfeff", border: "#a5f3fc", label: "Prácticas y EPS" },
        ].map(({ key, icon, color, bg, border, label }) => (
          <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color, display: "flex", alignItems: "center", gap: 7 }}>
                <Icon name={icon} size={14} color={color} /> {label}
              </p>
              <Toggle sm on={content.financiacion[key]?.enabled !== false} onChange={() => upFinSub(key, "enabled", content.financiacion[key]?.enabled === false)} />
            </div>
            <Field label="TÍTULO DE LA FRANJA" value={content.financiacion[key]?.heading || ""} onChange={(v) => upFinSub(key, "heading", v)} />
            <Field label="TEXTO" value={content.financiacion[key]?.text || ""} onChange={(v) => upFinSub(key, "text", v)} textarea />
          </div>
        ))}

        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#15803d", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="fileText" size={14} color="#15803d" /> Datos bancarios para depósito
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#166534" }}>Se muestran directamente en la sección de Financiación, sin necesidad de subir un PDF.</p>
          <Field label="TÍTULO DEL BLOQUE"    value={content.financiacion.bank?.heading || ""}       onChange={(v) => upBank("heading", v)} />
          <Field label="TEXTO INTRODUCTORIO"  value={content.financiacion.bank?.intro || ""}         onChange={(v) => upBank("intro", v)} textarea />
          <Field label="TITULAR DE LA CUENTA" value={content.financiacion.bank?.accountHolder || ""} onChange={(v) => upBank("accountHolder", v)} />
          <Field label="BANCO"                value={content.financiacion.bank?.bankName || ""}      onChange={(v) => upBank("bankName", v)} />
          <Field label="N.º DE CUENTA"        value={content.financiacion.bank?.accountNumber || ""} onChange={(v) => upBank("accountNumber", v)} />
          <Field label="CÓDIGO BANCARIO"      value={content.financiacion.bank?.bankCode || ""}      onChange={(v) => upBank("bankCode", v)} />
          <Field label="IBAN"                 value={content.financiacion.bank?.iban || ""}          onChange={(v) => upBank("iban", v)} />
          <Field label="BIC"                  value={content.financiacion.bank?.bic || ""}           onChange={(v) => upBank("bic", v)} />
          <Field label="REFERENCIA DE PAGO"   value={content.financiacion.bank?.reference || ""}     onChange={(v) => upBank("reference", v)} />
          <Field label="NOTA (ej. deducible de impuestos)" value={content.financiacion.bank?.note || ""} onChange={(v) => upBank("note", v)} />
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#15803d", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="fileText" size={14} color="#15803d" /> Cuenta en Guatemala (depósito local)
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#166534" }}>Se muestra junto a la cuenta internacional, para donantes dentro de Guatemala.</p>
          <Field label="TÍTULO DEL BLOQUE"    value={content.financiacion.bankGT?.heading || ""}       onChange={(v) => upBankGT("heading", v)} />
          <Field label="BANCO"                value={content.financiacion.bankGT?.bankName || ""}      onChange={(v) => upBankGT("bankName", v)} />
          <Field label="TIPO DE CUENTA"        value={content.financiacion.bankGT?.accountType || ""}  onChange={(v) => upBankGT("accountType", v)} />
          <Field label="NOMBRE DE CUENTA"      value={content.financiacion.bankGT?.accountHolder || ""} onChange={(v) => upBankGT("accountHolder", v)} />
          <Field label="NÚMERO DE CUENTA"      value={content.financiacion.bankGT?.accountNumber || ""} onChange={(v) => upBankGT("accountNumber", v)} />
        </div>

        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#0369a1", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="book" size={14} color="#0369a1" /> Documento de cuentas bancarias (opcional)
          </p>
          <Field label="URL DEL DOCUMENTO (PDF u otro)" value={content.financiacion.docUrl || ""} onChange={(v) => upC("financiacion", "docUrl", v)} />
          <Field label="TEXTO DEL BOTÓN" value={content.financiacion.docLabel || "Ver cuentas para depósito"} onChange={(v) => upC("financiacion", "docLabel", v)} />
          <p style={{ margin: 0, fontSize: 11, color: "#0c4a6e" }}>Solo si además quieres enlazar un PDF descargable. Sube el archivo a Cloudinary (Logo e Imágenes) y pega la URL aquí.</p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>IMÁGENES DEL CARRUSEL</p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>Aparecen en el carrusel debajo de la sección de donación. Sube Cloudinary o pega URLs.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            {(content.financiacion.donacionImages || []).map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
                <button
                  onClick={() => removeDonacionImage(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={addDonacionImage} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="O pega una URL de imagen aquí y pulsa +"
              id="donacion-url-inp"
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addDonacionImage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById("donacion-url-inp");
                if (el?.value.trim()) { addDonacionImage(el.value.trim()); el.value = ""; }
              }}
              style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <Icon name="plus" size={13} /> Agregar
            </button>
          </div>
        </div>

        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "16px 18px" }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="star" size={14} color="#92400e" /> Pagos en línea
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#b45309" }}>
            Esta función está disponible para configuración futura. Cuando tengas una pasarela de pago activa (Stripe, PayPal, etc.), podrás activarla aquí.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: "#e0e0e0", position: "relative", cursor: "not-allowed" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: 2, boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
            </div>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Pagos en línea — próximamente</span>
          </div>
        </div>

      </>}

      {/* ── VOLUNTARIADO ── */}
      {sub === "voluntariado" && <>
        <Field label="SUPERTÍTULO" value={content.voluntariado.supertitle} onChange={(v) => upC("voluntariado", "supertitle", v)} />
        <Field label="TÍTULO"      value={content.voluntariado.title}      onChange={(v) => upC("voluntariado", "title", v)} />
        <Field label="DESCRIPCIÓN" value={content.voluntariado.desc}       onChange={(v) => upC("voluntariado", "desc", v)} textarea />
        <Field label="TEXTO BOTÓN" value={content.voluntariado.btnText}    onChange={(v) => upC("voluntariado", "btnText", v)} />

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>LISTA DE ACTIVIDADES</label>
            <button style={addBtn} onClick={() => setVolModal(true)}>
              <Icon name="plus" size={12} /> Agregar actividad
            </button>
          </div>
          {content.voluntariado.list.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={a} onChange={(e) => upVol(i, e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => removeVol(i)} style={btnD}><Icon name="trash" size={11} /></button>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>IMÁGENES DE LA SECCIÓN</p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>
            Si agregas más de una, van rotando automáticamente junto a la información de voluntariado.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            {(content.voluntariado.images || []).map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 6, border: `2px solid ${idx === 0 ? PRIMARY : "#e0e0e0"}`, display: "block" }} />
                <button
                  onClick={() => removeVolImage(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={addVolImage} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="O pega una URL de imagen aquí y pulsa +"
              id="vol-url-inp"
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addVolImage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById("vol-url-inp");
                if (el?.value.trim()) { addVolImage(el.value.trim()); el.value = ""; }
              }}
              style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <Icon name="plus" size={13} /> Agregar
            </button>
          </div>
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e0e0e0", borderRadius: 8, padding: "14px 16px" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="users" size={13} color="#9ca3af" />
            El formulario de registro de voluntarios recibe solicitudes automáticamente. Revísalas en la sección <strong>Mensajes</strong>.
          </p>
        </div>

        {volModal && (
          <AddItemModal
            title="Agregar actividad de voluntariado"
            fields={[{ key: "text", label: "ACTIVIDAD", type: "text", placeholder: "Ej: Apoyo educativo (tutorías y refuerzo)" }]}
            onSave={(d) => addVol(d.text)}
            onClose={() => setVolModal(false)}
          />
        )}
      </>}

      {/* ── CONTACTO ── */}
      {sub === "contacto" && <>
        <Field label="SUPERTÍTULO" value={content.contacto.supertitle} onChange={(v) => upC("contacto", "supertitle", v)} />
        <Field label="TÍTULO"      value={content.contacto.title}      onChange={(v) => upC("contacto", "title", v)} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>ÍTEMS DE CONTACTO</label>
            <button style={addBtn} onClick={() => setContactModal(true)}>
              <Icon name="plus" size={12} /> Agregar ítem
            </button>
          </div>
          {content.contacto.items.map((item, i) => (
            <div key={i} style={{ background: "#f8f9fa", border: "1px solid #e8e8e8", borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <button onClick={() => removeContactItem(i)} style={btnD}>
                  <Icon name="trash" size={11} /> Eliminar
                </button>
              </div>
              <Field label="TÍTULO" value={item.title} onChange={(v) => upContact(i, "title", v)} />
              {item.icon === "location" ? (
                <>
                  <Field label="VALOR" value={content.topbar.address} onChange={(v) => upC("topbar", "address", v)} />
                  <p style={{ margin: "-8px 0 14px", fontSize: 11, color: "#9ca3af" }}>
                    Este valor es el mismo que la Dirección de la Barra superior — cambiarlo aquí también lo actualiza allá.
                  </p>
                </>
              ) : (
                <Field label="VALOR" value={item.val} onChange={(v) => upContact(i, "val", v)} />
              )}
              <IconPicker value={item.icon} onChange={(v) => upContact(i, "icon", v)} />
            </div>
          ))}
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e0e0e0", borderRadius: 8, padding: "14px 16px" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="mail" size={13} color="#9ca3af" />
            Los mensajes del formulario de contacto se guardan en la sección <strong>Mensajes</strong>.
          </p>
        </div>

        {contactModal && (
          <AddItemModal
            title="Agregar ítem de contacto"
            fields={[
              { key: "icon",  label: "ÍCONO",  type: "icon",     default: "mail" },
              { key: "title", label: "TÍTULO", type: "text",     placeholder: "Ej: Dirección" },
              { key: "val",   label: "VALOR",  type: "text",     placeholder: "Ej: 10a Calle 2-25…" },
            ]}
            onSave={(d) => addContactItem(d)}
            onClose={() => setContactModal(false)}
          />
        )}
      </>}

      {/* ── CONFIANZA ── */}
      {sub === "confianza" && <>
        <Field label="TEXTO DE LA FRANJA" value={content.confianza?.heading || ""} onChange={(v) => upC("confianza", "heading", v)} />

        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>LOGOS</p>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>
            Si no agregas ningún logo, esta franja no se muestra en el sitio.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            {(content.confianza?.logos || []).map((img, idx) => (
              <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: 80, height: 56, objectFit: "contain", background: "#f9fafb", borderRadius: 6, border: "2px solid #e0e0e0", display: "block" }} />
                <button
                  onClick={() => removeConfianzaLogo(idx)}
                  style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <Icon name="x" size={9} />
                </button>
              </div>
            ))}
            <AddImageBtn onAdd={addConfianzaLogo} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              placeholder="O pega una URL de imagen aquí y pulsa +"
              id="confianza-url-inp"
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addConfianzaLogo(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById("confianza-url-inp");
                if (el?.value.trim()) { addConfianzaLogo(el.value.trim()); el.value = ""; }
              }}
              style={{ padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <Icon name="plus" size={13} /> Agregar
            </button>
          </div>
        </div>
      </>}

      {/* ── FOOTER ── */}
      {sub === "footer" && <>
        <Field label="DESCRIPCIÓN" value={content.footer.desc} onChange={(v) => upC("footer", "desc", v)} textarea />
      </>}
    </div>
  );
}
