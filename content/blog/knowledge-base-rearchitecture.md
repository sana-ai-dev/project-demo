---
title: "Re-Architecting a Knowledge Base: Flat Files to Schema-Validated YAML"
date: "2026-05-15"
tags: ["Knowledge Base", "YAML", "Architecture", "Migration", "Schema", "Automation"]
category: "TECH"
excerpt: "Migrated a flat markdown knowledge base into a 4-tier YAML system with schema validation, auto-generated indexes, token budget tracking, and a full restore point snapshot."
---

## The Problem

The knowledge base had grown organically — a flat folder of markdown files with no structure, no validation, and no way to know what was current or stale. Key problems:

- **No schema** — every file had its own format
- **No index** — finding anything required searching
- **Token budget invisible** — no tracking of context window usage
- **No validation** — malformed entries went undetected
- **Stale files mixed** — current and archived content lived side by side

## The Solution: 4-Tier YAML Knowledge Base

### Structure

```
03_Knowledge_Base/
├── 00_directives/       # Core rules, principles, never-changing
├── 01_hot/              # Active context, current session
├── 02_warm/             # Reference, lessons, research
│   ├── reference/
│   ├── research/
│   └── templates/
└── 03_cold/             # Archive, obsolete, raw backups
    ├── raw/
    └── archive/
```

Each tier has a specific purpose and token budget:

| Tier | Budget | Purpose |
|------|--------|---------|
| `00_directives` | 300t | Core rules — always loaded |
| `01_hot` | 640t | Active session context |
| `02_warm` | 1,000t | Per-session reference cap |
| `03_cold` | 460t | Archive — loaded on demand |
| **Total** | **2,400t** | |

### Schema Validation

Every YAML file follows a validated schema with required fields, type checking, and cross-references. A `validate-schema.js` script runs before commits:

```bash
node _scripts/validate-schema.js --verbose
```

### Auto-Generated Compass

A `regenerate-compass.js` script scans the entire knowledge base and produces `_compass.yaml` — an auto-generated index of all entries with paths, summaries, and last-updated timestamps.

### Migration Stats

| Metric | Value |
|--------|-------|
| YAML files created | 32 |
| Markdown files archived | 20 |
| Agent files updated | 13 |
| Stale paths fixed | 6 |
| Files deleted | 4 |
| Restore point size | Full pre-migration snapshot |

## Token Budget Fix

A critical bug was discovered: the warm pool was being calculated as the **sum of all warm files**, when it's actually a **per-session cap**. The fix ensures the warm pool allocation is accurate — if you reference 5 files in a session, each counts toward the 1,000t cap, not the total of all warm files.

## Audit Results

- **Baseline over budget**: 150t (2,550 / 2,400) — acceptable with model fallback on free tier
- **Hot entries (860t)** exceed allocation (640t) — needs pruning in next session
- **All schemas valid** — no validation errors

## Key Results

- **32 structured YAML files** replacing flat markdown
- **Schema validation** enforced pre-commit
- **Auto-generated index** (`_compass.yaml`) always up to date
- **Token budget** accurately tracked per tier
- **13 agent files** updated with new KB paths
- **Restore point** created for rollback safety
- **20 stale markdown files** archived or deleted

## Takeaways

1. **Structure prevents entropy.** A 4-tier system with clear boundaries keeps information findable.
2. **Validate early, validate often.** Schema validation catches mistakes before they compound.
3. **Token budgets need monitoring.** It's easy to exceed limits without visibility.
4. **Auto-generated indexes scale.** Manual indexes become stale; regenerated ones don't.
5. **Always snapshot before migration.** A restore point saved the session when a path broke.
