---
title: "Building a Lead Scout Operations Dashboard with Dynamic Pricing"
date: "2026-05-21"
tags: ["Dashboard", "Python", "Lead Generation", "Pricing", "Automation", "API"]
category: "TECH"
excerpt: "Developed an operations dashboard for the Lead Scout system with dynamic pricing tiers, build progress tracking, help modal, and automated lead-to-website pipeline documentation."
---

## The Context

Lead Scout is an automated lead generation and website building system. The operations dashboard (`ops.html`) needed a major upgrade to handle the launch phase — tracking builds, displaying pricing, and documenting the sales workflow.

## What Was Built

### 1. Operations Dashboard Upgrades

The `ops.html` dashboard received several new features:

- **Build modal** — checklist-based progress tracking with step-by-step status
- **Help guide** — "?" modal with documentation (Option A chosen over inline help)
- **Dynamic stats** — live build counts, lead metrics, and conversion data
- **Price display** — updated pricing with launch badge

### 2. Pricing Strategy (Option B)

| Tier | Price | First 10 |
|------|-------|----------|
| **Basic** | £199 | £99 (50% off) |
| **Pro** | £399 | £199 (50% off) |
| **Enterprise** | £799 | £399 (50% off) |

The "first 10 at 50% off" strategy creates urgency while building social proof. A launch badge in the hero section highlights the promotion.

### 3. API Route Additions

New endpoints in `lead-scout/serve.py`:

- `/api/build` — trigger a new build with lead data
- `/api/stats` — return build statistics and metrics
- Rating filter fix — corrected hardcoded CSS selector approach

### 4. Documentation Suite

Four new report-style HTML docs created:

| Doc | Purpose |
|-----|---------|
| `docs/workflow.html` | Full lead generation workflow |
| `docs/sales.html` | Sales process and conversion |
| `docs/packages.html` | Package comparison and pricing |
| `docs/delivery.html` | Delivery timeline and process |

### 5. Build Website Script Enhancement

Added `--ids` flag to `lead-website-builder/build_website.py`, enabling batch building by lead ID instead of rebuilding the entire queue.

## Architecture

```
Lead Scout Pipeline
    │
    ├── Scout (scrape leads)
    ├── Analyze (score + qualify)
    ├── Build (generate websites)
    └── Email (deliver to client)
        │
        └── ops.html dashboard
            ├── Build modal (progress)
            ├── Help guide (docs)
            ├── Dynamic stats (metrics)
            └── Price display (tiers)
```

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Help via "?" modal (Option A) | Less layout disruption than a sidebar |
| Build modal with checklists | Clearer than dropdown menus |
| Keep both .md and .html docs | .md for GitHub, .html for client viewing |
| `--ids` flag for batch building | More targeted than full rebuilds |
| First 10 at 50% off | Creates urgency + social proof |

## Key Results

- **Operations dashboard** upgraded with build tracking and dynamic stats
- **Pricing strategy** set with launch promotion
- **4 new HTML docs** covering the full sales pipeline
- **API routes** added for build and stats
- **Batch building** with `--ids` flag for targeted processing

## Takeaways

1. **Dashboards should show build progress.** A checklist modal is clearer than status tags.
2. **Launch pricing needs urgency.** "First 10 at 50% off" converts better than a flat discount.
3. **Parallel doc formats serve different audiences.** .md for developers, .html for clients.
4. **API endpoints should return stats.** Build metrics help track system health at a glance.
