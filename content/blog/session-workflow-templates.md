---
title: "Designing a Session Workflow System with Templates & Incremental Persistence"
date: "2026-05-07"
tags: ["Workflow", "Templates", "Persistence", "OpenCode", "Crash Recovery"]
category: "TECH"
excerpt: "Built a robust session workflow system with automatic context loading, crash recovery, and consistent HTML report templates — ensuring no work is ever lost between sessions."
---

## The Problem

When working with AI coding assistants across multiple sessions, context loss is the single biggest productivity killer. Every new session starts blank — the assistant doesn't know what was built, what was decided, or what comes next.

This session focused on building the operational backbone: a startup protocol, crash recovery system, and standardized report templates.

## The Solution

### 1. Mandatory Startup Protocol

The `AGENTS.md` file was restructured so the very first thing every session does is:

1. **Read `active-session.json`** — identifies the current day and previous session
2. **Load previous context** — pulls in yesterday's session file automatically
3. **Create today's session file** — with proper Morning/Afternoon time slots
4. **Verify all components** — confirms 0mem, templates, and skills are loaded

### 2. Incremental Persistence

To guard against crashes, connection drops, and model switches:

- State is persisted to disk **every 3 actions** (or ~15 minutes)
- The **source of truth is always on disk**, never in memory
- Crash recovery reads the last persisted state and resumes seamlessly

### 3. Professional Report Templates

Standardised HTML templates with consistent design tokens:

```css
/* Template defaults - applied to all reports */
h1 { font-weight: 100; }         /* Thin - consistent across all reports */
background: gradient;             /* Not solid white - more professional */
.report-card { }                  /* Card component for key metrics */
.session-box { }                  /* Box for session timeline items */
```

### 4. Template Folder Structure

```
Templates/
├── Session Report Template.html    # Daily session reports
├── PDC Student Report Template.html  # Student/grade reports
└── Todo Report Template.html        # Priority task lists
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `h1` weight = 100 | Consistency across all report types |
| Gradient background | More professional than solid white |
| `.report-card` + `.session-box` classes | Reusable component system |
| 3-action persistence | Limits data loss to ~1 minute of work |
| Templates folder | Centralized, easy to find and update |

## Key Results

- **Zero context loss** — every session picks up exactly where the last one ended
- **Crash recovery** tested and verified — survives terminal crashes and model switches
- **3 report templates** created for different use cases
- **Startup protocol** runs automatically — no manual steps needed
- **Template consistency** enforced across all generated reports

## Takeaways

1. **Startup protocols prevent amnesia.** A few seconds of setup saves hours of re-explanation.
2. **Templates should be the first thing you build.** They enforce consistency from day one.
3. **Incremental persistence is non-negotiable.** Without it, one crash wipes an entire session.
4. **Design tokens in CSS variables make theming trivial.** Change one line, update every report.
