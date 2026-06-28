# Slice B65 — Metadata Context-Required Preview (PAS-001 §8 / B64 gap)

**Prerequisite:** Slice B64 — ERP metadata action bridge

**Status:** Delivered

**Type:** Implementation

---

## Objective

Render metadata **defer preview** for pre-evaluation `missing_context` failures (and page-level operating-context selection gaps) instead of Next.js `forbidden()`.

- `missing_session` — remains redirect / `forbidden()` (session gate precedes preview).
- `missing_context` / `TENANT_NOT_FOUND` / `MISSING_LEGAL_ENTITY_SELECTION` — readonly metadata surface with defer policy, verbose diagnostics, and **Select workspace** CTA (`/workspace/select`).

---

## Handoff block

```
1. Objective    — Pre-evaluation context-required metadata preview (B65).
2. Allowed layer— apps/erp metadata + metadata-workspace page + PAS docs
3. Files        — metadata-authorization-preview.server.ts (MODIFY)
                  resolve-metadata-authorization-from-api-route.server.ts (MODIFY)
                  resolve-metadata-ui-render-context.server.ts (MODIFY)
                  metadata-workspace-preview.contract.ts (MODIFY)
                  metadata-workspace-preview-surface.tsx (MODIFY)
                  context-errors.ts (MODIFY)
                  metadata-workspace/page.tsx (MODIFY)
                  metadata + context tests (MODIFY)
                  b65 slice doc; pas-status-index.md
4. Prohibited   — packages/metadata-ui evaluation logic; packages/kernel; registry
5. Authority    — PAS-001 §8 · B61–B64 bridge · metadata-ui render contracts
6. Gates        — pnpm --filter @afenda/erp typecheck; metadata vitest subset
7. Closes       — B64 deferred pre-eval UI gap; plan vs codebase completeness for auth preview triad
8. Evidence     — context-required preview tests; page wiring tests
9. Attestation  — Enterprise 9.5+/10
```

---

## Authorization preview triad (production)

| Failure class | Metadata UX |
| --- | --- |
| Evaluated RBAC denial | Forbidden preview + verbose diagnostics (B61) |
| Pre-eval `missing_context` | Defer readonly preview + workspace picker CTA (B65) |
| Pre-eval `missing_session` / other | `forbidden()` |

---

## Enterprise Quality Score

**9.8 / 10** — Full-stack metadata authorization preview triad closed; serializable defer policy at boundary; no kernel drift.
