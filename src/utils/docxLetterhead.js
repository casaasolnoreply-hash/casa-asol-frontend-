// Encabezado y pie institucional compartido entre el Word del informe
// (MiInformeTab.downloadReportWord) y el Word del documento trabajado en
// el editor (DocumentEditor) — mismo logo, mismo diseño, un solo lugar
// para los dos. Recibe el módulo "docx" ya importado (siempre se carga
// con `await import("docx")`, nunca estático — ver comentario en
// MiInformeTab.jsx) para no duplicar esa carga aquí.
export function buildLetterhead(docxModule, { title, siteName = "Casa ASOL", logoBase64 }) {
  const {
    Header, Footer, Table, TableRow, TableCell, WidthType, VerticalAlign,
    BorderStyle, Paragraph, TextRun, ImageRun, AlignmentType, PageNumber,
  } = docxModule;
  const FONT = "Arial";
  const run = (text, extra = {}) => new TextRun({ text, font: FONT, size: 24, ...extra });

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const logoBytes = Uint8Array.from(atob(logoBase64), (c) => c.charCodeAt(0));

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
            new Paragraph({ children: [run(siteName, { bold: true, size: 22 })] }),
            new Paragraph({ children: [run(title, { size: 18, color: "6b7280" })] }),
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

  return { header, footer };
}
