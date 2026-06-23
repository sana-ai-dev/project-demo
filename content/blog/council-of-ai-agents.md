---
title: "Building a Council of AI Agents + Designing a Persona System"
date: "2026-05-08"
tags: ["AI Agents", "Multi-Agent", "Persona", "OpenCode", "Architecture"]
category: "TECH"
excerpt: "Designed and implemented a multi-agent council system with specialized reviewer roles and a Maestro persona for orchestrating AI-assisted workflows."
---

## The Problem

A single AI assistant is a generalist — competent across many domains but expert in none. For tasks requiring specialized knowledge (security auditing, performance optimization, architectural review), you need **multiple specialized perspectives**. The challenge: how do you design a system where multiple AI agents collaborate effectively?

## The Solution

### The Council System

I built a 4-member council system where each member has a specialized role:

| Member | Role | Expertise |
|--------|------|-----------|
| **Architect** | System design review | Architecture patterns, trade-offs, scalability |
| **Coder/Debugger** | Code quality & bug diagnosis | Error patterns, edge cases, fix recommendations |
| **Security** | Vulnerability assessment | Threat modeling, secure coding, OWASP |
| **Performance** | Optimization review | Bottlenecks, caching, algorithms |

A dedicated `@council` trigger in `AGENTS.md` activates the entire council for any task.

### Persona System (Maestro)

Beyond the council, I designed a **Maestro persona** — an orchestration layer that coordinates AI agents like a conductor:

- **SOUL.md** — The persona definition file containing Maestro's identity, skills, and operating principles
- **Persona section** added to `AGENTS.md` to load Maestro on session start
- **Decision framework** — Maestro decides which council members to consult for each task

The persona system follows this architecture:

```
Maestro (Orchestrator)
  ├── Council: Architect
  ├── Council: Coder/Debugger
  ├── Council: Security
  ├── Council: Performance
  └── Direct: html-reports, brainstorming, critique skills
```

### Subagent → Council Migration

Three existing subagents were migrated into the council structure:

- `executing-plans/` → deleted (replaced by council workflow)
- `subagent-driven-development/` → deleted
- `writing-plans/` → deleted
- `council/SKILL.md` → created with 4 members

## Key Results

- **4-member council** operational — each member with distinct expertise
- **`@council` trigger** works from any context in `AGENTS.md`
- **Maestro persona** created with full identity, skills, and principles
- **3 old subagent systems** cleaned up and replaced
- **Test protocol** documented: restart OpenCode and verify 0mem auto-load + Maestro persona

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Council over single agent | Multiple perspectives catch more issues |
| Maestro as orchestrator | Separates "what to do" from "how to do it" |
| `@council` trigger | Simple, memorable invocation from any context |
| SOUL.md for persona | Separate file keeps persona distinct from config |
| Delete old subagents | Prevents confusion with the new council system |

## Takeaways

1. **Multi-agent systems need an orchestrator.** Without Maestro, the council has no direction.
2. **Specialization beats generalization.** Four focused reviewers outperform one generalist.
3. **Personas give AI consistent behavior.** A well-defined persona file shapes every response.
4. **Clean up old patterns.** Migrating from subagents to council left no obsolete files behind.
