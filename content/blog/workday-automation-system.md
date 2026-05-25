---
title: "Designing a Work Day Automation System with HTML Reports"
date: "2026-05-06"
tags: ["Workflow", "HTML", "Templates", "Obsidian", "Automation"]
category: "TECH"
excerpt: "Built a structured work day reporting system with automated HTML report generation, session tracking, and a reusable design process — all driven by templates and CLI automation."
---

## The Problem

Tracking daily work across multiple sessions is chaotic without a structured system. Sessions run together, decisions get lost, and tomorrow's plans are forgotten. What's needed is a repeatable workflow that:

- Captures each session's achievements and decisions
- Generates consistent, professional HTML reports automatically
- Preserves context for the next day's work
- Integrates with existing tools (Obsidian, OpenCode)

## The System

### Session-Based Workflow

Each day is divided into discrete sessions with clear boundaries:

```yaml
Session 1: 14:00-14:30  — Skills setup & configuration
Session 2: 15:00-15:30  — Template creation & testing
Session 3: 16:00-16:25  — Report generation & review
```

Every session captures:
- **What was done** (specific actions)
- **Key decisions** (with rationale)
- **Tomorrow's plan** (next actions)

### Automated HTML Report Generation

Using the `html-reports` skill combined with Obsidian and OpenCode, reports are generated with a single command pipeline:

1. Session data written to structured markdown
2. OpenCode reads markdown and applies the report template
3. Template renders with consistent CSS variables
4. Output is a standalone HTML file ready for sharing or archiving

### The 8-Step Design Process

Every report follows a proven design methodology:

1. **Structure** — Define sections and hierarchy
2. **Typography** — Select fonts (Roboto Thin + Light via Google Fonts)
3. **Color** — Apply 60-30-10 rule with WCAG AA contrast
4. **Grid** — 12-column CSS grid for layout flexibility
5. **Components** — Cards, tables, progress indicators
6. **Spacing** — Consistent rhythm and padding
7. **Responsiveness** — Works on any screen size
8. **Export** — Browser print-to-PDF for distribution

### Storage Strategy

```
E: drive/              → Bulky workspaces (preserves C: 32GB)
C: drive/              → System + critical tools only
Playwright CLI         → Token-efficient browser automation
```

This preserves the limited C: drive space while keeping workspaces accessible.

## Real Output Example

The system was immediately tested by generating a **Student Progress Report** from grade data, producing a clean HTML report with:

- Class overview with student performance table
- Subject average comparisons
- Key insights highlighted
- Clean Roboto typography with the 60-30-10 color scheme

## Key Results

- **3 sessions** tracked with full decision logging
- **Report template** with reusable 8-step design process
- **Student Progress Report** generated as first real output
- **Storage strategy** optimized (E: drive for workspaces)
- **Playwright CLI** validated for browser automation
- **Tomorrow's plan** captured with specific testable items

## Takeaways

1. **Session boundaries prevent context bleed.** Clear start/end times keep each session focused.
2. **Templates remove friction.** Once the design system is set, generating reports is nearly instant.
3. **Color rules matter.** The 60-30-10 rule with WCAG AA compliance ensures professional accessibility.
4. **Tomorrow's plan should be testable.** "Test Playwright CLI commands" is actionable; "Explore skills" is vague.
