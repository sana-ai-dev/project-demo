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

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const content = fs.readFileSync(path.join(blogDir, file), "utf8");
  const titleMatch = content.match(/^title:\s*"(.*?)"/m);
  const title = titleMatch ? titleMatch[1] : file.replace(/\.md$/, "");
  const initial = title.charAt(0).toUpperCase();
  const slug = file.replace(/\.md$/, "");
  const svgPath = path.join(outputDir, `${slug}.svg`);

  if (fs.existsSync(svgPath)) continue;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="675" viewBox="0 0 1080 675">
  <rect width="1080" height="675" fill="#F8F9FA"/>
  <text x="540" y="360" font-family="Archivo, sans-serif" font-size="200" font-weight="600" fill="#E4E4E7" text-anchor="middle" dominant-baseline="central">${initial}</text>
</svg>`;

  fs.writeFileSync(svgPath, svg, "utf8");
  console.log(`Generated: ${slug}.svg`);
}

console.log(`\nDone. ${files.length} placeholder(s) generated.`);
