# Research Document

---

## Part 1 — Market Research

### Problem Statement
Claude Code users on pay-per-use plans have no real-time visibility into token consumption or cost. The only feedback loop is the monthly invoice. This prevents users from making informed decisions mid-session ("should I start a new context?", "is this approach too expensive?").

### Target Users
- Solo developers using Claude Code daily on metered plans
- Freelancers or contractors who bill AI costs to clients
- Developers who want to build usage awareness habits

### Competitor / Prior Art Analysis
| Name | Strengths | Weaknesses | URL |
|------|-----------|------------|-----|
| claude.ai Usage tab | Official, accurate billing data | Web-only, not real-time, requires browser | claude.ai/settings/usage |
| ccusage (community tool) | Parses same JSONL format, CLI | Static report, not live dashboard | github.com/ryoppippi/ccusage |
| tokencost (Python) | Model pricing table | Library only, no CLI display | github.com/AgentOps-AI/tokencost |
| Anthropic Console | Aggregate API usage | API key required, not session-level | console.anthropic.com |

### Market Opportunity
Claude Code JSONL files are local, undocumented but stable — the community (ccusage, etc.) already relies on them. No tool currently offers a live, in-terminal dashboard experience. The gap is specifically real-time + TUI.

### Go / No-Go Decision
**Go.** JSONL format is readable, community-proven, and `fs.watch` + Ink is a well-established stack for this kind of tool.

---

## Part 2 — Technical Research

### Technical Feasibility
`~/.claude/projects/<encoded-path>/<session-id>.jsonl` files are written by Claude Code as each message completes. Each line is a JSON object containing `usage` (input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens), `costUSD`, `model`, and `timestamp`. Reading with `fs.watch` + `readline` is proven and synchronous-friendly. Ink (React for terminals) handles live re-renders cleanly.

### Third-Party Services & APIs
| Service | Purpose | Pricing Model | Risk |
|---------|---------|---------------|------|
| None | — | — | — |

### Key Technical Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| JSONL format changes between Claude Code versions | Medium | High | Read defensively — skip malformed lines, log parse errors |
| `fs.watch` misses rapid writes (coalescing) | Low | Medium | Also poll on interval as fallback |
| `costUSD` field absent in older log entries | Medium | Medium | Fall back to computing cost from token counts + model pricing table |
| Ink not rendering correctly in all terminal emulators | Low | Low | Test in common emulators (iTerm2, Alacritty, Wezterm, VS Code) |

### Proof of Concept Needed?
Validate that `fs.watch` fires reliably on JSONL append before building the full TUI. A 10-line script that watches one file and prints new lines is sufficient.
