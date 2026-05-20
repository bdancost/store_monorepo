// Script para gerar ícones PWA a partir de um SVG base
// Rode com: node scripts/generate-icons.mjs

import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG do ícone LUXTECH — hexágono dourado com raio
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4af37"/>
      <stop offset="100%" style="stop-color:#f5d56e"/>
    </linearGradient>
  </defs>
  <!-- Fundo escuro -->
  <rect width="512" height="512" rx="100" fill="#0a0a0f"/>
  <!-- Hexágono dourado -->
  <polygon
    points="256,80 432,176 432,336 256,432 80,336 80,176"
    fill="url(#gold)"
  />
  <!-- Raio branco no centro -->
  <text
    x="256"
    y="310"
    text-anchor="middle"
    font-size="220"
    font-family="system-ui"
    fill="#0a0a0f"
  >⚡</text>
</svg>
`;

const outputDir = join(__dirname, "../public/icons");
mkdirSync(outputDir, { recursive: true });

for (const size of sizes) {
  await sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toFile(join(outputDir, `icon-${size}x${size}.png`));

  console.log(`✅ Gerado: icon-${size}x${size}.png`);
}

console.log("\n🎉 Todos os ícones gerados em public/icons/");
