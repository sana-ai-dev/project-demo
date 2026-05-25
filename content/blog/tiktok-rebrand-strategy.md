---
title: "Building a TikTok Rebrand: From Strategy to First Carousel Post"
date: "2026-05-13"
tags: ["TikTok", "Branding", "Content Strategy", "HTML", "Carousel"]
category: "DESIGN"
excerpt: "Designed and executed a TikTok rebrand for PDC@sana.ai.dev, building the About Us identity anchor and the first content carousel — with a standardized workflow codifying every step."
---

## The Context

After the niche pivot to ADHD/Neurodivergent/Wellness, the TikTok account needed a **rebrand** — a new visual identity, new content strategy, and a repeatable build workflow.

## The Identity Anchor: About Us Carousel

The first post was the **About Us** carousel — the identity anchor that tells viewers who you are and why they should follow. This is the pinned post that shapes first impressions.

### Design Specs

| Property | Value |
|----------|-------|
| Canvas | 1080×1440px (3:4) |
| Style | v2 plain English, personal narrative |
| Audio | "Self Aware" by Temper City |
| Font | Clean sans-serif, large readable text |
| Palette | Brand colors from the new identity guide |

## The Workflow: Standardized Build Process

After building the About Us carousel, I codified the entire process into `02_Workflows/tiktok-rebrand-workflow.md` — a 5-phase workflow:

### Phase 1: Concept
- Define the hook (first 2 seconds)
- Write slide-by-slide narrative arc
- Source real, date-stamped references for any claims

### Phase 2: Build
- Create individual HTML slides (slide-01.html through slide-N.html)
- Apply frozen design specs (1080×1440, 3:4 ratio)
- Use consistent font sizing table

### Phase 3: Render
- Run Puppeteer screenshot script to convert HTML → PNG
- Verify each slide renders correctly

### Phase 4: Package
- Create `post-description.txt` with caption + 5 niche hashtags
- Select trending audio from Commercial Audio Library
- Package all 6 PNGs + description for upload

### Phase 5: Post & Promote
- Upload to TikTok with selected audio
- Pin identity anchor to profile
- Monitor views, saves, follows, link clicks

## The Content Carousel: 3 AI Prompts for Monday

The first content post following the About Us anchor was "3 AI Prompts You Can Use This Monday":

1. **Performance reviews** — sourced from Lattice (real publishing date)
2. **Inbox zero** — sourced from Mashable
3. **Week planning** — sourced from AIOpenLibrary

All three prompts include visible attribution to their sources — no made-up stats.

## Files Created

| File | Purpose |
|------|---------|
| `rebrand/friday-post/slide-01.html` through `slide-05.html` | Carousel slides |
| `rebrand/friday-post/slide-01.png` through `slide-05.png` | Rendered PNGs |
| `rebrand/friday-post/post-description.txt` | Caption + hashtags |
| `rebrand/friday-post/screenshot.cjs` | Puppeteer render script |
| `02_Workflows/tiktok-rebrand-workflow.md` | Standardized workflow |

## Key Decisions

| Decision | Why |
|----------|-----|
| v2 (plain English) style | More authentic, better engagement than formal tone |
| Real, dated sources | Builds trust — TikTok users check claims |
| "Self Aware" audio anchor | Consistent audio = brand recognition |
| 1080×1440 frozen | No more dimension debates |
| 5 niche hashtags per post | Researched, not guessed |

## Results

- **About Us carousel** ready for posting (pinned to profile)
- **Friday prompts carousel** ready as follow-up content
- **Standardized workflow** codified — future carousels follow the same 5 phases
- **Brand identity** established with consistent audio, visual, and tone

## Takeaways

1. **Identity anchors matter.** The About Us carousel is the first thing new visitors see — it must communicate value instantly.
2. **Source everything.** TikTok audiences are skeptical. A date-stamped source next to every claim builds credibility.
3. **Standardize early.** A workflow document executed 5 times prevents mistakes in the next 50.
4. **Plain English beats marketing speak.** v2 style outperformed the original formal tone in authenticity.
