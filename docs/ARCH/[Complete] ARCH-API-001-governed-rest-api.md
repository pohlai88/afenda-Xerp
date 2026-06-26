# ARCH-API-001 — Governed REST API Foundation

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Operational authority:** [`afenda-rest-api-governance.md`](../architecture/afenda-rest-api-governance.md) · **Paired FDR:** [`fdr-007-api-governance`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-api-governance.md) · **Slice 6 evidence:** [`slice-06-dod20-peer-review-evidence.md`](slices/ARCH-API-001/slice-06-dod20-peer-review-evidence.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-API-001 |
| **Work ID** | ARCH-API-001 · paired `fdr-007-api-governance` |
| **Title** | Governed REST API foundation |
| **Status** | **Complete — enterprise 9.5 accepted** (2026-06-26) |
| **Date** | 2026-06-26 |
| **Owner** | Application Authority (`apps/erp` API surface) |
| **Package** | PKG-007 · `@afenda/erp` |
| **Registry entry ID** | `PKG007_CONTEXT` (api-governance subdomain) |
| **Runtime owner** | `apps/erp/src/server/api/` |
| **Lane** | green-lane |
| **Risk class** | Medium |
| **Change class** | Extension + Governance |
| **Clean Core target** | B |
| **Enterprise score** | **29/30 enterprise 9.5 accepted** |

> **Scope:** REST-first governed API under `/api/internal/v1/**` — contract registry, envelope, RBAC, operating context, audit hooks, CI drift gates, Postgres idempotency + rate limits.  
> **Not in scope:** Kong gateway (P2), OpenAPI catalog (P2 — separate PR), accounting domain routes (ADR-0010), legacy auth/integration/webhook transports (allowlisted).

---

# 1. Execution instruction

Execute ARCH-API-001 slices via `afenda-governed-implementer` or `fdr-slice-implementer` when FDR handoff applies.

Every completion claim maps to file path, test path, command exit code, or documentation row — not prose alone. Operational details live in [`afenda-rest-api-governance.md`](../architecture/afenda-rest-api-governance.md).

---

# 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-API-001 · `fdr-007-api-governance` |
| Title | Governed REST API foundation |
| Status | **Complete — enterprise 9.5 accepted** |
| Package | `@afenda/erp` (PKG-007) |
| Registry entry ID | PKG007_CONTEXT |
| Runtime owner | `apps/erp/src/server/api/` |
| Lane | green-lane |
| Clean Core target | B |
| Enterprise score | 29/30 |

---

# 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. docs/architecture/afenda-rest-api-governance.md (operational authority)
3. docs/delivery/fdr-status-index.md
4. docs/delivery/FDR/[Partially Implemented] fdr-007-api-governance.md
5. packages/architecture-authority/src/data/foundation-disposition.registry.ts (PKG007_CONTEXT)
6. docs/architecture/afenda-runtime-truth-matrix.md (API Contract Governance row)
7. docs/architecture/multi-tenancy.md (operating context)
8. apps/erp/src/server/api/contracts/api-contract-registry.ts
```

---

# 4. Problem statement

## Current risk / gap

```text
Ungoverned route handlers multiply envelope shapes, bypass RBAC, skip operating-context
resolution, and evade audit — breaking client contracts and enterprise security posture.
```

## Business / architecture impact

```text
- Integration: Inconsistent JSON breaks ERP client helpers and future SDK work.
- Security: Client-trusted tenant scope or missing permission keys leak cross-tenant data.
- Audit: Mutations without registry audit policy leave compliance gaps.
- Maintainability: Ad-hoc routes cannot be catalog-exported or CI-gated.
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Path |
| --- | --- | --- |
| Contract registry | `@afenda/erp` | `apps/erp/src/server/api/contracts/` |
| Handler runtime | `@afenda/erp` | `apps/erp/src/server/api/runtime/` |
| Idempotency + rate-limit persistence | `@afenda/database` | `packages/database/src/api-governance/` |
| Permission keys | `@afenda/permissions` | Consumer — read-only |
| Operating context | `@afenda/kernel` + ERP resolver | Consumer — read-only |
| Drift gates | `scripts/api-contract/` | Repo-level CI |
| Operational docs | Architecture | `docs/architecture/afenda-rest-api-governance.md` |

## 5.2 Boundary rules

1. Govern before multiply — registry entry before route merge.
2. Single `API_CONTRACTS` authority — no parallel registries.
3. `/api/internal/v1/**` uses `createApiHandler` and governed envelope only.
4. Operating context via `resolveOperatingContext()` — see [`multi-tenancy.md`](../architecture/multi-tenancy.md).
5. Permission keys from `@afenda/permissions` vocabulary only.

## 5.3 Prohibited actions

- Add governed routes without `ApiRouteContract` registration
- Duplicate envelope or policy constants outside `contracts/`
- Inline tenant lookup or trust session for tenant scope
- Wire Kong or generate OpenAPI in this ARCH without separate approval row
- Hand-edit idempotency persistence migrations locally
- Use vague timeline language — classify gaps as P0/P1/P2/P3

## 5.4 Production classification

| Capability | Bucket | Notes |
| --- | --- | --- |
| Contract registry + envelope + CI gates | **P0 — production mandatory** | Delivered — 10 contracts registered |
| Durable idempotency store | **P0 — production mandatory** | Postgres `api_idempotency_records`; migration `20260626110401_polite_lucky_pierre` |
| Real rate-limit enforcement | **P0 — production mandatory** | Postgres `api_rate_limit_buckets`; wired in `createApiHandler` |
| OpenAPI catalog | **P2 — excluded from current production release** | Separate PR only |
| Kong / external API gateway | **P2 — excluded from current production release** | Seam at `api-gateway.adapter.ts` only; no runtime |

---

# 6. Required implementation scope

## In scope

- `apps/erp/src/server/api/contracts/**`
- `apps/erp/src/server/api/runtime/**`
- `apps/erp/src/server/api/__tests__/**`
- `apps/erp/src/app/api/internal/v1/**/route.ts`
- `packages/database/src/api-governance/**`
- `scripts/api-contract/**`
- `docs/architecture/afenda-rest-api-governance.md`

## Out of scope

- `/api/auth/**`, `/api/integrations/**`, `/api/webhooks/**` (allowlisted legacy)
- Accounting domain API routes (ADR-0010)
- Kong gateway runtime (P2)
- OpenAPI codegen (P2 — separate PR)

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: Governed REST API foundation

  Scenario: Registry covers all non-allowlisted ERP routes
    GIVEN route files under apps/erp/src/app/api/
    WHEN pnpm check:api-contracts runs
    THEN every governed route uses createApiHandler
    AND every contract appears in API_CONTRACTS

  Scenario: Protected route enforces context and permission
    GIVEN a session-required contract with tenant-required contextPolicy
    WHEN an unauthorized caller invokes the route
    THEN the response is a governed error envelope with category and retryable
    AND audit evidence records the denial when audit is enabled

  Scenario: Catalog snapshot stays aligned
    GIVEN API_CONTRACTS changes
    WHEN pnpm check:api-route-catalog runs
    THEN snapshot drift fails CI until pnpm export:api-route-catalog refreshes
```

---

# 8. Enterprise quality benchmark

| Dimension | Target | Evidence |
| --- | ---: | --- |
| Contract stability | 5/5 | `typecheck` + `check:api-contracts` exit 0 |
| Test coverage | 4/5 | Registry, envelope, boundary, catalog, idempotency, rate-limit tests |
| Observability + audit | 4/5 | Handler audit + correlation; live trace P1 waiver |
| Security + RBAC + RLS | 5/5 | Permission on protected contracts; context resolver; rate limits |
| Documentation | 5/5 | This ARCH + operational governance doc + slice 6 evidence |
| Maintainability + Clean Core | 5/5 | Single registry; Clean Core B |

**Accepted:** **29/30 enterprise 9.5** — DoD #14 peer review closed 2026-06-26 ([`slice-06`](slices/ARCH-API-001/slice-06-dod20-peer-review-evidence.md)).

---

# 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | 100% governed route registry coverage | `check:api-contracts` |
| Security | Server-side session, context, RBAC, rate limits | Handler + integration tests |
| Compatibility | Stable contract IDs and envelope | Registry + envelope tests |
| Reliability | Deterministic envelope; durable idempotency on mutations | Idempotency store + contract tests |
| Maintainability | No duplicate authority | Registry drift gate |
| Observability | Correlation ID on all responses | Envelope tests |

---

# 10. Required gates

```bash
pnpm check:api-contracts
pnpm check:api-route-catalog
pnpm export:api-route-catalog    # after registry edits
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run -- api-contract api-envelope api-handler-boundary api-route-catalog api-rate-limit idempotency
pnpm check:multi-tenancy-context-integration
pnpm quality:boundaries
pnpm check:documentation-drift
```

---

# 11. Definition of Done

| # | Criterion | Status |
| --- | --- | --- |
| 1 | Runtime evidence at `apps/erp/src/server/api/` | [x] |
| 2 | Acceptance criteria — registry coverage | [x] |
| 3 | Positive path tested | [x] |
| 4 | Negative path — handler boundary | [x] |
| 5 | TypeScript strict | [x] |
| 6 | Package tests | [x] |
| 7 | Runtime matrix API row **implemented** | [x] |
| 8 | ARCH + operational governance doc | [x] |
| 9 | Drift green | [x] |
| 10 | Clean Core B declared | [x] |
| 11–13 | Impact, rollback, security | [x] |
| 14 | Peer review (DoD #14) | [x] — slice 6 evidence 2026-06-26 |
| 15–19 | Waivers, E2E, enterprise score | [x] |
| 20 | Enterprise 29/30 | [x] |

---

# 12. Impact analysis

| Consumer | Dependency | Breaking? | Action |
| --- | --- | --- | --- |
| ERP client fetch helpers | Governed envelope | No | Use `readApiEnvelope` |
| ARCH-ADMIN-001 | System-admin API contracts | No | Registry consumer |
| ARCH-USER-001 | Dashboard layout API | No | Registry consumer |
| Phase 9 readiness | `check:api-contracts` | No | Gate delegated |
| Future `@afenda/accounting` | Blocked | N/A | ADR-0010 |

Breaking change: **No** · Runtime risk: **Low** · Rollback safe: **Yes** (revert registry commit + re-run gates).

---

# 13. Waiver policy

| Waiver ID | Requirement | Classification | Revisit |
| --- | --- | --- | --- |
| `api-e2e` | Browser E2E for API | P3 | External beta go-live |
| `api-observability-live-traces` | Full distributed trace | P1 | `fdr-013-logging-tracing` |

---

# 14. Rollback strategy

| Area | Method | Risk |
| --- | --- | --- |
| Registry / runtime code | `git revert` + `pnpm check:api-contracts` | Low |
| Idempotency / rate-limit migration | Forward-only migration; feature env toggles `API_IDEMPOTENCY_STORE=memory` | Medium |
| Catalog snapshot | Re-run `pnpm export:api-route-catalog` | Low |
| Documentation | Revert ARCH + governance doc | Low |

---

# 15. Required output from agent

Completion report per [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) §15 — file paths, gate exit codes, remaining P2 gaps.

---

# 16. Promotion rule

**Promoted 2026-06-26** to **Complete — enterprise 9.5 accepted** after:

- DoD #14 peer review closed (slice 6)
- P1 idempotency + rate-limit runtime delivered
- All gates exit 0
- `arch-status-index.md` row updated

---

# 17. Command to execute

```text
ARCH-API-001 Complete — maintenance mode only.
OpenAPI and Kong require separate P2 ARCH/FDR approval.
```

---

# 18. Runtime evidence summary

| Artifact | Path | Proven |
| --- | --- | --- |
| Contract registry (10 routes) | `api-contract-registry.ts` | Yes — `check:api-contracts` exit 0 |
| Route catalog snapshot | `api-route-catalog.snapshot.json` | Yes — `check:api-route-catalog` |
| Envelope + error taxonomy | `api-envelope.contract.ts`, `api-error.contract.ts` | Yes — unit tests |
| Handler factory | `runtime/create-api-handler.ts` | Yes — boundary tests + rate-limit wiring |
| Durable idempotency | `packages/database` + `runtime/idempotency-postgres.ts` | Yes — migration + unit tests |
| Rate-limit provider | `runtime/api-rate-limit.ts` | Yes — `api-rate-limit.test.ts` |
| Gateway seam (none) | `runtime/api-gateway.adapter.ts` | Yes — P2 no runtime |

Archive input: [`tip-010a-api-contract-governance.md`](../delivery/tips/[Complete]%20tip-010a-api-contract-governance.md).

---

# 19. Remaining gaps

| Gap | Classification | Owner |
| --- | --- | --- |
| OpenAPI catalog | P2 | Separate PR |
| Kong / API gateway | P2 | Separate ARCH/FDR |

**Verdict:** **Complete — enterprise 9.5 accepted** — P2 OpenAPI/Kong tracked separately. Apply migration `20260626110401_polite_lucky_pierre` on production DB before traffic (`pnpm migrate`).
