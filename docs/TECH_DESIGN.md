# Technical Design Document

## Tech Stack
| Layer        | Technology      | Version  | Reason for Choice |
|--------------|-----------------|----------|-------------------|
| Language     | TypeScript      | 5.x      | Type safety, modern ESM |
| Runtime      | Node.js         | ≥ 22     | Native fs.watch, no native compilation needed |
| TUI          | Ink             | 5.x      | React model for terminal UIs, active maintenance |
| CLI          | Commander.js    | 12.x     | Consistent with pomo-cli and todo-cli |
| Rendering    | React           | 18.x     | Required by Ink |
| Build        | tsc             | —        | No bundler needed for a CLI |
| Test         | Vitest          | 2.x      | Fast, ESM-native, consistent with todo-cli |
| Lint/Format  | ESLint + Prettier | —      | Consistent across projects |

> Stack summary is repeated in `AGENTS.md`. When the stack changes, update both files.

## Goals
- Zero-dependency data source: read JSONL files directly, no API calls
- Real-time: < 1 second from file write to dashboard update
- Resilient: never crash on malformed JSONL lines
- Globally installable: `npm install -g claude-watch`

## Non-Goals
- Anthropic API integration (billing endpoint)
- Web UI or any browser component
- Windows support (fs.watch behavior differs)
- Database persistence (all data comes from JSONL files)

## Architecture Overview
Single-process CLI. Commander.js parses args, then renders an Ink app. The Ink app manages two concerns via React hooks:
1. **LogWatcher**: uses `fs.watch` to tail JSONL files, emits parsed `UsageEntry` objects
2. **Aggregator**: accumulates entries into session/day/history state

## Directory Structure
```
src/
├── cli.ts                    ← Entry point, Commander.js setup
├── app/
│   ├── App.tsx               ← Root Ink component
│   ├── panels/
│   │   ├── SessionPanel.tsx  ← Current session metrics
│   │   ├── TodayPanel.tsx    ← Today's aggregate
│   │   └── HistoryPanel.tsx  ← 7-day history (P1)
│   └── hooks/
│       ├── useLogWatcher.ts  ← fs.watch + JSONL parsing
│       └── useAggregator.ts  ← Accumulates UsageEntry[] into display state
├── domain/
│   ├── UsageEntry.ts         ← Parsed JSONL line (value object)
│   ├── SessionMetrics.ts     ← Aggregated session totals
│   ├── DayMetrics.ts         ← Aggregated day totals
│   └── pricing.ts            ← Model pricing table + cost calculator
├── infrastructure/
│   ├── LogReader.ts          ← Reads and tails JSONL files
│   └── ProjectResolver.ts    ← Resolves ~/.claude/projects/ paths
└── utils/
    └── format.ts             ← Number/cost/token formatters
```

## MCP Servers
| Server | Purpose | Config File | Notes |
|--------|---------|-------------|-------|
| None   | —       | —           | —     |

## Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `CLAUDE_WATCH_LOG_DIR` | Override `~/.claude/projects/` path | No |
| `NO_COLOR` | Disable color output (respected automatically by Ink) | No |

## JSONL Data Format
Each line in a session file is a JSON object. Relevant fields:
```typescript
interface RawJSONLEntry {
  type?: string                    // e.g. "assistant"
  timestamp?: string               // ISO 8601
  model?: string                   // e.g. "claude-sonnet-4-6"
  costUSD?: number                 // May be absent in older logs
  usage?: {
    input_tokens?: number
    output_tokens?: number
    cache_creation_input_tokens?: number
    cache_read_input_tokens?: number
  }
}
```

## Model Pricing Table
Stored as a TypeScript constant (can be extracted to JSON later). Example:
```typescript
const PRICING: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  'claude-opus-4-7':    { input: 15,   output: 75,  cacheWrite: 18.75, cacheRead: 1.50  }, // per 1M tokens
  'claude-sonnet-4-6':  { input: 3,    output: 15,  cacheWrite: 3.75,  cacheRead: 0.30  },
  'claude-haiku-4-5':   { input: 0.80, output: 4,   cacheWrite: 1,     cacheRead: 0.08  },
}
```
If `costUSD` is present in the log, use it directly. Otherwise, compute from the table.

## File Watching Strategy
```
on start:
  1. Scan ~/.claude/projects/**/*.jsonl for all session files
  2. Parse existing lines → seed initial state
  3. Register fs.watch on the projects/ directory (recursive)

on fs.watch event:
  1. Read new lines appended since last known position (track byte offset per file)
  2. Parse each line → emit UsageEntry
  3. Ink re-renders via setState
```

## Component Architecture
```
<App>
  ├── useLogWatcher()     → streams UsageEntry[]
  ├── useAggregator()     → reduces to { session, today, history }
  ├── <SessionPanel>      → displays session totals
  ├── <TodayPanel>        → displays today totals
  └── <HistoryPanel>      → 7-day table (P1)
```

## Error Handling Strategy
- **JSONL parse errors:** catch per-line, skip silently, increment `parseErrors` counter shown in footer
- **File not found:** show "Waiting for Claude Code session…" placeholder
- **fs.watch errors:** display error message in UI, attempt to re-establish watch after 5s
- **No logging to disk** — this is a display-only tool

## Security Considerations
- **Authentication:** none required — reads local files only
- **Data at rest:** reads `~/.claude/` — user's own data, no transmission
- **Data in transit:** none — fully offline
- **Sensitive data:** JSONL may contain prompt content — never log or transmit it

## Performance Considerations
- **SLA targets:** < 1s update latency, < 50ms Ink render
- **Caching strategy:** keep accumulated state in React refs, don't re-parse entire file on each event
- **Known bottlenecks:** initial scan of many large JSONL files on startup — stream lines, don't load into memory
- **Scaling approach:** N/A — single-user local tool

## Known Technical Debt
- Model pricing table is hardcoded — needs periodic update as Anthropic changes prices
