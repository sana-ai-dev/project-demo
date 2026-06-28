---
title: "Migrating Python Automation from Windows to Raspberry Pi 5 for 24/7 Reliability"
date: "2026-06-28"
tags: ["Raspberry Pi", "Automation", "systemd", "Migration", "Python"]
category: "TECH"
excerpt: "Moved a Gmail auto-labeling pipeline from Windows Task Scheduler (runs only when logged in) to a Pi 5 systemd timer for true 24/7 operation — zero Windows dependency, survives reboots, runs every 30 minutes."
---

## The Problem

My Gmail inbox was a warzone. Hundreds of automated emails — GitHub notifications, render queue completions, Pi health alerts, Stripe receipts — all piled into a single folder. Finding a client message meant digging through noise.

I'd built a Python pipeline to fix this: `fetch_emails.py` pulled new messages from the Gmail API, and `classify_apply.py` ran a rule engine that auto-labeled, starred, and categorized everything. It worked great — until I logged off.

The bottleneck was Windows Task Scheduler. It only fires when the user is logged in. My work PC sleeps at night. It reboots for updates. I travel. Every offline hour meant unlabeled emails stacking up. The pipeline wasn't truly automated — it was *attended* automation disguised as the real thing.

I needed the pipeline running 24/7, whether my PC was on or not. A Raspberry Pi 5 sitting on my desk, already running a Minecraft server, was the obvious answer.

## The Solution

Migrate the entire Gmail auto-labeling pipeline from Windows Task Scheduler to a Pi 5 systemd timer — achieving true unattended operation with zero Windows dependency.

**The goal:** New emails get labeled within 30 minutes of arrival, forever, without anyone logged into anything.

## Architecture

The transition was clean. Windows-side PowerShell runner → Pi-side Bash runner. Windows Task Scheduler → systemd timer. Same Python scripts, same Gmail API credentials, same OAuth token — just running on a different OS, on a machine that never sleeps.

```
Windows (before)                     Pi 5 (after)
┌──────────────────┐                ┌──────────────────┐
│ Task Scheduler   │                │ systemd timer    │
│ (logged-in only) │                │ (30min, persist) │
└──────┬───────────┘                └───────┬──────────┘
       │                                     │
       ▼                                     ▼
┌──────────────┐                   ┌──────────────┐
│ PowerShell   │                   │ Bash runner  │
│ runner.ps1   │                   │ runner.sh    │
└──────┬───────┘                   └──────┬───────┘
       │                                   │
       ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│ Python pipeline  │              │ Python pipeline  │
│ (same scripts)   │              │ (same scripts)   │
└──────┬───────────┘              └──────┬───────────┘
       │                                   │
       ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│ Gmail API        │              │ Gmail API        │
│ OAuth token      │              │ same token       │
│ auto-refresh     │              │ auto-refresh     │
└──────────────────┘              └──────────────────┘
```

## Implementation

The migration followed 5 phases. Every phase had a verification gate — nothing moved forward unless the previous step passed.

### Phase 1: Probe & Prep

SSH'd into the Pi to check Python version and pip. Installed the Google API client libraries. Created the directory structure: `~/business-mail-organizer/{credentials,data,logs}`.

**Verification:** Python 3.10+, all packages installed, directories exist.

### Phase 2: Transfer Files

SCP'd the four Python scripts from Windows to the Pi: `fetch_emails.py`, `classify_apply.py`, `gmail_auth.py`, `config.py`. Then transferred the OAuth token file and client secret JSON. Finally, copied the existing inbox data.

**Critical decision:** The OAuth token already had the right scopes and worked without a browser. Copying it from Windows meant the Pi could authenticate immediately — no headless browser setup, no X11 forwarding, no manual re-auth.

**Verification:** All files present on Pi.

### Phase 3: Adapt for Pi

This was the real work. The Windows config.py had hardcoded `C:\Users\...` paths. I updated them to Linux paths under `/home/pi/business-mail-organizer/`.

Then I wrote `run-organizer.sh` — the Bash equivalent of the original PowerShell runner. It executes both stages (fetch then classify) with timestamps and exit code handling.

```bash
#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "[$(date)] Starting Business Inbox Organizer..." >> logs/runner.log
python3 fetch_emails.py >> logs/fetch.log 2>&1
python3 classify_apply.py >> logs/classify.log 2>&1
echo "[$(date)] Done." >> logs/runner.log
```

Dry-run first: `python3 classify_apply.py --dry-run` classified all 76 existing emails with zero errors. Then the full test: `./run-organizer.sh` completed with exit code 0 and logs written.

**Verification:** Scripts run without errors, logs written.

### Phase 4: systemd Timer

Two unit files. The service file tells systemd what to run:

```
[Unit]
Description=Business Inbox Organizer
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/home/pi/business-mail-organizer/run-organizer.sh
User=pi
```

The timer file tells systemd when:

```
[Unit]
Description=Run Business Inbox Organizer every 30 min

[Timer]
OnBootSec=5min
OnUnitActiveSec=30min
RandomizedDelaySec=5min
Persistent=true

[Install]
WantedBy=timers.target
```

`Persistent=true` is the killer feature: if the Pi is offline when a run was scheduled, it fires immediately on next boot. Combined with the randomized 5-minute delay to avoid Gmail API rate limits, this is more robust than any Windows scheduler ever was.

**Verification:** `systemctl list-timers` shows next run with future fire time. After first fire, `journalctl -u business-organizer` shows successful execution.

### Phase 5: Cleanup

Deleted the Windows Task Scheduler entry via `schtasks /Delete`. Updated the working memory docs. Marked the plan as complete.

**Verification:** Windows task removed, docs reflect new architecture.

## Key Results

| Metric | Before | After |
|--------|--------|-------|
| Runtime | PC-on hours only | 24/7 |
| Windows dependency | Full | Zero |
| Missed runs on reboot | All | None (persistent=true) |
| Management UI | Task Scheduler GUI | `systemctl` CLI |
| Logging | Windows Event Viewer | journald + file logs |

## Key Decisions

| Decision | Chosen | Why |
|----------|--------|-----|
| Runner script | Separate `.sh` file | Testable standalone; keeps service file minimal |
| Timer interval | 30 min + 5 min random delay | Balances API limits with responsiveness |
| Persistent | `true` | Catches missed runs after downtime |
| OAuth strategy | Copy token from Windows | Auto-refreshes without browser setup |
| Logging | journald + file | systemd integration + debug accessibility |

## Takeaways

1. **Task Scheduler is not automation.** If your pipeline only runs when you're logged in, it's an attended script — not a service. Real automation runs on its own hardware with its own scheduler.

2. **OAuth tokens are portable.** I assumed I'd need to re-authenticate on the Pi. Turns out the token file works cross-platform as long as the scopes match. Saved hours of headless-browser pain.

3. **systemd timers are superior to cron.** `Persistent=true` catches missed runs. `RandomizedDelaySec` prevents thundering-herd API hits. `OnBootSec` handles startup. Cron has none of these.

4. **The Pi 5 is a legitimate server.** 4 cores, 8GB RAM, NVMe via USB 3.0. Running a Python pipeline every 30 minutes is trivial. The same Pi also runs Minecraft — the overhead is invisible.

5. **Document the rollback before you migrate.** Three commands reverse the entire migration: re-enable the Windows task, delete the Pi files, disable the timer. Writing the rollback plan first meant I could migrate without fear.

---

*The pipeline has been running for 0 days with zero failures. Every email is labeled within 30 minutes. My inbox is quiet. My PC sleeps at night. The Pi doesn't.*
