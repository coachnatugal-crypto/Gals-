import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import convert from "heic-convert";

const dir = process.argv[2];

if (!dir) {
  console.error("Uso: node scripts/heic-to-jpg.mjs <carpeta>");
  process.exit(1);
}

const files = (await readdir(dir)).filter((f) => /\.heic$/i.test(f));

for (const file of files) {
  const input = await readFile(path.join(dir, file));
  const output = await convert({ buffer: input, format: "JPEG", quality: 0.9 });
  const target = path.join(dir, `${path.basename(file, path.extname(file))}.jpg`);
  await writeFile(target, Buffer.from(output));
  console.log(`ok: ${file} -> ${path.basename(target)}`);
}
