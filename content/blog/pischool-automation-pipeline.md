---
title: "Building PiSchool: An Automated School Communication Pipeline with Local LLMs"
date: "2026-06-26"
tags: ["AI", "Automation", "Python", "Raspberry Pi", "LLM", "Gmail API", "DevOps", "System Design"]
category: "TECH"
excerpt: "Designing a fully automated pipeline that fetches Gmail school emails, extracts structured events via a local LLM (Qwen2.5-Coder:1.5B), serves them on a Pi 5 dashboard, and sends daily email digests to parents — all at zero API cost."
---

## The Problem

My children attend two different schools, each using its own communication channels — one via BromCom, another via Studybugs, plus direct emails from both. Every week brings a firehose of emails: early closures, PE kit reminders, Finham Fest wristbands, heatwave guidance, SEND parents' evenings.

Critical information gets buried. An early-closure announcement at 8:15 AM might sit unread until lunchtime. A reminder to send a water bottle gets lost between newsletters. I found myself manually scanning Gmail every morning, mentally piecing together a timeline of what's happening and what needs packing.

Existing solutions (school apps, parent portals) are school-specific. There's no cross-school aggregator — and certainly none that works with both state schools in Coventry simultaneously.

## The Constraint

I'm not paying for an API. No OpenAI credits, no Anthropic tokens, no cloud LLM bills. The extraction has to run **locally**, for free, on hardware I already own.

## The Solution: PiSchool

An 8-phase pipeline that costs zero per run:

```
┌─ Windows Dev Machine (Task Scheduler · Mon-Fri 10am) ─┐
│  1. Fetch → Gmail API (readonly scope)                 │
│  2. Extract → Ollama + Qwen2.5-Coder:1.5B (local LLM) │
│  3. Push → SCP to Pi 5 (Nginx serves JSON)            │
│  4. Notify → Gmail API (send scope) → email digest     │
│                                                        │
│  → sanarahman1@gmail.com                               │
│  → farhanauddin208@gmail.com                           │
└──────────────────────────┬─────────────────────────────┘
                           │
┌─ Pi 5 (192.168.1.219) ──▼─────────────────────────────┐
│  Nginx → /admin/data/school-comms.json (6KB JSON)      │
│        → /admin/pages/pischool.html (dark-theme UI)    │
│  256MB MemMax · 1 core CPUQuota · static files only    │
└────────────────────────────────────────────────────────┘
```

## Phase 1: Gmail API Setup

The foundation. A Google Cloud project with the Gmail API enabled, OAuth 2.0 Desktop credentials, and a consent screen configured for external use (with test user access).

The credentials live in `Hidden/pischool/` — `.gitignore`'d, never committed. Authentication is a one-time browser flow that saves a `token.json` for subsequent runs.

**Scopes requested:**
- `gmail.readonly` — fetch school emails
- `gmail.send` — send digest emails

## Phase 2: Email Fetcher

A Python script (`fetch_emails.py`) that builds a Gmail API search query from configured sender domains:

```python
SENDER_DOMAINS = [
    "grangefarm.coventry.sch.uk",
    "bromcomcloud.com",
    "info1.studybugs.com",
    "finhampark.co.uk",
]
```

The query searches for unread emails matching `from:(domain) label:"Kids school"` within the last 7 days. Each email is parsed (multipart, HTML, plain text → beautifulsoup extraction) and saved as raw JSON to `data/raw/{message_id}.json`. Deduplication by message ID prevents reprocessing.

First run: 13 school emails captured from Grange Farm and Finham Park.

## Phase 3: Local LLM Extraction

The clever bit. Every raw email is sent to **Ollama** running **Qwen2.5-Coder:1.5B** — a 986MB quantized model that runs entirely on my Windows dev machine. No data leaves my network.

The system prompt defines a strict JSON schema:

```json
{
  "event_type": "closure | exam | pe_day | award | bring_item | meeting | deadline | other",
  "title": "Event title",
  "date": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD | null",
  "time": "12:35pm",
  "location": "School",
  "action_required": "What the parent needs to do",
  "urgency": "high | medium | low"
}
```

The model converts free-form email text into structured events. It handles date ranges ("24th-26th June"), relative dates ("tomorrow", "this Friday"), and correctly classifies urgency (closures = high, newsletters = low). Each extraction takes 8–20 seconds per email.

The first batch of 13 emails yielded **12 structured events** — early closures, instrument lesson cancellations, heatwave guidance, PE kit reminders, SEND parents' evening, Finham Fest wristbands. Zero misses.

## Phase 4: Pi 5 Deployment

The Pi 5 runs Nginx with strict resource limits (256MB MemoryMax, 1 core CPUQuota). A PowerShell script (`push-to-pi.ps1`) SCPs the generated JSON over SSH to `/var/www/project2jarvis/admin/data/school-comms.json`.

The Pi is a **passive server** — it only serves static files. No Python, no Node, no cron. Just Nginx and a 6KB JSON file.

## Phase 5: Automation

A master runner script (`run-pischool.ps1`) orchestrates all 4 stages with error handling at each step. Windows Task Scheduler fires it **Monday to Friday at 10:00 AM**.

```
Stage 1: python fetch_emails.py      # Gmail API → raw JSON
Stage 2: python extract_events.py    # Ollama → structured JSON
Stage 3: .\push-to-pi.ps1            # SCP to Pi 5
Stage 4: python notify_email.py      # Gmail API → email digest
```

The full pipeline completes in under 3 minutes with 5–10 new emails.

## Phase 6: Dashboard

A dark-theme single-page dashboard (`pischool.html`) served by Nginx. Vanilla JavaScript fetches the JSON and renders:

- **Summary cards**: events this week, urgent items, items to bring, actions needed
- **Filter pills**: closures, exams, bring items, meetings, deadlines
- **Timeline view**: events grouped by date with urgency dots and date badges
- **Pack checklist**: deduplicated bring-items with localStorage persistence

The entire dashboard is 688 lines — no frameworks, no build step, no backend.

## Phase 7: Email Notifications

The `notify_email.py` script builds a plain-text digest of recent events and sends it to both parents via the Gmail API.

**Deduplication**: A SHA256 hash of (message_id + title + date) is stored. If nothing changed since the last digest, no email is sent. No spam.

**Sample digest format:**
```
📋 PiSchool — School Communication Digest
  Friday, 26 June 2026

  🔴  Early Closure (2026-06-24)
       🕐 12:35pm
       📌 Contact school Reception to plan in place

  🎒  Water Bottle and Sunscreen (2026-06-29)
       📌 Send child with full water bottle and sunhat

  🔗  Full dashboard: http://192.168.1.219/admin/pages/pischool.html
```

First digest sent successfully at 02:18 AM to both recipients.

## Phase 8: Documentation

A complete product manual (`20260626-PiSchool-Complete-Documentation.html`) documents the entire system — PRD, system architecture, technical specs, build manual with all 8 phases, troubleshooting guide, and appendix. Dark-themed, printable, single-file HTML with embedded CSS.

A copy also lives in the digital products folder at `digital-products/pischool-manual/`.

## Key Design Decisions

**Local LLM over API**: Qwen2.5-Coder:1.5B (986MB quantized) runs on Windows via Ollama. Zero per-run cost, zero data leakage. The trade-off is speed (~15s/email) but the 10am schedule means it runs once daily — speed isn't critical.

**Plain-text over HTML emails**: Gmail strips JavaScript and most CSS in transit. A plain-text digest with a link to the full dashboard is more reliable and works everywhere.

**Two-level deduplication**: `processed_ids.json` prevents re-fetching emails. `last_digest.json` (SHA256 hash) prevents re-sending digests. Both are persistent across runs.

**Pi stays static**: The Pi 5 serves only pre-generated JSON and HTML. No runtime processes, no databases, no API endpoints. This keeps it within its 256MB cgroup allocation alongside Minecraft's 3GB allocation.

**10am Mon-Fri schedule**: School emails arrive in morning batches. Every-30-minute polling was wasteful. Once daily at 10am captures everything and respects weekends.

## What It Looks Like In Practice

```
http://192.168.1.219/admin/pages/pischool.html
```

A dark-themed dashboard showing a timeline of school events. Four stat cards at the top: events this week (5), urgent (2), items to bring (3), actions needed (4). Filter pills to isolate closures or PE days. A persistent pack checklist with checkboxes that survive page reloads (localStorage).

Below the timeline: "What to Pack" — water bottle, sunhat, PE kit, wristband — each with a checkbox that stays checked until unchecked.

## Current Status

All 8 phases are built, deployed, and tested end-to-end. The first automated Task Scheduler run is set for **Friday 26 June 2026 at 10:00 AM**.

The system has processed 13 school emails, extracted 12 events, served them on the Pi dashboard, and sent the first digest to both parents — costing exactly zero dollars in API fees.

## What's Next (V2)

| Priority | Feature | Why |
|----------|---------|-----|
| High | Parallel LLM extraction | Cut batch time from 95s to ~25s |
| High | Search/filter by keyword | Find events faster |
| High | Link to original email | One-click access to source |
| High | Per-child filtering | Separate Grange Farm from Finham Park events |
| Medium | HTML email digest | Colour-coded, styled emails |
| Medium | Health monitoring email | Know if the pipeline fails |
| Medium | PWA installable dashboard | Add to phone home screen |
| Future | Multi-family auth | Sell as a product for other parents |
| Future | Setup wizard | One-command install for new users |

---

**Tech stack**: Python 3.11+, Ollama + Qwen2.5-Coder:1.5B, Gmail API, Raspberry Pi 5 + Nginx, PowerShell, Windows Task Scheduler, Vanilla JS.

**Cost per month**: £0.00. The only electricity cost is the Pi 5 (idle, serving a 6KB JSON file) and the Windows dev machine (already running for other work).

**Repository**: Part of Project2Jarvis — an Obsidian vault and OpenCode workspace on GitHub.
