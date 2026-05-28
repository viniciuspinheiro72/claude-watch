# Active Context

<!-- Update this file at the START and END of every AI session.
     It is the first doc read each session to restore project state. -->

## Current Focus
Project just initialized — no code written yet. Next step is scaffolding the TypeScript project and implementing the MVP.

## In Progress
- Nothing yet — documentation phase complete

## Blockers
- None

## Next Steps
1. Scaffold TypeScript project: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `.prettierrc`
2. Implement `src/domain/UsageEntry.ts` — JSONL parser (returns `null` on error, never throws)
3. Implement `src/domain/pricing.ts` — model pricing table + `computeCost()` function
4. Implement `src/infrastructure/LogReader.ts` — byte-offset JSONL tail reader
5. Implement `src/infrastructure/ProjectResolver.ts` — decode `~/.claude/projects/` folder names
6. Implement `src/app/hooks/useLogWatcher.ts` — `fs.watch` integration
7. Implement `src/app/App.tsx` + `SessionPanel`, `TodayPanel`
8. Wire `src/cli.ts` with Commander.js
9. Write unit tests for domain layer
10. Create GitHub repo, make initial commit

## Significant Decisions
- 2026-05-28 — Chosen Ink TUI + JSONL local file approach (not Anthropic API)
- 2026-05-28 — Layered architecture: domain / infrastructure / app (see ADR-001)
- 2026-05-28 — `costUSD` fallback to pricing table always implemented

## Recent Context
- 2026-05-28 — Project initialized with full documentation suite (init-docs skill)

## Open Questions
- Should the pricing table live in a user-editable JSON file or stay as a TS constant?
- Should `claude-watch` stay alive when no Claude session is active, or exit after N seconds of inactivity?
