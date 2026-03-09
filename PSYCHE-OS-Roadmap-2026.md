# PSYCHE/OS Roadmap 2026

> Last updated: 2026-03-09
> Target: v1.0 public release by September 30, 2026
> Tracking: [Linear project](https://linear.app/mich-zero/project/psycheos-digital-psyche-operating-system-dc3b94c9691b)

This roadmap describes what PSYCHE/OS intends to become by end of 2026, what is already solid, and what remains. It is honest about gaps and does not inflate scope.

---

## Current State (v0.1.0)

**Released March 9, 2026.** First public snapshot.

| Area | Status | Notes |
|------|--------|-------|
| Ontology (types, levels, dimensions) | Done | Zod schemas, 5 access levels, 6 dimensions |
| React dashboard (13 views) | Done | Typographic, local-first, screenshot-ready |
| Shell extraction scripts | Done | Claude Code, Codex, social traces, synthesis, ND screening |
| Canonical prompts | Done | Shared between UI and shell workflows |
| Vector search (ChromaDB) | Done | Embeddings + CLI search working |
| Open-source hygiene | Done | LICENSE, CI, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT |
| TypeScript core pipeline | Partial | `ingest.ts` works; `extract.ts` and `patterns.ts` are stubs |
| Prompt calibration | Evolving | Functional but not regression-tested |
| Source adapter breadth | Done | 5 adapters (Claude Code, Codex, Twitter, YouTube, OpenClaw), 547 docs ingested |
| Evaluation & quality gates | Not started | Rubric written, no automated fixtures |

---

## Q1 2026: Foundation (Jan - Mar)

### Fase 1: Ontologia — `100%` complete
Linear: `Fase 1: Ontologia` / `M3: Web Dashboard MVP`

**Delivered:**
- Core Zod schemas: Entity, Pattern, Archetype, Cycle, Insight, Relation
- 5 access levels (L0 Surface → L4 Archetypal) with risk-based policies
- 6 analytical dimensions with metrics
- JSON-LD scaffold generator for downstream AI agents
- 13-view React dashboard with all visualization surfaces
- CI pipeline, security headers, bundled fonts

**What this unlocked:** A publishable skeleton that works end-to-end with manual prompt-driven extraction.

---

## Q2 2026: Engine (Apr - Jun)

The core work: replace shell-script-and-paste workflows with a real extraction and analysis pipeline.

### Fase 2: Ingestione — ✅ complete (Mar 9, 2026)
Linear: `Fase 2: Ingestione` / `M4: Multi-source Data Ingestion`

| Deliverable | Status |
|-------------|--------|
| Source adapter registry | ✅ `SourceAdapter` interface + `AdapterRegistry` with pluggable routing |
| 5 platform parsers | ✅ Claude Code, Codex, X/Twitter, YouTube, OpenClaw (local + m1) |
| Schema normalization | ✅ Every adapter outputs validated `SourceDocument` via Zod |
| Import validation | ✅ Runtime Zod validation on all 547 ingested documents |
| Fixture suite | ✅ 1 golden-file fixture per adapter + integration + E2E tests |
| Symlink traversal | ✅ Custom `walkDir` resolves symlinks on macOS |

**Delivered:** 35 tests passing (unit + integration + E2E), 547 documents ingested from 6 source directories.

### Fase 3: Knowledge Graph — target May 16
Linear: `Fase 3: Knowledge Graph`

| Deliverable | Description |
|-------------|-------------|
| Graph persistence layer | Local graph store (Neo4j or SQLite + JSON-LD) |
| Ontology import | Types, relations, and access levels mapped to graph schema |
| Entity deduplication | Cross-source entity resolution (same person/concept across sources) |
| Relationship indexing | Queryable relations: triggers, projects_onto, sabotages, manifests_as, etc. |

**Success criteria:** Graph can be queried for "all patterns related to entity X across sources."

### Fase 4: NLP Pipeline — target Jun 20
Linear: `Fase 4: NLP Pipeline` / `M5: Automated Analysis Pipeline`

| Deliverable | Description |
|-------------|-------------|
| `extract.ts` implementation | Replace stub with Claude API structured extraction |
| Tiered model strategy | Haiku for bulk extraction, Sonnet for pattern detection, Opus for synthesis |
| Extraction schema validation | Every extraction output validated against `ExtractedEntity`, `Theme`, `CognitivePattern` |
| Cost tracking | Per-run token usage and cost logging |
| CLI automation | `npm run analyze` runs full pipeline: ingest → extract → patterns → synthesize → output |

**Success criteria:** End-to-end pipeline produces validated JSON from raw sources with no manual prompt copy-paste.

---

## Q3 2026: Intelligence + Release (Jul - Sep)

### Fase 5: Pattern Engine — target Aug 1
Linear: `Fase 5: Pattern Engine`

| Deliverable | Description |
|-------------|-------------|
| `patterns.ts` implementation | Replace stub with cross-source pattern detection |
| Sabotage detection | Identify self-sabotage cycles with trigger → behavior → consequence chains |
| Projection analysis | Shadow/golden shadow/anima/persona mapping with evidence |
| Cycle detection | Growth, sabotage, creative, avoidance cycles with temporal frequency |
| Confidence calibration | Conservative scoring; no pattern below 2-source convergence |

**Success criteria:** Pattern engine produces results that pass the evaluation rubric (docs/evaluation-rubric.md) on 3+ test datasets.

### Fase 6: Agent Interface — target Aug 29
Linear: `Fase 6: Agent Interface` / `M7: MCP Server Integration`

| Deliverable | Description |
|-------------|-------------|
| MCP Server | Expose PKKG as MCP tools: `query_patterns`, `get_scaffold`, `get_dimensions`, `search_insights` |
| Access-level enforcement | Scaffold generation respects L0-L4 access levels structurally |
| Agent scaffold v1 | Production-quality JSON-LD context for Claude Code, Codex, and generic agents |
| Integration tests | Automated tests for every MCP tool endpoint |

**Success criteria:** A Claude Code session can query the MCP server and receive level-appropriate context.

### Fase 7: Visualization Upgrade — target Sep 12
Linear: `Fase 7: Visualization` / `M6: Interactive Exploration`

| Deliverable | Description |
|-------------|-------------|
| Live graph navigation | D3 force graph connected to real graph data (not demo JSON) |
| Dimensional drill-down | Click dimension → see contributing patterns with evidence |
| Pattern timeline | Temporal view of when patterns were detected across sources |
| Search | Full-text search across insights, patterns, and entities |

**Success criteria:** Dashboard displays real analysis results and supports exploration without touching CLI.

### Fase 8: Consolidation + Release — target Sep 30
Linear: `Fase 8: Consolidation` / `M8: Public Release`

| Deliverable | Description |
|-------------|-------------|
| Evaluation fixtures | Automated quality gates per evaluation rubric dimension |
| Adversarial validation | Counter-evidence and contradiction detection in synthesis |
| Onboarding guide | End-to-end setup for new users with sample data |
| CLI installer | `npx psyche-os init` or equivalent one-command setup |
| Schema stability | Versioned output schema with migration path |
| v1.0 release | Tagged release with complete documentation |

**Success criteria:** A new user can clone, install, run the pipeline on their own data, and explore results in the dashboard within 30 minutes.

---

## Explicitly Out of Scope for 2026

These are things PSYCHE/OS will **not** attempt this year:

- **Diagnostic claims** — It maps, it does not diagnose
- **Hosted/cloud deployment** — Local-first only
- **Real-time ingestion** — Batch processing, not streaming
- **Multi-user** — Single-user, single-machine
- **Mobile app** — Web dashboard only
- **OWL 2 / formal ontology export** — JSON-LD is sufficient for v1
- **Third-party integrations beyond MCP** — No Notion, Obsidian, or Logseq plugins
- **Monetization or SaaS** — Open-source, no commercial layer

---

## Quality Gates (apply at every milestone)

From `docs/evaluation-rubric.md`:

1. **Evidence traceability** — Every claim points to concrete source evidence
2. **Cross-source convergence** — Multi-source support, not single-source noise
3. **Contradiction handling** — Preserve tensions, don't force coherence
4. **Temporal sensitivity** — Distinguish recurring structure from one-offs
5. **Lens coverage** — Psychology, sociology, anthropology, tech, philosophy all contribute
6. **Calibration & safety** — Conservative confidence, non-diagnostic language
7. **Directional vector quality** — Reads like computed direction, not advice

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Claude API cost overrun on large source sets | Medium | High | Tiered model strategy, cost tracking, batch limits |
| Prompt quality plateau | Medium | High | Evaluation fixtures, adversarial testing, iterative calibration |
| Neo4j complexity vs. value for single-user | Medium | Medium | Evaluate SQLite + JSON-LD as lighter alternative |
| Source format changes (X export, Takeout) | High | Medium | Adapter isolation, fixture-based regression tests |
| Scope creep into diagnostic territory | Low | Critical | SCOPE.md as contract, non-diagnostic language enforced in prompts |
| Over-interpretation of sparse data | Medium | High | Minimum 2-source convergence rule, confidence thresholds |

---

## How This Roadmap Evolves

This document is updated when:
- A milestone is completed or its scope changes materially
- A risk materializes and alters the plan
- A new source type or capability is validated enough to add

It is **not** updated for minor progress. Linear tracks task-level progress. This document tracks direction.
