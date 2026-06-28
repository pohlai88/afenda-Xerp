# Slice B61 — Metadata Authorization Denial Preview (PAS-001 §8 / B60 −0.2)

**Prerequisite:** Slice B60 — API route metadata authorization bridge

**Status:** Delivered

**Type:** Implementation

---

## Objective

Render metadata diagnostics on **evaluated authorization denial** instead of immediate Next.js `forbidden()`.

Pre-evaluation failures (`missing_session`, `missing_context` without evaluation) continue to call `forbidden()`.

---

## Handoff block

```
1. Objective    — Evaluated denial metadata preview (B61).
2. Allowed layer— apps/erp metadata + metadata-workspace page
3. Files        — resolve-metadata-ui-render-context.server.ts, page.tsx, preview surface, tests
4. Prohibited   — packages/kernel, metadata-ui kernel imports
5. Authority    — PAS-001 §8 · B60 bridge
6. Gates        — ERP metadata vitest + typecheck
7. Closes       — B60 −0.2 denial UX
8. Evidence     — denial preview tests
9. Attestation  — Enterprise 9.5+/10
```
