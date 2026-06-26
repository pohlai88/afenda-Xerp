# fdr-007-api-governance — API Contract Governance

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-api-governance` |
| **Registry entry ID** | `PKG007_CONTEXT` |
| **Package** | `@afenda/erp` (PKG-007) |
| **Lane** | green-lane |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — REST envelope + contract registry for governed ERP API routes |
| **Enterprise readiness** | **27/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | API governance · Integration governance ([enterprise-erp-standards §8](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `operating-context`; this FDR scopes the **api-governance** subdomain on the same `PKG007_CONTEXT` entry. Acceptance gates `pnpm check:api-contracts` and `pnpm check:api-route-catalog` are listed in registry `gates[]` (synced 2026-06-26).

| Field | Value |
| --- | --- |
| id | `PKG007_CONTEXT` |
| packageId | PKG-007 |
| domain | `operating-context` (FDR subdomain: `api-governance`) |
| lane | green-lane |
| runtimeOwner | `apps/erp` |
| gates | `pnpm --filter @afenda/erp typecheck`; `pnpm quality:erp-context-surface`; `pnpm check:multi-tenancy-context-integration`; `pnpm check:documentation-drift` |
| prohibited | `do-not-create-accounting-package`; `do-not-inline-tenant-lookup`; `do-not-trust-session-for-tenant-scope` |
| allowedAgents | `erp-app-agent`; `kernel-context-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/erp` (PKG-007) | API contract registry, envelope runtime, route coverage validation | `apps/erp/src/server/api/` |
| `@afenda/permissions` (PKG-014) | Permission keys on protected contracts (read-only consumer) | `packages/permissions/src/grants/` |
| `@afenda/kernel` (PKG-010) | Branded execution context in envelopes (read-only consumer) | `packages/kernel/src/context/` |
| Governance scripts | Repo-level contract drift gate | `scripts/api-contract/` |

## Purpose

Lock and maintain REST-first, envelope-based API contract governance for all governed ERP routes — serializable `ApiRouteContract` registry, method/idempotency/pagination policy, `createApiHandler` boundary enforcement, operating-context resolution, RBAC, and stable success/error envelopes — so every non-auth ERP route is registered, test-evidenced, and CI-gated before Accounting Core activation.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-010a-api-contract-governance.md`](../../delivery/tips/[Complete]%20tip-010a-api-contract-governance.md).

## Scope

**In scope**

- `apps/erp/src/server/api/contracts/` — envelope, method policy, idempotency, pagination, error taxonomy, route coverage, contract registry
- `apps/erp/src/server/api/runtime/` — `createApiHandler`, validation, response envelope, correlation, audit hooks, idempotency runtime (in-memory)
- `apps/erp/src/server/api/__tests__/` — registry, envelope, handler boundary tests
- `scripts/api-contract/check-api-contracts.mts` — route coverage + policy drift gate
- `scripts/api-contract/governed-api-routes.mts` — CI evidence re-export
- FDR evidence reconciliation against archive tip-010a + runtime matrix **partial** row

**Out of scope**

- Public OpenAPI catalog (future product TIP)
- Accounting domain API routes (ADR-0010)
- Durable idempotency store — Postgres `api_idempotency_records` (migration `20260626110401_polite_lucky_pierre`)
- Real rate-limit provider — Postgres `api_rate_limit_buckets`; wired in `createApiHandler`
- Operating-context resolver pipeline internals (`fdr-007-operating-context`)
- System Admin page delivery (`fdr-007-system-admin` — admin contracts are consumers of this FDR)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `apps/erp/src/server/api/` and `scripts/api-contract/` paths under §Scope |
| Shared constants | No agent may duplicate contract IDs or envelope shapes outside `api-contract-registry.ts` and contract modules |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-007 | **Sequential** with `fdr-007-operating-context`, `fdr-007-system-admin`, `fdr-007-ux-surfaces` — same `runtimeOwner`; orchestrator serializes shared `apps/erp` edits |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-010a, runtime matrix API row, and live gate exit codes with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `pnpm check:api-contracts` exit 0? | **Yes** | Gate log below — "API contract drift check passed" |
| Are all non-auth ERP routes registered in `API_CONTRACTS`? | **Yes** — 10 contracts; coverage validator passes | `api-contract-registry.ts`; `check-api-contracts.mts` |
| Do governed routes use `createApiHandler` (no raw `Response.json`)? | **Yes** — route boundary scan passes | `api-route-coverage.ts`; `api-handler-boundary.test.ts` |
| Are method + idempotency policies enforced on every contract? | **Yes** | `method-policy.contract.ts`; `idempotency.contract.ts`; gate policy loop |
| Is durable idempotency store implemented? | **Yes** — Postgres-backed replay store | `packages/database/src/api-governance/` · `runtime/idempotency-postgres.ts` |
| Is rate-limit enforcement active? | **Yes** — contract policy enforced in handler | `runtime/api-rate-limit.ts` · `api-rate-limit.test.ts` |
| Does runtime matrix **partial** align with FDR promotion? | **No — reconciled** — matrix row **implemented** (2026-06-25 v2 audit); gate passes | §Remaining gaps `api-matrix-row-sync` closed |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:api-contracts` | 0 | A |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- api-contract` | 0 | A (19 tests across 3 files) |
| `pnpm check:multi-tenancy-context-integration` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A (post FDR upgrade) |

### v2 audit gate log (2026-06-25 refresh)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:api-contracts` | 0 | A |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- api-contract api-envelope api-handler-boundary` | 0 | A (19 tests) |
| `pnpm check:multi-tenancy-context-integration` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Slice 2 Evidence-sync gate log (2026-06-27)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:api-contracts` | 0 | A |
| `pnpm check:openapi-drift` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary` | 0 | A (18 tests — 15 registry + 3 boundary) |
| `pnpm check:documentation-drift` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | Canonical 8-contract registry + handler export map |
| `apps/erp/src/server/api/contracts/api-route-coverage.ts` | Route file discovery + coverage validation |
| `apps/erp/src/server/api/contracts/api-envelope.contract.ts` | Serializable `{ ok, data, error, meta }` envelope |
| `apps/erp/src/server/api/contracts/method-policy.contract.ts` | GET/POST/PATCH/PUT/DELETE rules |
| `apps/erp/src/server/api/contracts/idempotency.contract.ts` | Mutation idempotency key policy |
| `apps/erp/src/server/api/contracts/pagination.contract.ts` | Collection pagination contract |
| `apps/erp/src/server/api/runtime/create-api-handler.ts` | Governed handler factory |
| `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | Registry drift guards (15 tests) |
| `apps/erp/src/server/api/__tests__/api-envelope.test.ts` | Envelope + error taxonomy (5 tests) |
| `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` | Handler boundary (3 tests) |
| `scripts/api-contract/check-api-contracts.mts` | Repo-level drift gate |
| `docs/governance/api-contract.md` | Governance policy doc (archive cross-ref) |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | API Contract Governance row (**implemented** — v2 reconciled) |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Contract registry | `apps/erp/src/server/api/contracts/api-contract-registry.ts` | Yes — Grade A (`check:api-contracts` exit 0) |
| Route coverage module | `apps/erp/src/server/api/contracts/api-route-coverage.ts` | Yes — Grade A (coverage validator in gate) |
| Envelope contract | `apps/erp/src/server/api/contracts/api-envelope.contract.ts` | Yes — Grade B (`api-envelope.test.ts`) |
| Method policy | `apps/erp/src/server/api/contracts/method-policy.contract.ts` | Yes — Grade A (gate policy loop exit 0) |
| Idempotency policy | `apps/erp/src/server/api/contracts/idempotency.contract.ts` | Yes — Grade B (policy enforced; store in-memory only) |
| Pagination contract | `apps/erp/src/server/api/contracts/pagination.contract.ts` | Yes — Grade B (dashboard layout contracts cite pagination) |
| Handler factory | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Yes — Grade B (`api-handler-boundary.test.ts`) |
| Idempotency runtime | `apps/erp/src/server/api/runtime/idempotency.ts` | Yes — Grade A (Postgres default; memory for tests) |
| Registry tests | `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | Yes — Grade A (15 tests exit 0) |
| Envelope tests | `apps/erp/src/server/api/__tests__/api-envelope.test.ts` | Yes — Grade A (5 tests exit 0) |
| Handler boundary tests | `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` | Yes — Grade A (3 tests exit 0) |
| Drift gate script | `scripts/api-contract/check-api-contracts.mts` | Yes — Grade A (exit 0) |
| System Admin API contracts | `apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts` | Yes — Grade B (3 mutation/read contracts in registry) |
| Workspace API contracts | `apps/erp/src/server/api/contracts/workspace/dashboard-layout.contract.ts` | Yes — Grade B (GET/PUT/DELETE in registry) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `api-idempotency-store` | ~~Durable idempotency store~~ **Closed 2026-06-26** | green | `erp-app-agent` | Slice 6 | Postgres migration + ERP adapter |
| `api-registry-gate-sync` | ~~`check:api-contracts` not in registry~~ **Closed 2026-06-26** | green | `foundation-registry-owner` | Registry-sync | Added `check:api-contracts` + `check:api-route-catalog` to `PKG007_CONTEXT` gates |
| `api-matrix-row-sync` | ~~Runtime matrix row still **partial** while gate passes~~ **Closed** (v2 audit 2026-06-25) | green | Architecture Authority | — | Matrix row **implemented** |
| `api-complete-status` | FDR at 27/30 audit-adjusted; Complete blocked on peer review | green | Architecture Authority (PR) | Complete | DoD #14 peer review `[x]`; §Waivers reconfirmed. Slice 2 evidence reconciled (Evidence-sync); Complete blocked on DoD #14 peer review |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `api-contract-registry.test.ts` (15 tests) + `check:api-contracts` exit 0 — Grade A | — |
| Test coverage | 4/5 | 19 API unit tests + route coverage gate — Grade A | Waiver `api-e2e` for browser E2E |
| Observability + audit | 4/5 | `api-handler-audit.ts` + `api-handler-logging.ts` — Grade B | Waiver `api-observability-live-traces` |
| Security + RBAC + RLS | 5/5 | Every protected contract declares permission keys; operating context via handler — Grade A | — |
| Documentation + BRD traceability | 4/5 | FDR v2 + matrix **implemented** row + drift exit 0 — Grade A | DoD #14 peer review still `[ ]` |
| Maintainability + Clean Core | 5/5 | `check:api-contracts` exit 0; single registry authority; Clean Core B — Grade A | — |
| **Total (audit-adjusted)** | **27/30** | **~9.0 / 10 equivalent** — honest green-lane score today | |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound if §Waivers accepted and peer review pending only | Not final 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — contract registry at approved `apps/erp/src/server/api/contracts/` boundary; permission keys from `@afenda/permissions`; operating context from resolver pipeline (`fdr-007-operating-context`).

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` (route handlers) | `createApiHandler`, `getApiContractById`, contract exports | No | B→B |
| `fdr-007-system-admin` | `system-admin.contract.ts` API mutations | No | B→B |
| Phase 9 gate req #5 | `check:api-contracts` delegated gate | No | B→B |
| Future `@afenda/accounting` | Blocked until ADR-0010 amended — no accounting API routes | N/A | — |

Upstream consumers scan: every file under `apps/erp/src/app/api/` (non-allowlisted) must import `createApiHandler` and register a contract in `API_CONTRACTS`. Adding a route without registry entry fails `pnpm check:api-contracts`.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| API governance | Integration governance | `pnpm check:api-contracts` | 1, 2 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/erp typecheck` | 4 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-010a.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Every governed ERP route registers an `ApiRouteContract` | 1 | `pnpm check:api-contracts` |
| internal | Mutations enforce idempotency key policy | 17 | `idempotency.contract.ts` + gate |
| internal | Stable serializable envelope on success and error | 18 | `api-envelope.test.ts` |
| tip-010a (archive) | Method policy on all registry contracts | 2 | `check-api-contracts.mts` policy loop |
| Phase 9 req #5 | API contract governance proven | 7 | `pnpm check:accounting-readiness-gate` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Registry covers 100% non-auth ERP routes | `check-api-contracts.mts` route scan |
| Performance efficiency | Handler validation synchronous; idempotency in-memory map | code review + unit tests |
| Compatibility | Contract IDs stable; envelope JSON-serializable | `api-contract-registry.test.ts` |
| Security | RBAC keys on protected routes; no direct `Response.json` bypass | `api-handler-boundary.test.ts` |
| Maintainability | Single registry authority; biome + typecheck clean | `typecheck` exit 0 |
| Reliability | Deterministic envelope shape; correlation ID on errors | `api-envelope.test.ts` |
| Documentation | FDR + governance doc + matrix alignment | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| API mutations (invite, role assign, layout PUT) | Server-side RBAC + audit on handler | `api-handler-audit.ts`; system-admin integration tests |
| Idempotency replay | N/A — technical deduplication, not approval workflow | `runtime/idempotency.ts` |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-007-api-governance**
- Registry: `PKG007_CONTEXT` read-only snapshot in §Registry link
- Upstream: [`fdr-007-operating-context`](%5BPartially%20Implemented%5D%20fdr-007-operating-context.md) — operating context resolution in `createApiHandler`
- Sibling (sequential): [`fdr-007-system-admin`](%5BNot%20started%5D%20fdr-007-system-admin.md), [`fdr-007-ux-surfaces`](%5BPartially%20Implemented%5D%20fdr-007-ux-surfaces.md)
- Phase 9: [`fdr-007-accounting-readiness`](%5BPartially%20Implemented%5D%20fdr-007-accounting-readiness.md) — req #5 delegates to `check:api-contracts`
- Archive evidence: [`tip-010a-api-contract-governance.md`](../../delivery/tips/[Complete]%20tip-010a-api-contract-governance.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-007-api-governance.md` | — | Modified per slice |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/server/api/contracts/api-route-coverage.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `scripts/api-contract/check-api-contracts.mts` | — | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm check:api-contracts`
- `pnpm --filter @afenda/erp typecheck`
- `pnpm --filter @afenda/erp test:run`
- `pnpm check:multi-tenancy-context-integration`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed ERP API contract registry

  Scenario: Every non-auth ERP route is registered and uses createApiHandler
    GIVEN the set of route files under apps/erp/src/app/api/
    AND allowlisted auth routes are excluded
    WHEN check-api-contracts.mts scans route sources
    THEN every governed route imports createApiHandler
    AND no governed route calls Response.json directly
    AND every governed route contract appears in API_CONTRACTS

  Scenario: Mutation contracts enforce idempotency policy
    GIVEN a registered ApiRouteContract with a mutation method
    WHEN assertIdempotencyPolicy evaluates the contract
    THEN the contract declares idempotency requirements per idempotency.contract.ts
    OR the gate reports a named policy violation

  Scenario: API success responses use the stable envelope
    GIVEN createApiHandler completes a successful request
    WHEN the handler serializes the response
    THEN the body matches api-envelope.contract.ts ok shape
    AND meta includes correlationId when observability context is present

  Scenario: Protected routes declare permission keys
    GIVEN a contract in API_CONTRACTS that requires authorization
    WHEN api-contract-registry.test.ts validates registry invariants
    THEN each such contract references keys from @afenda/permissions vocabulary
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + gate exit 0 | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run -- api` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check apps/erp/src/server/api` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix API Contract Governance row **implemented** | [x] |
| 8 | fdr-status-index updated | index row + prefix rename | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | No duplicated constants / parallel authority | single `API_CONTRACTS` registry | [x] |
| 17 | Security negative path tested | handler boundary + policy violations in gate | [x] |
| 18 | Public API compatibility verified | envelope + contract ID stability tests | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers `api-e2e` | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (api-governance)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Reconcile archive tip-010a + runtime matrix **partial** with live `check:api-contracts` gate; map contracts → runtime → CI; update §Runtime evidence, §Remaining gaps, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Baseline gate log recorded (all gates exit 0)
- Status promoted to **Partially Implemented**
- Readiness score: **27/30 audit-adjusted** (29/30 ceiling)
- Slice 2 unblocked for contract registry hardening (v2 audit matrix row reconciled in §Research)

### Slice 2 — Contract registry hardening (Evidence-sync)

**Status:** Complete (Evidence-sync 2026-06-27)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** B→B

> **Reclassification (2026-06-27):** Original slice typed Implementation; live codebase already satisfies design intent (15 registry tests, 3 handler boundary tests, chained OpenAPI drift gate). See [`slice-02-contract-registry-hardening.md`](slices/fdr-007-api-governance/slice-02-contract-registry-hardening.md) §Reclassification notice. No source edits required.

#### Design (internal-guide)

Prove Slice 2 contract-registry hardening is already delivered in runtime; sync FDR prose that still referenced 11 registry tests, Implementation type, and "Not started" status. Partially advance `api-complete-status` by recording Slice 2 evidence — **Complete** promotion remains blocked on DoD #14 (Architecture Authority peer review).

#### Handoff block

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

#### DoD rows this slice closes

| # | Criterion | Gate | Notes |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + gate exit 0 | Confirm only — already `[x]` |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary` | 18 tests (15 + 3) |
| 16 | No duplicated constants / parallel authority | `pnpm check:api-contracts` | Export/registry parity test proves alignment |
| 17 | Security negative path tested | `api-handler-boundary.test.ts` | Direct `Response.json` scan |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | Sync test counts in evidence column only if changed |

**Explicitly not closed by this slice:** DoD #14 (peer review) — operator / Architecture Authority at PR.

#### Known debt

- `api-complete-status` — **partial** after this slice; full close requires DoD #14 `[x]` and FDR `[Complete]` promotion.
- Slice 3 (Implementation contract closeout) remains for any **future** route additions — not required for Slice 2 evidence reconciliation.
- `api-idempotency-store` and `api-registry-gate-sync` — already closed (2026-06-26).

### Slice 3 — Implementation (contract closeout)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Close any remaining route coverage gaps; extend registry for new ERP API surfaces; keep `check:api-contracts` green.

**Expected deliverables:** Modified contract registry + route coverage tests if new routes land.

### Slice 4 — Registry-sync (gate registration)

**Status:** Not started  
**Prerequisite:** Slice 3 or waiver  
**Type:** Registry-sync  
**Risk class:** Low  

**Purpose:** Add `pnpm check:api-contracts` to foundation disposition registry gates via `foundation-registry-owner`.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `apps/erp/src/server/api/` commit; re-run `pnpm check:api-contracts` | Quarterly-release-safe; git revert + gate re-run |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Re-run `pnpm check:foundation-disposition` |

Oracle analog: confirm upgrade-safe — no handler bypass outside `createApiHandler`. SAP analog: transport rollback = git revert + `pnpm check:api-contracts`.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `api-idempotency-store` | ~~Durable idempotency persistence~~ **Closed** | Postgres store delivered slice 6 | Architecture Authority | — |
| `api-e2e` | Browser E2E for API routes | Unit + drift gate prove registry; matrix marks E2E optional | Architecture Authority | External beta go-live |
| `api-observability-live-traces` | Live distributed trace on every API call (ISO observability 5/5) | Correlation ID + handler logging present; full trace deferred | Architecture Authority | `fdr-013-logging-tracing` |

## §Knowledge transfer

### Operational runbook

- Contract registry: `apps/erp/src/server/api/contracts/api-contract-registry.ts` — add contract + export in `GOVERNED_ROUTE_CONTRACT_EXPORTS`
- Route handler pattern: `apps/erp/src/server/api/runtime/create-api-handler.ts`
- Drift gate: `pnpm check:api-contracts` — run before any new `apps/erp/src/app/api/**/route.ts`
- Policy modules: `method-policy.contract.ts`, `idempotency.contract.ts`, `pagination.contract.ts`

### Observability

- Handler audit: `apps/erp/src/server/api/runtime/api-handler-audit.ts`
- Correlation: `apps/erp/src/server/api/runtime/api-correlation.ts`
- Client error contract: `apps/erp/src/server/api/contracts/observability/client-error.contract.ts`

### On-call escalation

- Symptom: CI `check:api-contracts` fails on new route → register contract + use `createApiHandler`
- Symptom: idempotency replay miss → expected until durable store; check in-memory map scope
- Owner: `@afenda/erp` (PKG-007) via `erp-app-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open.

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Internal OpenAPI catalog delivered ([`ARCH-API-002`](../ARCH/ARCH-API-002-openapi-internal-v1-catalog.md)); Kong and public v1 remain P2.
2. Browser E2E is waived until external beta go-live (`api-e2e`).
3. Live distributed trace on every API call is deferred (`api-observability-live-traces`).
4. **Complete** status requires Architecture Authority peer review and waiver reconfirmation at PR merge.

The **27/30 audit-adjusted** score is the honest green-lane benchmark today (~9.0 / 10 equivalent): registry, envelope, and route coverage proven by CI; capped by waived E2E, observability deferral, and open peer review.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. Confirmation that §Waivers remain valid at merge time.
3. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 27/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review.**

v3 audit refresh (2026-06-26): ten registered contracts; Postgres idempotency + rate limits; ARCH-API-001 Complete (DoD #14); ARCH-API-002 OpenAPI internal v1 catalog; 49+ API unit tests exit 0. Kong/public v1 remain P2.

Slice 2 Complete (Evidence-sync 2026-06-27) — registry hardening pre-delivered; no source diff; 15 registry + 3 handler boundary tests; `check:openapi-drift` chained exit 0.
