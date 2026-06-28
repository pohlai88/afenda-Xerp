# Slice B62 — Metadata Authorization Bridge Hardening (PAS-001 §8)

**Prerequisite:** Slice B61 — Metadata authorization denial preview

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — consolidation and type-safety; no behavior expansion for pre-eval failures

---

## Objective

Harden the metadata authorization bridge end-to-end:

1. Consolidate duplicate boundary-descriptor and pre-eval policy mappers.
2. Fix `isEvaluatedApiRouteAuthorizationDenial` to reject `operatingContext: null`.
3. Single denial-preview context helper shared by render resolver and preview surface.
4. Align production denial tests with `unauthorized` + boundary descriptor parity.
5. Document pre-eval projection (bridge-only; page still `forbidden()`).

Pre-evaluation failures remain **out of scope** for metadata UI preview — product defer/context-picker UX is a future slice.

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Shared projection module | `metadata-authorization-projection.server.ts` |
| 2 | Shared denial-preview helper | `metadata-authorization-preview.server.ts` |
| 3 | Type guard rejects null OC | `isEvaluatedApiRouteAuthorizationDenial` + test |
| 4 | Pre-eval projection tested | api-route bridge tests |
| 5 | Production denial parity | `resolveMetadataAuthorizationFromOperatingContext` test |

---

## Handoff block

```
1. Objective    — Harden metadata authorization bridge (B62).
2. Allowed layer— apps/erp/src/lib/metadata/**; preview surface; PAS docs
3. Files        — metadata-authorization-projection.server.ts (CREATE)
                  metadata-authorization-preview.server.ts (CREATE)
                  resolve-metadata-* (MODIFY)
                  metadata-workspace-preview-surface.tsx (MODIFY)
                  __tests__ (MODIFY/CREATE)
                  b61/b62 slice docs, pas-status-index.md
4. Prohibited   — packages/kernel, packages/metadata-ui evaluation logic
5. Authority    — PAS-001 §8 · Metadata UI · Permission
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp exec vitest run src/lib/metadata
                  pnpm --filter @afenda/erp exec vitest run src/__tests__/metadata-production-page.test.tsx
7. Closes       — B61 consolidation debt; type guard; test/production drift
8. Evidence     — projection + preview tests; pas-status-index B62 Delivered
9. Attestation  — Enterprise 9.5+/10
```

---

## Drift prevention

| Rule | Result |
|------|--------|
| Pre-eval failures still forbidden() on page | Pass — by design |
| metadata-ui does not execute authorization | Pass |
| Single canonical api-route production path | Pass |
