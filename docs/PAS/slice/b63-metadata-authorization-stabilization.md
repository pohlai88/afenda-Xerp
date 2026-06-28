# Slice B63 — Metadata Authorization Stabilization (PAS-001 §8)

**Prerequisite:** Slice B62 — Metadata authorization bridge hardening

**Status:** Delivered

**Type:** Implementation + documentation closure

---

## Objective

Close remaining stabilization risks from B62 assessment:

1. Rebuild `@afenda/kernel` dist after root wire-serializer exports (B18 parity).
2. Add root export parity test for policy/permission wire serializers.
3. Remove legacy `resolveMetadataAuthorizationWithPolicyCheck` from production module — vitest helper only.
4. Align render-context tests with production `resolveMetadataAuthorizationFromOperatingContext`.
5. Restore PAS slice documentation for B57–B60 (index-linked closure).

Pre-evaluation metadata UI preview (`missing_context` defer surface) remains **B64+** — page still calls `forbidden()`.

---

## Handoff block

```
1. Objective    — Stabilize metadata authorization stack risks (B63).
2. Allowed layer— apps/erp metadata tests; packages/kernel tests; PAS docs
3. Files        — resolve-metadata-authorization.server.ts (MODIFY)
                  metadata-authorization.test-helpers.ts (CREATE)
                  subpath-exports.test.ts (MODIFY)
                  b57–b60 + b63 slice docs; pas-status-index.md
4. Prohibited   — metadata-ui evaluation logic; pre-eval UI preview expansion
5. Authority    — PAS-001 §8 · B18 export parity
6. Gates        — pnpm --filter @afenda/kernel build && test:run
                  pnpm --filter @afenda/erp typecheck && metadata vitest
7. Closes       — legacy helper drift; missing slice docs; export parity test gap
8. Evidence     — 28+ metadata tests; kernel subpath export test
9. Attestation  — Enterprise 9.5+/10
```
