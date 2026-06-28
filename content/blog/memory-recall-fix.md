---
title: "Debugging an AI Agent's Memory — 5 Bugs That Broke Recall in a Multi-Agent System"
date: "2026-06-28"
tags: ["Memory", "AI Agents", "Debugging", "OpenCode", "Infrastructure"]
category: "TECH"
excerpt: "Discovered and fixed 5 bugs in an AI agent's memory pipeline that caused complete session amnesia — sessions ran perfectly but left zero trace for the next startup. Here's what went wrong and how I fixed it."
---

## The Problem

My AI agent built an entire pipeline — Gmail integration, Ollama extraction, Raspberry Pi deployment, and a scheduled email digest — over multiple sessions. Every session ran perfectly. Code was written, tests passed, the pipeline scheduled.

Then the next session started, and the agent asked: "What project are we working on?"

Complete amnesia. The PiSchool project — all 8 phases of v1, all 6 quick wins of v2 — was invisible to the agent on startup. It had no idea what it built yesterday, where the code lived, or what to do next.

This wasn't a model limitation. It was a memory pipeline bug. Five of them, actually.

## The Investigation

The recall system has three hot-path files that the agent reads on every startup:

```
active-context.yaml  → current project state, architecture, recent sessions
active-tasks.yaml    → task list with status and output
working-memory.md    → active thread table for immediate context
```

On startup, the agent loads these three files, builds mental context, and continues where it left off. It's a simple, effective system — when it works.

I checked all three files. They were empty. No PiSchool. No tasks. No recent sessions. The hot path was cold.

So I traced the pipeline backward:

1. **Startup reads** → empty hot-path files
2. **What writes hot-path files?** → The `endsession` workflow
3. **Did endsession run?** → No. PiSchool sessions ended without running it.
4. **Where did endsession output go?** → `state.json` and `standing-instructions.yaml` — files the agent never reads on startup
5. **What about auto-summary.py?** → 3 bugs there too

Root cause found. Five bugs in total.

## The 5 Bugs

### Bug 1: The 60% Wrecking Ball

`auto-summary.py` had a hardcoded keep ratio of 0.6. Every compaction cycle, 40% of MEMORY.md was discarded. Over 2-3 sessions, critical context got erased even when the file was well within budget.

```
Before:  keep_ratio = 0.6   → 40% loss every cycle
After:   keep_ratio = 0.84  → 16% loss, retains critical session context
```

**Fix**: Changed 0.6 → 0.84. Combined with the 200-line cap, this keeps ~168 lines per cycle.

### Bug 2: The Unbounded Cap

The same function calculated a `keep_target` of 210 lines from a 350-line file — exceeding the 200-line budget. The next compaction would compound the loss because the file was already over budget.

```
Before:  keep_target = 210  → still over budget, next cycle compounds
After:   keep_target = min(200, 210) = 200  → never exceeds budget
```

**Fix**: Added `min(200, keep_target)`. One line prevented cascading compaction loss.

### Bug 3: The Unprotected Section

Session headers (`## Session`) were not in the PROTECTED_SECTIONS list. The scoring algorithm treated them like any other content. Result: only the 3 most recent sessions survived. Older sessions — containing architecture decisions and lessons learned — were silently deleted.

**Fix**: Added `'session'` to PROTECTED_SECTIONS. Session headers are now immune to scoring-based deletion.

### Bug 4: The Invisible Output

The `endsession` Step 3.5 was supposed to capture session output. It wrote to `state.json` and `standing-instructions.yaml`. Both files are invisible to the agent on startup — it reads `active-tasks.yaml`, `active-context.yaml`, and `working-memory.md`.

The output was written. Nobody read it.

**Fix**: Rewrote Step 3 to write deterministic task output to all three hot-path files: task status in active-tasks.yaml, recent sessions in active-context.yaml, and thread context in working-memory.md.

### Bug 5: The Workflow That Never Ran

The PiSchool sessions ran across multiple days. The `endsession` command was in the workflow but was never executed. Without it, no output was captured anywhere — not even to the wrong files.

**Fix**: Rewrote `endsession` for deterministic task capture. Running it after any session now guarantees hot-path files reflect current state.

## Key Results

| Metric | Before | After |
|--------|--------|-------|
| PiSchool v1 phases visible on startup | 0 / 8 | 8 / 8 |
| PiSchool v2 Phase A items visible | 0 / 6 | 6 / 6 |
| Hot-path files with session output | 0 / 3 | 3 / 3 |
| auto-summary line loss per cycle | 40% | 16% |
| endsession task capture | manual + invisible | deterministic + hot-path |

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 84% auto-summary keep rate | 16% loss vs 40%; keeps critical session context |
| Inline output in existing YAML | Zero new files, no new infra, no extra startup reads |
| endsession writes to hot-path files | active-tasks.yaml + active-context.yaml + working-memory.md are read on every startup |
| "session" in PROTECTED_SECTIONS | Session headers and their children immune to scoring-based deletion |
| PiSchool threads in working-memory.md | Thread table is first thing builder reads after hot-path files |

## Takeaways

**1. Output invisibility is worse than no output.**
Writing to files the agent never reads creates an illusion of progress. The hot path — the 3 files read on every startup — must be the canonical output target. Everything else is just logs.

**2. Compaction cascades.**
A 60% keep ratio looks fine on paper. Over 3 compaction cycles, you've lost 78% of the original content. The `min(200, ...)` cap was one line of code that prevented unbounded loss — the highest-impact bug fix of the session.

**3. Protected sections need active maintenance.**
Every new content type in the memory file needs to be explicitly added to PROTECTED_SECTIONS. This is a design smell — ideally the system would auto-protect section types — but for now it's a manual checklist item.

**4. Session-end workflows are the single source of truth.**
If endsession doesn't run (or runs incompletely), the next session starts blind. Making it deterministic — always capturing task state, always writing to hot-path files — eliminated the gap entirely.

**5. Test the recall path, not just the build path.**
Building PiSchool worked perfectly. The bug was only visible when the next session loaded — never during development. A startup simulation check (do the hot-path files contain expected content?) should be part of every session-end workflow.

## What's Next

The memory pipeline is now reliable, but there's always room to improve:

- **Startup smoke test**: Verify hot-path files contain expected keys before declaring session ready
- **Leaky bucket detection**: Alert if compacted line count drops below a threshold in one cycle
- **Multi-agent recall**: Extend the hot-path pattern so subagents (council, researcher) can also read session context

For now, the agent remembers. That's a good place to start.
