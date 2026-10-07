---
title: "The Token Budget Nobody Enforced — And What Measurement Exposed"
date: "2026-10-07"
tags: ["OpenCode", "AI Agents", "Token Budget", "YAML", "Python", "Technical Debt"]
category: "TECH"
excerpt: "A 'token budget exceeded' warning had appeared for months. The guard meant to catch it was counting lines instead of tokens — here's what happened when we finally measured."
---

## The Problem

For months, the same warning kept appearing: *token budget exceeded*. The number behind it came from `00_directives/token-budget.yaml`, which declares a 200-token cap per hot file and a 3,500-token budget per session. The directive was clear. The problem was that **nothing actually enforced it.**

The only automated guard was a small script, `auto-summary.py`, that compared *line counts* against a *token* cap. A 180-line file at roughly 3,700 tokens sailed through as "under 200" — because 180 is under 200. The guard wasn't lenient; it was measuring a different quantity entirely.

This is the kind of bug that survives for months because it fails in the comfortable direction: everything looks fine right up until you check.

## The Solution

The fix to the guard itself was small: compute `len(text.encode('utf-8')) // 4` and compare that against the token cap, everywhere the check runs — including the printed report. Tokens in, tokens out.

The interesting part wasn't the fix. It was what the fix immediately reported.

**The guard fired on real data the moment it started measuring the right thing:**

| File | Tokens |
|---|---|
| `AGENTS.md` (loaded every session) | 2,895 |
| `MEMORY.md` | 3,697 |
| `01_hot/active-context.yaml` | 3,541 |
| `01_hot/active-tasks.yaml` | 2,467 |
| **Hot layer total** | **6,549** |

The budget was 3,500. The hot layer was running at **187% of it**, and `MEMORY.md` alone exceeded the entire session budget. None of this was new — it had been true the whole time. It just hadn't been visible.

That's the first lesson: **enforcing measurement is not the same as meeting the budget.** This session made the number honest. It did not make it compliant, and pretending otherwise would have been the same bug wearing a different hat.

### The YAML rabbit hole

A separate repair task hit a file that wouldn't parse at all. The cause was a Windows path inside a double-quoted YAML scalar — `\P` and `\B` are read as escape sequences, so `C:\Program Files\...` silently became garbage. Single quotes fixed it, because single-quoted YAML scalars treat backslashes literally.

While chasing that, a worse find surfaced: the archive writer in `auto-summary.py` was opening a `.yaml` file in append mode and writing **raw markdown** into it. Every end-of-session run since the script was written had appended invalid YAML to `lessons-learned.yaml` — a 95-line markdown tail sitting inside a YAML file. The repair was to comment-prefix the tail (preserving every line verbatim) and fix the writer to comment each line before appending, so the file stays parseable going forward.

Two files that looked broken weren't: four directive files failed `safe_load` but were actually the Obsidian-standard *frontmatter + markdown body* pattern. No code parses them. Restructuring a directive that contains governance text, for a cosmetic consistency win, is riskier than the inconsistency — so they were left alone.

### The deeper pattern: report only what a command confirmed

The session note for this work was initially written with numbers and closures that measurement contradicted — it claimed a 3,372-token reduction that never happened, and marked two audit items closed that had never been touched. The note was rewritten from measured values.

That's the second lesson, and the more transferable one: **an unchecked claim in a status report is the same class of bug as a line-count guard enforcing a token budget.** Both fail in the comfortable direction. Both survive because nobody re-measures.

## Key Results

- `auto-summary.py` now measures tokens (`bytes // 4`), not lines — guard verified firing on real data
- Hot-layer usage measured honestly: **6,549 tokens = 187% of the 3,500 budget**
- `lessons-learned.yaml` repaired (was unparseable from raw-markdown appends) and its writer fixed to stay parseable
- Windows-path YAML escape bug fixed with single-quoted scalars
- Four "broken" files correctly diagnosed as frontmatter documents and left untouched
- Session note rewritten to match measured values only

## Takeaways

- **Guards measure what they claim to measure.** A token cap checked against line counts is not a token cap. Audit the unit, not just the threshold.
- **Making a number visible is step one; meeting it is step two.** Report the gap honestly instead of letting the check pass quietly.
- **Failing in the comfortable direction is how debt accumulates.** If every check says "fine" while the budget is at 187%, the check is the bug.
- **In YAML, single quotes are the safe default for anything with backslashes.** Windows paths in double-quoted scalars will silently break.
- **Only report what a command confirmed.** Status notes are code — they fail silently too.
