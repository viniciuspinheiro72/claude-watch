# Testing Strategy

## Testing Philosophy
Test behavior, not implementation. The core logic (JSONL parsing, cost calculation, aggregation) is pure and highly testable. The Ink UI is integration-level — test that the right data flows to panels, not pixel-level rendering.

## Scope
### In Scope
- JSONL parsing (valid, malformed, missing fields)
- Cost calculation (with and without `costUSD`)
- Model pricing table lookups
- Aggregation logic (session totals, day totals, history rollup)
- Project path resolution
- File tail logic (byte offset tracking)

### Out of Scope
- Ink component rendering (no headless browser or terminal emulator in CI)
- `fs.watch` OS behavior (OS-dependent, not unit-testable)
- Visual layout verification

## Test Types & Tools
| Type        | Tool    | Notes |
|-------------|---------|-------|
| Unit        | Vitest  | Pure functions: parsers, calculators, aggregators |
| Integration | Vitest  | LogReader with real temp files on disk |
| E2E         | Manual  | Launch `claude-watch`, verify live dashboard updates |

## Entry Criteria
- TypeScript compiles without errors
- All unit tests pass

## Exit Criteria
- All unit and integration tests pass
- Coverage floors met (see CONSTITUTION.md)
- Manual smoke test: `claude-watch` launches and updates when a JSONL file is modified

## Test Environment
| Environment | Purpose | External files |
|-------------|---------|----------------|
| local       | Dev iteration | Temp JSONL files created in tests |
| CI          | Gate on PR | Same — no real `~/.claude/` dependency |

## Unit Test Patterns
```typescript
// Co-located: src/domain/__tests__/UsageEntry.test.ts
// Each test file mirrors its source file
// Arrange-Act-Assert, no mocking of pure functions
// Use tmp dirs (os.tmpdir()) for file-based integration tests
```

## Integration Test Scope
- `LogReader` reads lines from a real temp file and tracks byte offset correctly
- `LogReader` detects new lines appended after initial read

## E2E Scenarios (Critical Paths)
1. `claude-watch` starts, detects no active session → shows "Waiting…" message
2. A JSONL line is appended to a temp file → dashboard updates within 1s
3. `claude-watch --project ~/projects/foo` → only shows data from that project

## Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| fs.watch timing in CI | Use file-read polling in integration tests instead of watch events |
| Ink rendering in non-TTY (CI) | Test data layer only; skip UI-level assertions |

## CI/CD Integration
Run on every PR. Unit + integration tests are blocking. E2E is manual.

## How to Run Tests Locally
```bash
# Run all tests:
pnpm test

# Run unit tests only:
pnpm test src/domain

# Run with coverage report:
pnpm test --coverage
```
