# Active Context

<!-- Update this file at the START and END of every AI session.
     It is the first doc read each session to restore project state. -->

## Current Focus
MVP is fully implemented and working. Most recent addition: `--small` / `-s` compact widget mode.

## In Progress
- Nothing — widget mode shipped

## Blockers
- None

## Next Steps
- Write unit/snapshot tests for `SmallPanel`
- Consider a `--budget <amount>` flag so the today bar shows spend vs. a user-defined daily limit
- Consider whether `claude-watch` should exit after N seconds of inactivity (open question)

## Significant Decisions
- 2026-05-28 — Chosen Ink TUI + JSONL local file approach (not Anthropic API)
- 2026-05-28 — Layered architecture: domain / infrastructure / app (see ADR-001)
- 2026-05-28 — `costUSD` fallback to pricing table always implemented
- 2026-05-28 — `--small` widget mode added: `SmallPanel.tsx`, `-s/--small` CLI flag

## Recent Context
- 2026-05-28 — Project initialized with full documentation suite (init-docs skill)
- 2026-05-28 — Full MVP implemented: all domain, infrastructure, app layers, 6 test files
- 2026-05-28 — Widget mode (`--small`) added: compact 6-line panel with color bars and reset countdown

## Open Questions
- Should the pricing table live in a user-editable JSON file or stay as a TS constant?
- Should `claude-watch` stay alive when no Claude session is active, or exit after N seconds of inactivity?
- Should `--budget <amount>` be added so the today bar shows progress toward a daily spending limit?
