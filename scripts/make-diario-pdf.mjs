import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

const out = path.join(
  process.cwd(),
  "public/media/alimentacion/diario-sintomas.pdf",
);

const pdf = await PDFDocument.create();
const page = pdf.addPage([612, 792]);
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.1, 0.16, 0.21);
const blue = rgb(0.33, 0.41, 0.58);
const muted = rgb(0.36, 0.42, 0.47);
const lineColor = rgb(0.85, 0.78, 0.72);

let y = 740;
page.drawText("DIARIO", { x: 50, y, size: 28, font: bold, color: blue });
y -= 28;
page.drawText("Reintroduccion de alimentos · Body In Flow", {
  x: 50,
  y,
  size: 11,
  font,
  color: muted,
});
y -= 36;

page.drawText("Clara de huevo:", {
  x: 50,
  y,
  size: 11,
  font: bold,
  color: blue,
});
y -= 16;
const noteLines = [
  "La reintroduccion del huevo debe hacerse por separado, ya que en muchos",
  "casos lo que mas genera inflamacion son las claras y no las yemas.",
];
for (const line of noteLines) {
  page.drawText(line, { x: 50, y, size: 10, font, color: ink });
  y -= 14;
}
y -= 24;

for (const day of [1, 2, 3]) {
  page.drawText(`Dia ${day}`, { x: 50, y, size: 16, font: bold, color: blue });
  y -= 18;
  page.drawText("SINTOMAS?", { x: 50, y, size: 10, font: bold, color: muted });
  y -= 16;
  for (let i = 0; i < 4; i++) {
    page.drawLine({
      start: { x: 50, y },
      end: { x: 560, y },
      thickness: 0.8,
      color: lineColor,
    });
    y -= 22;
  }
  y -= 14;
}

page.drawText("Tu coach, Nati · Metodo Body In Flow / GAL'S Studio", {
  x: 50,
  y: 42,
  size: 9,
  font,
  color: muted,
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, await pdf.save());
console.log("wrote", out, fs.statSync(out).size);
