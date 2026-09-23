import { useState } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import Field from "../../ui/Field";
import Icon from "../../ui/Icon";
import IconPicker from "../../ui/IconPicker";
import AddItemModal from "../../ui/AddItemModal";
import AddImageBtn from "../AddImageBtn";

const inp = { width: "100%", padding: "7px 10px", border: "1px solid #d0d7de", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };
const btnD = { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 9px", background: "#fff", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer" };
const chip = (active) => ({ padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? PRIMARY : "#ddd"}`, background: active ? PRIMARY : "#fff", color: active ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" });
const addBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 };
const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 5, letterSpacing: .8 };

const TABS = [
  ["topbar", "Barra superior"], ["hero", "Hero"], ["historia", "Historia"],
  ["financiacion", "Financiación"], ["voluntariado", "Voluntariado"],
  ["contacto", "Contacto"], ["footer", "Footer"],
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

export default function ContentTab({ initialSub = "hero" }) {
  const [sub, setSub] = useState(initialSub);
  const [paraModal,    setParaModal]    = useState(false);
  const [amtModal,     setAmtModal]     = useState(false);
  const [volModal,     setVolModal]     = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const {
    content, upC, navItems,
    upAmt, removeAmt, addAmt,
    upVol, removeVol, addVol,
    addVolImage, removeVolImage,
    upContact, addContactItem, removeContactItem,
    addHistoriaParagraph, removeHistoriaParagraph, upHistoriaParagraph,
    addHistoriaImage, removeHistoriaImage,
    addDonacionImage, removeDonacionImage,
    addHeroButton, removeHeroButton, upHeroButton,
    addHeroImage, removeHeroImage,
  } = useApp();

  const paragraphs = content.historia.paragraphs?.length
    ? content.historia.paragraphs
    : [content.historia.text1, content.historia.text2].filter(Boolean);

  const heroButtons = content.hero.buttons || [];
  const heroImages = content.hero.images?.length ? content.hero.images : (content.hero.bgUrl ? [content.hero.bgUrl] : []);
  const historiaImages = content.historia.images?.length ? content.historia.images : (content.historia.imageUrl ? [content.historia.imageUrl] : []);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 18 }}>
        {TABS.map(([id, lbl]) => (
          <button key={id} onClick={() => setSub(id)} style={chip(sub === id)}>{lbl}</button>
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

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: .5 }}>MONTOS DE DONACIÓN</label>
            <button style={addBtn} onClick={() => setAmtModal(true)}>
              <Icon name="plus" size={12} /> Agregar monto
            </button>
          </div>
          {content.financiacion.amounts.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={a} onChange={(e) => upAmt(i, e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => removeAmt(i)} style={btnD}><Icon name="trash" size={11} /></button>
            </div>
          ))}
        </div>

        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#0369a1", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="book" size={14} color="#0369a1" /> Documento de cuentas bancarias
          </p>
          <Field label="URL DEL DOCUMENTO (PDF u otro)" value={content.financiacion.docUrl || ""} onChange={(v) => upC("financiacion", "docUrl", v)} />
          <Field label="TEXTO DEL BOTÓN" value={content.financiacion.docLabel || "Ver cuentas para depósito"} onChange={(v) => upC("financiacion", "docLabel", v)} />
          <p style={{ margin: 0, fontSize: 11, color: "#0c4a6e" }}>Sube el PDF a Cloudinary (Logo e Imágenes) y pega la URL aquí, o usa cualquier servicio externo.</p>
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

        {amtModal && (
          <AddItemModal
            title="Agregar monto de donación"
            fields={[{ key: "val", label: "MONTO", type: "text", placeholder: "Ej: Q100 / mes" }]}
            onSave={(d) => addAmt(d.val)}
            onClose={() => setAmtModal(false)}
          />
        )}
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
              <Field label="VALOR"  value={item.val}   onChange={(v) => upContact(i, "val", v)} />
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

      {/* ── FOOTER ── */}
      {sub === "footer" && <>
        <Field label="DESCRIPCIÓN" value={content.footer.desc} onChange={(v) => upC("footer", "desc", v)} textarea />
      </>}
    </div>
  );
}
