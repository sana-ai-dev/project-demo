---
title: "Launching a TikTok Brand Sprint: From Carousels to Cheat Sheets"
date: "2026-05-19"
tags: ["TikTok", "Brand Launch", "Carousel", "HTML", "Cheat Sheet", "Marketing"]
category: "DESIGN"
excerpt: "A full brand launch sprint for @repurposewithai — building an About Me carousel, product carousel, cheat sheet lead magnet, and automated email delivery system."
---

## The Sprint

After the brand strategy session, the execution sprint focused on building everything needed for the launch: identity carousel, product carousel, lead magnet, and delivery automation.

## Decision: Rename Instead of New Account

The original plan was to create a brand-new TikTok account via Chrome Guest Mode. But a faster approach emerged: **rename the existing account to @repurposewithai**. This saved the warmup period and leveraged existing (minimal) account history.

## The Carousels

### 1. About Me Carousel (7 slides)

The identity anchor for the new brand:

1. **Hook** — "I turn 1 piece of content into 10 with AI"
2. **The problem** — Creating content for every platform is exhausting
3. **The solution** — Systematic repurposing with AI tools
4. **How it works** — 4-step repurposing framework
5. **Example** — Blog post → 10 pieces of content
6. **Social proof** — Results from the system
7. **CTA** — "Follow for daily repurposing tips"

### 2. Product Carousel (7 slides)

The first product launch:

1. **Hook** — "Stop creating from scratch. Start repurposing."
2. **What's included** — The Repurpose System
3. **Feature 1** — Content transformation templates
4. **Feature 2** — AI prompt library
5. **Feature 3** — Platform-by-platform guide
6. **Bonus** — Setup guide PDF
7. **CTA** — Link in bio ($29)

### 3. Pivot Slide (Single Video)

A standalone video announcing the account direction change — kept separate from the carousel since it's a different format.

## Lead Magnet: Repurpose Cheat Sheet

A single-page HTML cheat sheet with the core repurposing workflow, designed as a free download:

- **Visual workflow** — Step-by-step repurposing process
- **Includes live prompt example** — Drives conversion to the $29 product
- **Beautiful HTML design** — Branded with the repurpose color palette
- **Delivered via DM** — User comments "system" → automated cheat sheet link

## Automation: Email Delivery System

Built a full email delivery system using Python:

| Component | File |
|-----------|------|
| SMTP sender | `.opencode/scripts/sendmail.py` |
| Command wrapper | `.opencode/commands/sendmail.md` |
| App password | Stored in gitignored script (not env vars) |

Security decision: the app password is stored in a gitignored Python file rather than environment variables or credential managers, keeping it out of the repo while staying accessible to the builder agent.

## Files Created

| File | Purpose |
|------|---------|
| `about-me-carousel/slide-1..7.html` + PNGs | Identity carousel |
| `product-carousel/slide-1..7.html` + PNGs | Product carousel |
| `pivot-slide.html` + PNG | Direction change announcement |
| `repurpose-cheatsheet.html` + PNG | Free lead magnet |
| `sendmail.py` + `sendmail.md` | Email delivery system |
| `Platform-Bios.md` | Bios for 5 platforms |
| `Setup-Guide.pdf` | Product bonus |

## Key Results

- **7-slide About Me carousel** — identity anchor for the brand
- **7-slide Product carousel** — $29 product launch
- **Pivot slide** — account direction change announcement
- **Cheat sheet lead magnet** — drives comment engagement → DM delivery
- **Email automation** — Python script for cheat sheet delivery
- **Complete launch package** ready for posting

## Takeaways

1. **Renaming an existing account is faster than starting fresh.** No warmup needed.
2. **Lead magnets should preview the paid product.** The cheat sheet includes a live example that only works with the full system.
3. **Email delivery can be simple.** A gitignored Python script with an app password is enough for launch.
4. **Pivot slides work better as single videos.** Carousels are for education; video is for announcements.
5. **Post order matters.** Pivot → About Me → Product builds a narrative arc.
