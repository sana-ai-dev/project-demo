import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(__dirname, "..", "public", "images", "screenshots");

const projects = {
  "ai-saas-landing": { color: "#2563EB", icon: "◈", views: ["hero", "features"] },
  "council-system": { color: "#7C3AED", icon: "◆", views: ["architecture", "review"] },
  "project-vantage": { color: "#059669", icon: "▲", views: ["pipeline", "dashboard"] },
  "exec-command-center": { color: "#DC2626", icon: "■", views: ["dashboard"] },
  "lead-scout": { color: "#D97706", icon: "●", views: ["cli"] },
  "opencode-dash-v3": { color: "#0891B2", icon: "◆", views: ["dashboard"] },
  "tiktok-marketing": { color: "#DB2777", icon: "★", views: ["carousel", "brand-guide"] },
  "voice-companion": { color: "#7C3AED", icon: "♢", views: ["design"] },
  "html-to-pdf-renderer": { color: "#4B5563", icon: "▣", views: ["output"] },
  "n8n-workflows": { color: "#EA580C", icon: "⚡", views: ["workflow"] },
};

function genSvg(name, view, color, icon) {
  const label = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0.02" />
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="#F8F9FA"/>
  <rect width="1200" height="750" fill="url(#bg)"/>
  <line x1="0" y1="0" x2="1200" y2="750" stroke="${color}15" stroke-width="1"/>
  <line x1="1200" y1="0" x2="0" y2="750" stroke="${color}15" stroke-width="1"/>
  <text x="600" y="340" font-family="Archivo, sans-serif" font-size="64" font-weight="600" fill="${color}" text-anchor="middle">${icon}</text>
  <text x="600" y="410" font-family="Space Grotesk, sans-serif" font-size="28" font-weight="600" fill="#0A0A0B" text-anchor="middle">${label}</text>
  <text x="600" y="442" font-family="Space Grotesk, sans-serif" font-size="15" fill="#52525B" text-anchor="middle">View: ${view}</text>
  <rect x="0" y="0" width="1200" height="750" fill="none" stroke="${color}20" stroke-width="2" rx="12"/>
</svg>`;
}

for (const [name, p] of Object.entries(projects)) {
  const dir = path.join(base, name);
  fs.mkdirSync(dir, { recursive: true });
  for (const view of p.views) {
    const svg = genSvg(name, view, p.color, p.icon);
    fs.writeFileSync(path.join(dir, `${view}.png`), svg);
    console.log(`Created: ${name}/${view}.png`);
  }
}
