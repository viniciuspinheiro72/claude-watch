# Domain Glossary

## Usage Entry
- **Definition:** A single parsed record from one line of a JSONL session file, representing the token and cost data for one Claude API response.
- **NOT:** A full conversation turn (a turn may produce multiple entries). Not a "log line" — not all JSONL lines are usage entries; some are metadata.
- **Synonyms to avoid:** "log entry", "event", "record" — call it UsageEntry consistently.
- **Code name:** `UsageEntry` (domain value object)
- **Related terms:** Session, Session Metrics
- **Example:** When Claude responds to a message, one UsageEntry is written with `input_tokens: 1200, output_tokens: 340, costUSD: 0.0042`.

---

## Session
- **Definition:** A single Claude Code conversation, corresponding to one JSONL file under `~/.claude/projects/<project>/`. Begins when a new JSONL file is created and ends when Claude Code exits or starts a new conversation.
- **NOT:** A user login session. Not a "project" — one project has many sessions.
- **Synonyms to avoid:** "conversation", "chat", "run" — use "session".
- **Code name:** `Session` — identified by the JSONL filename (UUID)
- **Related terms:** Usage Entry, Session Metrics, Project
- **Example:** Running `claude` in a project for 30 minutes produces one session with dozens of Usage Entries.

---

## Session Metrics
- **Definition:** The aggregated token and cost totals for a single Session — sum of all Usage Entries in that session's JSONL file.
- **NOT:** A raw Usage Entry. Not a daily total.
- **Synonyms to avoid:** "session stats", "session summary" — use "SessionMetrics".
- **Code name:** `SessionMetrics` (domain value object)
- **Related terms:** Session, Day Metrics
- **Example:** A SessionMetrics might show `inputTokens: 45000, outputTokens: 12000, costUSD: 0.87` for the current session.

---

## Day Metrics
- **Definition:** The aggregated token and cost totals across all Sessions for a single calendar day.
- **NOT:** A session total. Not a monthly aggregate.
- **Synonyms to avoid:** "daily stats", "daily summary" — use "DayMetrics".
- **Code name:** `DayMetrics` (domain value object)
- **Related terms:** Session Metrics
- **Example:** DayMetrics for 2026-05-27 shows `totalCostUSD: 3.42` across 5 sessions.

---

## Project
- **Definition:** A directory on the user's filesystem that Claude Code associates with a set of sessions. Represented in `~/.claude/projects/` as an encoded folder name (hyphens replacing slashes).
- **NOT:** An Anthropic API project or workspace. Not a GitHub repository (though they often correspond).
- **Synonyms to avoid:** "workspace", "repo" — use "project".
- **Code name:** `Project` — identified by its encoded path (e.g. `-home-user-projects-my-app`)
- **Related terms:** Session
- **Example:** The project at `~/projects/todo-cli` maps to `~/.claude/projects/-home-user-projects-todo-cli/`.

---

## Log Watcher
- **Definition:** The infrastructure component that monitors JSONL files for new lines using `fs.watch` and byte-offset tracking, emitting Usage Entries as Claude Code writes them.
- **NOT:** A generic file watcher. Not a log aggregator.
- **Code name:** `LogReader` (infrastructure layer) + `useLogWatcher` (React hook)
- **Related terms:** Usage Entry, Session
- **Example:** LogWatcher detects that a JSONL file grew by 200 bytes, reads the new line, and emits a UsageEntry.

---

## Pricing Table
- **Definition:** A bundled map of model identifiers to per-token rates (input, output, cache write, cache read), used to compute `costUSD` when the field is absent from the JSONL entry.
- **NOT:** A live API call to Anthropic pricing. Not user-configurable at runtime.
- **Synonyms to avoid:** "price list", "cost table" — use "PricingTable".
- **Code name:** `PRICING` constant in `src/domain/pricing.ts`
- **Related terms:** Usage Entry
- **Example:** PricingTable entry for `claude-sonnet-4-6`: `{ input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.30 }` (per 1M tokens, USD).

---

## Token Types
- **Definition:** The four categories of tokens tracked per Usage Entry, each priced differently:
  - **Input tokens** — tokens in the prompt sent to the model
  - **Output tokens** — tokens in the model's response
  - **Cache write tokens** (`cache_creation_input_tokens`) — input tokens written to the prompt cache
  - **Cache read tokens** (`cache_read_input_tokens`) — input tokens served from the prompt cache (cheaper than input)
- **NOT:** Interchangeable. Cache tokens have distinct pricing.
- **Code name:** Fields on `UsageEntry`: `inputTokens`, `outputTokens`, `cacheWriteTokens`, `cacheReadTokens`
- **Related terms:** Pricing Table, Usage Entry
- **Example:** A cache-heavy session may show `cacheReadTokens: 80000` but low cost because cache reads are ~10× cheaper than input tokens.
