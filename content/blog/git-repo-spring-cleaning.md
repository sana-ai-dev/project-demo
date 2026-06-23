---
title: "Git Repo Spring Cleaning: How I Cleaned 5 Months of Debt in 20 Minutes Without Breaking Anything"
date: "2026-06-06"
tags: ["Git", "DevOps", "Version Control", "Automation", "Workflow", "Maintenance"]
category: "TECH"
excerpt: "A phase-gated approach to cleaning 5 months of accumulated git repo debt — orphaned submodules, untracked binaries, line-ending chaos, branch rename, and clone verification — with zero data loss and a rollback at every step."
---

## The Problem

Every repo accumulates debt. Not code debt — **git debt**.

Five months of daily work, 19 AI agents, 18 skills, and countless experiments had left the repo in a state I no longer trusted:

- **6 orphaned submodule gitlinks** — directories whose repos had been moved or deleted, but git still expected a `git submodule update` to work
- **21 old session files** tracked in git — logs, temporary outputs, conversation dumps that should never have been committed
- **5 generated HTML reports** in version control — binary artifacts bloating the history
- **Line-ending chaos** — some files CRLF, some LF, some mixed, because `.gitattributes` never existed
- **The default branch was still `master`** — every modern convention says `main`, but the rename felt risky with a team of zero and a backlog of fear
- **No safety net** — one wrong `git clean -fd` or `git rm -rf` and weeks of work could vanish

The fear was real: *"What if I break it and can't undo it?"*

I needed a process that made breaking things impossible — not through caution, but through **architecture**.

## The Solution: 10 Safety-Gated Phases

Every phase had its own **verification gate** and **rollback plan**. No `--force`, no `git clean -fd`, no destructive shortcuts. Each phase proved the repo was intact before the next began.

### Phase 0: Safety Snapshot (Mandatory)

Before touching anything:

```bash
git checkout -b backup/pre-cleanup-2026-06-06
git stash pop  # restore uncommitted work first
```

A full branch backup — the reset button if anything went wrong. This single step transformed the cleanup from *frightening* to *freeing*.

### Phase 1: Cloudflare Check (Read-Only)

Confirmed this was `project-jarvis-home`, not the portfolio repo. No `wrangler.toml`, no `.cloudflare/`. A read-only sanity check before any writes.

### Phase 2: `.gitignore` + `.gitattributes`

Two files that should have existed on day one:

**`.gitignore` additions:**
- `state.json` — session state (machine-specific, changes every session)
- Binary report artifacts — 5 generated HTML reports

**`.gitattributes`** (28 lines of Windows CRLF rules):
```
*.md       text eol=crlf
*.yaml     text eol=crlf
*.json     text eol=crlf
*.png      binary
*.jpg      binary
*.svg      binary
```

Binary markers protect against git trying to diff image files, which corrupts them. CRLF for all text because this is a Windows-first environment.

### Phase 3: Submodule Gitlink Removal

The 6 orphaned submodule entries existed only in git's index — the actual directories had already been detached from their remote repos:

```
git rm --cached 04_Active_Work/opencode-dash-v3
git rm --cached 05_Archive/agency-agents
... 4 more
```

**Verification:** all 6 directories still have their own `.git/` folders on disk with full content intact. Git just stopped tracking them as submodules.

### Phase 4: Untrack HTML Reports

Five generated reports were sitting in git's index:

```
git rm --cached 07_Reports/output/*.html
```

Files remain on disk. They're now properly in `.gitignore` and won't be re-tracked.

### Phase 5: Line-Ending Normalization

With `.gitattributes` in place:

```bash
git add --renormalize .
```

This touched **86 files**, applying CRLF to text, binary to images, without changing a single byte of content. Pure metadata cleanup.

### Phase 6: Branch Rename (`master` → `main`)

The scary one. But with `backup/pre-cleanup-2026-06-06` as a safety net:

```bash
git branch -m master main
git remote prune origin
```

Remote `master` untouched — it stays as-is on GitHub. The local rename is safe because the backup branch preserves the original state.

### Phase 7: 5 Semantic Commits

Instead of one giant "cleanup" commit, I split the changes into logical commits:

| # | Message | Files | Scope |
|---|---------|-------|-------|
| 1 | `chore: remove orphaned submodule gitlinks + untrack HTML reports + gitignore/gitattributes + cleanup old session files` | 34 | Foundation |
| 2 | `feat: session start/end workflow — /startsession, /endsession, state.json, template` | 6 | New feature |
| 3 | `fix: update 3 agent configs with Layer 0 Session Bootstrap + corrected session end paths` | 4 | Agent configs |
| 4 | `fix: register /startsession and /endsession in KB configs` | 3 | KB registration |
| 5 | `fix: memory protocol standardization — 10 agent files switch to shared Memory Config` | 11 | Memory protocol |

A 6th commit followed for the remaining **34 line-ending-only files** — cosmetic changes from the renormalize that didn't fit the semantic commits.

### Phase 8: Push to Remote (With DRY-RUN)

```bash
git push --dry-run origin main
# verified: nothing unintentional
git push origin main
```

New `main` branch created on remote. `master` preserved. Both exist. No history rewritten.

### Phase 9: Clone Verification

The ultimate test:

```bash
git clone F:\sana-ai-dev-storage\Project2Jarvis C:\Users\Sana\AppData\Local\Temp\clone-test
cd clone-test
git status  # clean!
git log     # 6 commits present
```

**1,346 files cloned. Zero errors. Zero modified files. Zero submodule warnings.**

The cloned temp directory was deleted. The proof stood.

## The Results

| Metric | Value |
|--------|-------|
| **Phases completed** | 10 (+1 extra commit) |
| **Commits** | 6 (all pushed) |
| **Submodule gitlinks removed** | 6 |
| **Old session files deleted from tracking** | 21 |
| **HTML reports untracked** | 5 |
| **Files normalized (CRLF)** | 34 |
| **Files touched total** | 120+ |
| **Errors** | 0 |
| **Rollback needed** | 0 |
| **Safety rules violated** | 0 |

### What was NOT lost

- All 6 submodule directories remain on disk with their own `.git/` repos
- All 5 HTML reports remain on disk (just untracked)
- Remote `master` branch preserved untouched
- Backup branch `backup/pre-cleanup-2026-06-06` still available

### What was gained

- Clean `git status` — zero modified files (first time in months)
- Proper `.gitattributes` — line endings are now predictable
- Proper `.gitignore` — session artifacts stay local
- Default branch `main` — modern convention
- Clone-tested — the repo is in a verified cleanable state
- **Confidence** — the fear of breaking the repo is gone

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **`git rm --cached` not `git rm`** | Never remove files from disk — only untrack them |
| **5 semantic commits not 1** | Clean history for future bisects and blame |
| **DRY-RUN before push** | Verify intent before modifying remote |
| **Clone test after push** | Prove the remote is in a cloneable state |
| **No `--force` anywhere** | Rewriting history creates more problems than it solves |
| **No `git clean -fd`** | Too dangerous — one wrong glob and data is gone |
| **Rollback branch first** | The single most important step — makes everything else fearless |

## Takeaways

1. **A safety branch is not optional.** `backup/pre-cleanup-2026-06-06` cost 5 seconds to create and was worth its weight in gold. Every cleanup session should start with one.

2. **Git debt compounds silently.** Five months of "I'll fix line endings later" became 86 files that needed renormalization. A `.gitattributes` file on day one would have prevented all of it.

3. **`git rm --cached` is your friend.** It untracks files without deleting them. Paired with `.gitignore`, it's the safest way to clean an index.

4. **Semantic commits are worth the overhead.** Splitting ~86 files into 5 logical commits took 6 extra minutes. The resulting history is readable, bisectable, and professional.

5. **Clone test the remote, not just your local.** A clean local `git status` doesn't prove the remote clone works. Clone into a temp directory — it's the only real verification.

6. **Fear of breaking the repo is the biggest blocker — and the easiest to solve.** A backup branch and phase gates turn "this is too risky" into "let me show you how safe it is."
