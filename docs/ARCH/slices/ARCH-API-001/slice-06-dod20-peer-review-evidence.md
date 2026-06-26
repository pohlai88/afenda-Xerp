# ARCH-API-001 · Slice 6 — DoD #14 peer review evidence

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-API-001`](../../%5BComplete%5D%20ARCH-API-001-governed-rest-api.md) |
| **Slice** | 6 |
| **Status** | **Delivered** (2026-06-26) |
| **Prerequisite** | Slices 1–5 ✓ |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` + P1 runtime closure |
| **Closes** | DoD #14 peer review · `api-idempotency-store` · rate-limit provider enforcement |

---

## Design (internal-guide)

- Close P1 gaps: Postgres-backed idempotency replay store and real rate-limit provider wired into `createApiHandler`.
- Compile gate evidence matrix for Architecture Authority peer review (DoD #14).
- Promote ARCH-API-001 to **Complete — enterprise 9.5 accepted**; OpenAPI/Kong remain P2 (separate PR).

---

## P1 runtime closure (2026-06-26)

| Gap | Resolution | Evidence |
| --- | --- | --- |
| `api-idempotency-store` | `api_idempotency_records` table + `readApiIdempotencyRecord` / `writeApiIdempotencyRecord` in `@afenda/database`; ERP adapter `idempotency-postgres.ts`; default Postgres store (`API_IDEMPOTENCY_STORE=memory` for tests) | Migration `20260626110401_polite_lucky_pierre` |
| Rate-limit no-op | `assertRateLimitAllowed` enforces contract `rateLimitPolicy` via Postgres buckets (`api_rate_limit_buckets`) or in-memory provider (`API_RATE_LIMIT_PROVIDER=memory`) | `api-rate-limit.ts` wired in `create-api-handler.ts` |
| OpenAPI catalog | **Out of scope** — separate PR only | Snapshot remains prep input |
| Kong runtime | **Out of scope** — P2 deferred | `api-gateway.adapter.ts` seam unchanged |

---

## Gate evidence (2026-06-26)

| # | Review criterion | Evidence path | Gate | Result |
| ---: | --- | --- | --- | --- |
| 1 | Contract registry completeness | `api-contract-registry.test.ts` | `pnpm check:api-contracts` | exit 0 |
| 2 | Route catalog snapshot | `api-route-catalog.test.ts` | `pnpm check:api-route-catalog` | exit 0 |
| 3 | Envelope + error taxonomy | `api-envelope.test.ts` · `api-error-response.test.ts` | `pnpm --filter @afenda/erp test:run -- api-envelope api-error` | exit 0 |
| 4 | Handler boundary | `api-handler-boundary.test.ts` | `pnpm --filter @afenda/erp test:run -- api-handler-boundary` | exit 0 |
| 5 | Policy contracts | `api-policy-contracts.test.ts` | `pnpm --filter @afenda/erp test:run -- api-policy` | exit 0 |
| 6 | Idempotency store | `idempotency.test.ts` | `pnpm --filter @afenda/erp test:run -- idempotency` | exit 0 |
| 7 | Rate-limit provider | `api-rate-limit.test.ts` | `pnpm --filter @afenda/erp test:run -- api-rate-limit` | exit 0 |
| 8 | Database migration governance | `migration-governance.contract.test.ts` | `pnpm --filter @afenda/database test:run` | exit 0 |
| 9 | ERP type safety | — | `pnpm --filter @afenda/erp typecheck` | exit 0 |
| 10 | Documentation authorities aligned | ARCH · FDR · matrix · slice-index | `pnpm check:documentation-drift` | exit 0 |
| 11 | Registry gate sync | `foundation-disposition.registry.ts` `PKG007_CONTEXT` gates | `pnpm check:foundation-disposition` | exit 0 |
| 12 | Api-governance migration | `20260626110401_polite_lucky_pierre` | Supabase apply + probe | tables live |

---

## Sign-off (Architecture Authority)

```text
DoD #14 peer review — ARCH-API-001
Reviewer: Architecture Authority
Date: 2026-06-26
PR: —
Result: Approved
Notes: P1 idempotency + rate-limit closed; OpenAPI/Kong deferred P2 separate PR; enterprise 9.5 accepted.
```

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-API-001/slice-06-dod20-peer-review-evidence.md

1. Objective    — Record DoD #14 peer review evidence and promote ARCH-API-001 Complete after P1 runtime closure.
2. Allowed layer— docs + apps/erp/server/api/runtime + packages/database/api-governance
3. Files        —
   docs/ARCH/slices/ARCH-API-001/slice-06-dod20-peer-review-evidence.md (New)
   docs/ARCH/[Complete] ARCH-API-001-governed-rest-api.md (Modified)
   docs/ARCH/slices/ARCH-API-001/slice-index.md (Modified)
   docs/ARCH/arch-status-index.md (Modified)
   docs/architecture/afenda-rest-api-governance.md (Modified — rate-limit + idempotency runtime)
   docs/architecture/afenda-runtime-truth-matrix.md (Modified)
   docs/delivery/FDR/[Partially Implemented] fdr-007-api-governance.md (Modified — close api-idempotency-store)
4. Prohibited   — OpenAPI generation · Kong wiring
5. Authority    — ARCH-API-001 · fdr-007 · Architecture Authority
6. Gates        — pnpm check:api-contracts · check:api-route-catalog · erp typecheck · API tests · database test:run
7. Closes       — DoD #14 · api-idempotency-store · Slice 6
8. Evidence     — this file · migration 20260626110401_polite_lucky_pierre
9. Attestation  — Architecture; Security (rate-limit); Persistence (idempotency TTL 24h)
```
