import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import { hasScope, scopeIncludes } from "../../../utils/permissions";
import { LOGO_PNG_BASE64 } from "../../../assets/logoBase64";
import { buildLetterhead } from "../../../utils/docxLetterhead";

const STATUS_LABEL = {
  borrador: "Borrador", enviado: "Enviado para revisión", en_revision: "En revisión",
  calificado: "Calificado", devuelto_a_correccion: "Devuelto para corrección",
};
const STATUS_COLOR = {
  borrador: "#d97706", enviado: "#2563eb", en_revision: "#7c3aed",
  calificado: "#16a34a", devuelto_a_correccion: "#dc2626",
};
const EDITABLE_STATUSES = ["borrador", "devuelto_a_correccion"];

const btnBase = { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid #e0e0e0", background: "#fff", color: "#374151" };
const primaryBtn = { ...btnBase, background: PRIMARY, color: "#fff", border: "none" };
const dangerBtn = { ...btnBase, background: "#fff", color: "#dc2626", border: "1.5px solid #fecaca" };
const inputStyle = { width: "100%", padding: "8px 10px", border: "1.5px solid #e0e0e0", borderRadius: 6, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

/* ── Conversión del JSON de TipTap a párrafos/tablas/imágenes de
   "docx", para el botón "Descargar .docx" — soporta exactamente lo que
   ofrece la barra de herramientas: títulos, negrita/cursiva/subrayado,
   alineación, listas, tablas e imágenes. ── */
const ALIGN_MAP = { left: "LEFT", center: "CENTER", right: "RIGHT", justify: "BOTH" };

async function fetchImageBytes(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "";
  const type = contentType.includes("png") ? "png" : contentType.includes("gif") ? "gif" : "jpg";
  return { data: new Uint8Array(buf), type };
}

function measureImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 420;
      const w = Math.min(img.naturalWidth || maxW, maxW);
      const h = img.naturalWidth ? img.naturalHeight * (w / img.naturalWidth) : 240;
      resolve({ width: Math.round(w) || 300, height: Math.round(h) || 200 });
    };
    img.onerror = () => resolve({ width: 300, height: 200 });
    img.src = url;
  });
}

function inlineRuns(content, docxModule) {
  const { TextRun } = docxModule;
  const runs = [];
  for (const node of content || []) {
    if (node.type === "text") {
      const marks = node.marks || [];
      runs.push(new TextRun({
        text: node.text, font: "Arial", size: 24,
        bold: marks.some((m) => m.type === "bold"),
        italics: marks.some((m) => m.type === "italic"),
        underline: marks.some((m) => m.type === "underline") ? {} : undefined,
      }));
    } else if (node.type === "hardBreak") {
      runs.push(new TextRun({ text: "", break: 1 }));
    }
  }
  return runs;
}

async function blocksToDocx(nodes, docxModule, indent = 0) {
  const { Paragraph, AlignmentType, HeadingLevel, Table: DocxTable, TableRow: DocxTableRow, TableCell: DocxTableCell, WidthType, ImageRun, TextRun } = docxModule;
  const out = [];
  for (const node of nodes || []) {
    const alignKey = node.attrs?.textAlign ? ALIGN_MAP[node.attrs.textAlign] : undefined;
    const alignment = alignKey ? AlignmentType[alignKey] : undefined;

    if (node.type === "paragraph") {
      out.push(new Paragraph({ alignment, indent: indent ? { left: indent } : undefined, spacing: { after: 160 }, children: inlineRuns(node.content, docxModule) }));
    } else if (node.type === "heading") {
      const level = node.attrs?.level || 1;
      const HEADING = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 }[level] || HeadingLevel.HEADING_1;
      out.push(new Paragraph({ heading: HEADING, alignment, spacing: { before: 200, after: 120 }, children: inlineRuns(node.content, docxModule) }));
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const ordered = node.type === "orderedList";
      let i = 0;
      for (const item of node.content || []) {
        i++;
        for (const child of item.content || []) {
          if (child.type === "paragraph") {
            const runs = inlineRuns(child.content, docxModule);
            if (ordered) runs.unshift(new TextRun({ text: `${i}. `, font: "Arial", size: 24 }));
            out.push(new Paragraph({ bullet: ordered ? undefined : { level: 0 }, indent: { left: (indent || 0) + 400 }, spacing: { after: 100 }, children: runs }));
          } else {
            out.push(...(await blocksToDocx([child], docxModule, indent + 400)));
          }
        }
      }
    } else if (node.type === "table") {
      const rows = [];
      for (const row of node.content || []) {
        const cells = [];
        const colCount = row.content?.length || 1;
        for (const cell of row.content || []) {
          const cellChildren = await blocksToDocx(cell.content, docxModule);
          cells.push(new DocxTableCell({ width: { size: 100 / colCount, type: WidthType.PERCENTAGE }, children: cellChildren.length ? cellChildren : [new Paragraph({})] }));
        }
        rows.push(new DocxTableRow({ children: cells }));
      }
      if (rows.length) out.push(new DocxTable({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
    } else if (node.type === "image" && node.attrs?.src) {
      try {
        const [{ data, type }, size] = await Promise.all([fetchImageBytes(node.attrs.src), measureImage(node.attrs.src)]);
        out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new ImageRun({ type, data, transformation: size })] }));
      } catch {
        // Si la imagen no se pudo descargar (ej. red), se omite en vez
        // de romper toda la exportación.
      }
    } else if (node.content) {
      out.push(...(await blocksToDocx(node.content, docxModule, indent)));
    }
  }
  return out;
}

export async function downloadDocumentDocx(content, { title, siteName = "Casa ASOL", filename }) {
  const docxModule = await import("docx");
  const { Document, Packer } = docxModule;
  const { header, footer } = buildLetterhead(docxModule, { title, siteName, logoBase64: LOGO_PNG_BASE64 });
  const children = await blocksToDocx(content?.content || [], docxModule);
  const doc = new Document({ sections: [{ headers: { default: header }, footers: { default: footer }, children: children.length ? children : [new docxModule.Paragraph({})] }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename || "documento.docx";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ── Barra de herramientas ── */
function ToolbarBtn({ active, disabled, onClick, children, title }) {
  return (
    <button
      type="button" title={title} disabled={disabled} onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6,
        border: active ? `1.5px solid ${PRIMARY}` : "1px solid #e5e7eb",
        background: active ? `${PRIMARY}12` : "#fff", color: active ? PRIMARY : "#374151",
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, fontSize: 12, fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onInsertImage, uploadingImage }) {
  if (!editor) return null;
  const sep = <div style={{ width: 1, height: 22, background: "#e5e7eb", margin: "0 4px" }} />;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center", padding: "8px 10px", background: "#f9fafb", border: "1px solid #e8e8e8", borderRadius: 9 }}>
      <ToolbarBtn title="Negrita" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarBtn>
      <ToolbarBtn title="Cursiva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarBtn>
      <ToolbarBtn title="Subrayado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarBtn>
      {sep}
      <ToolbarBtn title="Título 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarBtn>
      <ToolbarBtn title="Título 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarBtn>
      <ToolbarBtn title="Título 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarBtn>
      {sep}
      <ToolbarBtn title="Lista con viñetas" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><Icon name="list" size={14} /></ToolbarBtn>
      <ToolbarBtn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarBtn>
      {sep}
      <ToolbarBtn title="Alinear izquierda" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⟸</ToolbarBtn>
      <ToolbarBtn title="Centrar" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>⟺</ToolbarBtn>
      <ToolbarBtn title="Alinear derecha" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>⟹</ToolbarBtn>
      <ToolbarBtn title="Justificar" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>☰</ToolbarBtn>
      {sep}
      <ToolbarBtn title="Insertar tabla" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <Icon name="dashboard" size={14} />
      </ToolbarBtn>
      <ToolbarBtn title="Insertar imagen" disabled={uploadingImage} onClick={onInsertImage}>
        <Icon name="image" size={14} />
      </ToolbarBtn>
    </div>
  );
}

/* ── Panel de historial de versiones ── */
function VersionsPanel({ documentId, onClose, onRestored }) {
  const [versions, setVersions] = useState(null);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    api.getDocumentVersions(documentId).then(setVersions).catch((e) => setError(e.message));
  }, [documentId]);

  const restore = async (versionId) => {
    setRestoringId(versionId);
    try {
      await api.restoreDocumentVersion(documentId, versionId);
      onRestored();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 600 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 440, maxWidth: "92vw", maxHeight: "80vh", overflowY: "auto", background: "#fff", borderRadius: 14, zIndex: 601, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Historial de versiones</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}><Icon name="x" size={18} /></button>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: 12 }}>{error}</p>}
        {!versions ? (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p>
        ) : versions.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Todavía no hay versiones guardadas manualmente.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {versions.map((v) => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#f9fafb", border: "1px solid #eef0f2", borderRadius: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#1a1a2e" }}>{v.label || "Versión guardada"}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{new Date(v.created_at).toLocaleString("es-GT")} · {v.created_by_username || "—"}</p>
                </div>
                <button onClick={() => restore(v.id)} disabled={restoringId === v.id} style={{ ...btnBase, padding: "6px 10px", fontSize: 11 }}>
                  {restoringId === v.id ? "Restaurando..." : "Restaurar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Panel de comentarios y calificación ── */
function CommentsPanel({ documentId, doc, comments, onReload, canGrade, isAuthor, pendingSelection, onConsumeSelection }) {
  const [newComment, setNewComment] = useState("");
  const [score, setScore] = useState(doc.score || "");
  const [returnComment, setReturnComment] = useState("");
  const [mode, setMode] = useState(null); // null | "grade" | "return"
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pendingSelection) setNewComment("");
  }, [pendingSelection]);

  const addFragmentComment = async () => {
    if (!newComment.trim() || !pendingSelection) return;
    setSaving(true);
    setError("");
    try {
      await api.addDocumentComment(documentId, { body: newComment.trim(), anchorFrom: pendingSelection.from, anchorTo: pendingSelection.to, quote: pendingSelection.quote });
      setNewComment("");
      onConsumeSelection();
      onReload();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const addGeneralComment = async () => {
    if (!newComment.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.addDocumentComment(documentId, { body: newComment.trim() });
      setNewComment("");
      onReload();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const grade = async () => {
    setSaving(true);
    setError("");
    try {
      await api.gradeDocument(documentId, score);
      onReload();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const doReturn = async () => {
    setSaving(true);
    setError("");
    try {
      await api.returnDocument(documentId, returnComment);
      onReload();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const generalComments = comments.filter((c) => c.anchor_from === null);
  const fragmentComments = comments.filter((c) => c.anchor_from !== null);

  return (
    <div style={{ width: 300, flexShrink: 0, borderLeft: "1px solid #eef0f2", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
      {doc.score && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "10px 12px" }}>
          <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: "#15803d", textTransform: "uppercase" }}>Nota</p>
          <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 700, color: "#14532d" }}>{doc.score}</p>
        </div>
      )}

      {canGrade && doc.status === "en_revision" && (
        <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 9, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "#6b21a8" }}>Calificar documento</p>
          {mode === "return" ? (
            <div>
              <textarea value={returnComment} onChange={(e) => setReturnComment(e.target.value)} placeholder="¿Qué hay que corregir?" style={{ ...inputStyle, minHeight: 60, resize: "vertical", marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={doReturn} disabled={saving} style={{ ...dangerBtn, fontSize: 11 }}>Confirmar devolución</button>
                <button onClick={() => setMode(null)} style={{ ...btnBase, fontSize: 11 }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="Nota (ej. 95, 8.5/10, Excelente...)" style={{ ...inputStyle, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={grade} disabled={saving} style={{ ...primaryBtn, fontSize: 11 }}>Calificar</button>
                <button onClick={() => setMode("return")} disabled={saving} style={{ ...dangerBtn, fontSize: 11 }}>Devolver</button>
              </div>
            </>
          )}
        </div>
      )}

      {pendingSelection && canGrade && doc.status === "en_revision" && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 9, padding: "10px 12px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontStyle: "italic", color: "#92400e" }}>"{pendingSelection.quote.slice(0, 80)}{pendingSelection.quote.length > 80 ? "…" : ""}"</p>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Comenta este fragmento..." style={{ ...inputStyle, minHeight: 50, resize: "vertical", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={addFragmentComment} disabled={saving || !newComment.trim()} style={{ ...primaryBtn, fontSize: 11 }}>Comentar</button>
            <button onClick={onConsumeSelection} style={{ ...btnBase, fontSize: 11 }}>Cancelar</button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "#ef4444", fontSize: 11.5 }}>{error}</p>}

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>Comentarios de fragmentos</p>
        {fragmentComments.length === 0 && <p style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>Ninguno todavía.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fragmentComments.map((c) => (
            <div key={c.id} style={{ background: "#f9fafb", border: "1px solid #eef0f2", borderRadius: 8, padding: "8px 10px" }}>
              {c.quote && <p style={{ margin: "0 0 4px", fontSize: 11, fontStyle: "italic", color: "#6b7280" }}>"{c.quote.slice(0, 70)}{c.quote.length > 70 ? "…" : ""}"</p>}
              <p style={{ margin: 0, fontSize: 12.5, color: "#1a1a2e" }}>{c.body}</p>
              <p style={{ margin: "4px 0 0", fontSize: 10.5, color: "#9ca3af" }}>{c.author_username} · {new Date(c.created_at).toLocaleDateString("es-GT")}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>Comentarios generales</p>
        {generalComments.length === 0 && <p style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>Ninguno todavía.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
          {generalComments.map((c) => (
            <div key={c.id} style={{ background: "#f9fafb", border: "1px solid #eef0f2", borderRadius: 8, padding: "8px 10px" }}>
              <p style={{ margin: 0, fontSize: 12.5, color: "#1a1a2e" }}>{c.body}</p>
              <p style={{ margin: "4px 0 0", fontSize: 10.5, color: "#9ca3af" }}>{c.author_username} · {new Date(c.created_at).toLocaleDateString("es-GT")}</p>
            </div>
          ))}
        </div>
        {canGrade && doc.status === "en_revision" && !pendingSelection && (
          <div style={{ display: "flex", gap: 6 }}>
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Comentario general..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addGeneralComment} disabled={saving || !newComment.trim()} style={{ ...primaryBtn, fontSize: 11 }}>Agregar</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Editor principal ── */
export default function DocumentEditor({ documentId, onClose, initialFile }) {
  const { authUser } = useApp();
  const [doc, setDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [showVersions, setShowVersions] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocx, setUploadingDocx] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [versionLabel, setVersionLabel] = useState("");
  const [showLabelPrompt, setShowLabelPrompt] = useState(false);
  const fileInputRef = useRef(null);
  const docxInputRef = useRef(null);
  const autosaveTimer = useRef(null);

  // authUser no trae un id numérico (solo el username, ver AppContext/
  // /api/auth/me) — se compara contra author_username, que el modelo
  // ya trae resuelto con un JOIN a users.
  const isAuthor = doc && authUser.user === doc.author_username;
  const canGrade = doc && scopeIncludes(authUser.permissions, "aceptarInformes", doc.role);
  const editable = !!(doc && isAuthor && EDITABLE_STATUSES.includes(doc.status));

  // El objeto de configuración de useEditor se crea una sola vez — los
  // callbacks (onUpdate, onSelectionUpdate) quedarían con el valor de
  // "editable"/"doc"/"canGrade" de ESE momento (closure vieja) en vez
  // del actual. Se leen siempre desde refs para evitar, por ejemplo,
  // que un autoguardado programado antes de enviar a revisión se
  // dispare después (ya bloqueado) usando el permiso de edición viejo.
  const editableRef = useRef(editable);
  const docRef = useRef(doc);
  const canGradeRef = useRef(canGrade);
  useEffect(() => { editableRef.current = editable; }, [editable]);
  useEffect(() => { docRef.current = doc; }, [doc]);
  useEffect(() => { canGradeRef.current = canGrade; }, [canGrade]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
    ],
    content: "",
    editable: false,
    onUpdate: () => {
      if (!editableRef.current) return;
      setSaveState("saving");
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        try {
          await api.autosaveDocument(documentId, editor.getJSON());
          setSaveState("saved");
        } catch {
          setSaveState("idle");
        }
      }, 2500);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      if (!canGradeRef.current || editableRef.current || docRef.current?.status !== "en_revision") return;
      const { from, to } = ed.state.selection;
      if (from === to) { setPendingSelection(null); return; }
      const quote = ed.state.doc.textBetween(from, to, " ");
      if (quote.trim()) setPendingSelection({ from, to, quote });
    },
  });

  const reload = useCallback(async () => {
    try {
      const [d, c] = await Promise.all([api.getDocument(documentId), api.getDocumentComments(documentId)]);
      setDoc(d);
      setComments(c);
      if (editor && !editor.isDestroyed) {
        // emitUpdate:false — cargar el contenido del servidor no debe
        // contar como una edición del usuario ni programar un autosave.
        editor.commands.setContent(d.content && Object.keys(d.content).length ? d.content : "", { emitUpdate: false });
      }
    } catch (e) {
      setError(e.message || "No se pudo cargar el documento");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, editor]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) editor.setEditable(editable);
    // Si el documento deja de ser editable (se envió a revisión, etc.)
    // se cancela cualquier autoguardado que hubiera quedado pendiente.
    if (!editable) clearTimeout(autosaveTimer.current);
  }, [editor, editable]);

  const insertImage = () => fileInputRef.current?.click();

  const submit = async () => {
    try {
      await api.submitDocument(documentId);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  const startReview = async () => {
    try {
      await api.startDocumentReview(documentId);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  const saveVersion = async () => {
    try {
      await api.saveDocumentVersion(documentId, editor.getJSON(), versionLabel.trim() || undefined);
      setVersionLabel("");
      setShowLabelPrompt(false);
      setSaveState("saved");
    } catch (e) {
      setError(e.message);
    }
  };

  const applyDocxFile = useCallback(async (file) => {
    setUploadingDocx(true);
    setError("");
    try {
      const { html } = await api.uploadDocx(documentId, file);
      editor.commands.setContent(html);
      await api.saveDocumentVersion(documentId, editor.getJSON(), "Importado desde .docx");
      await reload();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setUploadingDocx(false);
    }
  }, [documentId, editor, reload]);

  const handleDocxFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await applyDocxFile(file);
  };

  // Viene de "Subir Word" en Mis informes: el informe y el documento ya
  // se crearon vacíos solo para esto — en cuanto el editor está listo,
  // se convierte el archivo de una vez, sin que la persona tenga que
  // volver a pulsar "Subir .docx" adentro.
  const autoUploadDone = useRef(false);
  useEffect(() => {
    if (!initialFile || autoUploadDone.current || !editor || loading) return;
    autoUploadDone.current = true;
    applyDocxFile(initialFile);
  }, [initialFile, editor, loading, applyDocxFile]);

  const removeOriginalDocx = async () => {
    try {
      await api.deleteOriginalDocx(documentId);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  const download = async () => {
    try {
      await downloadDocumentDocx(editor.getJSON(), { title: doc.report_code || "Documento", filename: `${doc.report_code || "documento"}.docx` });
    } catch (e) {
      setError(e.message || "No se pudo generar el .docx");
    }
  };

  if (loading) {
    return (
      <>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 500 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 14, padding: 28, zIndex: 501 }}>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>Cargando documento...</p>
        </div>
      </>
    );
  }

  if (!doc) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 500 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 14, padding: 28, zIndex: 501 }}>
          <p style={{ margin: 0, color: "#ef4444", fontSize: 13 }}>{error || "No se pudo cargar el documento"}</p>
          <button onClick={onClose} style={{ ...btnBase, marginTop: 14 }}>Cerrar</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "4vh", left: "3vw", width: "94vw", height: "92vh", background: "#fff", borderRadius: 14, zIndex: 501, boxShadow: "0 24px 64px rgba(0,0,0,.3)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #eef0f2", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{doc.report_code || "Documento"}</h3>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#9ca3af" }}>Autor: {doc.author_username}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: `${STATUS_COLOR[doc.status]}15`, color: STATUS_COLOR[doc.status], border: `1px solid ${STATUS_COLOR[doc.status]}40` }}>
            {STATUS_LABEL[doc.status]}
          </span>
          {editable && (
            <span style={{ fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="clock" size={11} /> {saveState === "saving" ? "Guardando..." : "Guardado"}
            </span>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {editable && (
              <>
                <input ref={docxInputRef} type="file" accept=".docx" onChange={handleDocxFile} style={{ display: "none" }} />
                <button onClick={() => docxInputRef.current?.click()} disabled={uploadingDocx} style={btnBase}><Icon name="upload" size={13} /> {uploadingDocx ? "Convirtiendo..." : "Subir .docx"}</button>
                <button onClick={() => setShowLabelPrompt(true)} style={btnBase}><Icon name="check" size={13} /> Guardar versión</button>
              </>
            )}
            <button onClick={() => setShowVersions(true)} style={btnBase}><Icon name="clock" size={13} /> Historial</button>
            <button onClick={download} style={btnBase}><Icon name="fileText" size={13} /> Descargar .docx</button>
            {editable && (
              <button onClick={submit} style={primaryBtn}><Icon name="check" size={13} /> Enviar a revisión</button>
            )}
            {canGrade && doc.status === "enviado" && (
              <button onClick={startReview} style={primaryBtn}>Tomar para revisar</button>
            )}
            <button onClick={onClose} style={{ ...btnBase, padding: "7px 9px" }}><Icon name="x" size={16} /></button>
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 12, margin: "8px 20px 0" }}>{error}</p>}
        {doc.original_docx_name && (
          <div style={{ margin: "8px 20px 0", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280", background: "#f9fafb", border: "1px solid #eef0f2", borderRadius: 8, padding: "6px 12px", width: "fit-content" }}>
            <Icon name="fileText" size={13} />
            <a href={doc.original_docx_url} target="_blank" rel="noreferrer" style={{ color: "#374151" }}>{doc.original_docx_name}</a>
            <span style={{ color: "#d1d5db" }}>·</span>
            <span>archivo original subido</span>
            {editable && (
              <button onClick={removeOriginalDocx} title="Quitar el archivo original (subido por error)" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: 2 }}>
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
        )}
        {doc.status === "devuelto_a_correccion" && (
          <p style={{ margin: "8px 20px 0", fontSize: 12, color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px" }}>
            Este documento fue devuelto para corrección. Revisa los comentarios del panel derecho.
          </p>
        )}

        {showLabelPrompt && (
          <div style={{ margin: "8px 20px 0", display: "flex", gap: 8 }}>
            <input value={versionLabel} onChange={(e) => setVersionLabel(e.target.value)} placeholder="Etiqueta de la versión (opcional)" style={{ ...inputStyle, maxWidth: 300 }} />
            <button onClick={saveVersion} style={primaryBtn}>Guardar</button>
            <button onClick={() => setShowLabelPrompt(false)} style={btnBase}>Cancelar</button>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", gap: 16, padding: "14px 20px 20px", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            {editable && (
              <Toolbar editor={editor} uploadingImage={uploadingImage} onInsertImage={insertImage} />
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setUploadingImage(true);
              setError("");
              try {
                const token = sessionStorage.getItem("ca-token");
                const formData = new FormData();
                formData.append("file", file);
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
                const res = await fetch(`${API_URL}/api/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al subir imagen");
                editor.chain().focus().setImage({ src: data.url }).run();
              } catch (e2) {
                setError(e2.message);
              } finally {
                setUploadingImage(false);
              }
            }} />
            <div style={{ flex: 1, overflowY: "auto", border: "1px solid #e8e8e8", borderRadius: 10, padding: "20px 28px", background: editable ? "#fff" : "#fafafa" }}>
              <EditorContent editor={editor} />
            </div>
          </div>

          <CommentsPanel
            documentId={documentId} doc={doc} comments={comments} onReload={reload}
            canGrade={canGrade} isAuthor={isAuthor}
            pendingSelection={pendingSelection}
            onConsumeSelection={() => setPendingSelection(null)}
          />
        </div>
      </div>

      {showVersions && (
        <VersionsPanel documentId={documentId} onClose={() => setShowVersions(false)} onRestored={reload} />
      )}
    </>
  );
}
