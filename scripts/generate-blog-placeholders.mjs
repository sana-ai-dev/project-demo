/**
 * generate-blog-placeholders.mjs
 *
 * Generates SVG thumbnail files for blog posts at public/images/blog/{slug}.svg.
 * These serve as Open Graph images for social sharing and reference the same
 * hash-based pastel colour system as the inline BlogCard components.
 *
 * Usage: node scripts/generate-blog-placeholders.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "content", "blog");
const outputDir = path.join(__dirname, "..", "public", "images", "blog");

if (!fs.existsSync(blogDir)) {
  console.log("No content/blog directory found. Nothing to generate.");
  process.exit(0);
}

fs.mkdirSync(outputDir, { recursive: true });

/* ─── Hash & Pastel Engine (mirrors lib/blog-theme.ts) ─── */

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getPastel(slug, category) {
  const hue = djb2(slug) % 360;
  const saturation = category === "DESIGN" ? 32 : 25;
  const lightness = category === "DESIGN" ? 93 : 90;
  const bg = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const letterSat = Math.min(saturation + 15, 45);
  const letterLight = Math.max(lightness - 42, 35);
  const letterColor = `hsl(${hue}, ${letterSat}%, ${letterLight}%)`;

  let patternSvg;
  const hash = djb2(slug);

  if (category === "DESIGN") {
    const patterns = ["organic", "rings", "organic", "dots", "rings"];
    patternSvg = generatePatternSVG(patterns[hash % patterns.length], hue);
  } else {
    const patterns = ["geometric", "grid", "geometric", "dots", "grid"];
    patternSvg = generatePatternSVG(patterns[hash % patterns.length], hue);
  }

  return { bg, letterColor, patternSvg };
}

function generatePatternSVG(type, hue) {
  const patternColor = `hsla(${hue}, 33%, 80%, 0.2)`;
  const patternColor2 = `hsla(${hue}, 33%, 80%, 0.12)`;

  const patterns = {
    geometric: `
      <g fill="none" stroke="${patternColor}" stroke-width="2">
        <path d="M140 60 L280 20 L420 60 L280 100 Z"/>
        <path d="M540 280 L660 240 L780 280 L660 320 Z"/>
        <line x1="80" y1="280" x2="220" y2="120"/>
        <line x1="860" y1="80" x2="980" y2="260"/>
        <polygon points="440,200 500,140 560,200 500,260"/>
        <polygon points="680,80 720,40 760,80 720,120" fill="${patternColor2}"/>
        <polygon points="200,340 230,310 260,340 230,370" fill="${patternColor2}"/>
      </g>`,

    organic: `
      <g fill="none" stroke="${patternColor}" stroke-width="2">
        <path d="M100 260 C160 160 260 140 340 200 C420 260 540 220 600 140"/>
        <path d="M680 100 C760 60 880 80 960 160"/>
        <path d="M80 100 C140 60 220 80 280 140 C340 200 280 240 220 220"/>
        <path d="M780 280 C840 320 920 340 1000 280"/>
        <circle cx="450" cy="100" r="4" fill="${patternColor}"/>
        <circle cx="250" cy="320" r="3" fill="${patternColor}"/>
        <circle cx="900" cy="60" r="3.5" fill="${patternColor2}"/>
        <circle cx="600" cy="300" r="2.5" fill="${patternColor2}"/>
      </g>`,

    dots: `
      <g fill="${patternColor}">
        <circle cx="80" cy="60" r="5"/>
        <circle cx="240" cy="40" r="3.5"/>
        <circle cx="440" cy="90" r="6"/>
        <circle cx="660" cy="50" r="4"/>
        <circle cx="880" cy="80" r="5.5"/>
        <circle cx="160" cy="220" r="4"/>
        <circle cx="360" cy="280" r="3"/>
        <circle cx="560" cy="240" r="5"/>
        <circle cx="760" cy="300" r="3.5"/>
        <circle cx="100" cy="360" r="3"/>
        <circle cx="500" cy="360" r="4"/>
        <circle cx="920" cy="340" r="5"/>
      </g>
      <g fill="${patternColor2}">
        <circle cx="320" cy="160" r="2.5"/>
        <circle cx="720" cy="170" r="3"/>
        <circle cx="920" cy="180" r="2"/>
      </g>`,

    grid: `
      <g fill="none" stroke="${patternColor}" stroke-width="2">
        <rect x="80" y="50" width="10" height="10" rx="1.5"/>
        <circle cx="260" cy="55" r="5" fill="${patternColor}"/>
        <line x1="420" y1="50" x2="420" y2="70"/>
        <line x1="410" y1="60" x2="430" y2="60"/>
        <rect x="600" y="50" width="10" height="10" rx="1.5"/>
        <circle cx="800" cy="55" r="5" fill="${patternColor}"/>
        <circle cx="160" cy="200" r="5" fill="${patternColor}"/>
        <line x1="340" y1="195" x2="340" y2="215"/>
        <line x1="330" y1="205" x2="350" y2="205"/>
        <rect x="500" y="195" width="10" height="10" rx="1.5"/>
        <line x1="700" y1="195" x2="700" y2="215"/>
        <line x1="690" y1="205" x2="710" y2="205"/>
        <circle cx="900" cy="200" r="5" fill="${patternColor}"/>
        <rect x="240" y="320" width="10" height="10" rx="1.5"/>
        <circle cx="460" cy="325" r="5" fill="${patternColor2}"/>
        <line x1="660" y1="320" x2="660" y2="340"/>
        <line x1="650" y1="330" x2="670" y2="330"/>
      </g>`,

    rings: `
      <g fill="none" stroke="${patternColor}" stroke-width="1.5">
        <circle cx="160" cy="140" r="55"/>
        <circle cx="160" cy="140" r="35"/>
        <circle cx="160" cy="140" r="15"/>
        <circle cx="540" cy="200" r="70"/>
        <circle cx="540" cy="200" r="45"/>
        <circle cx="540" cy="200" r="20"/>
        <circle cx="920" cy="140" r="60"/>
        <circle cx="920" cy="140" r="38"/>
        <circle cx="920" cy="140" r="18"/>
        <circle cx="340" cy="320" r="35"/>
        <circle cx="340" cy="320" r="18"/>
        <circle cx="740" cy="300" r="40"/>
        <circle cx="740" cy="300" r="20"/>
        <circle cx="80" cy="340" r="25"/>
        <circle cx="80" cy="340" r="10"/>
      </g>`,
  };

  return patterns[type] || patterns.geometric;
}

/* ─── Generate SVGs ─── */

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
let generated = 0;
let skipped = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(blogDir, file), "utf8");
  const titleMatch = content.match(/^title:\s*"(.*?)"/m);
  const categoryMatch = content.match(/^category:\s*"(.*?)"/m);
  const title = titleMatch ? titleMatch[1] : file.replace(/\.md$/, "");
  const category = categoryMatch ? categoryMatch[1] : "TECH";
  const initial = title.charAt(0).toUpperCase();
  const slug = file.replace(/\.md$/, "");
  const svgPath = path.join(outputDir, `${slug}.svg`);

  if (fs.existsSync(svgPath)) {
    skipped++;
    continue;
  }

  const { bg, letterColor, patternSvg } = getPastel(slug, category);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="675" viewBox="0 0 1080 675">
  <rect width="1080" height="675" fill="${bg}"/>
  ${patternSvg}
  <text x="540" y="360" font-family="Archivo, sans-serif" font-size="200" font-weight="600" fill="${letterColor}" text-anchor="middle" dominant-baseline="central" opacity="0.6">${initial}</text>
</svg>`;

  fs.writeFileSync(svgPath, svg, "utf8");
  generated++;
  console.log(`Generated: ${slug}.svg (${category}, hue=${djb2(slug) % 360})`);
}

console.log(`\nDone. ${generated} new / ${skipped} skipped (already exist).`);
