# Codebase Structure & Conventions

## File Naming
- **TypeScript source files:** `PascalCase.ts` for classes/value objects, `camelCase.ts` for modules (hooks, utils)
- **React/Ink components:** `PascalCase.tsx` (must use `.tsx` extension even if JSX is minimal)
- **Test files:** `*.test.ts` / `*.test.tsx`, centralized under `tests/unit/` or `tests/integration/`
- **Config files:** `*.config.ts` at project root (`vitest.config.ts`, `tsconfig.json`)

## Folder Organization
- **Pattern:** type-first within each layer (domain objects together, hooks together, panels together)
- No feature folders — the project is small enough that type-first is cleaner
- Example:
  ```
  src/app/
  ├── App.tsx
  ├── hooks/
  │   ├── useLogWatcher.ts
  │   └── useAggregator.ts
  └── panels/
      ├── SessionPanel.tsx
      └── TodayPanel.tsx
  ```

## Import Conventions
- **Relative paths only** — no `@/` alias (project is small, aliases add tooling complexity)
- **Import order:** Node built-ins → external packages → internal modules → types
- **No barrel exports** (`index.ts`) — import directly from the source file
- **`.js` extension on all imports** — required for ESM output (`import { X } from './X.js'`)

## Naming Conventions
- **Variables / functions:** `camelCase`
- **Classes / interfaces / type aliases:** `PascalCase`
- **Constants:** `SCREAMING_SNAKE_CASE` (e.g. `PRICING`, `BAR_WIDTH`)
- **React hooks:** `useNoun` or `useNounVerb` (e.g. `useLogWatcher`, `useAggregator`)
- **Ink components:** `NounPanel` or `NounView` (e.g. `SessionPanel`, `TodayPanel`)
- **Boolean variables:** `is`/`has`/`should` prefix (e.g. `isLoading`, `hasError`)
- **Test describe blocks:** `describe('ClassName', () => { describe('methodName', () => { ... }) })`

## Code Style
**Preferred style — domain value object:**
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

export function parseUsageEntry(raw: unknown): UsageEntry | null {
  // defensive parse — return null on any error
  try {
    const obj = raw as Record<string, unknown>
    // ...
    return { sessionId, timestamp, model, inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens, costUSD }
  } catch {
    return null
  }
}
```

**Preferred style — Ink panel component:**
```tsx
// src/app/panels/SessionPanel.tsx
import { Box, Text } from 'ink'
import type { SessionMetrics } from '../../domain/SessionMetrics.js'

interface Props {
  metrics: SessionMetrics
}

export function SessionPanel({ metrics }: Props) {
  return (
    <Box flexDirection="column" borderStyle="round" padding={1}>
      <Text bold>Current Session</Text>
      <Text>Cost: <Text color="green">${metrics.costUSD.toFixed(4)}</Text></Text>
    </Box>
  )
}
```

## Co-location Rules
- **Tests:** centralized in `tests/unit/` and `tests/integration/` — mirrors `src/` structure
  - e.g. `src/domain/UsageEntry.ts` → `tests/unit/domain/UsageEntry.test.ts`
- **Types:** co-located in the same file as their implementation (no separate `*.types.ts`)
- **No global CSS** — Ink handles all styling via props

## What NOT to Do
- Do not use `any` — use `unknown` and narrow with type guards
- Do not import domain objects from infrastructure or app layers
- Do not read files directly from Ink components — always go through `useLogWatcher`
- Do not use `class` in the domain layer — prefer plain objects and pure functions
- Do not add `index.ts` barrel files — direct imports only
- Do not use `require()` — this is a pure ESM project
