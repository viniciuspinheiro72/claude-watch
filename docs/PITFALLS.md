# Pitfalls & Known Gotchas

<!-- Each entry: what the trap is, why it happens, how to avoid it.
     Add an entry whenever you hit an unexpected problem — future sessions
     will read this to avoid repeating the same mistake. -->

## JSONL lines are not always complete JSON objects
- **What happens:** `JSON.parse()` throws on a partially-written line
- **Why it happens:** Claude Code appends a line while the OS flushes in chunks; `fs.watch` fires mid-write
- **How to avoid:** Wrap every `JSON.parse()` in try/catch; skip the line and retry on the next watch event
- **Discovered:** Design phase — ccusage handles this case

## `costUSD` field is absent in older session logs
- **What happens:** `entry.costUSD` is `undefined`; cost shows as $0.00
- **Why it happens:** Older Claude Code versions did not write this field
- **How to avoid:** Always fall back to computing cost from `usage` token counts + model pricing table
- **Discovered:** Design phase — ccusage pricing fallback pattern

## `fs.watch` fires multiple events for a single append (coalescing)
- **What happens:** One line append triggers 2–3 watch events; lines may appear duplicated
- **Why it happens:** OS-level coalescing behavior varies by platform and filesystem
- **How to avoid:** Track byte offset per file; only read bytes beyond the last known offset, never re-read from start
- **Discovered:** Design phase — standard fs.watch gotcha

## Ink renders incorrectly when stdout is not a TTY
- **What happens:** Raw Ink markup leaks into the terminal output (e.g., in CI or piped output)
- **Why it happens:** Ink checks `process.stdout.isTTY` but some environments spoof it
- **How to avoid:** Guard with `if (!process.stdout.isTTY) { ... fallback text output ... }` before rendering Ink
- **Discovered:** Design phase

## `~/.claude/projects/` uses encoded directory names
- **What happens:** The folder name for `~/projects/my-app` is `-home-user-projects-my-app`, not the raw path
- **Why it happens:** Claude Code encodes the absolute path by replacing `/` with `-`
- **How to avoid:** Use `ProjectResolver` to decode folder names back to absolute paths for display; never assume the folder name matches the actual path
- **Discovered:** Design phase — observed in session data
