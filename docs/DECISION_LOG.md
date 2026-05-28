# Decision Log

<!-- One entry per significant decision. Newest first.
     For major architectural decisions, write a full ADR in docs/adr/ instead. -->

### 2026-05-28 — Use JSONL local files as data source (not Anthropic API)
- **Decision:** Read `~/.claude/projects/**/*.jsonl` directly via `fs.watch`
- **Why:** Zero latency, works offline, no API key needed, per-message granularity; community tools (ccusage) prove the format is stable enough
- **Alternatives considered:** Anthropic billing API (polling, requires key, no session breakdown), both (added complexity)
- **Consequences:** Must parse defensively and handle format changes gracefully; no cross-device data

### 2026-05-28 — Ink TUI over simple line-by-line stream
- **Decision:** Use Ink 5.x (React for terminals) for the live display
- **Why:** Supports multi-panel layout (current session + today summary side by side), active maintenance, React component model makes panels independently testable
- **Alternatives considered:** Simple clear+reprint loop (limited to one frame), Blessed (unmaintained)
- **Consequences:** React + Ink as dependencies; must guard against non-TTY environments

### 2026-05-28 — Always implement costUSD fallback to pricing table
- **Decision:** If `costUSD` is absent in a JSONL entry, compute from token counts using bundled pricing table
- **Why:** Older Claude Code versions don't write `costUSD`; showing $0.00 would be worse than a computed estimate
- **Alternatives considered:** Show "N/A" when field absent (confusing), require `costUSD` field (breaks on old logs)
- **Consequences:** Pricing table must be kept up to date as Anthropic changes model prices
