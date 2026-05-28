# claude-watch

Real-time terminal dashboard for Claude Code token usage and cost. Watches your local session logs and shows live metrics as you work.

```
╭─ Current Session ──────────────╮ ╭─ Today — 2026-05-28 ───────────╮
│ Model        claude-sonnet-4-6 │ │ Sessions              3         │
│ Duration     14m 32s           │ │ Messages              47        │
│ Messages     23                │ │ ────────────────────────────── │
│ ────────────────────────────── │ │ Input tokens          284.3k    │
│ Input tokens 142.1k            │ │ Output tokens         38.2k     │
│ Cache write   6.2k             │ │ Cache write           12.5k     │
│ Cache read   99.3k             │ │ Cache read            198.7k    │
│ Total tokens 267.0k            │ │ Total tokens          533.7k    │
│                                │ │                                 │
│ Session cost  $0.1847          │ │ Today's cost          $0.3821   │
│ Updated 19:24:11               │ ╰─────────────────────────────────╯
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

# Compact widget mode (fits in a tmux pane or terminal corner)
claude-watch --small
claude-watch -s

# Widget without border
claude-watch --small --no-border
```

Press `q` to quit.

### Widget mode

`--small` renders a compact panel showing your real usage limits — the same numbers as Claude Code's `/usage` command. It reads your OAuth token from `~/.claude/.credentials.json` and polls `claude.ai` every 60 seconds.

```
╭─ claude-watch ──────────────────────────────────────╮
│ claude-watch widget                                  │
│ session  ████████████░░░░  43%  ↻ 2h 15m           │
│ week     █░░░░░░░░░░░░░░░   5%  ↻ Jun 4            │
│                                                      │
│ [q] quit                                            │
╰──────────────────────────────────────────────────────╯
```

- **session** — five-hour usage window (same as `/usage` "Current session")
- **week** — seven-day usage window (same as `/usage` "Current week")
- Bars are color-coded: green → yellow → red as utilization rises
- Bar width scales with terminal width — safe to resize
- `--no-border` removes the box border for cleaner embedding in tmux status bars

## How it works

Claude Code writes a JSONL file per session under `~/.claude/projects/`. Each assistant response appends a line with token counts and the model name.

`claude-watch` uses `fs.watch` with byte-offset tracking to tail these files in real time — updates appear within 1 second of Claude Code writing a response. Cost is computed from a bundled pricing table.

The widget mode calls `GET https://claude.ai/api/oauth/usage` using the OAuth token Claude Code stores locally, so no separate API key is needed.

## Dashboard panels

| Panel | Updates | Shows |
|-------|---------|-------|
| **Current Session** | Every response | Tokens, cost, model, duration, message count |
| **Today** | Every response | Daily aggregate across all sessions |
| **Last 7 Days** | On start + new sessions | Cost bar chart, token totals, session count |
| **Widget** (`--small`) | Every 60s | Real usage limits from claude.ai, reset times |

## CLI flags

| Flag | Short | Description |
|------|-------|-------------|
| `--project <path>` | `-P` | Filter to a specific project directory |
| `--small` | `-s` | Compact widget mode |
| `--no-border` | — | Remove border (widget mode only) |

## Development

```bash
pnpm install
pnpm dev          # run without building
pnpm test         # run test suite
pnpm coverage     # coverage report
pnpm build        # compile to dist/
```

## License

MIT
