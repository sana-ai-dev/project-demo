---
title: "Revamping the OW2 Hero Picker with a Multi-Agent Code Review"
date: "2026-05-13"
tags: ["Web App", "Code Review", "AI Agents", "HTML", "CSS", "JavaScript"]
category: "TECH"
excerpt: "A full revamp of the OW2 Hero Picker app guided by three specialized AI reviewers — covering data deduplication, responsive UI, image fallbacks, and GPU-composited animations."
---

## The Problem

The OW2 Hero Picker app had accumulated several issues:

- **Data duplication** — Sierra and Freja had overlapping entries
- **Hitscan type conflation** — heroes with different weapon types were misclassified
- **Blank image placeholders** — missing hero images showed nothing
- **No responsive design** — the UI broke on mobile screens
- **No deploy pipeline** — outdated build artifacts in the repo

Rather than diving in blind, I ran the project through a **council review** first.

## The Council Review

Three specialized AI agents analyzed the codebase before any changes:

### Council-Architect

Identified structural issues:
- Data model had redundant fields
- Image loading was synchronous with no fallbacks
- CSS had no design token system

### Council-Quality

Found code quality concerns:
- Inconsistent naming conventions (snake_case mixed with camelCase)
- Missing edge case handling in hero synergy calculations
- No loading states for images

### Council-Performance

Flagged performance bottlenecks:
- No lazy loading for hero images
- DOM manipulations triggered layout thrashing
- Animations not GPU-composited

## The Revamp

### 1. Data Model Cleanup

Removed the Sierra/Freja duplication and fixed hitscan type classification:

```javascript
// Before: overlapping entries, inconsistent naming
{ name: "sierra_freja", type: "dps", hitscan: true }

// After: clean, deduplicated, kebab-case
{ name: "sierra", type: "dps", hitscan: false }
```

### 2. Design Token System

Introduced CSS custom properties for a consistent, themeable design:

```css
:root {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --color-surface: #16213e;
  --radius-sm: 6px;
  --radius-lg: 12px;
  --shadow-card: 0 4px 12px rgba(0,0,0,0.3);
}
```

### 3. Responsive Mobile-First Layout

The entire UI was rebuilt with a mobile-first approach using CSS Grid and flexible containers. The hero grid adapts from 2 columns on mobile to 4 on desktop.

### 4. Image System with 3-Tier Fallback

Hero images load with a fallback chain:

```
primary image → placeholder SVG → initial letter
```

All images are lazy-loaded with native `loading="lazy"` and organized into an `assets/` structure with kebab-case filenames.

### 5. GPU-Composited Animations

Animations were refactored to use `transform` and `opacity` only (GPU-composited properties) instead of layout-triggering properties like `width`, `height`, or `top`.

## Files Modified

| File | Changes |
|------|---------|
| `js/data.js` | Data model cleanup, hero entries deduplication |
| `js/logic.js` | Comp synergy fixes, hitscan reclassification |
| `js/app.js` | Image loader, lazy loading, event handling |
| `index.html` | Clean markup, meta tags, footer |
| `css/styles.css` | Complete redesign with design tokens |
| `workflow-ow2-picker-reference.md` | Documentation updated |

## Key Config Changes

The role slot configuration was reorganized to match actual OW2 competitive team composition:

- **2 DPS** slots
- **2 Support** slots
- **1 Tank** slot
- **1 Flex** slot

## Results

- **Clean, deduplicated data** — no more Sierra/Freja confusion
- **Responsive design** — works on mobile, tablet, and desktop
- **Image fallback chain** — never shows a blank space
- **GPU-composited animations** — smooth 60fps transitions
- **Design token system** — easy to theme and maintain
- **Clean `dist/` folder** — ready for Cloudflare Pages deployment

## Takeaways

1. **Review before refactor.** The council caught issues I would have missed.
2. **Multiple perspectives matter.** Architect, Quality, and Performance each found different problems.
3. **Design tokens prevent drift.** A single CSS variable change updates the entire UI.
4. **Mobile-first is easier than mobile-later.** Building responsive from the start saves rework.
5. **3-tier image fallbacks feel polished.** Users never see a broken image.
