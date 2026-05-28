# Progress

## Done
- [x] 2026-05-28 — Full documentation suite scaffolded (init-docs)

## In Progress
- [ ] MVP implementation

## Blocked
| Item | Blocker | Who can unblock |
|------|---------|-----------------|
| — | — | — |

## Next
- [ ] TypeScript project scaffold (package.json, tsconfig, vitest config)
- [ ] Domain layer: UsageEntry, SessionMetrics, DayMetrics, pricing
- [ ] Infrastructure: LogReader (byte-offset tail), ProjectResolver
- [ ] App layer: useLogWatcher hook, useAggregator hook
- [ ] Ink UI: App.tsx, SessionPanel, TodayPanel
- [ ] CLI entry point (Commander.js)
- [ ] Unit tests for domain layer
- [ ] Integration tests for LogReader
- [ ] GitHub repo + initial commit
- [ ] Global install (`npm install -g`)

## Icebox
- `--project` flag filter (P1)
- 7-day history panel (P1)
- `claude-watch report` subcommand (P1)
- Budget threshold warning with color change (P2)
- Export to JSON/CSV (P2)
