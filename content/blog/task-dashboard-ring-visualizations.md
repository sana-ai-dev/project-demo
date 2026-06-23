---
title: "Building a Priority-Based Task Dashboard with HTML Ring Visualizations"
date: "2026-05-07"
tags: ["Dashboard", "HTML", "CSS", "Task Management", "Visualization"]
category: "TECH"
excerpt: "Designed an HTML-based task dashboard with priority badges, progress ring visualizations, deadline tracking, and weekly timeline views — all generated from structured YAML-like data."
---

## The Problem

Task management tools are either too simple (a flat list) or too complex (Jira, Monday.com). What was needed was a **middle ground**: a lightweight HTML dashboard that visualizes tasks by priority, tracks progress with ring charts, and shows deadlines on a horizontal timeline — all generated from a simple structured data format.

## The Design

### Progress Rings

Each task category gets a circular progress indicator showing completion at a glance:

- **Admin tasks** — completion percentage displayed as a filled ring
- **Student tasks** — separate ring with distinct color
- **Planning tasks** — urgent items highlighted with accent color

The rings are pure CSS/SVG — no JavaScript libraries needed:

```html
<svg viewBox="0 0 36 36" class="ring">
  <path class="ring-bg" d="M18 2.0845..." />
  <path class="ring-fill" stroke-dasharray="75, 100" ... />
</svg>
```

### Priority Badge System

Tasks are tagged with visual priority badges:

| Priority | Color | Usage |
|----------|-------|-------|
| 🔴 Urgent | Red badge | Exam deadlines, critical submissions |
| 🟡 Medium | Amber badge | Upcoming tasks, pending actions |
| 🟢 Low | Green badge | Optional items, nice-to-haves |

### Horizontal Timeline

A weekly view arranges tasks across Monday–Friday with clear deadlines:

```
Monday    │ Padlet update weeks 24-29 │ Sign off meetings
Tuesday   │ PPD certificate upload     │ Coaching intervention
Wednesday │ Grace's Postcard           │ Enrichment survey
Thursday  │ Call maths students        │ Pro Portal exam info
Friday    │ Attendance list            │ PDC Standards prep
```

### Deadline Tracking

Critical dates are highlighted with countdown awareness:

- **13 May** — PDC Professional Standards Launch
- **14 May** — Maths Exam (urgent)
- **3 June** — Maths Exam
- **10 June** — Maths Exam
- **End of Year** — PPD Award feedback

## Results

The final dashboard provides:

- **Complete weekly overview** at a glance
- **Visual progress tracking** via ring charts
- **Priority-filtered task lists** with color-coded badges
- **Deadline-aware scheduling** with clear date markers
- **Reflection section** for weekly review notes

All rendered as a single HTML file — no server, no database, no JavaScript framework.

## Takeaways

1. **SVG rings are lightweight.** Pure CSS/SVG progress indicators without any library overhead.
2. **Color = meaning.** A consistent priority color system makes scanning the board instant.
3. **Timelines beat lists.** A horizontal weekly view reveals gaps and overlaps that a flat list hides.
4. **HTML dashboards are enough.** Not everything needs React — a well-designed HTML page with CSS variables is maintainable and fast.
