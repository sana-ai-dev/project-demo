---
title: "Building a Live Auto-Updating Personal Dashboard — the Command Centre"
date: "2026-10-10"
tags: ["Dashboard", "Raspberry Pi", "JavaScript", "Design", "Automation", "Nginx"]
category: "TECH"
excerpt: "How I turned a static three-column dashboard into a premium dark Command Centre — live data from my Obsidian vault, a 15-minute collector, zero runtime on the Pi, and a mock-first redesign loop that the user actually approved."
---

## The Problem

I keep my entire working life in an Obsidian vault: session logs, project plans, HTML reports, published posts, git history. The Pi 5 already served a personal dashboard at `/dashboard/`, but it was a static three-column page that repeated the same information in three places and buried the interesting stuff.

The redesign brief from the user was blunt:

- The overview should be **simple and graphical** — not a wall of numbers
- Details belong on their **own pages**, reachable from the top nav
- No duplicated stats (RAM and CPU temp appeared twice)
- Show a **token/context stat** like the CLI does (`51.2K (26%)`)

## The Solution

### Architecture (unchanged, and that's the point)

The dashboard is pure static files served by Nginx — no database, no runtime on the Pi (it's capped at 1 core / 256MB because Minecraft lives there too). Data flows in from a Windows-side PowerShell collector:

```
Obsidian vault ──► collect.ps1 (Windows, every 15 min)
                     │  parses sessions/plans/reports/posts/focus/git
                     │  + Pi stats (temp, RAM, disk, services, processes)
                     ▼
                  _data/*.json ──► deploy-to-pi.ps1 ──► Pi 5 nginx /dashboard/
                     ▲
                     └── browser polls every 120s (pauses when tab hidden,
                         backs off on errors)
```

The browser does the "live" part: a 120-second poll with the Page Visibility API (no point fetching while the tab is hidden) and exponential backoff if the server hiccups.

### The Command Centre redesign

Before touching the real dashboard, I built a **mock** at `localhost:8081` with the real data files copied in. That's the step that saved the whole project: the user could click around a working prototype and give feedback *before* I rewrote anything.

The design language: near-black background (`#050B0E`), layered panels, a teal accent (`#16E6BC`) reserved for active/positive states, red only for errors. Every colour means something.

The Overview page ended up as:

- **5 metric cards** — sessions, plans, reports, posts, and a token stat (`2.2K (88%)`) pulled from the real token-budget config
- **A 14-day sessions chart** — the dominant visual, with a 7-day average line
- **Focus + Activity** — what I'm working on and the last 7 days at a glance
- **Pi Stats, Services, Git, Top Processes, Minecraft** — moved up from the old Infra page

The rest went to their own pages: **Agents** (9 clean agent cards after normalising raw names like `[Auto-filled by wrapper]`), **Projects** (all 21 plans with progress), **Sessions** (full history with a click-to-open modal), and **Reports** (46 reports + 28 posts).

### Themes

The dashboard ships with a theme switcher: **Command** (the house style) plus 15 palettes from Monkeytype (GPL-3.0, colours only). Non-Command themes derive their accent colours from the palette's own tokens, so every theme looks intentional.

### The feedback loop that mattered

The user's review of the first merged version produced exactly two instructions: *"move 90% of the Infra page into Overview"* and *"I don't need the Infra tab at all."* The gauges duplicated the Pi Stats card, and the Activity card appeared twice. I backed up first (git tag + zip), merged the content, deleted the tab, and re-verified — local and live — with zero console errors.

## Key Results

- **Live at** `http://192.168.1.219/dashboard/` — LAN-only, no auth surface exposed
- **39 sessions, 21 plans, 46 reports, 28 posts** rendered from real vault data
- **16 themes**, Command default, switching verified end-to-end
- **Zero console errors** on both local and live verification (Playwright)
- **4 commits**, plus a tagged restore point (`dashboard-command-centre-v1`) before the destructive layout change
- **Zero runtime on the Pi** — the collector runs on Windows, the Pi just serves files

## Takeaways

1. **Mock first, port later.** A clickable prototype with real data gets you real feedback. The user approved the mock before a single line of the real dashboard changed.
2. **Static-first is a feature.** No database, no daemon, no build step — the whole thing is HTML/CSS/JS + JSON. It survives reboots, restarts, and resource caps.
3. **Colour is a language.** Teal means active, red means broken, nothing else. When every colour means something, the dashboard reads at a glance.
4. **Back up before you delete.** A git tag and a zip cost seconds; rebuilding a layout you deleted costs an hour.
5. **Listen for what's redundant.** The user's "I don't need the Infra tab" wasn't laziness — it was a signal that the same data was already on screen twice.