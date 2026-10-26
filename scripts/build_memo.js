// Builds the formal PM memo (.docx) from a JSON content file.
// Usage: node build_memo.js <memo.json> <output.docx>
// Formatting is fixed here so every memo looks the same: Outfit font in
// black-grey, 1.5 line spacing, 3 pt before and after every paragraph.

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, WidthType, ShadingType, BorderStyle,
  Header, Footer, PageNumber,
} = require("docx");

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("Usage: node build_memo.js <memo.json> <output.docx>");
  process.exit(1);
}
const m = JSON.parse(fs.readFileSync(inPath, "utf8"));

const FONT = "Outfit";
const SPACING = { line: 360, before: 60, after: 60 }; // 1.5 lines, 3 pt = 60 twips
const TEXT_COLOR = "333333"; // black-grey body text
const HEADING_COLOR = "262626"; // slightly darker black-grey for titles and headings
const CONTENT_WIDTH = 9360; // US Letter, 1" margins
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

const DECISION_COLORS = {
  "GO": "D9EAD3",
  "NO-GO": "F4CCCC",
  "NEEDS MORE INFO": "FFF2CC",
};

// --- helpers -------------------------------------------------------------

// Supports **bold** spans inside plain strings.
function runs(text, base = {}) {
  return String(text ?? "").split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) =>
    part.startsWith("**") && part.endsWith("**")
      ? new TextRun({ ...base, text: part.slice(2, -2), bold: true })
      : new TextRun({ ...base, text: part })
  );
}
const p = (text, opts = {}) => new Paragraph({ children: runs(text, opts.run), ...opts.para });
const h1 = (text) => new Paragraph({ style: "Heading1", children: [new TextRun(text)] });
const h2 = (text) => new Paragraph({ style: "Heading2", children: [new TextRun(text)] });
const bullet = (text) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: runs(text) });
const numbered = (text) => new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: runs(text) });
const paras = (v) => (Array.isArray(v) ? v : [v]).filter(Boolean).map((t) => p(t));
const bullets = (v) => (v || []).map(bullet);

function cell(text, width, { header = false, fill } = {}) {
  return new TableCell({
    borders: BORDERS,
    width: { size: width, type: WidthType.DXA },
    shading: fill || header ? { fill: fill || "E8EAF0", type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({ children: runs(text, header ? { bold: true } : {}) })],
  });
}

// widths: relative weights, scaled to the content width
function table(headers, rows, weights) {
  const w = weights || headers.map(() => 1);
  const total = w.reduce((a, b) => a + b, 0);
  const widths = w.map((x) => Math.floor((x / total) * CONTENT_WIDTH));
  widths[widths.length - 1] += CONTENT_WIDTH - widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], { header: true })) }),
      ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, widths[i])) })),
    ],
  });
}

function decisionBox(decision, rationale) {
  const key = String(decision || "").toUpperCase();
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [new TableRow({ children: [new TableCell({
      borders: BORDERS,
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      shading: { fill: DECISION_COLORS[key] || "EEEEEE", type: ShadingType.CLEAR, color: "auto" },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [
        new Paragraph({ children: [new TextRun({ text: `DECISION: ${key}`, bold: true, size: 32 })] }),
        ...paras(rationale),
      ],
    })] })],
  });
}

const spacer = () => new Paragraph({ children: [] });

// --- document body -------------------------------------------------------

const children = [];
children.push(new Paragraph({ style: "Title", children: [new TextRun(m.title || "PM Memo")] }));

const meta = [
  ["To", m.to], ["From", m.from], ["Date", m.date],
  ["Idea source", m.source], ["Subject", m.subject],
].filter(([, v]) => v);
meta.forEach(([k, v]) => children.push(p(`**${k}:** ${v}`)));

children.push(spacer(), decisionBox(m.decision, m.decisionRationale), spacer());

if (m.bottomLine) { children.push(h1("Bottom Line"), ...paras(m.bottomLine)); }

children.push(h1("1. Problem Statement"), ...paras(m.problemStatement));
if (m.jtbd) children.push(p(`**Job to be done:** ${m.jtbd}`));
if (m.rootCause) children.push(h2("Why the problem exists"), ...paras(m.rootCause));

children.push(h1("2. Affected Users"), ...paras(m.affectedUsers?.summary));
if (m.affectedUsers?.segments?.length) {
  children.push(table(["Segment", "Size / reach", "How they feel the problem"],
    m.affectedUsers.segments.map((s) => [s.segment, s.size, s.pain]), [2, 2, 4]));
}

children.push(h1("3. Framework Scores"));
if (m.rice) {
  const r = m.rice;
  children.push(h2("RICE"));
  children.push(table(["Factor", "Score (1-10)", "Input", "Rationale"], [
    ["Reach", r.reach?.score, r.reach?.input, r.reach?.why],
    ["Impact", r.impact?.score, r.impact?.input, r.impact?.why],
    ["Confidence", r.confidence?.score, r.confidence?.input, r.confidence?.why],
    ["Effort", r.effort?.score, r.effort?.input, r.effort?.why],
  ].map((row) => row.map((c) => c ?? "")), [2, 1.5, 2, 4.5]));
  if (r.formula) children.push(p(`**RICE score:** ${r.formula}`));
  if (r.normalized != null) children.push(p(`**RICE on a 1-10 scale:** ${r.normalized}/10`));
}
if (m.scorecard?.length) {
  children.push(h2("Full scorecard"));
  children.push(table(["Dimension", "Score (1-10)", "Rationale"],
    m.scorecard.map((s) => [s.dimension, String(s.score), s.why]), [2.5, 1.5, 6]));
}
if (m.overall) children.push(p(`**Overall score:** ${m.overall}`));
if (m.quadrant) children.push(p(`**Value vs Effort:** ${m.quadrant}`));
if (m.kano) children.push(p(`**Kano category:** ${m.kano}`));

children.push(h1("4. Risks"));
if (m.risks?.length) {
  children.push(table(["Risk", "Likelihood", "Impact", "Mitigation / early signal"],
    m.risks.map((r) => [r.risk, r.likelihood, r.impact, r.mitigation]), [3.5, 1.5, 1.5, 4]));
}
if (m.premortem) children.push(h2("Pre-mortem: how this fails"), ...bullets(m.premortem));

children.push(h1("5. Alternatives Considered"));
if (m.alternatives?.headers && m.alternatives?.rows) {
  children.push(table(m.alternatives.headers, m.alternatives.rows));
}
if (m.alternatives?.notes) children.push(...paras(m.alternatives.notes));

if (m.mentalModels) {
  children.push(h1("6. Stress Test"));
  const mm = m.mentalModels;
  [["First principles", mm.firstPrinciples], ["Systems thinking", mm.systems],
   ["I am not the user", mm.notTheUser], ["Inversion", mm.inversion]]
    .filter(([, v]) => v).forEach(([k, v]) => children.push(p(`**${k}:** ${v}`)));
}

children.push(h1("7. Recommendation"), ...paras(m.recommendation));
if (m.pushback) children.push(h2("Message to the requester"), ...paras(m.pushback));
if (m.goCriteria?.length) children.push(h2("What would change this decision"), ...bullets(m.goCriteria));

if (m.validation?.length) children.push(h1("8. Validation Plan & Test Scenarios"), ...bullets(m.validation));

if (m.nextSteps?.length) {
  children.push(h1("9. Next Steps"));
  children.push(table(["Action", "Owner", "By when"],
    m.nextSteps.map((s) => [s.action, s.owner || "", s.due || ""]), [6, 2, 2]));
}
if (m.openQuestions?.length) children.push(h1("Open Questions & Assumptions"), ...m.openQuestions.map(numbered));

// --- document ------------------------------------------------------------

const heading = (id, name, size, color) => ({
  id, name, basedOn: "Normal", next: "Normal", quickFormat: true,
  run: { font: FONT, size, bold: true, color },
  paragraph: { spacing: SPACING, outlineLevel: id === "Heading1" ? 0 : 1, keepNext: true },
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: TEXT_COLOR }, paragraph: { spacing: SPACING } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal",
        run: { font: FONT, size: 44, bold: true, color: HEADING_COLOR }, paragraph: { spacing: SPACING } },
      heading("Heading1", "Heading 1", 30, HEADING_COLOR),
      heading("Heading2", "Heading 2", 24, HEADING_COLOR),
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "PM Memo: for review", size: 18, color: "808080" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, color: "808080" })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log(`Memo written to ${outPath}`);
});
