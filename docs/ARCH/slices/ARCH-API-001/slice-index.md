# ARCH-API-001 — Slice index

> Parent: [`[Complete] ARCH-API-001-governed-rest-api.md`](../[Complete]%20ARCH-API-001-governed-rest-api.md) · Operational reference: [`afenda-rest-api-governance.md`](../../architecture/afenda-rest-api-governance.md)

| Slice | Title | Status | Scope |
| ---: | --- | --- | --- |
| 1 | Policy contracts + `ApiRouteContract` enrichment | **Delivered** (2026-06-26) | auth/context/rate-limit/lifecycle/stability modules |
| 2 | Route catalog + export/check gates | **Delivered** (2026-06-26) | `api-route-catalog.ts`, snapshot, scripts |
| 3 | Error envelope category/retryable + gateway seam | **Delivered** (2026-06-26) | `api-error.contract.ts`, `api-gateway.adapter.ts` |
| 4 | Drift fixes + registry tests | **Delivered** (2026-06-26) | webhooks allowlist, auth/memberships metadata, FDR sync |
| 5 | ARCH + governance docs + index | **Delivered** (2026-06-26) | ARCH-API-001, `afenda-rest-api-governance.md` |
| 6 | Promotion review | **Delivered** (2026-06-26) | DoD #14 peer review evidence · Complete promotion |

**Gates (all slices):** `pnpm check:api-contracts` · `pnpm check:api-route-catalog` · `pnpm --filter @afenda/erp test:run -- api-contract api-envelope api-handler-boundary api-route-catalog api-policy`

**Out of scope (P2):** OpenAPI generation (separate PR) · Kong runtime · `/api/public/v1`
