---
status: Accepted
date: 2026-05-28
decision-makers: Vinicius
consulted: —
informed: —
---

# ADR-001: Initial Architecture

## Context and Problem Statement
We need a CLI tool that reads Claude Code's local JSONL session logs and displays real-time token/cost metrics in the terminal. The tool is solo-maintained, has no backend, and must be installable globally with `npm install -g`. The core challenge is: how do we watch files in real time and render a live TUI without unnecessary complexity?

## Decision Drivers
- Must update the display within 1 second of Claude Code writing to a JSONL file
- Must not crash on malformed JSONL lines (format is undocumented and may change)
- Must be globally installable as a single CLI binary
- Solo project — minimal architectural overhead
- Consistent with existing personal CLI projects (pomo-cli, todo-cli)

## Considered Options
- **Option A:** Layered CLI — Commander.js entry point + domain layer (value objects, pricing) + infrastructure (LogReader, ProjectResolver) + Ink TUI app layer
- **Option B:** Flat script — single file with all logic, no layering
- **Option C:** Electron / web-based dashboard — browser UI polling local files via a local HTTP server

## Decision Outcome
Chosen: **Option A (Layered CLI)** because it separates the pure domain logic (parsing, aggregation, pricing) from I/O concerns (file watching) and rendering (Ink), making each part independently testable and replaceable without touching the rest.

### Consequences
- **Positive:** Domain logic is pure and fully unit-testable without file system access; Ink components can be developed independently from the watcher logic
- **Negative:** Slightly more files than a flat script approach; requires understanding the layer boundary rules
- **Neutral:** No database, no persistence layer — all state lives in React refs during the process lifetime

### Confirmation
Layer boundaries are enforced by convention: `domain/` has no imports from `infrastructure/` or `app/`. Violations will be caught in code review.

## Pros and Cons of the Options

### Option A — Layered CLI
- ✅ Pure domain functions are trivially unit-testable
- ✅ Ink component tree is decoupled from file I/O
- ✅ Easy to swap Ink for another renderer later
- ❌ More files than a simple script

### Option B — Flat script
- ✅ Fastest to write initially
- ❌ Untestable — file watching and rendering are interleaved
- ❌ Becomes unmaintainable as features are added

### Option C — Electron / web dashboard
- ✅ Richer UI capabilities
- ❌ Massive dependency footprint
- ❌ Requires a local HTTP server and browser — defeats the "stays in terminal" goal

## Review Trigger
Revisit if: the Ink library is abandoned, Claude Code changes its JSONL format substantially, or the tool needs to support a web view alongside the TUI.
