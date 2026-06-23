---
title: "Week in Review: Design System Evolution & TikTok Content Strategy"
date: "2026-05-11"
tags: ["Design Systems", "CSS", "TikTok", "Content Strategy", "Carousel", "HTML"]
category: "DESIGN"
excerpt: "A productive stretch covering HTML report design system upgrades, ADHD digital planner carousels, AI prompts for small business, and a viral 'Rate My Face' TikTok carousel."
---

## Overview

This three-day sprint (May 10–11) spanned two parallel tracks: refining the HTML report design system and building TikTok carousel content for multiple niches.

---

## Track 1: HTML Report Design System v1.1.0

The report generation CSS was upgraded from v1.0.0 to v1.1.0 with significant improvements:

### New CSS Components

| Component | Purpose |
|-----------|---------|
| `.cover-card` | Hero section for report covers |
| `.metric-row` | Horizontal KPI display |
| `.badge` system | Priority/status indicators |
| `.timeline-compact` | Denser session timelines |
| `.stat-grid` | 2×2 stat cards for quick stats |

### Files Updated

- `07_Reports/css/report-styles.css` — +200 lines of new components
- `07_Reports/templates/daily.html` — restructured to PDC layout
- `02_Workflows/html-report-generation.md` — workflow documentation updated
- `.opencode/skills/html-reports/SKILL.md` — 6 new components added, renumbered
- `03_Knowledge_Base/design-system-html-reports.md` — grew from 18 to 23 components

The new components make reports more scannable with visual metrics, compact timelines, and consistent badge styling.

---

## Track 2: ADHD Digital Planner Launch Carousel

Built a 7-slide HTML carousel for the ADHD Digital Planner product:

- **Pure HTML/CSS** — Rejected Canva as "low class"; all slides hand-coded
- **Warm editorial design** — DM Serif Display headings, Inter body, cream/lavender/navy palette
- **Emotional Before/After** storytelling format
- **Soft piano audio** selected for emotional resonance
- 7 individual slides + generator script created

The TikTok README was completely rewritten to pivot from IT/tech niches (AI Prompts, Career Pivot, n8n) to ADHD/Neurodivergent/Wellness, with updated content angles, hashtag strategy, and conversion funnel.

---

## Track 3: AI Prompts for Small Business

Created a product: **50 AI Prompts for Small Business**, curated across 7 categories:

| Category | Prompts |
|----------|---------|
| Marketing & Content | 10 |
| Customer Service | 7 |
| Sales & Lead Gen | 8 |
| Operations & Admin | 7 |
| Finance & Invoicing | 6 |
| Strategy & Planning | 6 |
| HR & Hiring | 6 |

The cover uses a **terminal window frame** with traffic light dots and animated cursor — a design bridge between warm editorial and tech aesthetics. Priced at £12 Basic / £19 Pro / £27 Bundle.

A companion **Terminal Aesthetic Carousel** was researched and built using Catppuccin Mocha (the 2026 industry standard for beautiful terminals — not the cliché green-on-black Matrix look).

---

## Track 4: "Rate My Face" Trump Carousel

A viral-format carousel asking "ChatGPT, rate my face objectively" applied to famous faces:

- **7 slides** with AI-powered facial analysis framing
- **Styled ChatGPT screenshots** (not real — designed for visual impact)
- **Headless Playwright** capture scripts for PNG rendering
- Created a reusable `tiktok-carousel-workflow.md` for future builds

### Strategic Insights

The long-term niche strategy emerged: bridge from viral "AI rates your face" content to **"AI optimises your life"** — using the same terminal aesthetic but transitioning from facial analysis to productivity/wellness tools.

**Winning principles:**
- Every slide must teach, entertain, or surprise
- Interactive CTA ("Drop 'prompt' in comments") drives engagement
- Terminal aesthetic is the brand identifier
- Faceless is a constraint, not a limitation
- Headless Playwright node scripts only (no interactive browser)

---

## Key Results

- **7+ new CSS components** for the report design system
- **7 slides** for ADHD Digital Planner (HTML, no Canva)
- **50 AI prompts** curated across 7 business categories
- **7 slides** for "Rate My Face" viral carousel
- **TikTok README** completely rewritten for ADHD niche
- **Terminal aesthetic carousel** with Catppuccin Mocha palette

## Takeaways

1. **Design systems evolve fast.** v1.0.0 to v1.1.0 in a single session with +200 lines.
2. **HTML beats Canva.** Custom-coded slides look more premium and are fully controllable.
3. **Terminal aesthetics are having a moment.** Catppuccin Mocha is the 2026 standard — not green-on-black.
4. **Viral formats build audience; valuable content builds business.** The bridge between them is the strategy.
