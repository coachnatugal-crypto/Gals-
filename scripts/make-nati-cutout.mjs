import sharp from "sharp";
import fs from "fs";

const input = "public/media/alimentacion/nati-waffle.png";
const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.from(data);
let transparent = 0;
for (let i = 0; i < out.length; i += 4) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const lum = (r + g + b) / 3;
  if (lum < 22) {
    out[i + 3] = 0;
    transparent++;
  } else if (lum < 48) {
    out[i + 3] = Math.min(out[i + 3], Math.round(((lum - 22) / 26) * 255));
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile("public/media/tree/nati-cutout.png");

console.log({
  w: info.width,
  h: info.height,
  transparent,
  size: fs.statSync("public/media/tree/nati-cutout.png").size,
});
