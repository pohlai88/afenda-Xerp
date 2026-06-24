# fdr-015-tenant-storage — Tenant-Scoped Storage Abstraction

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-015-tenant-storage` |
| **Registry entry ID** | `PKG015_STORAGE` |
| **Package** | `@afenda/storage` (PKG-015) |
| **Lane** | _(planned green-lane)_ |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — tenant-scoped object storage for ERP attachments |
| **Enterprise readiness** | **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (DoD #14 peer review open; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Storage partitioning · Storage namespace |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). **`PKG015_STORAGE` row exists** (Phase 1 complete 2026-06-25).

| Field | Value |
| --- | --- |
| id | `PKG015_STORAGE` |
| packageId | PKG-015 |
| domain | `tenant-storage` |
| lane | green-lane |
| runtimeOwner | `packages/storage` |
| gates | `pnpm --filter @afenda/storage typecheck`; `pnpm --filter @afenda/storage test:run` |
| prohibited | `do-not-create-accounting-package`; `do-not-store-accounting-documents-without-adr` |
| allowedAgents | `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/storage` (PKG-015) | Tenant-scoped object storage contracts, provider adapters, service facade | `packages/storage/src/` |
| `@afenda/database` (PKG-003) | `storage_objects` metadata table + RLS policy (persistence owner) | `packages/database/src/schema/storage.schema.ts` |
| `@afenda/testing` (PKG-016) | Dev-only mock storage provider for test consumers | `packages/testing/src/storage/mock-storage-provider.ts` |
| `apps/erp` (PKG-007) | Future attachment/upload consumer (not wired today) | — |

## Purpose

Govern the tenant-scoped storage abstraction — contracts, signed URL generation, and provider adapters (R2, Vercel Blob) — so ERP modules store and retrieve binary objects under strict tenant (and optional company/organization) scope without ad-hoc S3 clients or unsigned object paths in application code.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md) — cites `packages/storage/` as execution-foundation evidence.

## Scope

**In scope**

- `packages/storage/src/contracts/` — storage object, provider, signed upload/download, result, and error contracts
- `packages/storage/src/services/storage.service.ts` — `createStorageService`, default `storageService` facade with provider error normalization
- `packages/storage/src/providers/` — `createR2StorageProvider`, `createBlobStorageProvider`, HMAC signed URL helpers
- Unit tests under `packages/storage/src/__tests__/`
- FDR-aligned reconciliation of archive tip-011 storage claims vs current runtime paths
- Registry onboarding plan for `PKG015_STORAGE` (Implementation blocked until row exists)

**Out of scope**

- Accounting document retention / posting attachments without ADR (ADR-0010)
- Hand-editing `storage_objects` migrations (`fdr-003-persistence` owns DDL)
- Live R2/Blob credentials in CI (provider adapters are test-configured only)
- ERP upload UI and server actions (future ERP slice after storage FDR Complete)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may create `PKG015_STORAGE` in `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/storage/` paths listed in slice Field 3 |
| Database boundary | `storage_objects` schema/RLS edits belong to `fdr-003-persistence` / `fdr-003-tenant-rls` — not this FDR's Implementation agent |
| Shared constants | No agent may duplicate storage error codes or provider IDs outside `storage-error.contract.ts` / `storage-object.contract.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-015 | **Disjoint** with `fdr-002-auth-disposition` and `fdr-009-rollout-flags` in Research-Security batch — docs-only Research may run in parallel via `fdr-orchestrator` |
| Implementation blocked until | Research Slice 1 complete; `PKG015_STORAGE` registry row exists |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research formalized pre-authoring baseline; gates attested; matrix **implemented** reconciled with FDR delivery.

### Discovery questions

| Question | Pre-authoring baseline (2026-06-25) | Evidence grade |
| --- | --- | --- |
| Does `packages/storage/` exist with contracts and tests? | **Yes** — 8 contract modules, 2 providers, service facade, 5 unit tests pass | B |
| Is a foundation-disposition registry row present? | **No** — `PKG015_STORAGE` pending; blocks Implementation | E (blocker) |
| Does `storage_objects` metadata exist in database? | **Yes** — `storage.schema.ts` with tenant FK + indexes | C |
| Is RLS registered for `storage_objects`? | **Yes** — `storage_objects_tenant_isolation` in tenant-rls-coverage contract | C (not storage-package tested) |
| Are cross-tenant denial paths tested in `@afenda/storage`? | **Yes** — `tenant-denial.test.ts` covers R2 + Blob get/delete/sign + bucket denial | A |
| Is ERP wired to `@afenda/storage`? | **No** — no `apps/erp` imports; `@afenda/testing` mock only | C |
| Does default `storageService` use a live provider? | **No** — `unavailableProvider` stub; factory JSDoc documents injection pattern (waiver `storage-default-stub-export`) | A |
| Do typecheck and test gates exit 0? | **Yes** — baseline run 2026-06-25 | A |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/storage/src/contracts/storage.contract.ts` | Tenant-scoped CRUD input shapes |
| `packages/storage/src/contracts/storage-object.contract.ts` | Object identity + provider enum |
| `packages/storage/src/services/storage.service.ts` | Service facade + error normalization |
| `packages/storage/src/providers/r2.provider.ts` | R2 adapter + tenant/bucket guards |
| `packages/storage/src/providers/blob.provider.ts` | Vercel Blob adapter |
| `packages/storage/src/providers/signature.ts` | HMAC signed URL generation |
| `packages/storage/src/__tests__/storage.service.test.ts` | Service delegation + error normalization |
| `packages/storage/src/__tests__/provider-adapters.test.ts` | Signed URL + metadata round-trip |
| `packages/database/src/schema/storage.schema.ts` | Metadata persistence boundary |
| `packages/database/src/rls/tenant-rls-coverage.contract.ts` | `storage_objects` RLS policy registration |
| `packages/testing/src/storage/mock-storage-provider.ts` | Test consumer pattern |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | `@afenda/storage` row |
| [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md) | Archive execution-foundation claims |

### Skills to read

- `enterprise-erp-standards` — domain controls §8 (`tenant-storage`)
- `write-fdr` — slice planning (handoffs delegated to `fdr-slice-author`)
- `multi-tenancy-erp` — tenant path prefix conventions for object keys

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/storage typecheck` | 0 | A |
| `pnpm --filter @afenda/storage test:run` | 0 | A (5 tests) |
| `pnpm exec biome check packages/storage` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A (no PKG015 row — waiver applies) |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Public API barrel | `packages/storage/src/index.ts` | Yes — Grade B (curated exports) |
| Storage contracts | `packages/storage/src/contracts/*.contract.ts` | Yes — Grade B (8 modules) |
| Storage service | `packages/storage/src/services/storage.service.ts` | Yes — Grade B (3 unit tests pass) |
| R2 provider adapter | `packages/storage/src/providers/r2.provider.ts` | Yes — Grade B (tenant guard in source) |
| Blob provider adapter | `packages/storage/src/providers/blob.provider.ts` | Yes — Grade B (provider-adapters test) |
| Signed URL helper | `packages/storage/src/providers/signature.ts` | Yes — Grade B (signature length assertion) |
| Service tests | `packages/storage/src/__tests__/storage.service.test.ts` | Yes — Grade A (`test:run` exit 0) |
| Provider adapter tests | `packages/storage/src/__tests__/provider-adapters.test.ts` | Yes — Grade A (`test:run` exit 0) |
| Tenant denial tests | `packages/storage/src/__tests__/tenant-denial.test.ts` | Yes — Grade A (R2 + Blob cross-tenant + bucket denial) |
| Database metadata schema | `packages/database/src/schema/storage.schema.ts` | Yes — Grade C (cross-package; not storage-package gate) |
| RLS coverage registration | `packages/database/src/rls/tenant-rls-coverage.contract.ts` | Partial — Grade C (policy named; live apply = `fdr-003-tenant-rls`) |
| Mock test consumer | `packages/testing/src/storage/mock-storage-provider.ts` | Yes — Grade C (dev-only) |
| ERP production wiring | `apps/erp/` | No — Grade E (no imports) |
| Foundation disposition registry | `foundation-disposition.registry.ts` | Yes — Grade A (`PKG015_STORAGE` row; `check:foundation-disposition` exit 0) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`storage-disposition-registry`~~ | ~~No `PKG015_STORAGE` row~~ | green | `foundation-registry-owner` | Phase 1 ✓ | **Closed** 2026-06-25 — registry row exists |
| `storage-matrix-fdr-drift` | Matrix **implemented** vs FDR was **Not started** — delivery lag | green | `fdr-author` (Research) | Slice 1 ✓ | Research attestation; status → **Partially Implemented** |
| ~~`storage-tenant-denial-test`~~ | ~~No dedicated cross-tenant negative test~~ | green | `fdr-slice-implementer` | Slice 2 ✓ | **Closed** — `tenant-denial.test.ts` (10 scenarios) |
| ~~`storage-default-provider-stub`~~ | ~~Exported stub without documented factory~~ | green | `fdr-slice-implementer` | Slice 2 ✓ | **Closed** — `createStorageService` JSDoc + waiver reconfirmed |
| `storage-database-bridge` | No repository layer linking `storage_objects` Drizzle rows to `StorageService` | green | `fdr-003-persistence` / storage slice | Slice 2+ | Bridge contract or explicit out-of-scope waiver |
| `storage-erp-consumer` | No ERP server action / route uses `@afenda/storage` | green | ERP FDR (future) | Post Slice 2 | Import surface documented in §Impact analysis |
| `storage-audit-coverage` | create/delete object mutations not in governed mutation audit registry | green | `fdr-013-audit-coverage` | Slice 2 / waiver | Audit action registered or §Waivers row |
| `storage-rls-live-proof` | RLS policy registered in contract; live apply not proven under storage FDR gates | green | `fdr-003-tenant-rls` | Upstream | `pnpm check:database-tenant-rls-coverage` includes `storage_objects` live proof |
| ~~`storage-complete-status`~~ | ~~Matrix/index not synced to 29/30 Evidence-sync~~ | green | `fdr-slice-implementer` | Slice 3 ✓ | **Partial close** 2026-06-25 — matrix/index synced; `[Complete]` prefix blocked on DoD #14 |

## §Enterprise readiness score

> **Slice 3 Evidence-sync (2026-06-25):** Slice 2 denial suite + registry aligned; gate log re-run attests **29/30 audit-adjusted**. Waivers `storage-erp-e2e`, `storage-default-stub-export`, `storage-audit-deferred` **affirmed**. Final **Complete** blocked on DoD #14 peer review only.
>
> Score 0–5 per dimension. **Hard fail:** missing registry entry caps total at **22/30** when raw sum exceeds 22 ([ENTERPRISE-BENCHMARK §3.1](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | 8 contract modules + public barrel + `typecheck` exit 0 — Grade A | Slice 3 gate log re-run |
| Test coverage | 5/5 | 15 unit tests; denial suite Grade A — `tenant-denial.test.ts` | Slice 3 gate log re-run |
| Observability + audit | 4/5 | Waiver `storage-audit-deferred` — no ERP mutation path; RLS gate exit 0 — Grade B | Governed mutation audit deferred until `fdr-013-audit-coverage` |
| Security + RBAC + RLS | 5/5 | Cross-tenant + bucket denial tests Grade A; RLS gate exit 0 | Slice 3 gate log re-run |
| Documentation + BRD traceability | 5/5 | FDR + index + matrix + registry + drift exit 0 — Grade A | DoD #14 blocks Complete prefix only |
| Maintainability + Clean Core | 5/5 | typecheck + test + biome + boundaries + foundation-disposition exit 0 — Grade A | Slice 3 gate log re-run |
| **Total (audit-adjusted)** | **29/30** | **Enterprise 9.5 candidate** | Peer review (DoD #14) pending |
| **Total (evidence-qualified ceiling)** | **29/30** | Matches audit-adjusted — waivers bounded | Not final Complete until DoD #14 |

### Slice 3 gate log (Evidence-sync — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/storage typecheck` | 0 | A |
| `pnpm --filter @afenda/storage test:run` | 0 | A (15 tests) |
| `pnpm exec biome check packages/storage` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

> **Waiver affirmation:** `storage-erp-e2e` — no ERP consumer wired; unit tests prove contract surface. `storage-default-stub-export` — default `storageService` remains `provider_unavailable`; `createStorageService(provider)` injection documented. `storage-audit-deferred` — governed mutation audit deferred until `fdr-013-audit-coverage` Complete; observability scored 4/5 under bounded waiver.

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — storage contracts and provider adapters at approved `@afenda/storage` Foundation boundary; metadata persistence owned by `@afenda/database`; no duplicated provider IDs outside contracts.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/testing` | `StorageProvider`, `createStorageSuccess`, mock provider | No | B→B (dev-only) |
| `apps/erp` (planned) | `createStorageService`, signed upload/download types | No (greenfield) | B→B |
| `@afenda/database` | `storage_objects` schema (inverse — storage reads metadata shape) | No | B→B |
| `@afenda/execution` (planned) | Attachment payloads via outbox jobs | No | B→B |

**ERP giant compatibility (Research baseline):**

- **Tenant isolation:** Every storage input carries `tenantId`; R2/Blob providers return `not_found` when object `tenantId` ≠ request `tenantId` (`r2.provider.ts` get/delete/sign paths). Object paths use tenant-prefixed keys (e.g. `tenant-1/invoice.pdf` in tests). Database metadata table enforces `tenant_id` FK + `storage_objects_tenant_isolation` RLS policy (live apply tracked under `fdr-003-tenant-rls`).
- **Multi-company / org scope:** Contracts include optional `companyId` and `organizationId` on objects — aligns with ERP operating context without bypassing tenant root.
- **Object storage provider compatibility:** Dual adapters — `createR2StorageProvider` (Cloudflare R2 / S3-compatible) and `createBlobStorageProvider` (Vercel Blob). Signed URLs use HMAC (`signature.ts`) with `tenantId` query param — no unsigned direct object paths in adapter outputs.
- **Scale:** In-memory provider maps in adapters are test/dev implementations; production wiring must inject env-configured providers per tenant bucket strategy (Slice 2 design decision).
- **Default export safety:** `storageService` singleton returns `provider_unavailable` until explicitly configured — prevents accidental unauthenticated uploads in unconsumed scaffold state.
- **Upstream consumers scan:** No production `apps/erp` imports today. `@afenda/testing` is the only registered consumer via dependency-registry dev exemption. Future ERP attachment flows must import `@afenda/storage` public barrel only — no deep imports into `providers/`.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Storage partitioning | Storage namespace | `pnpm check:database-tenant-rls-coverage` | 17 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/storage typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-011.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Tenant-scoped object create and retrieve | 2 | `pnpm --filter @afenda/storage test:run` |
| internal | Cross-tenant object access denied | 17 | `provider-adapters.test.ts` (Slice 2 adds explicit scenario) |
| internal | Signed upload URL binds tenant and signature | 2 | `provider-adapters.test.ts` |
| internal | Unconfigured service returns provider_unavailable | 2 | `storage.service.test.ts` |
| tip-011 (archive) | Storage abstraction package exists for execution foundation | 1 | `packages/storage/` + matrix row |
| internal | Bucket mismatch returns access_denied | 17 | Slice 2 negative test |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | CRUD + signed URL operations match contract shapes | `storage.service.test.ts`; `provider-adapters.test.ts` |
| Performance efficiency | Signed URL generation synchronous; O(1) provider map lookup in adapters | unit tests + code review |
| Compatibility | R2 and Blob providers implement same `StorageProvider` interface | `storage-provider.contract.ts`; adapter tests |
| Security | Tenant scope on all mutating paths; signed URLs; bucket allowlist | provider source + Slice 2 denial tests |
| Maintainability | Biome clean; strict typecheck; zero upstream package deps | `pnpm ci:biome`; `typecheck` |
| Reliability | Provider errors normalized to `StorageResult` — no thrown leaks | `storage.service.test.ts` (error normalization) |
| Documentation | Index + matrix + FDR evidence aligned | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Storage object create/delete (future ERP) | Not wired — audit gap `storage-audit-coverage` | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-015-tenant-storage**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-015**
- Registry: `PKG015_STORAGE` — row exists (Phase 1 complete 2026-06-25)
- Upstream: [`fdr-003-persistence`](%5BNot%20started%5D%20fdr-003-persistence.md) — `storage_objects` DDL authority
- Upstream: [`fdr-003-tenant-rls`](%5BNot%20started%5D%20fdr-003-tenant-rls.md) — `storage_objects_tenant_isolation` live RLS proof
- Related: [`fdr-013-audit-coverage`](%5BNot%20started%5D%20fdr-013-audit-coverage.md) — governed mutation audit for object create/delete
- Orchestrator batch: **Research-Security** — parallel Research with `fdr-002`, `fdr-009` (disjoint docs-only files)
- Archive evidence: [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-015-tenant-storage.md` | — | Modified per slice |
| `packages/storage/src/contracts/*.contract.ts` | `@afenda/storage` | Modified (Implementation slices only) |
| `packages/storage/src/services/storage.service.ts` | `@afenda/storage` | Modified (Implementation slices only) |
| `packages/storage/src/providers/*.ts` | `@afenda/storage` | Modified (Implementation slices only) |
| `packages/storage/src/__tests__/*.test.ts` | `@afenda/storage` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/storage typecheck`
- `pnpm --filter @afenda/storage test:run`
- `pnpm quality:boundaries`
- `pnpm check:database-tenant-rls-coverage`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition` (after `PKG015_STORAGE` exists)

## Acceptance criteria

```gherkin
Feature: Tenant-scoped storage abstraction

  Scenario: Unconfigured storage service reports provider unavailable
    GIVEN the default storageService export with no live provider configured
    WHEN healthCheck is invoked
    THEN the result status is provider_unavailable

  Scenario: Storage service delegates to configured provider
    GIVEN a StorageProvider that returns success for createObject
    AND createStorageService is called with that provider
    WHEN createObject is called with a valid tenant-scoped input
    THEN the result status is success
    AND the returned StorageObject includes the same tenantId

  Scenario: Signed upload URL includes tenant binding
    GIVEN createR2StorageProvider with valid signing options
    WHEN generateUploadUrl is called for tenant "tenant-1"
    THEN the result status is success
    AND the URL contains a signature query parameter
    AND the URL contains tenantId "tenant-1"

  Scenario: Cross-tenant object access is denied
    GIVEN an object stored for tenant "tenant-a"
    WHEN getObject is called with tenantId "tenant-b" for the same objectId
    THEN the result status is not_found

  Scenario: Disallowed bucket returns access denied
    GIVEN a provider configured for bucket "tenant-files"
    WHEN createObject is called with bucket "other-bucket"
    THEN the result status is access_denied
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/storage test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/storage typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/storage` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix `@afenda/storage` row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | cross-tenant / bucket denial tests | [x] |
| 18 | Public API compatibility verified | `@afenda/storage` barrel stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (tenant-storage)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Formalize pre-authoring baseline; reconcile tip-011 + matrix **implemented** with FDR **Not started**; attest gates.

**Outcomes:** Closed gap `storage-matrix-fdr-drift`; baseline gate log Grade A; status → **Partially Implemented**; registry onboarding request to `foundation-registry-owner`.

### Slice 2 — Implementation (tenant denial tests + provider wiring closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓; **`PKG015_STORAGE` registry row exists** ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

#### Design (internal-guide)

Close gate-critical tenant isolation evidence in `@afenda/storage` without crossing package boundaries. Add a dedicated `tenant-denial.test.ts` suite that proves cross-tenant `getObject`, `deleteObject`, and `generateDownloadUrl` return `not_found` when `tenantId` mismatches the stored object, and `createObject` / `generateUploadUrl` return `access_denied` when `bucket` ≠ provider-configured bucket — for **both** `createR2StorageProvider` and `createBlobStorageProvider`. No provider source changes unless a test reveals a guard regression (prefer test-only closeout).

Document the intentional `storageService` stub: add `createStorageService(provider)` factory JSDoc in `storage.service.ts` stating ERP/server hosts must inject a live `StorageProvider`; default export remains `provider_unavailable` per waiver `storage-default-stub-export`. Do **not** add env-driven default provider wiring in this slice.

Update runtime matrix Tenant storage row to cite denial tests and registry alignment. Do **not** implement `storage_objects` Drizzle bridge (`storage-database-bridge` — `fdr-003-persistence`), ERP consumer wiring (`storage-erp-consumer`), governed mutation audit (`storage-audit-coverage` — `fdr-013-audit-coverage`), or live RLS apply proof (`storage-rls-live-proof` — `fdr-003-tenant-rls`). PKG-015 `packages/storage/` only — one package per Implementation slice rule.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md

1. Objective    — Add explicit cross-tenant and disallowed-bucket denial tests for R2 and Blob providers; document createStorageService injection pattern; sync matrix evidence so gate-critical DoD #17 and registry-aligned DoD #6/#16 pass after PKG015_STORAGE exists.
2. Allowed layer— packages/storage/src/__tests__/; packages/storage/src/services/storage.service.ts
3. Files        —
   packages/storage/src/__tests__/tenant-denial.test.ts
   packages/storage/src/services/storage.service.ts
   docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/database/; packages/testing/; apps/erp/; foundation-disposition.registry.ts; do-not-create-accounting-package; accounting document storage without ADR; @afenda/accounting (ADR-0010); env-driven default provider on storageService singleton
5. Authority    — ADR-0014 · ADR-0016 · PKG015_STORAGE (tenant-storage domain) · packages/storage runtimeOwner
6. Gates        —
   pnpm --filter @afenda/storage typecheck
   pnpm --filter @afenda/storage test:run
   pnpm exec biome check packages/storage
   pnpm quality:boundaries
   pnpm check:database-tenant-rls-coverage
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `storage-tenant-denial-test`; Gap `storage-default-provider-stub` (factory JSDoc + waiver `storage-default-stub-export` reconfirmed); Gap `storage-disposition-registry` (when prerequisite PKG015 row exists); DoD #6; DoD #7; DoD #10; DoD #16; DoD #17
8. Evidence     —
   packages/storage/src/__tests__/tenant-denial.test.ts
   packages/storage/src/services/storage.service.ts
   packages/storage/src/__tests__/storage.service.test.ts
   packages/storage/src/__tests__/provider-adapters.test.ts
   docs/architecture/afenda-runtime-truth-matrix.md
9. Attestation  — Test coverage (cross-tenant + bucket denial suite); Security + RBAC (negative paths Grade A); Documentation (factory injection documented); Maintainability (PKG gates exit 0)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |
| 7 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` Tenant storage row |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 Completion Report |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` |
| 17 | Security negative path tested | `packages/storage/src/__tests__/tenant-denial.test.ts` |

#### Known debt

- `storage-database-bridge` — no Drizzle repository linking `storage_objects` to `StorageService`; owner `fdr-003-persistence` / future storage slice; explicit out-of-scope for PKG-015 boundary
- `storage-audit-coverage` — create/delete mutations not in governed audit registry; waiver `storage-audit-deferred` until `fdr-013-audit-coverage` Complete
- `storage-erp-consumer` — no `apps/erp` import of `@afenda/storage`; future ERP attachment FDR
- `storage-rls-live-proof` — RLS policy registered in contract only; live apply proof owned by `fdr-003-tenant-rls`
- `storage-default-stub-export` — default `storageService` export remains `provider_unavailable` until ERP injects provider; waiver reconfirmed at Slice 2 closeout

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓ (`tenant-denial.test.ts`, `PKG015_STORAGE` registered, 26/30 attestation)  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Docs-only closeout: re-run Slice 2 PKG gates to attest runtime evidence; recalculate §Enterprise readiness score to **29/30 audit-adjusted** (peer review deducts final point — DoD #14 remains open). Sync Tenant storage row in `afenda-runtime-truth-matrix.md` and `fdr-status-index.md` to cite 29/30 + denial suite + registry alignment. Record Slice 3 gate log in FDR. Affirm waivers `storage-erp-e2e`, `storage-default-stub-export`, and `storage-audit-deferred` — no waiver expiry changes. Add `storage-complete-status` gap with **partial close** (matrix/index synced; Complete prefix blocked on DoD #14). Do **not** rename FDR to `[Complete]`.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md

1. Objective    — Re-run PKG gates; recalculate readiness to 29/30 audit-adjusted; sync matrix Tenant storage row + fdr-status-index; add Slice 3 gate log; affirm waivers storage-erp-e2e, storage-default-stub-export, storage-audit-deferred. Do not rename to [Complete] — DoD #14 peer review still open.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-store-accounting-documents-without-adr; accounting
5. Authority    — ADR-0014 · ADR-0016 · PKG015_STORAGE (tenant-storage domain) · archive tip-011 (read-only)
6. Gates        —
   pnpm --filter @afenda/storage typecheck
   pnpm --filter @afenda/storage test:run
   pnpm exec biome check packages/storage
   pnpm quality:boundaries
   pnpm check:database-tenant-rls-coverage
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap storage-complete-status (matrix/index sync — peer review remains open); DoD #20 (readiness attestation)
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
9. Attestation  — Documentation + BRD traceability (matrix/index sync); Enterprise readiness 29/30 audit-adjusted confirmed; Maintainability (gate log re-run exit 0)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table + Slice 3 gate log |

#### Known debt

- DoD #14 peer review — Architecture Authority PR approval; blocks `[Complete]` prefix rename
- `storage-database-bridge` — Drizzle repository linking `storage_objects` to `StorageService`; owner `fdr-003-persistence`
- `storage-erp-consumer` — no `apps/erp` import; waiver `storage-erp-e2e` affirmed
- `storage-audit-coverage` — governed mutation audit deferred; waiver `storage-audit-deferred` affirmed until `fdr-013-audit-coverage` Complete
- `storage-rls-live-proof` — live RLS apply proof owned by `fdr-003-tenant-rls`
- `storage-default-stub-export` — default `storageService` stub; waiver affirmed until ERP consumer FDR

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** B→B  

**Purpose:** Record Architecture Authority peer review (DoD #14); reconfirm §Waivers (`storage-erp-e2e`, `storage-default-stub-export`, `storage-audit-deferred`); promote to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix Tenant storage row; close `storage-complete-status` (full — including `[Complete]` prefix rename).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md

1. Objective    — Close DoD #14; promote fdr-015-tenant-storage to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-store-accounting-documents-without-adr
5. Authority    — Architecture Authority peer review attestation · ADR-0014 · ADR-0016 · PKG015_STORAGE
6. Gates        —
   pnpm --filter @afenda/storage typecheck
   pnpm --filter @afenda/storage test:run
   pnpm quality:boundaries
   pnpm check:database-tenant-rls-coverage
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap storage-complete-status; DoD #14; DoD #7; DoD #8 (index)
8. Evidence     — §Peer review attestation; final gate log in FDR Slice 4 section
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 14 | Peer review | Architecture Authority PR approval |
| 7 | Runtime matrix updated | matrix Tenant storage row → Complete |
| 8 | fdr-status-index updated | index row → Complete |

#### Known debt

- `storage-database-bridge` — Drizzle repository linking `storage_objects` to `StorageService`; owner `fdr-003-persistence`
- `storage-erp-consumer` — no `apps/erp` import; waiver `storage-erp-e2e` affirmed
- `storage-audit-coverage` — governed mutation audit deferred; waiver `storage-audit-deferred` affirmed until `fdr-013-audit-coverage` Complete
- `storage-rls-live-proof` — live RLS apply proof owned by `fdr-003-tenant-rls`
- `storage-default-stub-export` — default `storageService` stub; waiver affirmed until ERP consumer FDR

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `packages/storage/` commit; rebuild package | Quarterly-release-safe; no hand-edited registry objects |
| Provider config (future ERP) | Disable env provider keys; fall back to `provider_unavailable` | Feature-flag attachment uploads |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `storage-erp-e2e` | Browser E2E for file upload | No ERP consumer wired; unit tests prove contract surface | Architecture Authority (pre-Research) | ERP attachment FDR or external beta |
| `storage-default-stub-export` | Live provider on default `storageService` singleton | Scaffold safety — explicit injection required until ERP wiring | Architecture Authority | ERP consumer FDR |
| `storage-audit-deferred` | Governed mutation audit on object create/delete | No ERP mutation path yet; tracked as `storage-audit-coverage` | Architecture Authority | `fdr-013-audit-coverage` Complete |

## §Knowledge transfer

### Operational runbook

- Package entry: `packages/storage/src/index.ts` — public barrel; prefer `createStorageService(provider)` over default `storageService` stub
- Contract authority: `packages/storage/src/contracts/storage.contract.ts` — all inputs require `tenantId`
- Provider factories: `createR2StorageProvider`, `createBlobStorageProvider` in `packages/storage/src/providers/`
- Database metadata: `packages/database/src/schema/storage.schema.ts` — `storage_objects` table (persistence owner PKG-003)
- Test mock: `packages/testing/src/storage/mock-storage-provider.ts`

### Observability

- Storage operations today have **no** governed audit events (waived — see §Waivers)
- Provider errors normalized to `StorageResult` with codes in `STORAGE_ERROR_CODES`
- Health check: `storageService.healthCheck()` or injected service instance

### On-call escalation

- Symptom: uploads fail with `provider_unavailable` → confirm ERP/server injected a live `StorageProvider`; default export is intentionally stubbed
- Symptom: cross-tenant data concern → verify `tenantId` on request matches object row; run Slice 2 denial tests; confirm `fdr-003-tenant-rls` live proof
- Symptom: signed URL rejected → check HMAC secret rotation and `expiresAt` clock skew
- Owner: `@afenda/storage` (PKG-015) via Platform Authority

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Tenant storage | **implemented** | **Partially Implemented** | **Partially Implemented** · **29/30 audit-adjusted** | ERP consumer + audit deferred (waivers affirmed) | DoD #14 peer review |

**Verdict:** Matrix **implemented** vs FDR **Partially Implemented** is expected per ADR-0016 until DoD #14 peer review closes. ERP consumer wiring remains waived (`storage-erp-e2e`); registry row aligned (`PKG015_STORAGE`).

## §Enterprise benchmark qualification

This FDR is an **enterprise 9.5 candidate** at **29/30 audit-adjusted** (Slice 3 Evidence-sync 2026-06-25). Final **Complete — enterprise 9.5 accepted** blocked on DoD #14 peer review only.

The **29/30 evidence-qualified ceiling** is accepted under these bounded assumptions:

1. Browser E2E waived until ERP attachment FDR (`storage-erp-e2e`).
2. Governed mutation audit on object create/delete waived (`storage-audit-deferred`); observability at 4/5 until `fdr-013-audit-coverage` Complete.
3. Default `storageService` stub export waived (`storage-default-stub-export`); explicit provider injection required until ERP consumer FDR.
4. Live RLS apply proof owned by `fdr-003-tenant-rls` (`storage-rls-live-proof`); contract registration proven via `check:database-tenant-rls-coverage`.

**Promotion to Complete — enterprise 9.5 accepted requires:** DoD #14 peer review `[x]`; rename FDR prefix to `[Complete]`; §Waivers reconfirmed at PR merge.

## Verdict

**Partially Implemented — enterprise 9.5 candidate at 29/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review (DoD #14).**

Research Slice 1 **Complete** (2026-06-25). Slice 2 added `tenant-denial.test.ts` (10 denial scenarios), `createStorageService` injection JSDoc, and registry/matrix alignment with `PKG015_STORAGE`. Slice 3 Evidence-sync **Complete** (2026-06-25): PKG gates re-run exit 0; waivers `storage-erp-e2e`, `storage-default-stub-export`, `storage-audit-deferred` affirmed. Do not rename to `[Complete]` until DoD #14 peer review closes at PR merge.
