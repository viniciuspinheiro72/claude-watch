@AGENTS.md
@docs/PRODUCT_BRIEF.md
@docs/ACTIVE_CONTEXT.md
@docs/ARCHITECTURE.md
@docs/STRUCTURE.md
@docs/GLOSSARY.md

<!-- The @-imports above enforce the "always" injection tier.
     Auto and Manual docs are read on demand — do not import them here. -->

## Claude-Specific Configuration

### Memory
Session protocol is defined in AGENTS.md under "Session Protocol".
At session end, update `docs/ACTIVE_CONTEXT.md` and append to `docs/DECISION_LOG.md` for any significant decisions made.

### Hooks
<!-- Configure in .claude/settings.json when needed -->

### Slash Commands / Skills
- `/init-docs` — re-run or extend project documentation
- `/superpowers` — brainstorm → write-plan → execute-plan workflow for feature work

### Personas / Modes
Senior TypeScript/Ink engineer. Resilient parsers, pure domain functions, no crashes on bad input.

## Document Index

| Document       | File                       | Injection  | Purpose                                        |
|----------------|----------------------------|------------|------------------------------------------------|
| Constitution   | `./CONSTITUTION.md`        | always     | Immutable hard constraints and invariants      |
| AI Context     | `./AGENTS.md`              | always     | Coding conventions, patterns, boundaries       |
| Product Brief  | `./docs/PRODUCT_BRIEF.md`  | always     | What it is, who it's for, why it matters       |
| Active Context | `./docs/ACTIVE_CONTEXT.md` | always     | Current session state and in-progress work     |
| Architecture   | `./docs/ARCHITECTURE.md`   | always     | Folder map, layers, dependency rules           |
| Structure      | `./docs/STRUCTURE.md`      | always     | File naming, import patterns, conventions      |
| Glossary       | `./docs/GLOSSARY.md`       | always     | Domain language and term definitions           |
| PRD            | `./docs/PRD.md`            | auto       | Full product requirements and user stories     |
| Tech Design    | `./docs/TECH_DESIGN.md`    | auto       | Stack decisions and technical design           |
| Testing        | `./docs/TESTING.md`        | auto       | Test philosophy and coverage rules             |
| Research       | `./docs/RESEARCH.md`       | auto       | Market context and technical feasibility       |
| Progress       | `./docs/PROGRESS.md`       | manual     | Done / In Progress / Blocked / Next            |
| Decision Log   | `./docs/DECISION_LOG.md`   | manual     | Lightweight chronological decisions            |
| Pitfalls       | `./docs/PITFALLS.md`       | manual     | Known gotchas and lessons learned              |
| ADRs           | `./docs/adr/`              | manual     | Architecture Decision Records                  |
