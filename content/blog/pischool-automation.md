---
title: "How I Automated School Communication — Gmail API + Ollama + Raspberry Pi"
date: "2026-06-28"
tags: ["PiSchool", "Gmail", "Ollama", "Automation", "Raspberry Pi", "Education"]
category: "TECH"
excerpt: "Built a complete school communication automation pipeline: Gmail API reads school emails, Ollama extracts events, Raspberry Pi serves a family dashboard, and daily digests keep both parents informed — all running automatically."
---

## The Problem

Two children. Two different schools. Four communication channels (BromCom, Studybugs, direct emails from both). Critical information buried in the daily firehose.

An early-closure announcement at 8:15 AM sits unread until lunchtime. A PE kit reminder gets lost between newsletters. I'm manually scanning Gmail every morning, mentally piecing together timelines across two school calendars.

There's no cross-school aggregator on the market — and certainly none that costs zero dollars to run.

## The Constraint

No API budget. No OpenAI credits, no Anthropic tokens, no cloud LLM bills. Everything must run locally on hardware I already own.

## The Solution

A hybrid pipeline spanning a Windows dev machine and a Raspberry Pi 5. Every stage is free, local, and automated.

```
Windows (Task Scheduler · Mon-Fri 7pm):
  1.  Gmail API → fetch unread school emails
  2.  Ollama + Qwen2.5-Coder:1.5B → extract structured events
  3.  SCP school-comms.json → Pi 5
  4.  Gmail API → text digest to both parents

Pi 5 (192.168.1.219 · 256MB · 1 core):
  Nginx → /admin/data/school-comms.json (static JSON)
        → /admin/pages/pischool.html (family dashboard)
```

## Architecture

**Data flow** in five stages:

1. **Fetch** — Python authenticates via Gmail API (OAuth 2.0), searches by sender domain + label, parses multipart/HTML emails via BeautifulSoup, deduplicates by message ID. Raw emails saved to `data/raw/`.

2. **Extract** — Each raw email is sent to Ollama running Qwen2.5-Coder:1.5B, a 986MB quantized model. The system prompt enforces a strict JSON schema with event types, dates, urgency levels, and action required fields. First batch: 13 emails → 12 structured events.

3. **Push** — PowerShell script SCPs the merged JSON to the Pi's Nginx data directory. If the Pi is offline, Stage 0 SSH gate catches it before any work is wasted.

4. **Notify** — A text digest is composed from recent events and sent via Gmail API to both parents. SHA256 hash deduplication prevents re-sending identical digests.

5. **Display** — The Pi serves a vanilla JS dashboard (688 lines, no frameworks) with summary cards, filter pills, a timeline, and a persistent pack checklist.

## Implementation — 8 Phases in 2 Sessions

**Session 1 (10:00–12:00):** Built phases 1–8 end-to-end. Gmail API setup, email fetcher, Ollama extraction pipeline, Pi push, master runner + Task Scheduler, dashboard page, deploy + docs, email digest notification. All 8 phases completed in a single session.

**Session 2 (18:30–20:00):** Reliability overhaul. Added Stage 0 SSH health check (fast-fail gate), hardened Python path for Task Scheduler background mode, set 30-minute max runtime safety net, fixed encoding corruption in PowerShell files. Five-stage pipeline (0/5 through 4/5) verified end-to-end in 6.4 seconds.

**v2 Phase A (6 quick wins):** Gmail links on event cards, search/filter bar with category chips, Today badge with urgency colouring, school-specific colour badges (Grange Farm green, Finham Park blue), parallel Ollama extraction (95s → 25s), E2E test script.

## Key Results

- **12 events** extracted from 13 school emails — closures, PE days, exam dates, bring-items, parents evenings
- **Zero extraction misses** — every email with actionable content produced a valid event
- **Pipeline runs in ~6.4 seconds** for a full 5-stage cycle (when no new emails)
- **Daily digests** sent to both parents at 7pm, Mon-Fri
- **Dashboard live** at http://192.168.1.219/admin/pages/pischool.html
- **Total cost: £0.00** — local LLM, free Gmail API, existing Pi 5 hardware

## Key Decisions

| Decision | Why |
|----------|-----|
| Local LLM over cloud API | Zero per-run cost, zero data leakage. 15s/email is fine for daily batch. |
| Plain-text digests | Gmail strips CSS/JS. Plain text + link is universally reliable. |
| Pi serves only static files | No runtime, no database, no API. Stays within 256MB alongside Minecraft. |
| Two-level dedup | processed_ids.json prevents re-fetch; last_digest.json SHA256 prevents re-send. |
| 7pm schedule | Catches afternoon school emails; respects weekends. |
| Stage 0 SSH gate | Fast-fail: if Pi offline, abort before wasting fetch/extract/email cycles. |
| Never run individual steps | Only run-pischool.ps1. Individual steps break pipeline state — burned once, learned forever. |

## Takeaways

1. **Local LLMs are production-ready for structured extraction.** Qwen2.5-Coder:1.5B correctly classified urgency, parsed date ranges, and handled multiple event types from noisy email text — all at zero API cost. The accuracy was high enough that I never needed the regex fallback.

2. **Reliability is the last 20% that takes 80% of the effort.** The core pipeline took one session to build. Hardening it — SSH gate, Python path, encoding, timeout safety — took a second full session. Every fix was discovered through real failure, not foresight.

3. **Windows-to-Linux pipelines need hardening at every boundary.** PowerShell quoting, BOM/CRLF corruption, emoji encoding, PATH differences between interactive and background sessions — each boundary crossing is an opportunity for silent breakage.

4. **Cherry-pick the right pattern.** "Always run the master script, never individual steps" is now a permanent lesson in lessons-learned.yaml. One bad experience taught me more than a hundred hypotheticals.

5. **Static dashboards are underrated.** A 688-line vanilla JS page with no frameworks, no build step, no backend — served by Nginx in 256MB of RAM — gives me more utility than any React SPA ever could.

---

**Tech stack:** Python 3.11, Ollama + Qwen2.5-Coder:1.5B, Gmail API, Raspberry Pi 5 + Nginx, PowerShell, Windows Task Scheduler, Vanilla JS.

**Cost:** £0.00/month. The Pi is already running for Minecraft. The Windows machine is already running for other work.

**Part of Project2Jarvis** — an Obsidian vault and OpenCode workspace on GitHub.
