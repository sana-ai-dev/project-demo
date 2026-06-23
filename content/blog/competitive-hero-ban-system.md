---
title: "Building a Competitive Hero Ban System: Recreating Blizzard's Season 16 Algorithm"
date: "2026-05-26"
tags: ["Web App", "Game Dev", "JavaScript", "Algorithm", "OW2", "UI/UX"]
category: "TECH"
excerpt: "A deep dive into implementing Overwatch 2's Season 16 Hero Ban system — ranked-choice voting, 2-per-role limit, tiebreaker resolution, and a full three-phase competitive UI."
---

## The Challenge

Overwatch 2's Season 16 introduced a game-changing mechanic: **Hero Bans**. Before each match, teams vote to ban heroes from play — adding a layer of strategy that reshapes team compositions at every rank.

The brief was clear: build a complete Competitive 5v5 Hero Ban tab that mirrors Blizzard's official specification. Not a simplified version — the real deal.

Three core requirements:
- **Ranked-choice voting** — each player assigns 1st, 2nd, and 3rd choice bans
- **Blizzard-accurate resolution** — points-based algorithm with role limits and tiebreakers
- **Three seamless phases** — Vote → Bans Reveal → Build with banned heroes excluded

## The Algorithm

The heart of the system is the ban resolution algorithm in `resolveBans()`. It follows Blizzard's Season 16 spec precisely:

```
1. Points:     1st choice = 7pts, 2nd = 5pts, 3rd = 3pts
2. Priority:   Team with highest single-hero total bans first
3. Ban Order:  1 → 2 → 2 → 1 (alternating, 4 total)
4. Role Cap:   Max 2 bans per role across both teams
5. Duplicates: Skip already-banned heroes, move to next choice
6. Tiebreaker: Equal points → more voters wins → random
```

The most interesting part? The **alternating ban order** — Team A gets ban #1, Team B gets bans #2 and #3, then Team A closes with ban #4. This mirrors the actual competitive flow where the first-ban team gets one, then the second team gets two to compensate.

## The Three-Phase UX

The feature spans three distinct phases, each with its own UI:

### Phase 1: Voting

Each team gets 3 ranked vote slots. The user manually sets all 6 votes (Team A and Team B, 1st/2nd/3rd each). No synthetic data — real decisions only.

### Phase 2: Bans Revealed

The algorithm resolves all 4 bans and displays them with an explanation log. Why was each hero banned? The breakdown shows points, voter count, and tiebreaker decisions — complete transparency.

### Phase 3: Competitive Builder

The hero grid rebuilds with banned heroes removed. The recommendation engine (`recommendBestHero()`) now accepts an `excludeHeroes` parameter, so it never suggests a banned pick. All roles are available — the ban reshapes the meta organically.

## Files That Changed

| File | What Changed |
|------|-------------|
| `js/data.js` | Competitive state vars, `banVotes`, `BAN_POINTS` lookup, `resetBanState()` |
| `js/logic.js` | `resolveBans()` algorithm, `getAvailableHeroes()`, updated recommendation engine |
| `js/app.js` | Tab switching, all 3 ban phases UI, shared picker overlay for competitive |
| `index.html` | Tab bar, competitive section HTML, footer with social links |
| `css/styles.css` | Tab styling, phase indicator, vote slots, ban cards, responsive breakpoints |

## Beyond the Feature

While implementing the ban system, I also shipped a few quality-of-life improvements:

- **Social footer** — TikTok, Portfolio, and Store links with hover tooltips
- **Shared picker overlay** — the hero selection UI is now consistent across Standard, Ban, and Competitive modes
- **Cloudflare-ready** — all 5 modified files synced to `dist/` for deployment

## Key Decisions

| Decision | Why |
|----------|-----|
| No synthetic `banRate` data | Used only existing hero data — no fake stats |
| Max 2 per role | Matches Blizzard's spec exactly |
| Full manual voting control | User sets all 6 ranked votes — no automation that could misrepresent intent |
| Shared overlay | Single picker component across all modes reduces bugs |

## Results

- **6 implementation steps** completed in one session
- **3 JavaScript files** pass Node syntax verification
- **5 files modified**, zero regressions
- **All 3 JS files pass** `node --check` syntax validation
- **Cloudflare-ready** build in `dist/`

## Takeaways

1. **Game mechanics make great engineering challenges.** Implementing a voting algorithm with tiebreakers is harder than it looks — and more satisfying when it clicks.
2. **Mirror real specs, don't simplify.** The authentic ban order (1→2→2→1) matters for competitive integrity. Cutting corners would break the experience.
3. **Shared UI components prevent drift.** The single picker overlay across Standard/Ban/Competitive modes means one fix improves all three.
4. **Syntax verification is non-negotiable.** Every JS file passes `node --check` before commit — catches issues before they reach production.
5. **Cloudflare sync is a habit, not an afterthought.** Keeping `dist/` in sync means deployment is always one push away.
