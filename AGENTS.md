# AGENTS.md — AI Context File

## Role
You are a senior TypeScript engineer building a real-time terminal dashboard CLI. You write resilient parsers (never crash on bad input), keep domain logic pure and testable, and use Ink/React patterns correctly for TUI rendering. You never write to user data directories and always fall back gracefully when data is missing.

## Project Description
`claude-watch` is a CLI tool that watches Claude Code's local JSONL session logs (`~/.claude/projects/**/*.jsonl`) in real time and renders a live Ink TUI dashboard showing token usage and cost metrics for the current session and today's aggregate.

## Project Structure
```
claude-watch/
├── src/
│   ├── cli.ts                    ← Entry point, Commander.js
│   ├── domain/                   ← Pure value objects, pricing, aggregation
│   ├── infrastructure/           ← JSONL reading, fs.watch, path resolution
│   ├── app/                      ← Ink components and React hooks
│   │   ├── App.tsx
│   │   ├── hooks/
│   │   └── panels/
│   └── utils/                    ← Formatters
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
```

## Tech Stack
| Layer      | Technology   | Version |
|------------|-------------|---------|
| Language   | TypeScript  | 5.x     |
| Runtime    | Node.js     | ≥ 22    |
| TUI        | Ink         | 5.x     |
| UI model   | React       | 18.x    |
| CLI        | Commander.js| 12.x    |
| Test       | Vitest      | 2.x     |
| Build      | tsc         | —       |

> Full rationale → `docs/TECH_DESIGN.md`

## Coding Conventions
- **Language version:** TypeScript 5.x strict mode, ESM (`"type": "module"`)
- **Naming:** camelCase variables/functions, PascalCase classes/interfaces/components, SCREAMING_SNAKE_CASE constants
- **File naming:** `PascalCase.ts` for value objects/classes, `camelCase.ts` for modules/hooks, `PascalCase.tsx` for Ink components
- **Import order:** Node built-ins → external packages → internal modules → types
- **Extensions:** always use `.js` extension in import paths (ESM requirement)
- **No barrel exports** — import directly from source files

**Style example:**
```typescript
// src/domain/UsageEntry.ts
export interface UsageEntry {
  readonly sessionId: string
  readonly timestamp: Date
  readonly model: string
  readonly inputTokens: number
  readonly outputTokens: number
  readonly cacheWriteTokens: number
  readonly cacheReadTokens: number
  readonly costUSD: number
}

export function parseUsageEntry(line: string): UsageEntry | null {
  try {
    const obj = JSON.parse(line) as Record<string, unknown>
    // ... defensive field extraction
    return { sessionId, timestamp, model, inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens, costUSD }
  } catch {
    return null   // never throw — constitution rule
  }
}
```

## Lint & Format Process
- **Tool:** ESLint + Prettier
- **Run locally:**
  ```bash
  # Format:
  pnpm format
  # Lint (check only):
  pnpm lint
  # Lint (auto-fix):
  pnpm lint:fix
  ```
- **Enforcement:** advisory (no CI yet)

## Testing
```bash
# Run all tests:
pnpm test
# Run a single test file:
pnpm test tests/unit/domain/UsageEntry.test.ts
# Run with coverage:
pnpm test --coverage
# Run only unit tests:
pnpm test tests/unit
```
- **Framework:** Vitest 2.x, pool: forks (ESM + Node built-ins)
- **Test file location:** centralized in `tests/unit/` and `tests/integration/`, mirroring `src/` structure
- **Naming convention:** `*.test.ts`
- **What to mock:** mock `fs.watch` in unit tests; use real temp files in integration tests; never mock domain functions

## Advisory Patterns

### Prefer
- Pure functions in `domain/` — easier to test, no side effects
- Defensive `unknown` typing at JSONL parse boundary, then narrow with type guards
- React `useRef` for accumulated state that shouldn't trigger re-renders
- `fs.watch` + byte-offset tracking over polling entire files

### Avoid
- Reading files from inside Ink components — always go through hooks
- Re-parsing entire JSONL files on every watch event (use byte offset)
- Class hierarchies in domain layer — plain objects and functions preferred
- `any` type — use `unknown` and narrow

## Boundaries

### ✅ Always
- Run `pnpm lint && pnpm test` after every code change
- Return `null` from any parse function that encounters bad input
- Use `.js` extension in all import paths

### ⚠️ Ask First
- Adding new npm dependencies
- Changing the JSONL parsing logic (format may differ across Claude Code versions)
- Modifying the model pricing table
- Deleting files

### 🚫 Never
- Write to `~/.claude/` or any user data directory
- Transmit usage data to any external service
- Use `JSON.parse()` outside of a try/catch
- Import from `infrastructure/` or `app/` inside `domain/`

## Common Commands
```bash
# Install dependencies:
pnpm install
# Build:
pnpm build
# Run (dev):
npx tsx src/cli.ts
# Install globally:
npm install -g .
```

## Git Workflow

### Branch Naming
- Pattern: `<type>/<short-description>` (e.g. `feat/session-panel`, `fix/byte-offset`)
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### Commit Message Format
- Format: `<type>(<scope>): <description>` — imperative, lowercase, no period
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Max subject length: 72 characters
- Body: optional
- Example: `feat(watcher): add byte-offset tracking to LogReader`

### Merge Strategy
- Squash merge to main

## Key Files
| File | Purpose |
|------|---------|
| `src/cli.ts` | Entry point — Commander.js setup |
| `src/domain/pricing.ts` | Model pricing table + cost calculator |
| `src/infrastructure/LogReader.ts` | JSONL file reading with byte-offset tracking |
| `src/app/hooks/useLogWatcher.ts` | fs.watch integration, emits UsageEntry[] |
| `docs/PITFALLS.md` | Known gotchas — read when something breaks |

## External Documentation
| Resource | URL or Path | Notes |
|----------|------------|-------|
| Ink docs | https://github.com/vadimdemedes/ink | TUI component API |
| Claude Code JSONL format | `~/.claude/projects/**/*.jsonl` | Undocumented — parse defensively |

## Session Protocol

### Session Start
1. Read `docs/ACTIVE_CONTEXT.md` to restore state from the last session.
2. Read `CONSTITUTION.md` to re-anchor on hard rules.

### During the Session
- When a significant decision is made → append a one-liner to `docs/DECISION_LOG.md`.
- When an unexpected problem or gotcha is encountered → append to `docs/PITFALLS.md`.

### Session End
1. Update `docs/ACTIVE_CONTEXT.md`: what changed, what's next, any open questions.
2. Update `docs/PROGRESS.md` if work moved between Done / In Progress / Blocked.

## Related Documents

### Always Loaded
- Constitution: `./CONSTITUTION.md`
- Product Brief: `./docs/PRODUCT_BRIEF.md`
- Architecture: `./docs/ARCHITECTURE.md`
- Structure: `./docs/STRUCTURE.md`
- Glossary: `./docs/GLOSSARY.md`
- Active Context: `./docs/ACTIVE_CONTEXT.md`

### Auto (loaded when relevant)
- PRD: `./docs/PRD.md`
- Tech Design: `./docs/TECH_DESIGN.md`
- Testing: `./docs/TESTING.md`
- Research: `./docs/RESEARCH.md`

### Manual (explicitly requested)
- Progress: `./docs/PROGRESS.md`
- Decision Log: `./docs/DECISION_LOG.md`
- Pitfalls: `./docs/PITFALLS.md`
- ADRs: `./docs/adr/`
