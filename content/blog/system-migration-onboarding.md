---
title: "Behind the Scenes: Migrating 77,000 Files & Building a Model Handover System"
date: "2026-05-29"
tags: ["Infrastructure", "DevOps", "Automation", "System Design", "AI Agents", "Workflow"]
category: "TECH"
excerpt: "Relocating an entire development ecosystem across drives — 77K files migrated, 17K files path-patched, zero references broken — and building a low-token onboarding system for seamless AI model handovers."
---

## The Problem

Every project reaches a point where your storage setup becomes the bottleneck.

The original workspace lived on the `D:\` drive — but as the project grew to **5,286 source files across 1,343 directories**, with **19 AI agents**, **18 skills**, and **37 HTML reports**, a few realities became unavoidable:

- The `C:\` drive was dangerously low on space (29 GB free)
- `D:\` was filling up and becoming a single point of friction
- The workspace needed to move to `F:\` — a dedicated daily driver

The challenge? Move everything without breaking a single reference, path, or configuration. With **19 agents** and **dozens of scripts** that reference absolute paths, one missed `D:\` could break the entire system.

## The Migration: 4 Phases

### Phase 1: Robocopy (77,113 Files)

The first phase was pure data transfer — every file, every directory, every hidden config:

```
77,113 files  |  9,137 directories  |  2 GB copied
```

Robocopy handled the transfer with its native multi-threading, preserving timestamps and permissions. Exit code 1 — success with a few expected skips (locked files, temp caches).

### Phase 2: Path Replace (17,258 Files)

The critical phase. Every `D:\Projects\Project2Jarvis` reference needed to become `F:\sana-ai-dev-storage\Project2Jarvis` — across **17,258 files**.

```
Before: D:\Projects\Project2Jarvis\...
After:  F:\sana-ai-dev-storage\Project2Jarvis\...
```

A blanket find-and-replace operation patched every config file, script, documentation reference, and hardcoded path. The result was verified via `Select-String` audit: **zero `D:\` references remain** on `F:\`.

### Phase 3: Verification

Every subsystem was tested:

| System | Check | Result |
|--------|-------|--------|
| Git | `git fsck` | Clean — 5 commits intact |
| Obsidian | 4 plugins, 10 themes | All present |
| Scripts | All 19 scripts | Identical on D: and F: |
| MCP Filesystem | Serves `F:/` paths | Correct |
| Node modules | 98 packages | Intact |
| Path references | `Select-String` audit | Zero D:\ found |

### Phase 4: Registry & Shortcuts

- Obsidian vault registry updated to point to `F:\`
- Desktop and Start Menu shortcuts cleaned — no stale `D:\` references
- Residual install data cleaned from `%LOCALAPPDATA%`

## Recovery: C:\ Drive Space

With the migration complete, I reclaimed **31 GB** on the `C:\` drive:

| Action | Space Recovered |
|--------|:--------------:|
| Disk Cleanup (temp files, caches) | +2.2 GB |
| npm cache cleared | +6.7 GB |
| Docker / WSL unregistered | +14.0 GB |
| Playwright browser cache | +2.6 GB |
| NVIDIA DXCache cleared | +5.6 GB |
| **Total** | **+31.0 GB** |

From 29 GB → **60.4 GB free**. The `C:\` drive went from critical to comfortable.

## The /onboarding System

The migration solved the storage problem, but there was a second, subtler challenge: **model continuity**.

Working with AI agents means occasional model switches — when the primary model exhausts its token budget, a fallback model takes over. Without proper context handover, the fallback model starts cold, wasting time and tokens re-establishing context.

The solution: a **low-token onboarding system** (~878 words YAML) that any fallback model can load in seconds.

### How It Works

```
/onboarding command
    → Identity check — are you the primary or fallback?
    → Session verification — was state saved before handover?
    → Context load — AGENTS.md, MEMORY.md, active-context.yaml
    → Report back — "I'm [model] acting as [agent]. Ready."
    → Token warnings — guidance before the fallback runs dry
```

Key design decisions:

| Decision | Rationale |
|----------|-----------|
| **YAML over Markdown** | ~1,500 tokens vs. 3,500+ — 57% less context overhead |
| **Failover chain documented** | Big Pickle → GLM-4.5-Air → any model |
| **Dual deployment** | Onboarding files live on both `D:\` (reference) and `F:\` (active) |
| **Always save first** | `/onboarding` warns: never switch models without saving session state |

### The Failover Chain

```
Step 1: opencode/big-pickle        → Primary — verify via /onboarding
Step 2: openrouter/glm-4.5-air      → Recommended fallback — session-save first
Step 3: any model via select-model  → Tertiary — manual override
```

## The Agent Ecosystem

The project now runs **19 agents** organized into three tiers:

| Tier | Agents | Permission |
|------|--------|------------|
| **Builders** | JARVIS-Builder, ui-ux-pro-max, maintainer | Full access |
| **Council** | architect, security, performance, quality, docs, debugger | Review only |
| **Agency** | code-reviewer, mcp-builder, security-engineer, evidence-collector, workflow-architect | Specialized |

Plus 8 slash commands for rapid workflows — from `/onboarding` for model handover to `/awesome` for the CSS POP design process.

## Results

- **77,113 files migrated** across drives with zero broken references
- **17,258 files path-patched** automatically
- **Zero D:\ references remain** on the F:\ drive
- **31 GB C:\ drive space reclaimed** (29 GB → 60.4 GB)
- **/onboarding system deployed** — 5-step model handover in ~878 YAML tokens
- **19 agents operational** with 8 slash commands and 18 skills

## Takeaways

1. **Storage migrations are path-reference problems, not file-copy problems.** The robocopy was the easy part — patching 17K references was the real work.
2. **Verify with automation, not eyeballs.** A `Select-String` audit across the entire tree catches what manual review misses.
3. **C: drive hygiene compounds.** Clearing npm cache alone freed 6.7 GB — unused caches are silent space killers.
4. **Model handovers need a protocol, not hope.** Without `/onboarding`, a fallback model wastes its first 3,500+ tokens reorienting.
5. **Dual-drive deployment prevents lock-in.** With onboarding files on both D: and F:, neither drive is a single point of failure.
