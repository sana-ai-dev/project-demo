---
title: "Fixing the HTML Report Pipeline & Building a Link-in-Bio Landing Page"
date: "2026-05-20"
tags: ["HTML", "CSS", "React", "TikTok", "Landing Page", "shadcn"]
category: "TECH"
excerpt: "A dual-focus session: fixing a critical CSS inlining bug across 18 report files, then building a full React + shadcn link-in-bio landing page with 6 products and a redesigned 9-slide TikTok carousel."
---

## Part 1: The CSS Inlining Fix

### The Bug

All HTML reports were being generated with external `<link>` stylesheets. When users copy-pasted report content into emails, wikis, or other tools, the stylesheet path broke — rendering the content unstyled and unreadable.

Root cause: external CSS `<link>` tags can't resolve relative paths when pasted outside the project directory.

### The Fix

Inlined the CSS into every report file. This affected **18 files total**:

| File Type | Count |
|-----------|-------|
| Output reports (`07_Reports/output/*.html`) | 11 |
| Templates (`07_Reports/templates/*.html`) | 7 |

Font paths were also fixed during the process.

### Permanent Workflow Change

Both documentation files were updated to prescribe inlining as a standard step:

- `02_Workflows/html-report-generation.md` — workflow updated
- `.opencode/skills/html-reports/SKILL.md` — skill specification updated

**New rule**: ALL HTML reports must inline CSS going forward. No more external `<link>` tags.

---

## Part 2: Repurpose Link-in-Bio Landing Page

### The Product

@repurposewithai needed a **link-in-bio** landing page — a single page listing all Gumroad products, replacing the limited single-link TikTok bio.

### Tech Stack

- **React** + **Vite** — fast development build
- **shadcn/ui** — component library with dark theme
- **Tailwind CSS v4** — utility-first styling
- **Teal accent** (#14b8a6) — brand color

### Product Lineup (6 Items)

| Product | Price |
|---------|-------|
| TikTok Repurpose System | $29 |
| AI Prompts for Small Business | £12 |
| ADHD Digital Planner | £12 |
| 50 AI Prompts Bundle | £19 |
| Complete Toolkit Bundle | £27 |
| Custom Package | Contact |

### Design Decisions

- **Plain `<a>` tags** for links — dropped `ListBox` component, saving 110 KB
- **Dark theme** with teal accent — consistent with the @repurposewithai brand
- **?wanted=true** appended to all Gumroad URLs — direct checkout, no cart page
- **No glassmorphism, gradients, or glows** — clean dark backgrounds only

### Carousel Redesign

The product carousel was extended from 7 to **9 slides** with:

- **Slides 8–9**: Real sheet screenshots (Dashboard + Repurposing Engine) as social proof
- **Removed all glassmorphism** — clean dark backgrounds with teal accents
- **Re-rendered** all slides at 1080×1440 @ 2x

## Key Results

- **18 HTML files** fixed with inlined CSS
- **Workflow permanently updated** — future reports will inline CSS
- **Link-in-bio landing page** built with 6 products
- **9-slide carousel** with real screenshots for social proof
- **-110 KB** savings by dropping unnecessary components

## Takeaways

1. **Inline CSS or nothing.** External stylesheets break when content leaves the project.
2. **Clean dark backgrounds beat glassmorphism.** Less visual noise, more readability.
3. **Real screenshots convert better than mockups.** Social proof in slides 8–9 builds trust.
4. **Every KB counts on mobile.** Dropping ListBox saved 110 KB with no UX loss.
