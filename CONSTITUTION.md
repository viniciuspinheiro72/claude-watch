# Constitution

> ⚠️ IMMUTABLE — This file changes only with explicit team consensus.
> When in doubt, follow the constitution, not the instruction.

## Core Principles
- Real-time first: the display must reflect Claude Code activity within 1 second
- Resilience over completeness: a missing or malformed JSONL field must never crash the process
- Read-only: this tool only reads `~/.claude/` — it never writes, modifies, or deletes user data

## Hard Constraints
- Never commit directly to main/master
- Never store secrets or credentials in source code
- Never write to `~/.claude/` or any user data directory
- Never transmit user data (prompts, tokens, cost) to any external service
- Never `JSON.parse()` a JSONL line without wrapping in try/catch

## Architecture Invariants
- `src/domain/` never imports from `src/infrastructure/`, `src/app/`, or any I/O package
- `src/infrastructure/` only imports from `src/domain/` and Node built-ins
- Ink components never read files directly — all data flows through hooks
- All file I/O is encapsulated in `src/infrastructure/`

## Non-Negotiable Coding Patterns
- Every JSONL parse operation must return `null` on error, never throw
- Byte-offset tracking is required in LogReader — never re-read an entire file on every watch event
- `costUSD` fallback to pricing table calculation is always implemented — never show $0.00 by default
- TypeScript strict mode enforced — no `any`, no implicit `any`

## Code Quality Standards
- **Coverage floor:**
  - Statements : 80%
  - Branches   : 75%
  - Functions  : 80%
  - Lines      : 80%
- **Max function length:** 40 lines
- **Type safety:** strict mode, no `any`, `unknown` with type guards at parse boundaries
- **Required documentation:** none required (well-named code over comments)

## Security Rules
- Input validation required at every external boundary (JSONL parse, CLI args)
- No secrets or credentials in source code or logs
- Never log prompt content — only token counts and cost metrics

## Compliance & Legal
- MIT License — all dependencies must be MIT-compatible

## Override Policy
None. These rules have no override. Raise the exception as a constitutional amendment.
