# Product Requirements Document (PRD)

## Overview & Purpose
claude-watch is a real-time terminal dashboard CLI that parses Claude Code's local JSONL session logs and displays live token usage and cost metrics via an Ink TUI.

## Problem Statement
Claude Code writes detailed usage data locally but exposes no live dashboard. Developers running long sessions have no way to track spend in real time.

## Target Users & Personas
**Dev Dana** — solo developer, daily Claude Code user, pay-per-use plan. Goal: know session cost before it's too late. Frustration: gets surprised by monthly bills.

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| Real-time visibility | Lag between Claude Code write and dashboard update | < 1 second |
| Accurate cost display | Cost matches claude.ai Usage tab | ≤ 1% deviation |
| Zero friction | Time from `claude-watch` to live dashboard | < 2 seconds |

## Scope

### MVP Features — P0
- `claude-watch` command — launches live Ink TUI
- Current session panel: input tokens, output tokens, cache read tokens, cache write tokens, cost (USD)
- Today summary panel: total tokens, total cost, session count
- Auto-detect active Claude Code session from JSONL files
- `fs.watch` + readline for real-time updates

### Important Features — P1
- `--project <path>` flag to filter to a specific project directory
- 7-day history panel (bar chart or table)
- Model breakdown (which models used, cost per model)
- `claude-watch report` subcommand for static one-shot summary

### Nice-to-have — P2
- Budget threshold warning (color change when approaching limit)
- Export to JSON/CSV
- Per-conversation breakdown

## Functional Requirements
- Parse `~/.claude/projects/**/*.jsonl` — one directory per project (encoded path), one file per session
- Each JSONL line may contain: `usage.input_tokens`, `usage.output_tokens`, `usage.cache_creation_input_tokens`, `usage.cache_read_input_tokens`, `costUSD`, `model`, `timestamp`
- Malformed or missing lines must be skipped silently
- If `costUSD` is absent, compute from token counts using a bundled model pricing table
- Dashboard refreshes within 1 second of new JSONL line being written
- Works on macOS and Linux

## Non-Functional Requirements
| Attribute     | Requirement | Notes |
|---------------|-------------|-------|
| Performance   | < 50ms render time per frame | Ink re-render budget |
| Startup       | < 2s cold start | Parse existing logs on start |
| CPU usage     | < 5% idle | While watching, no active Claude session |
| Compatibility | Node.js ≥ 22, macOS + Linux | Windows not required |
| Accessibility | Respects `NO_COLOR` env var | For non-color terminals |

## User Stories & Acceptance Criteria

**US-01: Live session tracking**
As Dev Dana, I want the dashboard to update automatically when Claude Code writes a new message, so I can see my cost growing in real time.
- Given: Claude Code is running a session
- When: a new message completes and Claude Code writes to the JSONL
- Then: the dashboard updates within 1 second, showing updated token counts and cost

**US-02: Today's summary**
As Dev Dana, I want to see how much I've spent today across all sessions, so I can budget my remaining work.
- Given: multiple sessions were run today
- When: I open claude-watch
- Then: the Today panel shows total tokens and total cost for the current calendar day

**US-03: Project filter**
As Dev Dana, I want to filter the dashboard to one project directory, so I can see costs for a specific client engagement.
- Given: multiple projects in ~/.claude/projects/
- When: I run `claude-watch --project ~/projects/my-app`
- Then: only sessions from that project are included in all panels

## Technical Considerations
- JSONL format is undocumented — parse defensively, never crash on unexpected fields
- `fs.watch` may coalesce rapid writes — also track file size and re-read tail on change
- Model pricing table must be updatable without a code change (JSON config file)

## Milestones & Releases
- v0.1.0: MVP — live TUI, current session + today summary
- v0.2.0: P1 features — project filter, 7-day history, `report` subcommand

## Assumptions & Constraints
- Claude Code writes JSONL files atomically per line (append-only)
- User has Node.js 22+ installed
- `~/.claude/` directory structure is stable across Claude Code versions

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| JSONL schema changes | Medium | High | Defensive parsing, version detection |
| Ink incompatibility with terminal | Low | Medium | Test suite on common emulators |
| costUSD absent in logs | Medium | Medium | Fallback pricing table |

## Open Questions
- Should the pricing table be embedded in code or a user-editable JSON file?
- Should `claude-watch` stay alive when no Claude session is active, or exit?
