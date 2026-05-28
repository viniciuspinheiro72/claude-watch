# Product Brief

## What It Is
A real-time terminal dashboard that watches Claude Code's local session logs and displays live token usage, cost, and session metrics.

## Who It's For
Developers who use Claude Code daily and want visibility into their token consumption and API cost without leaving the terminal — especially those on metered or pay-per-use plans.

## The Problem It Solves
Claude Code gives no built-in usage dashboard. Developers have no way to know how many tokens a session consumed, what it cost, or how usage trends over time — until they get their monthly bill. This creates surprise costs and prevents informed usage habits.

## Key Features
- Live TUI dashboard (Ink) that updates as Claude Code writes to its JSONL log files
- Current-session panel: tokens in, tokens out, cache tokens, cost so far
- Today's summary panel: total tokens, total cost, number of sessions
- Historical view: last 7 days of usage by day
- `claude-watch` command with optional `--project` filter

## Business Objective
Zero-surprise billing: the user should always know their current session cost and daily spend before they see their invoice.

## Out of Scope
- Anthropic API polling (billing API integration)
- Multi-user or team dashboards
- Budget alerts or notifications
- Web UI
