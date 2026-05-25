---
title: "Building an HTML Report Generation System from Scratch"
date: "2026-05-07"
tags: ["HTML", "CSS", "Templates", "Automation", "Workflow"]
category: "TECH"
excerpt: "I designed and built an automated HTML report generation system that eliminates context loss, enforces consistent design, and supports multiple roles — all from a zero-budget starting point."
---

## The Problem

Every session with an AI coding assistant starts from scratch. The assistant has no memory of what happened in the previous session — no context, no progress, no decisions. This leads to repetitive explanations, lost work, and frustration.

The root cause? **No startup protocol.** The `AGENTS.md` file (the configuration file read at every session start) lacked any hook to load previous context, create today's session file, or handle crash recovery.

## The Approach

I designed a three-layer solution:

### 1. Session Startup Protocol

A mandatory startup sequence embedded in `AGENTS.md` that runs at the beginning of every session:

- Reads `active-session.json` to identify the current day and previous session
- Loads the previous day's session file into context
- Creates today's session file with the correct structure (Morning/Afternoon time slots)
- Verifies all components are loaded before proceeding

### 2. Incremental Persistence

To prevent loss from crashes, connection drops, or model switches:

- Every 3 actions (or ~15 minutes), the session state is persisted to disk
- The source of truth is **always on disk**, never in memory
- Crash recovery reads the last persisted state and resumes from there

### 3. Consistent Report Templates

Session reports were being generated with inconsistent styling. I created a proper template system:

- A single HTML template with well-defined CSS variables (`--primary`, `--secondary`, `--accent`, etc.)
- A structured grid layout for consistent section placement
- Standardised sections: Executive Summary, Timeline, Key Decisions, Files Modified

## Technical Details

The template uses CSS custom properties for theming:

```css
:root {
    --primary: #1E2761;
    --secondary: #CADCFC;
    --accent: #F96167;
    --text: #333333;
    --muted: #666666;
    --success: #4CAF50;
    --warning: #FF9800;
}
```

And a 12-column CSS grid for layout flexibility:

```css
.container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 8px;
    max-width: 1200px;
    margin: 0 auto;
}
```

## Key Results

- **Zero context loss** going forward — every session picks up exactly where the last one left off
- **Consistent report styling** across all generated reports
- **Crash recovery** that limits data loss to at most 3 actions
- **Model-switch proof** — switching between AI models doesn't break the session
- **5 role-specific workflows** designed: Educator, Student, Content Creator, Data Analyst, PDC Coach

## Files Created

| File | Purpose |
|------|---------|
| `AGENTS.md` (updated) | Session startup protocol at the top |
| `2026-05-07.md` | Today's session file with proper structure |
| `Templates/Session Report Template.html` | Consistent report template |
| `0mem/SKILLS/session-report-workflow.md` | Standard Operating Procedure |

## Key Takeaways

1. **Design for failure.** The system assumes crashes will happen and handles them gracefully.
2. **Disk is truth.** Memory is ephemeral; the filesystem persists. Always write state to disk.
3. **Consistency reduces cognitive load.** A template removes design decisions so you can focus on content.
4. **Startup protocols prevent amnesia.** A few seconds of setup saves hours of re-explanation.
