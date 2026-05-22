/**
 * Screenshot Capture Script
 *
 * Launches each project's dev server and captures screenshots
 * of key views for use in the portfolio.
 *
 * Usage: node scripts/capture-screenshots.mjs
 *
 * Prerequisites:
 * - Playwright installed (npm install -D playwright)
 * - Project dev servers must be configurable
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "..", "public", "images", "screenshots");

const projects = [
  {
    name: "ai-saas-landing",
    url: "http://localhost:3000",
    views: [
      { name: "hero", selector: "body", fullPage: false },
      { name: "features", selector: "body", fullPage: false },
    ],
  },
  {
    name: "exec-command-center",
    url: "http://localhost:3001",
    views: [
      { name: "dashboard", selector: "body", fullPage: true },
    ],
  },
  {
    name: "opencode-dash-v3",
    url: "http://localhost:5173",
    views: [
      { name: "dashboard", selector: "body", fullPage: true },
    ],
  },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const project of projects) {
    const projectDir = path.join(outputDir, project.name);
    fs.mkdirSync(projectDir, { recursive: true });

    console.log(`\n📸 Capturing: ${project.name}`);

    try {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
      });

      await page.goto(project.url, {
        waitUntil: "networkidle",
        timeout: 15000,
      });

      for (const view of project.views) {
        const outputPath = path.join(projectDir, `${view.name}.png`);
        await page.screenshot({
          path: outputPath,
          fullPage: view.fullPage,
        });
        console.log(`  ✓ ${view.name}.png`);
      }

      await page.close();
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  await browser.close();
  console.log("\n✅ Screenshot capture complete");
}

capture();
