# ADR-0009 — Runtime Truth Before Roadmap

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-23 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

The LLM Development Master Plan v4.0.0 (dated 2026-06-20) contained an "Implementation reality audit" that described `@afenda/ui` as a placeholder, `@afenda/metadata-ui` as contracts-only, and `apps/erp` as minimal. By 2026-06-23, runtime evidence showed 58 UI components, metadata renderers, and 199 ERP source files — a **material documentation drift** that caused AI agents to re-implement completed work and skip unfinished gates.

Roadmaps derived from stale documentation are **actively harmful** in an AI-governed monorepo because agents treat canonical docs as ground truth.

Related artifacts:

- [`docs/PAS/pas-status-index.md`](../PAS/pas-status-index.md)
- [`docs/PAS/pas-status-index.md`](../PAS/pas-status-index.md)
- ADR-0012 (evidence-backed documentation)

---

## Decision

1. **No delivery roadmap or TIP sequence update may ship without a concurrent runtime truth audit** backed by filesystem evidence (files, tests, exports, scripts, schemas).
2. The **Runtime Truth Matrix** (`docs/PAS/pas-status-index.md`) is a required companion artifact to the master plan and pre-accounting roadmap.
3. Master plan "implementation reality" sections must include an **as-of date** and link to the runtime matrix. Sections older than the matrix are **presumed stale** until re-verified.
4. TIP status in delivery docs must be reconciled against runtime evidence before any phase gate sign-off.

---

## Consequences

### Positive

- AI agents and humans share a single evidence-based status model.
- Prevents duplicate implementation of completed foundation work.
- Surfaces real blockers (outbox, System Admin) instead of imaginary ones (missing UI library).

### Negative / trade-offs

- Requires periodic matrix maintenance (at minimum: each foundation phase completion).
- Initial audit effort is non-trivial.

---

## Acceptance Gate

- [x] `afenda-runtime-truth-matrix.md` exists with evidence column populated for all foundation areas.
- [x] Master plan v5 includes "Runtime Truth as of Current Audit" section.
- [x] Drift audit published with classified findings.
- [x] CI `pnpm quality:delivery-evidence-surface` passes (existing gate).
- [x] TIP-000D closeout — `pnpm check:documentation-drift` passes.
- [x] `pnpm quality` includes `quality:documentation-drift`.
- [x] Baseline fingerprint bumped to `ARCH-BASELINE-2026-06-23-v2`.

---

## References

- [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md) — Phase 0
- [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) v5
