# Architecture

## Overview
Lightweight layered CLI. The domain layer defines pure value objects (UsageEntry, SessionMetrics, DayMetrics, PricingTable). The infrastructure layer handles JSONL file reading and path resolution. The app layer (Ink components + hooks) composes domain objects into a live TUI. Commander.js at the entry point routes subcommands.

## Directory Structure
```
claude-watch/
├── src/
│   ├── cli.ts                    ← Entry point: Commander.js setup, launches Ink app
│   ├── domain/
│   │   ├── UsageEntry.ts         ← Parsed JSONL line (value object)
│   │   ├── SessionMetrics.ts     ← Aggregated session totals (value object)
│   │   ├── DayMetrics.ts         ← Aggregated day totals (value object)
│   │   └── pricing.ts            ← PRICING table + computeCost()
│   ├── infrastructure/
│   │   ├── LogReader.ts          ← Reads and tails JSONL files (byte-offset tracking)
│   │   └── ProjectResolver.ts    ← Decodes ~/.claude/projects/ encoded folder names
│   ├── app/
│   │   ├── App.tsx               ← Root Ink component
│   │   ├── hooks/
│   │   │   ├── useLogWatcher.ts  ← fs.watch integration, emits UsageEntry[]
│   │   │   └── useAggregator.ts  ← Reduces UsageEntry[] → session/today/history state
│   │   └── panels/
│   │       ├── SessionPanel.tsx  ← Current session metrics display
│   │       ├── TodayPanel.tsx    ← Today's aggregate display
│   │       └── HistoryPanel.tsx  ← 7-day history table (P1)
│   └── utils/
│       └── format.ts             ← Token/cost number formatters
├── tests/
│   ├── unit/                     ← Domain logic tests
│   └── integration/              ← LogReader tests with real temp files
└── docs/
```

## Layer Responsibilities
| Layer          | Folder               | Responsibility |
|----------------|----------------------|----------------|
| Domain         | `src/domain/`        | Value objects, pricing calculation, aggregation logic — pure functions, no I/O |
| Infrastructure | `src/infrastructure/`| JSONL file reading, fs.watch, path resolution — all I/O lives here |
| App (UI)       | `src/app/`           | Ink components and React hooks — composes domain + infrastructure into live display |
| Entry point    | `src/cli.ts`         | Commander.js arg parsing, wires dependencies, mounts Ink app |

## Dependency Rules
- `domain/` has zero imports from `infrastructure/`, `app/`, or external packages (except Node built-ins for types)
- `infrastructure/` imports from `domain/` only
- `app/` imports from `domain/` and `infrastructure/` — never directly reads files itself
- `cli.ts` imports from all layers — it is the composition root
- Never import Ink or React from `domain/` or `infrastructure/`

## Data Flow
```
JSONL file write (Claude Code)
  → fs.watch event (LogReader)
  → new bytes read (LogReader.readNewLines)
  → JSON.parse → UsageEntry (domain)
  → emitted via useLogWatcher hook
  → accumulated by useAggregator hook
  → SessionMetrics + DayMetrics computed
  → Ink re-render (SessionPanel, TodayPanel)
  → terminal output
```

## Where to Add New Things
| Thing                        | Where |
|------------------------------|-------|
| New display panel            | `src/app/panels/` + wire in `App.tsx` |
| New aggregation calculation  | `src/domain/` (pure function) |
| New file I/O or path logic   | `src/infrastructure/` |
| New CLI flag or subcommand   | `src/cli.ts` |
| New unit test                | `tests/unit/` |
| New integration test         | `tests/integration/` |
| New token formatter          | `src/utils/format.ts` |
| Model pricing update         | `src/domain/pricing.ts` |

## Key Conventions
- All domain objects are immutable value objects (readonly fields, no setters)
- No class hierarchies — prefer plain objects and pure functions in `domain/`
- Ink components are functional React components with hooks
- See `docs/STRUCTURE.md` for file naming and import conventions

## Architecture Decision Records
- Location: `docs/adr/`
- Write an ADR when: changing the TUI library, switching data sources, adding persistence, or changing the dependency rules above.
- See `docs/adr/ADR-001-initial-architecture.md` for the first entry and format reference.
