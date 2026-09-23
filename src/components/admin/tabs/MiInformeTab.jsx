import { useState, useEffect, useCallback } from "react";
import { PRIMARY } from "../../../constants/theme";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../api/client";
import Icon from "../../ui/Icon";
import { LOGO_PNG_BASE64 } from "../../../assets/logoBase64";

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
  border: "1.5px solid #d0d7de", borderRadius: 7, boxSizing: "border-box",
};

const PERIOD_LABEL = { diario: "Diario", semanal: "Semanal", mensual: "Mensual", trimestral: "Trimestral", semestral: "Semestral", anual: "Anual" };
const ALL_PERIOD_TYPES = Object.keys(PERIOD_LABEL);
const GRANULARITY_LABEL = { diario: "Día", semanal: "Semana", mensual: "Mes" };
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatBucketLabel(bucket, granularity) {
  const d = new Date(`${bucket}T00:00:00`);
  if (granularity === "mensual") return MONTH_NAMES[d.getMonth()];
  if (granularity === "semanal") return `Semana del ${d.toLocaleDateString("es-GT", { day: "2-digit", month: "short" })}`;
  return d.toLocaleDateString("es-GT", { day: "2-digit", month: "short" });
}
const STATUS_LABEL = { borrador: "Borrador", enviado: "Enviado", aceptado: "Aceptado", devuelto: "Devuelto para corrección" };
const STATUS_COLOR = { borrador: "#d97706", enviado: "#2563eb", aceptado: "#16a34a", devuelto: "#dc2626" };
const STEPS = ["Periodo", "Descripción", "Cifras del informe", "Revisar y enviar"];

const blankDraft = () => ({
  id: null, reportCode: null, periodType: "", periodStart: "", periodEnd: "",
  stats: {}, narrative: {}, status: "borrador", reviewComment: null, reviewedAt: null,
});

function fromServer(r) {
  return {
    id: r.id, reportCode: r.report_code, periodType: r.period_type,
    periodStart: r.period_start?.slice(0, 10) || "",
    periodEnd: r.period_end?.slice(0, 10) || "",
    stats: r.stats || {}, narrative: r.narrative || {}, status: r.status,
    reviewComment: r.review_comment, reviewedAt: r.reviewed_at,
  };
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-GT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Ayuda a llenar el periodo sin que el usuario tenga que calcular
// fechas a mano: si ya eligió el tipo de periodo, elegir "desde"
// calcula el "hasta"; si eligió las fechas antes que el tipo, se
// detecta el tipo de periodo a partir de cuántos días abarcan.
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}
function addMonthsEndOfPeriod(dateStr, months) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
}
function computeEndFromStart(periodType, startStr) {
  switch (periodType) {
    case "diario":    return startStr;
    case "semanal":   return addDays(startStr, 6);
    case "mensual":   return addMonthsEndOfPeriod(startStr, 1);
    case "trimestral":return addMonthsEndOfPeriod(startStr, 3);
    case "semestral": return addMonthsEndOfPeriod(startStr, 6);
    case "anual":     return addMonthsEndOfPeriod(startStr, 12);
    default:          return startStr;
  }
}
// La granularidad de las series (monthlyFields) sigue al tipo de
// periodo del informe, no se elige aparte: un informe diario/semanal
// se desglosa por día/semana; uno mensual, trimestral, semestral o
// anual se desglosa por mes (no hay una unidad más fina razonable).
function granularityForPeriodType(periodType) {
  if (periodType === "diario" || periodType === "semanal" || periodType === "mensual") return periodType;
  return "mensual";
}

function detectPeriodTypeFromDates(startStr, endStr) {
  const diffDays = Math.round((new Date(`${endStr}T00:00:00`) - new Date(`${startStr}T00:00:00`)) / 86400000) + 1;
  if (diffDays === 1) return "diario";
  if (diffDays === 7) return "semanal";
  if (diffDays >= 28 && diffDays <= 31) return "mensual";
  if (diffDays >= 89 && diffDays <= 92) return "trimestral";
  if (diffDays >= 181 && diffDays <= 184) return "semestral";
  if (diffDays >= 365 && diffDays <= 366) return "anual";
  return null;
}

// Editable en borrador (todavía no se manda) o devuelto (se manda a
// corregir) — igual que exige el backend. Bloqueado en enviado
// (esperando revisión) o aceptado (final).
const isEditable = (status) => status === "borrador" || status === "devuelto";

// config.narrativeFields es un árbol de secciones (ver backend
// reportFields.js) — esto saca todos los campos de texto "hoja" (los
// que de verdad tienen un textarea) en orden, sin importar cuántos
// niveles de agrupación tengan encima. Espejo del mismo helper del
// backend (config/reportFields.js) — no se comparte archivo entre
// frontend y backend, así que vive duplicado en los dos.
function flattenNarrativeFields(narrativeFields) {
  const out = [];
  const walkFields = (fields) => {
    for (const f of fields || []) {
      if (f.fields?.length) walkFields(f.fields);
      else out.push(f);
    }
  };
  for (const node of narrativeFields || []) {
    if (node.kind === "intro" || node.kind === "closing") out.push(node);
    else if (node.kind === "section") walkFields(node.fields);
  }
  return out;
}

// Al editar un borrador, en vez de abrir siempre en el paso 1, se
// entra directo al primer paso que todavía necesita algo — si ya
// está todo lleno, va directo a "Revisar y enviar".
function firstIncompleteStep(config, draft) {
  if (!draft.periodType || !draft.periodStart || !draft.periodEnd) return 0;
  if (!flattenNarrativeFields(config.narrativeFields).every((f) => draft.narrative?.[f.key]?.trim())) return 1;
  if (!config.statFields.every((f) => draft.stats?.[f.key] !== undefined)) return 2;
  return 3;
}

// Toda la lógica de edición de un borrador (fechas, textos, series,
// listas) vive acá para que el asistente paso a paso y el modal de
// corrección de "devuelto" (sin pasos) se comporten exactamente igual
// sin duplicar cada función.
function useReportDraft(config, initialDraft) {
  const [draft, setDraft] = useState(initialDraft);
  // true una vez que el usuario elige el tipo de periodo a mano — a
  // partir de ahí, elegir "desde" autocompleta "hasta"; antes de eso,
  // completar ambas fechas a mano detecta el tipo de periodo solo.
  const [periodTypeTouched, setPeriodTypeTouched] = useState(false);
  const resetPeriodTypeTouched = () => setPeriodTypeTouched(false);

  const onPeriodTypeSelect = (newType) => {
    setPeriodTypeTouched(!!newType);
    setDraft((d) => {
      const next = { ...d, periodType: newType };
      if (newType && d.periodStart) next.periodEnd = computeEndFromStart(newType, d.periodStart);
      return next;
    });
  };

  const onPeriodStartChange = (newStart) => {
    setDraft((d) => {
      const next = { ...d, periodStart: newStart };
      if (newStart && periodTypeTouched) {
        next.periodEnd = computeEndFromStart(d.periodType, newStart);
      } else if (newStart && d.periodEnd) {
        const detected = detectPeriodTypeFromDates(newStart, d.periodEnd);
        if (detected && config?.periodTypes?.includes(detected)) next.periodType = detected;
      }
      return next;
    });
  };

  const onPeriodEndChange = (newEnd) => {
    setDraft((d) => {
      const next = { ...d, periodEnd: newEnd };
      if (!periodTypeTouched && d.periodStart && newEnd) {
        const detected = detectPeriodTypeFromDates(d.periodStart, newEnd);
        if (detected && config?.periodTypes?.includes(detected)) next.periodType = detected;
      }
      return next;
    });
  };

  const setStat      = (key, val) => setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: val === "" ? undefined : Number(val) } }));
  const setNarrative = (key, val) => setDraft((d) => ({ ...d, narrative: { ...d.narrative, [key]: val } }));

  // La granularidad no se guarda como elección del usuario: se
  // recalcula siempre a partir del tipo de periodo (paso 1), así que
  // si cambian el periodo, las series usan la unidad correcta sin
  // quedar desincronizadas.
  const getSeries = (key) => ({ granularity: granularityForPeriodType(draft.periodType), rows: draft.stats[key]?.rows || [] });
  const addSeriesRow    = (key) => setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: { ...getSeries(key), rows: [...getSeries(key).rows, { label: "", value: 0 }] } } }));
  const removeSeriesRow = (key, i) => setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: { ...getSeries(key), rows: getSeries(key).rows.filter((_, idx) => idx !== i) } } }));
  const setSeriesRow    = (key, i, sub, val) => setDraft((d) => {
    const rows = [...getSeries(key).rows];
    rows[i] = { ...rows[i], [sub]: sub === "value" ? Number(val) : val };
    return { ...d, stats: { ...d.stats, [key]: { ...getSeries(key), rows } } };
  });

  const addListItem    = (key) => setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: [...(d.stats[key] || []), ""] } }));
  const removeListItem = (key, i) => setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: (d.stats[key] || []).filter((_, idx) => idx !== i) } }));
  const setListItem    = (key, i, val) => setDraft((d) => {
    const items = [...(d.stats[key] || [])];
    items[i] = val;
    return { ...d, stats: { ...d.stats, [key]: items } };
  });

  return {
    draft, setDraft, periodTypeTouched, resetPeriodTypeTouched,
    onPeriodTypeSelect, onPeriodStartChange, onPeriodEndChange,
    setStat, setNarrative, getSeries, addSeriesRow, removeSeriesRow, setSeriesRow,
    addListItem, removeListItem, setListItem,
  };
}

// Quita filas/elementos vacíos que el usuario agregó pero no llenó,
// para que no truenen la validación del backend al guardar.
function cleanStats(config, stats) {
  const cleaned = { ...stats };
  for (const { key } of config.monthlyFields || []) {
    if (cleaned[key]) cleaned[key] = { ...cleaned[key], rows: (cleaned[key].rows || []).filter((row) => row.label?.trim()) };
  }
  for (const { key } of config.listFields || []) {
    if (cleaned[key]) cleaned[key] = cleaned[key].filter((item) => item?.trim());
  }
  return cleaned;
}

const MONTH_NAMES_UPPER = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

const ORDINAL_FEM = ["PRIMERA", "SEGUNDA", "TERCERA", "CUARTA", "QUINTA"];
const ORDINAL_MASC = ["PRIMER", "SEGUNDO", "TERCER", "CUARTO"];

// Encabezado de la tabla / "Total (...)" del documento — distinto
// según el tipo de periodo, como en el documento real: un día
// concreto, la semana del mes, el trimestre o semestre del año, etc.
// "periodStart"/"periodEnd" pueden venir como "YYYY-MM-DD" (borrador
// del asistente) o como ISO completo con hora (fila cruda del
// servidor) — por eso siempre se recorta a los primeros 10 caracteres
// antes de construir la fecha.
function periodRangeLabel(periodType, periodStart, periodEnd) {
  if (!periodStart || !periodEnd) return "";
  const s = new Date(`${String(periodStart).slice(0, 10)}T00:00:00`);
  const e = new Date(`${String(periodEnd).slice(0, 10)}T00:00:00`);
  if (isNaN(s) || isNaN(e)) return "";

  if (periodType === "diario") {
    return `INFORME DEL DÍA ${s.getDate()} DE ${MONTH_NAMES_UPPER[s.getMonth()]} DE ${s.getFullYear()}`;
  }
  if (periodType === "semanal") {
    const week = Math.min(Math.ceil(s.getDate() / 7), 5);
    return `${ORDINAL_FEM[week - 1]} SEMANA DE ${MONTH_NAMES_UPPER[s.getMonth()]} ${s.getFullYear()}`;
  }
  if (periodType === "trimestral") {
    const q = Math.floor(s.getMonth() / 3);
    return `${ORDINAL_MASC[q]} TRIMESTRE DEL AÑO ${s.getFullYear()}`;
  }
  if (periodType === "semestral") {
    const h = s.getMonth() < 6 ? 0 : 1;
    return `${ORDINAL_MASC[h]} SEMESTRE DEL AÑO ${s.getFullYear()}`;
  }
  if (periodType === "anual") {
    return `AÑO ${s.getFullYear()}`;
  }

  // mensual (u otro): un solo mes -> "ENERO"; cruza a otro mes -> "ENERO A FEBRERO".
  const sLabel = s.getFullYear() === e.getFullYear() ? MONTH_NAMES_UPPER[s.getMonth()] : `${MONTH_NAMES_UPPER[s.getMonth()]} ${s.getFullYear()}`;
  const eLabel = `${MONTH_NAMES_UPPER[e.getMonth()]} ${e.getFullYear()}`;
  return s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear() ? sLabel : `${sLabel} A ${eLabel}`;
}

const splitParagraphs = (text) => (text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);

// Arma la estructura del documento (Word y PDF comparten esto, solo
// cambia cómo se dibuja) a partir del árbol config.narrativeFields
// (ver backend reportFields.js) — nada de nombres de campos de un rol
// en particular codificados acá, todo sale de la configuración.
//
// Numeración: cada sección trae "number" fijo (ej. "2.3", tal como
// tutoría entrega su informe) o "groupBase" (ej. psicología, donde
// 1-2 y 5-6-7 son dos grupos que se numeran solos 1,2,3... y se corren
// si a algo le falta contenido, sin dejar un hueco — así el documento
// real, que salta del "2" al "5" porque no hay sección "3"/"4" propia,
// queda igual si todo está lleno).
//
// Una sección con un solo campo de texto se muestra como un párrafo
// (o viñetas) bajo su encabezado numerado. Una con varios campos (o
// campos con sus propios sub-campos, como "Reforzamientos académicos"
// con Inglés/Matemáticas/...) muestra cada uno con su propio
// sub-encabezado en negrita debajo del título de la sección.
function buildReportModel(report, config, roleLabel) {
  const narrative = report.narrative || {};
  const stats = report.stats || {};
  const has = (key) => !!narrative[key]?.trim();
  const hasAny = (fields) => (fields || []).some((f) => (f.fields?.length ? hasAny(f.fields) : has(f.key)));

  const title = config.docTitle || `Informe Área de ${roleLabel}`;

  const monthlyField = (config.monthlyFields || [])[0];
  const listField = (config.listFields || [])[0];
  const monthlyRows = monthlyField ? stats[monthlyField.key]?.rows || [] : [];
  const listItems = listField ? stats[listField.key] || [] : [];
  const hasDetailData = monthlyRows.length > 0 || listItems.length > 0;

  // Arma el contenido de una sección: cada field se vuelve un ítem
  // {subheading, paragraphs} (texto simple) o {subheading, children}
  // (si el field a su vez tiene sub-campos, recursivo). El sub-título
  // solo se muestra si hay más de un field en ese nivel — si es uno
  // solo, su propio label ya se usa como el título de la sección.
  const buildFieldContent = (fields) => {
    const items = [];
    const multi = (fields || []).length > 1;
    for (const f of fields || []) {
      if (f.fields?.length) {
        if (!hasAny(f.fields)) continue;
        items.push({ subheading: f.label, children: buildFieldContent(f.fields) });
      } else if (has(f.key)) {
        items.push({ subheading: multi ? f.label : null, paragraphs: splitParagraphs(narrative[f.key]) });
      }
    }
    return items;
  };

  const intro = [];
  const sections = [];
  const conclusion = [];
  const groupNext = {}; // groupBase -> siguiente número a asignar en ese grupo

  for (const node of config.narrativeFields || []) {
    if (node.kind === "intro") { if (has(node.key)) intro.push(...splitParagraphs(narrative[node.key])); continue; }
    if (node.kind === "closing") { if (has(node.key)) conclusion.push(...splitParagraphs(narrative[node.key])); continue; }
    if (node.kind !== "section") continue;

    if (node.isDetail) {
      if (!hasDetailData) continue;
      const number = node.number ?? (groupNext[node.groupBase] ??= node.groupBase);
      if (node.groupBase !== undefined) groupNext[node.groupBase] = number + 1;
      sections.push({
        number, heading: config.detailSectionTitle || "Detalle de atenciones",
        detail: {
          monthlyLabel: monthlyField?.label, monthlyRows,
          totalLabel: `Total (${periodRangeLabel(report.period_type, report.period_start, report.period_end) || "periodo"})`,
          total: monthlyRows.reduce((s, r) => s + (Number(r.value) || 0), 0),
          listLabel: listField?.label, listItems,
        },
      });
      continue;
    }

    const fields = node.fields || [];
    const items = buildFieldContent(fields);
    if (items.length === 0) continue;

    const number = node.number ?? (groupNext[node.groupBase] ??= node.groupBase);
    if (node.groupBase !== undefined) groupNext[node.groupBase] = number + 1;
    const heading = node.label || (fields.length === 1 && !fields[0].fields?.length ? fields[0].label : "");

    sections.push({ number, heading, items, bulleted: !!node.bulleted });
  }

  const tableRows = config.statFields.filter((f) => stats[f.key] !== undefined).map((f) => ({ label: f.label, value: stats[f.key] }));

  return { title, intro, sections, conclusion, table: tableRows.length ? { headerLabel: periodRangeLabel(report.period_type, report.period_start, report.period_end) || "TOTALES", rows: tableRows } : null };
}

// PDF real generado en el navegador (pdfmake) — se descarga como
// archivo directo, no abre el diálogo de impresión. Mismo diseño que
// el Word (ver buildReportModel): título, secciones numeradas con
// viñetas, viñetas anidadas en el detalle de atenciones, tabla de
// totales, y encabezado/pie con logo y número de página reales en
// cada hoja (pdfmake sí sabe cuántas páginas tiene el documento).
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(script);
  });
}

// pdfmake está pensada para cargarse como <script> clásico (deja
// window.pdfMake) — empaquetarla con Vite/Rollup la partía en pedazos
// de forma inestable, por eso vive como archivo estático en
// public/vendor (ver ese README) y se carga así, una sola vez.
let pdfMakeReadyPromise = null;
function loadPdfMake() {
  if (!pdfMakeReadyPromise) {
    pdfMakeReadyPromise = loadScriptOnce("/vendor/pdfmake.min.js")
      .then(() => loadScriptOnce("/vendor/pdfmake-helvetica.js"))
      .then(() => window.pdfMake);
  }
  return pdfMakeReadyPromise;
}

async function downloadReportPdf(report, config, roleLabel) {
  const pdfMake = await loadPdfMake();

  const model = buildReportModel(report, config, roleLabel);
  const FONT = "Helvetica";

  const bulletList = (items) => ({ ul: items, margin: [0, 0, 0, 10] });
  // Nivel 0 (•) y nivel 1 (indentado) — como el documento real:
  // "Incremento progresivo..." es la viñeta de primer nivel, cada mes
  // y el total van indentados debajo, en segundo nivel.
  // Ojo: si el ítem lleva "text" y "ul" juntos en el mismo objeto,
  // pdfmake descarta el texto en silencio (se pierde la etiqueta y
  // solo quedan los sub-ítems) — por eso van como dos entradas
  // separadas dentro de la misma lista: la etiqueta como texto plano,
  // y la sub-lista como su propio ítem justo debajo (así indenta bien).
  const nestedBullet = (headLabel, subItems) => subItems.length
    ? { ul: [headLabel, { ul: subItems }], margin: [0, 0, 0, 10] }
    : null;

  // Recorre s.items (ver buildReportModel): cada uno es un párrafo
  // simple (con o sin su propio sub-encabezado en negrita, según haya
  // más de un field en la sección) o, si tiene "children", un grupo
  // anidado un nivel más (ej. "Reforzamientos académicos").
  const renderItems = (items, bulleted) => {
    const nodes = [];
    for (const item of items) {
      if (item.subheading) nodes.push({ text: item.subheading, bold: true, margin: [0, 10, 0, 6] });
      if (item.children) {
        nodes.push({ margin: [14, 0, 0, 6], stack: renderItems(item.children, bulleted) });
      } else if (bulleted) {
        nodes.push(bulletList(item.paragraphs));
      } else {
        for (const p of item.paragraphs) nodes.push({ text: p, alignment: "justify", margin: [0, 0, 0, 8] });
      }
    }
    return nodes;
  };

  const content = [
    { text: model.title, fontSize: 14, bold: true, alignment: "center", margin: [0, 0, 0, 16] },
    ...model.intro.map((p) => ({ text: p, alignment: "justify", margin: [0, 0, 0, 10] })),
  ];

  for (const s of model.sections) {
    content.push({ text: `${s.number}. ${s.heading}`, bold: true, margin: [0, 12, 0, 6] });
    if (s.detail) {
      const monthly = nestedBullet(`${s.detail.monthlyLabel}:`, [
        ...s.detail.monthlyRows.map((r) => `${r.label}: ${r.value}`),
        ...(s.detail.monthlyRows.length ? [`${s.detail.totalLabel}: ${s.detail.total}`] : []),
      ]);
      if (monthly) content.push(monthly);
      const list = nestedBullet(`${s.detail.listLabel}:`, s.detail.listItems);
      if (list) content.push(list);
      continue;
    }
    content.push(...renderItems(s.items, s.bulleted));
  }

  for (const p of model.conclusion) content.push({ text: p, alignment: "justify", margin: [0, 12, 0, 0] });

  if (model.table) {
    content.push({
      margin: [0, 20, 0, 0],
      table: {
        widths: ["*", "*"],
        body: [
          [{ text: model.table.headerLabel, colSpan: 2, alignment: "center", bold: true, fillColor: "#dbe4f3" }, {}],
          ...model.table.rows.map((r) => [{ text: r.label, alignment: "center" }, { text: String(r.value), alignment: "center" }]),
        ],
      },
    });
  }

  const docDefinition = {
    pageMargins: [56, 90, 56, 60],
    header: () => ({
      margin: [56, 20, 56, 0],
      columns: [
        { image: `data:image/png;base64,${LOGO_PNG_BASE64}`, width: 34 },
        { text: [{ text: "Casa ASOL\n", bold: true, fontSize: 11 }, { text: model.title, fontSize: 9, color: "#6b7280" }], margin: [10, 2, 0, 0] },
      ],
    }),
    footer: (currentPage, pageCount) => ({
      text: `Página ${currentPage} de ${pageCount}`, alignment: "center", fontSize: 8, color: "#9ca3af", margin: [0, 10, 0, 0],
    }),
    content,
    defaultStyle: { font: FONT, fontSize: 10 },
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);
  await pdfDoc.download(`${report.report_code || "informe"}.pdf`);
}

// Word real (.docx), con el mismo diseño que el PDF y el documento
// original: título centrado, párrafo introductorio, secciones
// numeradas en negrita, "Logros" con viñetas, y la tabla de totales
// al final con el periodo como encabezado.
async function downloadReportWord(report, config, roleLabel) {
  const {
    Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType,
    Header, Footer, ImageRun, PageNumber, VerticalAlign, BorderStyle,
  } = await import("docx");
  const FONT = "Arial";

  const run = (text, extra = {}) => new TextRun({ text, font: FONT, size: 24, ...extra });
  const bodyPara = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, children: [run(text)] });
  const boldPara = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 }, children: [run(text, { bold: true })] });
  const bulletPara = (text, level = 0) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, bullet: { level }, children: [run(text)] });
  const cellPara = (text, bold = false) => new Paragraph({ alignment: AlignmentType.CENTER, children: [run(String(text), { bold })] });
  const cell = (text, opts = {}) => new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [cellPara(text, opts.bold)], ...opts.tc });

  const model = buildReportModel(report, config, roleLabel);

  // Encabezado (logo + nombre del informe según el rol) y pie de
  // página con el número de página real — a diferencia del PDF
  // impreso desde el navegador, Word sí sabe cuántas páginas tiene el
  // documento, así que "Página X de Y" es exacto en cada hoja.
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const logoBytes = Uint8Array.from(atob(LOGO_PNG_BASE64), (c) => c.charCodeAt(0));
  const header = new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
        rows: [new TableRow({ children: [
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [
            new Paragraph({ children: [new ImageRun({ type: "png", data: logoBytes, transformation: { width: 42, height: 33 } })] }),
          ] }),
          new TableCell({ width: { size: 85, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [
            new Paragraph({ children: [run("Casa ASOL", { bold: true, size: 22 })] }),
            new Paragraph({ children: [run(model.title, { size: 18, color: "6b7280" })] }),
          ] }),
        ] })],
      }),
    ],
  });
  const footer = new Footer({
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      run("Página ", { size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 }),
      run(" de ", { size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18 }),
    ] })],
  });
  // Recorre s.items (ver buildReportModel): cada uno es un párrafo
  // simple (con o sin su propio sub-encabezado en negrita, según haya
  // más de un field en la sección) o, si tiene "children", un grupo
  // anidado un nivel más (ej. "Reforzamientos académicos") — indentado
  // 400 twips por nivel para que se note la jerarquía.
  const renderItems = (items, bulleted, indent = 0) => {
    const nodes = [];
    for (const item of items) {
      if (item.subheading) {
        nodes.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 }, indent: indent ? { left: indent } : undefined, children: [run(item.subheading, { bold: true })] }));
      }
      if (item.children) {
        nodes.push(...renderItems(item.children, bulleted, indent + 400));
      } else if (bulleted) {
        for (const p of item.paragraphs) nodes.push(bulletPara(p));
      } else {
        for (const p of item.paragraphs) {
          nodes.push(indent
            ? new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, indent: { left: indent }, children: [run(p)] })
            : bodyPara(p));
        }
      }
    }
    return nodes;
  };

  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [run(model.title, { bold: true, size: 28 })] }),
    ...model.intro.map(bodyPara),
  ];

  for (const s of model.sections) {
    children.push(boldPara(`${s.number}. ${s.heading}`));
    if (s.detail) {
      // Nivel 0 (•) y nivel 1 (o, indentado) — como el documento real.
      if (s.detail.monthlyRows.length) {
        children.push(bulletPara(`${s.detail.monthlyLabel}:`, 0));
        for (const r of s.detail.monthlyRows) children.push(bulletPara(`${r.label}: ${r.value}`, 1));
        children.push(bulletPara(`${s.detail.totalLabel}: ${s.detail.total}`, 1));
      }
      if (s.detail.listItems.length) {
        children.push(bulletPara(`${s.detail.listLabel}:`, 0));
        for (const item of s.detail.listItems) children.push(bulletPara(item, 1));
      }
      continue;
    }
    children.push(...renderItems(s.items, s.bulleted));
  }

  for (const p of model.conclusion) children.push(bodyPara(p));

  if (model.table) {
    children.push(new Table({
      width: { size: 60, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      rows: [
        new TableRow({ children: [new TableCell({ columnSpan: 2, shading: { fill: "DBE4F3" }, children: [cellPara(model.table.headerLabel, true)] })] }),
        ...model.table.rows.map((r) => new TableRow({ children: [cell(r.label), cell(r.value)] })),
      ],
    }));
  }

  const doc = new Document({ sections: [{ headers: { default: header }, footers: { default: footer }, children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.report_code || "informe"}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ── Formulario de texto: recorre config.narrativeFields (árbol de
   secciones, ver reportFields.js) y muestra un textarea por cada
   campo hoja. Si una sección tiene un solo campo (como en psicología)
   se ve igual que antes: label + textarea. Si tiene varios (o campos
   con sus propios sub-campos, como "Reforzamientos académicos" en
   tutoría), se agrupan bajo el título de la sección con su propio
   sub-encabezado cada uno. Lo usan el asistente paso a paso y el
   modal de corrección de "devuelto" (sin pasos) — así se comportan
   igual sin duplicar esta lógica. ── */
function NarrativeFieldsForm({ narrativeFields, narrative, setNarrative, locked }) {
  const textarea = (field, extraStyle) => (
    <div key={field.key} style={{ marginBottom: 16, ...extraStyle }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{field.label}</label>
      <textarea value={narrative[field.key] || ""} disabled={locked} onChange={(e) => setNarrative(field.key, e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
    </div>
  );

  const renderFields = (fields, depth) => fields.map((f) =>
    f.fields?.length
      ? (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#374151" }}>{f.label}</p>
          <div style={{ paddingLeft: 14, borderLeft: "2px solid #f0f0f0" }}>{renderFields(f.fields, depth + 1)}</div>
        </div>
      )
      : textarea(f)
  );

  return narrativeFields.map((node, i) => {
    if (node.kind === "intro" || node.kind === "closing") return textarea(node);
    if (node.kind !== "section" || node.isDetail) return null;
    const fields = node.fields || [];
    const single = fields.length === 1 && !fields[0].fields?.length;
    if (single) return textarea(fields[0]);
    return (
      <div key={node.number ?? i} style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
        <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{node.label}</p>
        {renderFields(fields, 0)}
      </div>
    );
  });
}

/* ── Botón para llenar el informe contando el expediente de atenciones ── */
function CalculateFromAttentionsButton({ calculating, onClick }) {
  return (
    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
      <button onClick={onClick} disabled={calculating} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", background: "#fff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: calculating ? "wait" : "pointer", marginBottom: 8 }}>
        <Icon name="cloud" size={13} /> {calculating ? "Calculando..." : "Calcular desde el expediente"}
      </button>
      <p style={{ margin: 0, fontSize: 12, color: "#1e40af" }}>
        Cuenta las atenciones que ya registraste en "Expediente de atenciones" durante este periodo y llena los campos de abajo automáticamente. Sigue siendo editable: si algo no quedó registrado ahí, puedes corregirlo a mano.
      </p>
    </div>
  );
}

/* ── Panel de revisión: aceptar / devolver (solo admin/desarrollador) ── */
function ReviewPanel({ reportId, onDone }) {
  const [mode, setMode] = useState(null); // null | "accept" | "return"
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const accept = async () => {
    setSaving(true);
    setError("");
    try {
      await api.acceptReport(reportId);
      onDone();
    } catch (e) {
      setError(e.message || "No se pudo aceptar");
    } finally {
      setSaving(false);
    }
  };

  const returnReport = async () => {
    setSaving(true);
    setError("");
    try {
      await api.returnReport(reportId, comment);
      onDone();
    } catch (e) {
      setError(e.message || "No se pudo devolver");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 18, marginBottom: 22 }}>
      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Este informe está esperando revisión</p>

      {mode === "return" ? (
        <div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="¿Qué hay que corregir?" style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={returnReport} disabled={saving} style={{ padding: "8px 16px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
              {saving ? "Enviando..." : "Confirmar devolución"}
            </button>
            <button onClick={() => setMode(null)} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={accept} disabled={saving} style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            Aceptar informe
          </button>
          <button onClick={() => setMode("return")} disabled={saving} style={{ padding: "8px 16px", background: "#fff", color: "#dc2626", border: "1.5px solid #fecaca", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Devolver para corrección
          </button>
        </div>
      )}
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>{error}</p>}
    </div>
  );
}

/* ── Bitácora: cuándo se creó, se envió, y si lo aceptaron o
   devolvieron (con el motivo). Solo refleja el ciclo de revisión más
   reciente — el backend no guarda un historial de ciclos anteriores. ── */
function BitacoraModal({ report, onClose }) {
  const events = [{ label: "Creado como borrador", date: report.created_at, icon: "edit", color: "#6b7280" }];
  if (report.submitted_at) {
    events.push({ label: "Enviado para revisión", date: report.submitted_at, icon: "mail", color: "#2563eb" });
  }
  if (report.status === "enviado") {
    events.push({ label: "Pendiente de revisión", date: null, icon: "clock", color: "#d97706" });
  } else if (report.status === "aceptado") {
    events.push({ label: "Aceptado", date: report.reviewed_at, icon: "check", color: "#16a34a" });
  } else if (report.status === "devuelto") {
    events.push({ label: "Devuelto para corrección", date: report.reviewed_at, icon: "warning", color: "#dc2626", comment: report.review_comment });
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 440, maxWidth: "92vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "26px 28px 22px", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Bitácora</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 12, color: PRIMARY, fontWeight: 700 }}>{report.report_code || "Sin código todavía"}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${e.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={e.icon} size={14} color={e.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{e.label}</p>
                {e.date && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{formatDateTime(e.date)}</p>}
                {e.comment && (
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#7f1d1d", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "8px 10px", maxWidth: 320 }}>
                    {e.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Ver informe: todo el contenido de una sola vez, sin ir paso por
   paso — solo lectura, ideal para revisar o compartir en pantalla. ── */
function ReportViewModal({ report, config, roleLabel, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 640, maxWidth: "92vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "28px 30px 24px", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{report.report_code || "Sin código todavía"}</h3>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
              {roleLabel} · {report.period_type ? PERIOD_LABEL[report.period_type] : "Periodo sin definir"}
              {report.period_start && ` · ${formatDate(report.period_start)} – ${formatDate(report.period_end)}`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex", flexShrink: 0 }}><Icon name="x" size={20} /></button>
        </div>

        <span style={{ display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: `${STATUS_COLOR[report.status]}15`, color: STATUS_COLOR[report.status], border: `1px solid ${STATUS_COLOR[report.status]}40` }}>
          {STATUS_LABEL[report.status]}
        </span>

        {report.status === "devuelto" && report.review_comment && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginTop: 16 }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#991b1b" }}>Comentario de corrección</p>
            <p style={{ margin: 0, fontSize: 13, color: "#7f1d1d" }}>{report.review_comment}</p>
          </div>
        )}

        {/* Bitácora completa: se listan TODOS los campos que el informe
            pide, aunque todavía estén vacíos — así se ve de un vistazo
            qué falta, sin tener que abrir el asistente. */}
        {flattenNarrativeFields(config.narrativeFields).map(({ key, label }) => {
          const value = report.narrative?.[key]?.trim();
          return (
            <div key={key} style={{ marginTop: 20 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label.toUpperCase()}</p>
              {value
                ? <p style={{ margin: "4px 0 0", fontSize: 13, color: "#1a1a2e", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{value}</p>
                : <p style={{ margin: "4px 0 0", fontSize: 13, color: "#c1c7d0", fontStyle: "italic" }}>Sin completar</p>}
            </div>
          );
        })}

        {(config.monthlyFields || []).map(({ key, label }) => {
          const rows = report.stats?.[key]?.rows || [];
          return (
            <div key={key} style={{ marginTop: 20 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label.toUpperCase()}</p>
              {rows.length ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>{row.label}</td>
                        <td style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: 700 }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ margin: 0, fontSize: 13, color: "#c1c7d0", fontStyle: "italic" }}>Sin registros</p>
              )}
            </div>
          );
        })}

        {(config.listFields || []).map(({ key, label }) => {
          const items = report.stats?.[key] || [];
          return (
            <div key={key} style={{ marginTop: 20 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label.toUpperCase()}</p>
              {items.length ? (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7 }}>
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: 13, color: "#c1c7d0", fontStyle: "italic" }}>Sin elementos</p>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 24, paddingTop: 18, borderTop: "1px solid #f0f0f0" }}>
          {config.statFields.map(({ key, label }) => (
            <div key={key}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: report.stats?.[key] !== undefined ? PRIMARY : "#c1c7d0" }}>
                {report.stats?.[key] !== undefined ? report.stats[key] : "—"}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Corregir un informe devuelto: todo en una sola pantalla, sin
   pasos — para arreglar rápido lo que se pidió corregir, en vez de
   tener que navegar el asistente completo de nuevo. ── */
function RejectedEditModal({ report, config, roleLabel, canManageAllRoles, effectiveRole, onClose, onSaved }) {
  const {
    draft, setDraft, onPeriodTypeSelect, onPeriodStartChange, onPeriodEndChange,
    setStat, setNarrative, getSeries, addSeriesRow, removeSeriesRow, setSeriesRow,
    addListItem, removeListItem, setListItem,
  } = useReportDraft(config, fromServer(report));

  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  const periodIncomplete = !draft.periodType || !draft.periodStart || !draft.periodEnd;
  const hasAttentionSources = config.statFields.some((f) => f.sourceType) || (config.monthlyFields || []).some((f) => f.sourceType);

  const calculateFromAttentions = async () => {
    if (periodIncomplete) { setError("Completa el periodo antes de calcular"); return; }
    setCalculating(true);
    setError("");
    setNotice("");
    try {
      const statSources = config.statFields.filter((f) => f.sourceType);
      if (statSources.length) {
        const summary = await api.getAttentionSummary({ role: effectiveRole, periodStart: draft.periodStart, periodEnd: draft.periodEnd, granularity: "mensual" });
        setDraft((d) => {
          const stats = { ...d.stats };
          for (const f of statSources) stats[f.key] = summary[f.sourceType]?.count ?? 0;
          return { ...d, stats };
        });
      }
      for (const f of (config.monthlyFields || [])) {
        if (!f.sourceType) continue;
        const granularity = getSeries(f.key).granularity || "mensual";
        const summary = await api.getAttentionSummary({ role: effectiveRole, periodStart: draft.periodStart, periodEnd: draft.periodEnd, granularity });
        const rows = (summary[f.sourceType]?.series || []).map((s) => ({ label: formatBucketLabel(s.bucket, granularity), value: s.value }));
        setDraft((d) => ({ ...d, stats: { ...d.stats, [f.key]: { granularity, rows } } }));
      }
      setNotice("Totales calculados desde el expediente de atenciones. Puedes editarlos si algo no quedó registrado ahí.");
    } catch (e) {
      setError(e.message || "No se pudo calcular desde el expediente");
    } finally {
      setCalculating(false);
    }
  };

  const buildPayload = () => ({
    ...(canManageAllRoles && { role: effectiveRole }),
    periodType: draft.periodType, periodStart: draft.periodStart, periodEnd: draft.periodEnd,
    stats: cleanStats(config, draft.stats), narrative: draft.narrative,
  });

  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api.updateReport(draft.id, buildPayload());
      setNotice("Cambios guardados");
      onSaved();
      return true;
    } catch (e) {
      setError(e.message || "No se pudo guardar");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const resend = async () => {
    setSaving(true);
    setError("");
    try {
      await api.updateReport(draft.id, buildPayload());
      await api.submitReport(draft.id);
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message || "No se pudo reenviar");
    } finally {
      setSaving(false);
    }
  };

  const rowBtnStyle = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280", flexShrink: 0 };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", zIndex: 400 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 680, maxWidth: "94vw", background: "#fff", borderRadius: 14, zIndex: 401, boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: "26px 30px 24px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Corregir informe</h3>
            {report.report_code && <p style={{ margin: "3px 0 0", fontSize: 12, fontWeight: 700, color: PRIMARY }}>{report.report_code}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}><Icon name="x" size={20} /></button>
        </div>

        {report.review_comment && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginTop: 16 }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#991b1b" }}>Por qué se devolvió</p>
            <p style={{ margin: 0, fontSize: 13, color: "#7f1d1d" }}>{report.review_comment}</p>
          </div>
        )}

        <h3 style={{ margin: "22px 0 14px", fontSize: 14, fontWeight: 700, color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>Periodo</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>TIPO DE PERIODO</label>
            <select value={draft.periodType} onChange={(e) => onPeriodTypeSelect(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Escoge un periodo...</option>
              {config.periodTypes.map((p) => <option key={p} value={p}>{PERIOD_LABEL[p]}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>DESDE</label>
            <input type="date" value={draft.periodStart} onChange={(e) => onPeriodStartChange(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>HASTA</label>
            <input type="date" value={draft.periodEnd} onChange={(e) => onPeriodEndChange(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <h3 style={{ margin: "26px 0 14px", fontSize: 14, fontWeight: 700, color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>Descripción</h3>
        <NarrativeFieldsForm narrativeFields={config.narrativeFields} narrative={draft.narrative} setNarrative={setNarrative} locked={false} />

        <h3 style={{ margin: "26px 0 4px", fontSize: 14, fontWeight: 700, color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>Cifras del informe</h3>
        {hasAttentionSources && <CalculateFromAttentionsButton calculating={calculating} onClick={calculateFromAttentions} />}
        {config.statFields.length === 0 && !(config.monthlyFields || []).length && !(config.listFields || []).length ? (
          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Este rol no tiene cifras que reportar — el informe es solo narrativo.</p>
        ) : (
          <>
            <p style={{ margin: "10px 0 14px", fontSize: 12, color: "#9ca3af" }}>Un número por cada tipo de atención — obligatorio para todos.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              {config.statFields.map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, lineHeight: 1.35, minHeight: 28 }}>{label}</label>
                  <input type="number" min="0" value={draft.stats[key] ?? ""} onChange={(e) => setStat(key, e.target.value)} style={inputStyle} placeholder="0" />
                </div>
              ))}
            </div>
          </>
        )}

        {(config.monthlyFields || []).map(({ key, label }) => {
          const series = getSeries(key);
          return (
            <div key={key} style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px dashed #e5e7eb" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Detalle opcional: {label} (por {GRANULARITY_LABEL[series.granularity].toLowerCase()})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                {series.rows.map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <input value={row.label} onChange={(e) => setSeriesRow(key, i, "label", e.target.value)} placeholder="Ej. Enero" style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" min="0" value={row.value ?? ""} onChange={(e) => setSeriesRow(key, i, "value", e.target.value)} placeholder="0" style={{ ...inputStyle, width: 100 }} />
                    <button onClick={() => removeSeriesRow(key, i)} style={rowBtnStyle}><Icon name="trash" size={13} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => addSeriesRow(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                <Icon name="plus" size={12} /> Agregar
              </button>
            </div>
          );
        })}

        {(config.listFields || []).map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px dashed #e5e7eb" }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Detalle opcional: {label}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {(draft.stats[key] || []).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input value={item} onChange={(e) => setListItem(key, i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={() => removeListItem(key, i)} style={rowBtnStyle}><Icon name="trash" size={13} /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addListItem(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              <Icon name="plus" size={12} /> Agregar
            </button>
          </div>
        ))}

        {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 16 }}>{error}</p>}
        {notice && <p style={{ color: "#16a34a", fontSize: 13, marginTop: 16 }}>{notice}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 18, borderTop: "1px solid #f0f0f0" }}>
          <button onClick={save} disabled={saving} style={{ padding: "10px 18px", background: "#fff", color: PRIMARY, border: `1.5px solid ${PRIMARY}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {confirmingSubmit ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>No podrás editarlo mientras esté en revisión.</span>
              <button onClick={() => setConfirmingSubmit(false)} disabled={saving} style={{ padding: "10px 14px", background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
              <button onClick={resend} disabled={saving} style={{ padding: "10px 18px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>Confirmar reenvío</button>
            </div>
          ) : (
            <button onClick={() => setConfirmingSubmit(true)} disabled={saving || periodIncomplete} title={periodIncomplete ? "Completa el periodo antes de reenviar" : undefined} style={{ padding: "10px 18px", background: periodIncomplete ? "#d1d5db" : PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : periodIncomplete ? "not-allowed" : "pointer" }}>
              Reenviar informe
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Pantalla de inicio: tabla + filtros ── */
function InformesInicio({ reports, config, roleLabel, onOpen, onNew, canManageAllRoles, effectiveRole, onReload }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [logFor, setLogFor] = useState(null);
  const [viewFor, setViewFor] = useState(null);
  const [correctingFor, setCorrectingFor] = useState(null);

  const years = [...new Set(reports.map((r) => r.period_start?.slice(0, 4)).filter(Boolean))].sort().reverse();

  const matchesSearch = (r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const haystack = [r.report_code, PERIOD_LABEL[r.period_type], STATUS_LABEL[r.status], ...Object.values(r.narrative || {})]
      .filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  };

  const filtered = reports.filter((r) =>
    (!statusFilter || r.status === statusFilter) &&
    (!periodFilter || r.period_type === periodFilter) &&
    (!year || r.period_start?.slice(0, 4) === year) &&
    matchesSearch(r)
  );

  const selectStyle = { padding: "8px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#374151", cursor: "pointer", background: "#fff" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Mis informes</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Borradores, enviados, aceptados y devueltos de tus periodos de reporte</p>
        </div>
        <button onClick={onNew} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Icon name="plus" size={14} /> Nuevo informe
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Icon name="eye" size={13} color="#9ca3af" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código o contenido..."
            style={{ ...inputStyle, width: 240, paddingLeft: 30 }}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">Cualquier estado</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        {/* Universo completo de periodos, no solo los que este rol usa
            hoy — el filtro sirve para lo que ya existe guardado. */}
        <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={selectStyle}>
          <option value="">Cualquier periodo</option>
          {ALL_PERIOD_TYPES.map((p) => <option key={p} value={p}>{PERIOD_LABEL[p]}</option>)}
        </select>

        {years.length > 1 && (
          <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
            <option value="">Todos los años</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="list" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>
            {reports.length === 0 ? "Todavía no has creado informes." : "Nada coincide con estos filtros."}
          </p>
        </div>
      )}

      {logFor && <BitacoraModal report={logFor} onClose={() => setLogFor(null)} />}
      {viewFor && <ReportViewModal report={viewFor} config={config} roleLabel={roleLabel} onClose={() => setViewFor(null)} />}
      {correctingFor && (
        <RejectedEditModal
          report={correctingFor} config={config} roleLabel={roleLabel}
          canManageAllRoles={canManageAllRoles} effectiveRole={effectiveRole}
          onClose={() => setCorrectingFor(null)} onSaved={onReload}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((r) => {
          const actionBtn = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280", flexShrink: 0 };
          return (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${PRIMARY}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="list" size={16} color={PRIMARY} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                  {r.report_code && <span style={{ color: PRIMARY, marginRight: 8 }}>{r.report_code}</span>}
                  {r.period_type ? PERIOD_LABEL[r.period_type] : "Periodo sin definir"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                  {r.period_start ? `${formatDate(r.period_start)} – ${formatDate(r.period_end)}` : `Creado el ${formatDate(r.created_at)}`}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: `${STATUS_COLOR[r.status]}15`, color: STATUS_COLOR[r.status], border: `1px solid ${STATUS_COLOR[r.status]}40` }}>
                {STATUS_LABEL[r.status]}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setLogFor(r)} title="Bitácora" style={actionBtn}><Icon name="clock" size={13} /></button>
                <button onClick={() => setViewFor(r)} title="Ver informe" style={actionBtn}><Icon name="eye" size={13} /></button>
                {isEditable(r.status) && (
                  <button
                    onClick={() => (r.status === "devuelto" ? setCorrectingFor(r) : onOpen(r))}
                    title={r.status === "devuelto" ? "Corregir" : "Editar"}
                    style={actionBtn}
                  >
                    <Icon name="edit" size={13} />
                  </button>
                )}
                <button onClick={() => downloadReportPdf(r, config, roleLabel)} title="Descargar PDF" style={actionBtn}><Icon name="fileText" size={13} /></button>
                <button onClick={() => downloadReportWord(r, config, roleLabel)} title="Descargar Word" style={actionBtn}><Icon name="book" size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Indicador de pasos ── */
function Stepper({ step, setStep }) {
  return (
    <div style={{ display: "flex", marginBottom: 26, borderBottom: "1px solid #f0f0f0", paddingBottom: 18 }}>
      {STEPS.map((label, i) => (
        <button
          key={label}
          onClick={() => setStep(i)}
          style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: i === step ? PRIMARY : i < step ? "#dcfce7" : "#f3f4f6",
            color: i === step ? "#fff" : i < step ? "#16a34a" : "#9ca3af",
            fontSize: 12, fontWeight: 700,
          }}>
            {i < step ? <Icon name="check" size={12} color="#16a34a" /> : i + 1}
          </div>
          <span style={{ fontSize: 10, fontWeight: i === step ? 700 : 500, color: i === step ? PRIMARY : "#9ca3af", textAlign: "center" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function MiInformeTab() {
  const { authUser } = useApp();
  // admin/desarrollador y las dos directoras no tienen un informe
  // "propio" — pueden elegir de cuál rol ver/crear informes, y son
  // quienes reciben y revisan (aceptan/devuelven) lo que envía cada
  // área operativa.
  const canManageAllRoles = ["admin", "desarrollador", "directora_tecnica", "directora_programatica"].includes(authUser.role);

  const [availableRoles, setAvailableRoles] = useState(null); // null = aún no se sabe (solo aplica a canManageAllRoles)
  const [selectedRole, setSelectedRole] = useState(null);
  const [config, setConfig] = useState(null);
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("inicio"); // "inicio" | "wizard"
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const {
    draft, setDraft, resetPeriodTypeTouched,
    onPeriodTypeSelect, onPeriodStartChange, onPeriodEndChange,
    setStat, setNarrative, getSeries, addSeriesRow, removeSeriesRow, setSeriesRow,
    addListItem, removeListItem, setListItem,
  } = useReportDraft(config, blankDraft());

  const effectiveRole = canManageAllRoles ? selectedRole : authUser.role;
  const roleLabel = canManageAllRoles ? (availableRoles?.find((r) => r.name === effectiveRole)?.label || effectiveRole) : effectiveRole;

  // admin/desarrollador: primero averiguar qué roles tienen informes
  // configurados, y elegir el primero por defecto.
  useEffect(() => {
    if (!canManageAllRoles) return;
    api.getAvailableReportRoles()
      .then((list) => { setAvailableRoles(list); setSelectedRole((r) => r || list[0]?.name || null); })
      .catch((e) => setError(e.message || "No se pudieron cargar los roles con informes"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    if (!effectiveRole) { setLoading(false); return; }
    setError("");
    setLoading(true);
    try {
      const [cfg, list] = await Promise.all([
        api.getReportConfig(effectiveRole),
        api.getReports(canManageAllRoles ? effectiveRole : undefined),
      ]);
      setConfig(cfg);
      setReports(list);
    } catch (e) {
      setError(e.message || "No se pudo cargar la configuración de informes");
    } finally {
      setLoading(false);
    }
  }, [effectiveRole, canManageAllRoles]);

  useEffect(() => { load(); setView("inicio"); }, [load]);

  const locked = !isEditable(draft.status);
  // Un borrador se puede guardar incompleto, pero enviarlo no: el
  // periodo es lo mínimo que el informe necesita para existir.
  const periodIncomplete = !draft.periodType || !draft.periodStart || !draft.periodEnd;

  const openNew = () => { setDraft(blankDraft()); setStep(0); setNotice(""); setError(""); setConfirmingSubmit(false); resetPeriodTypeTouched(); setView("wizard"); };
  // Borradores: entra directo al primer paso que le falte algo, no
  // siempre al 1. Los "devuelto" no pasan por acá — ver InformesInicio,
  // esos abren el modal de corrección sin pasos.
  const openReport = (r) => {
    const d = fromServer(r);
    setDraft(d);
    setStep(firstIncompleteStep(config, d));
    setNotice(""); setError(""); setConfirmingSubmit(false); resetPeriodTypeTouched(); setView("wizard");
  };

  // Solo tiene sentido si algún campo del informe declara "sourceType"
  // (ver reportFields.js) — es decir, si hay un expediente de atenciones
  // detrás que se pueda contar.
  const hasAttentionSources = !!config && (config.statFields.some((f) => f.sourceType) || (config.monthlyFields || []).some((f) => f.sourceType));

  // Cuenta los registros del expediente de atenciones (ver AttentionsTab)
  // en el periodo elegido y llena statFields/monthlyFields automáticamente.
  // Sigue siendo editable después, por si algo no quedó registrado ahí.
  const calculateFromAttentions = async () => {
    if (!draft.periodStart || !draft.periodEnd) { setError("Define primero el periodo (paso 1)"); return; }
    setCalculating(true);
    setError("");
    setNotice("");
    try {
      const statSources = config.statFields.filter((f) => f.sourceType);
      if (statSources.length) {
        const summary = await api.getAttentionSummary({ role: effectiveRole, periodStart: draft.periodStart, periodEnd: draft.periodEnd, granularity: "mensual" });
        setDraft((d) => {
          const stats = { ...d.stats };
          for (const f of statSources) stats[f.key] = summary[f.sourceType]?.count ?? 0;
          return { ...d, stats };
        });
      }
      for (const f of (config.monthlyFields || [])) {
        if (!f.sourceType) continue;
        const granularity = getSeries(f.key).granularity || "mensual";
        const summary = await api.getAttentionSummary({ role: effectiveRole, periodStart: draft.periodStart, periodEnd: draft.periodEnd, granularity });
        const rows = (summary[f.sourceType]?.series || []).map((s) => ({ label: formatBucketLabel(s.bucket, granularity), value: s.value }));
        setDraft((d) => ({ ...d, stats: { ...d.stats, [f.key]: { granularity, rows } } }));
      }
      setNotice("Totales calculados desde el expediente de atenciones. Puedes editarlos si algo no quedó registrado ahí.");
    } catch (e) {
      setError(e.message || "No se pudo calcular desde el expediente");
    } finally {
      setCalculating(false);
    }
  };

  const buildPayload = () => ({
    ...(canManageAllRoles && { role: effectiveRole }),
    periodType: draft.periodType, periodStart: draft.periodStart, periodEnd: draft.periodEnd,
    stats: cleanStats(config, draft.stats), narrative: draft.narrative,
  });

  // Un borrador se puede guardar aunque todavía le falten campos —
  // solo "Enviar informe" exige que el periodo esté completo. Devuelve
  // si se guardó bien, para que quien llama decida qué hacer después
  // (quedarse a seguir editando, o volver a la lista).
  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = buildPayload();
      const saved = draft.id ? await api.updateReport(draft.id, payload) : await api.createReport(payload);
      setDraft(fromServer(saved));
      load();
      return true;
    } catch (e) {
      setError(e.message || "No se pudo guardar");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // "Guardar borrador": guarda y regresa a la lista de informes, para
  // confirmar visualmente que quedó registrado.
  const saveAndClose = async () => {
    if (await save()) setView("inicio");
  };

  // Antes había que acordarse de darle "Guardar borrador"; ahora salir
  // del formulario sin enviarlo también guarda automáticamente lo que
  // ya se llenó (si hay algo que guardar y todavía se puede editar).
  const hasUnsavedContent = () =>
    !!draft.periodType || !!draft.periodStart || !!draft.periodEnd ||
    Object.values(draft.narrative || {}).some((v) => v?.trim()) ||
    Object.keys(draft.stats || {}).length > 0;

  const goBackToInicio = async () => {
    if (!locked && hasUnsavedContent()) {
      if (await save()) setView("inicio");
    } else {
      setView("inicio");
    }
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload();
      const saved = draft.id ? await api.updateReport(draft.id, payload) : await api.createReport(payload);
      const submitted = await api.submitReport(saved.id);
      setDraft(fromServer(submitted));
      setNotice("Informe enviado");
      load();
    } catch (e) {
      setError(e.message || "No se pudo enviar");
    } finally {
      setSaving(false);
    }
  };

  const reloadDraftAfterReview = async () => {
    const fresh = await api.getReports(canManageAllRoles ? effectiveRole : undefined);
    setReports(fresh);
    const updated = fresh.find((r) => r.id === draft.id);
    if (updated) setDraft(fromServer(updated));
  };

  // Selector de rol — solo admin/desarrollador, para poder entrar a
  // la vista de informes de cualquier rol operativo.
  const roleSelector = canManageAllRoles && availableRoles?.length > 0 && (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", background: "#f4f6f8", borderRadius: 8, border: "1px solid #e5e7eb" }}>
      <Icon name="users" size={14} color="#6b7280" />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Viendo informes de:</span>
      <select
        value={selectedRole || ""}
        onChange={(e) => { setSelectedRole(e.target.value); setView("inicio"); }}
        style={{ padding: "7px 12px", border: "1.5px solid #d0d7de", borderRadius: 7, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}
      >
        {availableRoles.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
      </select>
    </div>
  );

  if (loading) return <div>{roleSelector}<p style={{ color: "#9ca3af", fontSize: 13 }}>Cargando...</p></div>;

  if (canManageAllRoles && availableRoles?.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
        <Icon name="warning" size={36} color="#d1d5db" />
        <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>Todavía no hay ningún rol con formulario de informes configurado.</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div>
        {roleSelector}
        <div style={{ textAlign: "center", padding: "56px 24px", background: "#f9fafb", borderRadius: 12, border: "2px dashed #e0e0e0" }}>
          <Icon name="warning" size={36} color="#d1d5db" />
          <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 14 }}>Tu rol todavía no tiene un formulario de informes configurado.</p>
        </div>
      </div>
    );
  }

  if (view === "inicio") {
    return (
      <div>
        {roleSelector}
        <InformesInicio
          reports={reports} config={config} roleLabel={roleLabel} onOpen={openReport} onNew={openNew}
          canManageAllRoles={canManageAllRoles} effectiveRole={effectiveRole} onReload={load}
        />
      </div>
    );
  }

  const rowBtnStyle = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", color: "#6b7280", flexShrink: 0 };

  return (
    <div>
      {roleSelector}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={goBackToInicio} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6b7280", fontSize: 12, fontWeight: 600, cursor: saving ? "wait" : "pointer", padding: 0 }}>
          <Icon name="chevronDown" size={12} color="#6b7280" style={{ transform: "rotate(90deg)" }} /> Volver a mis informes
        </button>
        {draft.id && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => downloadReportPdf({ ...draft, report_code: draft.reportCode, period_type: draft.periodType, period_start: draft.periodStart, period_end: draft.periodEnd }, config, roleLabel)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              <Icon name="fileText" size={13} /> Descargar PDF
            </button>
            <button onClick={() => downloadReportWord({ ...draft, report_code: draft.reportCode, period_type: draft.periodType, period_start: draft.periodStart, period_end: draft.periodEnd }, config, roleLabel)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              <Icon name="book" size={13} /> Descargar Word
            </button>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 24 }}>
        {(draft.reportCode || draft.id) && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            {draft.reportCode && <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: .5 }}>{draft.reportCode}</span>}
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 12, background: `${STATUS_COLOR[draft.status]}15`, color: STATUS_COLOR[draft.status], border: `1px solid ${STATUS_COLOR[draft.status]}40` }}>
              {STATUS_LABEL[draft.status]}
            </span>
          </div>
        )}

        {draft.status === "devuelto" && draft.reviewComment && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 22 }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#991b1b" }}>Comentario de corrección</p>
            <p style={{ margin: 0, fontSize: 13, color: "#7f1d1d" }}>{draft.reviewComment}</p>
          </div>
        )}

        {canManageAllRoles && draft.status === "enviado" && (
          <ReviewPanel reportId={draft.id} onDone={reloadDraftAfterReview} />
        )}

        <Stepper step={step} setStep={setStep} />

        {/* Paso 1: Periodo */}
        {step === 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>TIPO DE PERIODO</label>
              <select value={draft.periodType} onChange={(e) => onPeriodTypeSelect(e.target.value)} disabled={locked} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Escoge un periodo...</option>
                {config.periodTypes.map((p) => <option key={p} value={p}>{PERIOD_LABEL[p]}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>DESDE</label>
              <input type="date" value={draft.periodStart} disabled={locked} onChange={(e) => onPeriodStartChange(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>HASTA</label>
              <input type="date" value={draft.periodEnd} disabled={locked} onChange={(e) => onPeriodEndChange(e.target.value)} style={inputStyle} />
            </div>
            <p style={{ flexBasis: "100%", margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>
              Si eliges el tipo de periodo primero, "hasta" se calcula solo al elegir "desde". Si prefieres escribir las fechas directamente, el tipo de periodo se detecta solo.
            </p>
          </div>
        )}

        {/* Paso 2: Descripción */}
        {step === 1 && (
          <NarrativeFieldsForm narrativeFields={config.narrativeFields} narrative={draft.narrative} setNarrative={setNarrative} locked={locked} />
        )}

        {/* Paso 3: Cifras del informe — totales, y detalle opcional para
            las categorías que el documento original pide desglosadas. */}
        {step === 2 && (
          <>
            {!locked && hasAttentionSources && (
              <CalculateFromAttentionsButton calculating={calculating} onClick={calculateFromAttentions} />
            )}

            {config.statFields.length === 0 && !(config.monthlyFields || []).length && !(config.listFields || []).length ? (
              <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Este rol no tiene cifras que reportar — el informe es solo narrativo.</p>
            ) : (
              <>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Totales del periodo</h3>
                <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9ca3af" }}>Un número por cada tipo de atención — obligatorio para todos.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: (config.monthlyFields?.length || config.listFields?.length) ? 32 : 0 }}>
                  {config.statFields.map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, lineHeight: 1.35, minHeight: 28 }}>{label}</label>
                      <input type="number" min="0" value={draft.stats[key] ?? ""} disabled={locked} onChange={(e) => setStat(key, e.target.value)} style={inputStyle} placeholder="0" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {(config.monthlyFields || []).map(({ key, label }) => {
              const series = getSeries(key);
              return (
                <div key={key} style={{ marginBottom: 28, paddingTop: 24, borderTop: "1px dashed #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Detalle opcional: {label}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, background: `${PRIMARY}12`, padding: "5px 10px", borderRadius: 6 }}>
                      Agrupado por {GRANULARITY_LABEL[series.granularity].toLowerCase()}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>
                    El total de arriba ya cuenta para el informe — esto es solo si además quieres mostrar cómo se repartió por {GRANULARITY_LABEL[series.granularity].toLowerCase()}. Se llena solo con "Calcular desde el expediente" (arriba), o agrega/edita renglones a mano.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                    {series.rows.map((row, i) => (
                      <div key={i} style={{ display: "flex", gap: 8 }}>
                        <input value={row.label} disabled={locked} onChange={(e) => setSeriesRow(key, i, "label", e.target.value)} placeholder={`Ej. ${series.granularity === "diario" ? "Lunes 5" : series.granularity === "semanal" ? "Semana 1" : "Enero"}`} style={{ ...inputStyle, flex: 1 }} />
                        <input type="number" min="0" value={row.value ?? ""} disabled={locked} onChange={(e) => setSeriesRow(key, i, "value", e.target.value)} placeholder="0" style={{ ...inputStyle, width: 100 }} />
                        {!locked && <button onClick={() => removeSeriesRow(key, i)} style={rowBtnStyle}><Icon name="trash" size={13} /></button>}
                      </div>
                    ))}
                  </div>
                  {!locked && (
                    <button onClick={() => addSeriesRow(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                      <Icon name="plus" size={12} /> Agregar {GRANULARITY_LABEL[series.granularity].toLowerCase()}
                    </button>
                  )}
                </div>
              );
            })}

            {(config.listFields || []).map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 24, paddingTop: 24, borderTop: "1px dashed #e5e7eb" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Detalle opcional: {label}</h3>
                <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9ca3af" }}>Esto no se calcula solo — el expediente no guarda los temas de cada taller, agrégalos a mano si quieres dejarlos anotados.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                  {(draft.stats[key] || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <input value={item} disabled={locked} onChange={(e) => setListItem(key, i, e.target.value)} placeholder="Ej. Inteligencia emocional" style={{ ...inputStyle, flex: 1 }} />
                      {!locked && <button onClick={() => removeListItem(key, i)} style={rowBtnStyle}><Icon name="trash" size={13} /></button>}
                    </div>
                  ))}
                </div>
                {!locked && (
                  <button onClick={() => addListItem(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                    <Icon name="plus" size={12} /> Agregar
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {/* Paso 4: Revisar y enviar */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#6b7280" }}>PERIODO</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#1a1a2e" }}>{PERIOD_LABEL[draft.periodType]} · {formatDate(draft.periodStart)} – {formatDate(draft.periodEnd)}</p>
            </div>
            {flattenNarrativeFields(config.narrativeFields).filter(({ key }) => draft.narrative[key]?.trim()).map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label.toUpperCase()}</p>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "#1a1a2e", whiteSpace: "pre-wrap" }}>{draft.narrative[key]}</p>
              </div>
            ))}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 18, paddingTop: 18, borderTop: "1px solid #f0f0f0" }}>
              {config.statFields.filter(({ key }) => draft.stats[key] !== undefined).map(({ key, label }) => (
                <div key={key}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: PRIMARY }}>{draft.stats[key]}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{label}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: "18px 0 0", fontSize: 12, color: "#9ca3af" }}>
              Revisa los pasos anteriores si falta algo. Al enviar, el informe queda pendiente de revisión y no se puede editar mientras tanto.
            </p>
          </div>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 18 }}>{error}</p>}
        {notice && <p style={{ color: "#16a34a", fontSize: 13, marginTop: 18 }}>{notice}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 24, paddingTop: 18, borderTop: "1px solid #f0f0f0" }}>
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "10px 18px", background: "#fff", color: step === 0 ? "#d1d5db" : "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: step === 0 ? "default" : "pointer" }}>
            ← Anterior
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            {!locked && (
              <button onClick={saveAndClose} disabled={saving} style={{ padding: "10px 18px", background: "#fff", color: PRIMARY, border: `1.5px solid ${PRIMARY}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                {saving ? "Guardando..." : "Guardar borrador"}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} style={{ padding: "10px 18px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Siguiente →
              </button>
            ) : !locked && (
              confirmingSubmit ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>No podrás editarlo mientras esté en revisión.</span>
                  <button onClick={() => setConfirmingSubmit(false)} disabled={saving} style={{ padding: "10px 14px", background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button onClick={() => { setConfirmingSubmit(false); submit(); }} disabled={saving} style={{ padding: "10px 18px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                    Confirmar envío
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {periodIncomplete && (
                    <span style={{ fontSize: 11, color: "#dc2626" }}>Completa el periodo (paso 1) para poder enviar</span>
                  )}
                  <button onClick={() => setConfirmingSubmit(true)} disabled={saving || periodIncomplete} title={periodIncomplete ? "Completa el tipo de periodo y las fechas en el paso 1" : undefined} style={{ padding: "10px 18px", background: periodIncomplete ? "#d1d5db" : PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : periodIncomplete ? "not-allowed" : "pointer" }}>
                    {draft.status === "devuelto" ? "Reenviar informe" : "Enviar informe"}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
