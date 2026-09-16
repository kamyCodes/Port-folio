import sharp from "sharp";
import fs from "fs";
import path from "path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#171a1f"/>
  <g fill="none" stroke="#06b6d4" stroke-width="8.5" stroke-linecap="round">
    <path d="M21 13v38"/>
    <path d="M25.5 32 45 15.5"/>
    <path d="M25.5 32 45 48.5"/>
  </g>
</svg>`;

function icoFromPngs(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4); // count

  const entries = [];
  const bodies = [];
  let offset = 6 + 16 * pngs.length;

  for (const { size, png } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(png.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    bodies.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...bodies]);
}

const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  // Render at 4x then downscale for smoother edges at small sizes.
  const big = await sharp(Buffer.from(svg)).resize(size * 4, size * 4).png().toBuffer();
  const png = await sharp(big).resize(size, size).png().toBuffer();
  pngs.push({ size, png });
}

const ico = icoFromPngs(pngs);
fs.writeFileSync(path.resolve("src/app/favicon.ico"), ico);
fs.writeFileSync(path.resolve("public/favicon.svg"), svg);
console.log(
  `Wrote src/app/favicon.ico (${ico.length} bytes, ${sizes.join("/")}px) and public/favicon.svg`,
);