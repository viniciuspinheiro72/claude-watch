# claude-watch

Real-time terminal dashboard for Claude Code token usage and cost. Watches your local session logs and shows live metrics as you work.

```
╭─ Current Session ──────────────╮ ╭─ Today — 2026-05-28 ───────────╮
│ Model        claude-sonnet-4-6 │ │ Sessions              3         │
│ Duration     14m 32s           │ │ Messages              47        │
│ Messages     23                │ │ ────────────────────────────── │
│ ────────────────────────────── │ │ Input tokens          284.3k    │
│ Input tokens 142.1k            │ │ Output tokens         38.2k     │
│ Output tokens 19.4k            │ │ Cache write           12.5k     │
│ Cache write   6.2k             │ │ Cache read            198.7k    │
│ Cache read   99.3k             │ │ Total tokens          533.7k    │
│ Total tokens 267.0k            │ │                                 │
│                                │ │ Today's cost          $0.3821   │
│ Session cost  $0.1847          │ ╰─────────────────────────────────╯
│ Updated 19:24:11               │
╰────────────────────────────────╯

╭─ Last 7 Days ────────────────────────────────────────╮
│ today  █████████░░░ $0.3821   533.7k  3s             │
│ 05-27  ████████████ $0.5104   812.1k  5s             │
│ 05-26  ████░░░░░░░░ $0.1923   301.4k  2s             │
│ 05-25  ██░░░░░░░░░░ $0.0841   134.2k  1s             │
╰──────────────────────────────────────────────────────╯
```

## Install

```bash
npm install -g claude-watch
```

Or clone and install locally:

```bash
git clone https://github.com/viniciuspinheiro72/claude-watch
cd claude-watch
pnpm install
npm install -g .
```

**Requires Node.js ≥ 22.**

## Usage

```bash
# Watch all projects
claude-watch

# Filter to a specific project
claude-watch --project ~/projects/my-app
claude-watch -P ~/projects/my-app
```

Press `q` to quit.

## How it works

Claude Code writes a JSONL file per session under `~/.claude/projects/`. Each assistant response appends a line with token counts (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`) and the model name.

`claude-watch` uses `fs.watch` with byte-offset tracking to tail these files in real time — updates appear within 1 second of Claude Code writing a response. Cost is computed from a bundled pricing table since Claude Code doesn't write a cost field directly.

## Dashboard panels

| Panel | Updates | Shows |
|-------|---------|-------|
| **Current Session** | Every response | Tokens, cost, model, duration, message count |
| **Today** | Every response | Daily aggregate across all sessions |
| **Last 7 Days** | On start + new sessions | Cost bar chart, token totals, session count |

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `CLAUDE_WATCH_LOG_DIR` | `~/.claude/projects/` | Override log directory path |
| `NO_COLOR` | — | Disable color output |

## Development

```bash
pnpm install
pnpm dev          # run without building
pnpm test         # 40 tests
pnpm coverage     # coverage report
pnpm build        # compile to dist/
```

## License

MIT
