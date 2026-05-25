---
title: "Polishing & Distributing the Prompt Finder Tool"
date: "2026-05-23"
tags: ["Python", "Tool", "Distribution", "HTML", "Carousel", "TikTok"]
category: "TECH"
excerpt: "Finalised the Prompt Finder tool for distribution — added proper footer, created a zip package, added portfolio project entry, and built a 7-slide TikTok carousel to promote it."
---

## The Tool

[Prompt Finder](https://github.com/sana-ai-dev/prompt-finder) is a searchable HTML gallery of AI prompts, designed for creators and professionals who need the right prompt fast. All data is inlined as JSON — no server needed, works as a standalone HTML file.

## What Was Done

### 1. Footer Addition

Both HTML files received a proper footer with:

- Tool attribution and version
- "Built by sana.ai.dev" branding
- Social/portfolio links
- Clean styling matching the dark futuristic theme

### 2. Bug Fixes

The `generate_index.py` script had bugs in the footer CSS/HTML output. These were fixed and both `index.html` and `prompt-gallery.html` were regenerated.

### 3. Distribution Package

Created `prompt-finder.zip` containing:

```
prompt-finder/
├── index.html              — Main search interface
├── prompt-gallery.html     — Browse-all gallery view
├── generate_index.py       — Generator script (for customisation)
└── README.md               — Setup and usage instructions
```

Both HTML files are fully self-contained with data inlined as JSON. No server required — open directly in a browser.

### 4. Portfolio Addition

Added as a new project entry:

- `content/projects/prompt-finder.yaml` — project metadata and case study
- `public/images/screenshots/prompt-finder/search.svg` — SVG placeholder

### 5. TikTok Carousel

Built a 7-slide carousel to promote Prompt Finder on TikTok:

| Slide | Content |
|-------|---------|
| 1 | Hook — "Stop writing prompts from scratch" |
| 2 | The problem — Prompt fatigue |
| 3 | The tool — Searchable prompt gallery |
| 4 | Feature highlight — Categories + search |
| 5 | Feature highlight — Copy with one click |
| 6 | Use case — Save hours weekly |
| 7 | CTA — Link in bio |

The carousel uses a **dark futuristic SaaS palette with terminal-card layout** — a style guide hybrid that looks premium while staying on-brand.

### Design Hybrid

The carousel blends two aesthetics:
- **Dark futuristic SaaS** — deep backgrounds, vibrant accents, clean typography
- **Terminal card layout** — code-inspired card frames, monospace accents, subtle grid lines

This creates a distinctive look that signals "tech/AI tool" while remaining approachable.

## Key Technical Details

- **Self-contained HTML** — both files work offline, no CDN dependencies
- **Data inlined as JSON** — no API calls, instant load
- **Cloudflare-ready** — deploy as static files, zero configuration
- **Carousel at 1080×1440** — TikTok 3:4 format, rendered at 2x

## Key Results

- **Tool polished** with footer and bug fixes
- **Distribution package** ready for sharing
- **Portfolio entry** added with full case study
- **7-slide TikTok carousel** built for promotion
- **Self-contained distribution** — unzip and use, no setup

## Takeaways

1. **Self-contained tools are the most portable.** No server, no install, no dependencies.
2. **A zip package makes sharing professional.** One file instead of "download these 4 things."
3. **Footer branding turns a tool into a portfolio piece.** Every generated page is a marketing touchpoint.
4. **Carousel style can hybridize.** Dark SaaS + terminal cards = distinctive and recognizable.
