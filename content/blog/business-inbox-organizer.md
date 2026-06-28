---
title: "Building a Smart Gmail Labeling System — 76 Emails, 7 Categories, Zero AI"
date: "2026-06-28"
tags: ["Gmail", "Automation", "Python", "Productivity"]
category: "TECH"
excerpt: "Built an automated Gmail labeling system that fetches emails from sana.ai.dev@gmail.com, classifies them into 7 categories via keyword-based rules, and applies Gmail labels + stars — all without any AI dependency."
---

## The Problem

Every morning I'd open my Gmail inbox and face a wall of 76+ emails. Session reports from overnight dev runs, security alerts from Google, promotional emails from AI services, Trustpilot review requests, car service updates — all mixed together in one flat list. Manually sorting and starring important messages was eating 10-15 minutes per day.

I needed a system that would:

- Automatically recognize what each email is about
- Apply a colored Gmail label for instant visual filtering
- Star the urgent ones (security alerts, customer service threads)
- Run silently every 30 minutes without me thinking about it

And crucially — I wanted it to work without any AI dependency. No Ollama running in the background, no GPU needed, no API costs.

## The Solution

The Business Inbox Organizer is a **Python pipeline with 5 components** that runs on Windows, fetches emails from `sana.ai.dev@gmail.com` via the Gmail API, classifies each one using pure keyword matching, and applies labels + stars inside Gmail.

It reuses the same Google Cloud project and OAuth pattern as my PiSchool project — one less credential set to manage.

## Architecture

```
Gmail API ◄── Config ──► Fetch ──► Classifier ──► Runner (PowerShell)
                  ▲                        │
                  └── keyword rules ───────┘
```

5 components, no AI runtime:

- **Gmail API** — OAuth 2.0 with `gmail.modify` scope (read, label, star)
- **Config** — Email address, category definitions, star threshold, all paths
- **Fetch** — Paginated batch fetcher (50 at a time), deduplication via `processed_ids.json`
- **Classifier** — Pure Python rule engine: match sender domain → exact sender → subject keywords → body keywords (first 500 chars). Falls back to "Other / Promotional"
- **Runner** — PowerShell script that chains Fetch → Classify, logs to daily files, ready for Task Scheduler

The data flow is simple: Fetch from Gmail → save to `data/inbox.json` → classify each email → create/ensure labels exist → apply labels + star via `messages.modify`.

## Categories Discovered

After scanning 76 inbox emails, I found 7 natural groups:

| Category | Color | Starred? | Example Senders |
|----------|-------|----------|-----------------|
| Session Reports | Blue | No | Self-sent dev logs |
| AI Services | Purple | No | OpenAI, OpenRouter, HeyGen |
| Security & Account | Red | **Yes** | Google security, GitHub |
| Platform Notifications | Teal | No | Cloudflare, Vercel, Instagram |
| Customer Service | Orange | **Yes** | Citroen, Tenpin, bookings |
| Review Requests | Green | No | Trustpilot |
| Other / Promotional | Gray | No | Newsletters, marketing |

Security alerts and customer service threads are auto-starred. Everything else gets labeled but stays unstarred — reducing inbox noise significantly.

## Key Results

- **76 emails** fetched and classified in one pass
- **7 Gmail labels** created with distinct colors
- **100% classification rate** — every email got a label
- **Zero errors** — no API failures, no crashes
- **All existing labels preserved** — old `AI-Business/` prefixed labels cleaned up
- **30-minute schedule** ready for Windows Task Scheduler

## Key Decisions

| Decision | What I Chose | Why |
|----------|-------------|-----|
| Classification engine | Pure Python keyword matching | No Ollama dependency. Faster, deterministic, free. |
| Label structure | Flat names (no prefix) | Cleaner in Gmail sidebar after removing old prefix |
| Star threshold | Urgency >= 7 | Only Security and Customer Service get stars |
| Gmail auth | Same project as PiSchool | One OAuth consent screen, separate tokens per account |
| Deduplication | Processed IDs file | Never re-label an email, save API quota |
| Body scanning | First 500 chars only | Avoids irrelevant footer boilerplate |

## Edge Cases Handled

- **Rate limited?** Respect Retry-After, retry once, log failure. Next 30-min run picks up stragglers.
- **Token expired?** Auto-refresh via google-auth. If that fails, prompt user.
- **No new emails?** Exit silently — no spammy logs.
- **Unparseable body?** Classify from subject + sender only.
- **Already labeled?** Skip via label-ID intersection check.
- **Missing credentials?** Clear error with GCP Console instructions.
- **Category drift?** Re-run the analyzer script monthly.

## Takeaways

1. **Start simple.** I almost added Ollama for "smarter" classification. Pure keyword matching got 100% coverage on day one. Rule-based systems are underrated for well-scoped problems.

2. **Reuse auth patterns.** Using the same Google Cloud project as PiSchool saved me 30 minutes of OAuth setup. The `gmail_auth.py` file is 90% copy-paste from existing code.

3. **Delete old junk before creating new.** The first run found stale `AI-Business/` prefixed labels from a prototype. Deleting them first avoided label duplication and cleaned the sidebar.

4. **Log everything to files.** The PowerShell runner writes timestamped daily logs. When something goes wrong at 3 AM, the first thing you need is a log, not a cryptic error on a hidden console.

5. **30 minutes is the sweet spot.** Gmail's API quota is generous, but polling every 5 minutes is wasteful. Every 30 minutes means you see new emails labeled within the hour — good enough for a solo developer.

The code lives in `04_Active_Work/business-mail/` and can be deployed to any Windows machine with Python 3.11+ and a Google Cloud project. Total build time: one focused session.
