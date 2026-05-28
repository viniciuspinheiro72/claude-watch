# Active Context

<!-- Update this file at the START and END of every AI session.
     It is the first doc read each session to restore project state. -->

## Current Focus
Widget mode is feature-complete. All flags implemented and working.

## In Progress
- Nothing

## Blockers
- None

## Next Steps
- Write tests for `UsageApi.ts` and `useUsage` hook
- Consider token refresh logic if OAuth token expires mid-session

## Significant Decisions
- 2026-05-28 — Chosen Ink TUI + JSONL local file approach (not Anthropic API)
- 2026-05-28 — Layered architecture: domain / infrastructure / app (see ADR-001)
- 2026-05-28 — `costUSD` fallback to pricing table always implemented
- 2026-05-28 — `--small` widget mode added: `SmallPanel.tsx`, `-s/--small` CLI flag
- 2026-05-28 — Widget pulls real limits from `GET /api/oauth/usage` (discovered via binary analysis)
- 2026-05-28 — `--no-border` flag added to strip widget border for tmux embedding
- 2026-05-28 — Split `App` into `WidgetApp` / `FullApp` to fix `q` key not working in widget mode

## Recent Context
- 2026-05-28 — Full MVP implemented: all domain, infrastructure, app layers, 6 test files
- 2026-05-28 — Widget mode (`--small`) added with real usage limits from claude.ai API
- 2026-05-28 — `--no-border` flag added; terminal cleared on widget start; bar width responsive to resize
- 2026-05-28 — Fixed `q` key by splitting App into WidgetApp/FullApp components

## Open Questions
- Should the pricing table live in a user-editable JSON file or stay as a TS constant?
- Should `claude-watch` stay alive when no Claude session is active, or exit after N seconds of inactivity?
