# fdr-007-api-governance · Slice 2 — Contract registry hardening (Evidence-sync)

| Field | Value |
| --- | --- |
| **Parent** | [`[Partially Implemented] fdr-007-api-governance.md`](../../%5BPartially%20Implemented%5D%20fdr-007-api-governance.md) |
| **Status** | Complete (Evidence-sync 2026-06-27) |
| **Prerequisite** | Slice 1 Complete ✓ |
| **Slice type** | **Evidence-sync** (reclassified from Implementation — runtime deliverables already present) |
| **Risk class** | Low |
| **Clean Core impact** | B→B |
| **Runtime owner** | `apps/erp` (read-only verification) |
| **Registry entry** | `PKG007_CONTEXT` |

---

## Reclassification notice

Original Slice 2 was typed **Implementation** with bounded edits to `api-route-coverage.ts`, registry tests, handler boundary tests, and `check-api-contracts.mts`.

**2026-06-27 audit:** Live codebase already satisfies Slice 2 design intent:

| Planned deliverable | Live evidence | Grade |
| --- | --- | --- |
| Route coverage invariants + export parity | `api-contract-registry.test.ts` — 15 tests including `registers every governed route handler contract` and `keeps API_CONTRACTS aligned with GOVERNED_ROUTE_CONTRACT_EXPORTS` | A |
| Handler boundary negative paths | `api-handler-boundary.test.ts` — 3 tests: `createApiHandler` required, forbids `Response.json`, forbids UI imports | A |
| Drift gate with named route violations | `check-api-contracts.mts` — `${filePath}: missing createApiHandler` / `: direct Response.json usage` + registry coverage validator | A |
| OpenAPI drift chained | `pnpm check:api-contracts` chains `check-openapi-drift.mts` — exit 0 | A |

**Gate verification (2026-06-27):**

| Gate | Exit |
| --- | ---: |
| `pnpm check:api-contracts` | 0 |
| `pnpm check:openapi-drift` | 0 |
| `pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary` | 0 (18 tests) |

No source edits required. Slice 2 is **Evidence-sync** — reconcile FDR §Slices, §Runtime evidence, §Remaining gaps, and slice index; do **not** modify `apps/erp` or `scripts/api-contract/` unless a gate fails during delivery.

---

## Slice discovery (audit record)

| Field | Value |
| --- | --- |
| FDR doc | `docs/delivery/FDR/[Partially Implemented] fdr-007-api-governance.md` |
| FDR ID | `fdr-007-api-governance` |
| Registry entry ID | `PKG007_CONTEXT` |
| Slice number | 2 |
| Previous slice status | Delivered (Slice 1 Complete 2026-06-25) |
| Slice type | Evidence-sync (reclassified from Implementation) |
| Risk class | Low |
| Clean Core impact | B→B |
| Runtime owner | `apps/erp` |
| Owning package | `@afenda/erp` |
| Deliverables rows covered | FDR doc evidence reconciliation; slice handoff authority |
| Remaining gaps closed | `api-complete-status` (partial — evidence only; DoD #14 peer review remains operator) |
| Enterprise gates touched | G0 documentation drift; G1 contract stability (`check:api-contracts`); G2 test coverage (registry + boundary tests) |

---

## Design (internal-guide)

Prove Slice 2 contract-registry hardening is already delivered in runtime; sync FDR prose that still references 11 registry tests, Implementation type, and "Not started" status. Partially advance `api-complete-status` by recording Slice 2 evidence — **Complete** promotion remains blocked on DoD #14 (Architecture Authority peer review).

---

## Handoff block

```
Handoff from: docs/delivery/FDR/slices/fdr-007-api-governance/slice-02-contract-registry-hardening.md

1. Objective    — Reconcile Slice 2 contract registry hardening as Evidence-sync: confirm live gates exit 0, update FDR §Slices/§Runtime evidence/slice index to reflect 15 registry tests + 3 handler boundary tests + chained OpenAPI drift gate, and partially close api-complete-status (evidence only; DoD #14 remains operator).
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/slices/fdr-007-api-governance/slice-02-contract-registry-hardening.md
   docs/delivery/FDR/slices/fdr-007-api-governance/slice-index.md
   docs/delivery/FDR/[Partially Implemented] fdr-007-api-governance.md
4. Prohibited   — foundation-disposition.registry.ts edits; apps/erp/** source edits unless a verification gate fails; scripts/api-contract/** source edits unless gate failure; @afenda/accounting API routes (ADR-0010); do-not-trust-session-for-tenant-scope; duplicate envelope shapes outside api-envelope.contract.ts; FDR filename promotion to [Complete] (blocked on DoD #14)
5. Authority    — ADR-0014 · ADR-0016 · PKG007_CONTEXT · tip-010a archive (reference only)
6. Gates        —
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary
   pnpm check:documentation-drift
7. Closes       — api-complete-status (partial — evidence only; DoD #14 peer review remains operator); DoD #1 (runtime evidence paths confirmed); DoD #2 (registry + boundary tests pass); DoD #16 (single API_CONTRACTS authority); DoD #17 (handler boundary negative path)
8. Evidence     —
   apps/erp/src/server/api/__tests__/api-contract-registry.test.ts
   apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts
   apps/erp/src/server/api/contracts/api-route-coverage.ts
   scripts/api-contract/check-api-contracts.mts
   scripts/api-contract/check-openapi-drift.mts
   docs/delivery/FDR/slices/fdr-007-api-governance/slice-02-contract-registry-hardening.md
9. Attestation  — Documentation (FDR + slice index sync); Test coverage (15 + 3 unit tests verified); Contract stability (check:api-contracts + OpenAPI drift exit 0); Maintainability (no duplicate registry authority)
```

---

## FDR doc edits required (`fdr-slice-implementer`)

Apply these exact edits to `docs/delivery/FDR/[Partially Implemented] fdr-007-api-governance.md`:

1. **§Slices → Slice 2 header:** Change `### Slice 2 — Implementation (contract registry hardening)` to `### Slice 2 — Contract registry hardening (Evidence-sync)`.
2. **Slice 2 metadata:** Set `**Status:**` to `Complete (Evidence-sync 2026-06-27)`; set `**Type:**` to `Evidence-sync`; add reclassification note referencing this handoff file.
3. **Replace Slice 2 handoff block** with the 9-field block above (Evidence-sync version).
4. **§Runtime evidence — Registry tests row:** Change `(11 tests exit 0)` to `(15 tests exit 0)`.
5. **§Runtime evidence — Handler boundary tests row:** Confirm `(3 tests exit 0)` unchanged.
6. **§Enterprise readiness — Contract stability row:** Update evidence text from `11 tests` to `15 tests`.
7. **§Research — Files inspected / gate logs:** Add 2026-06-27 verification row: 15 registry + 3 boundary tests; `check:openapi-drift` chained exit 0.
8. **§Remaining gaps — `api-complete-status`:** Append close condition note: `Slice 2 evidence reconciled (Evidence-sync); Complete blocked on DoD #14 peer review`.
9. **§Verdict:** Add bullet: `Slice 2 Complete (Evidence-sync 2026-06-27) — registry hardening pre-delivered; no source diff`.
10. **Do NOT:** Rename FDR to `[Complete]`; mark DoD #14 `[x]`; edit registry.

---

## DoD rows this slice closes

| # | Criterion | Gate | Notes |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + gate exit 0 | Confirm only — already `[x]` |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary` | 18 tests (15 + 3) |
| 16 | No duplicated constants / parallel authority | `pnpm check:api-contracts` | Export/registry parity test proves alignment |
| 17 | Security negative path tested | `api-handler-boundary.test.ts` | Direct `Response.json` scan |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | Sync test counts in evidence column only if changed |

**Explicitly not closed by this slice:** DoD #14 (peer review) — operator / Architecture Authority at PR.

---

## Known debt

- `api-complete-status` — **partial** after this slice; full close requires DoD #14 `[x]` and FDR `[Complete]` promotion.
- Slice 3 (Implementation contract closeout) remains for any **future** route additions — not required for Slice 2 evidence reconciliation.
- `api-idempotency-store` and `api-registry-gate-sync` — already closed (2026-06-26).
