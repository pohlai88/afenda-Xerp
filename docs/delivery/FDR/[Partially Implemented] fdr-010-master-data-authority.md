# fdr-010-master-data-authority — Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-010-master-data-authority` |
| **Registry entry ID** | `PKG010_KERNEL` |
| **Package** | `@afenda/kernel` (PKG-010) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — TIP-008B business master data wire references |
| **Enterprise readiness** | **27/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | MDG · Product Hub |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `operating-context-contracts`; this FDR scopes the **master-data-authority** subdomain on the same `PKG010_KERNEL` entry.

| Field | Value |
| --- | --- |
| id | `PKG010_KERNEL` |
| packageId | PKG-010 |
| domain | `operating-context-contracts` (FDR subdomain: `master-data-authority`) |
| lane | green-lane |
| runtimeOwner | `packages/kernel` |
| gates | `pnpm --filter @afenda/kernel typecheck`; `pnpm quality:kernel-context-surface` |
| prohibited | `do-not-create-accounting-package`; `do-not-implement-resolver-in-kernel` |
| allowedAgents | `kernel-context-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/kernel` (PKG-010) | Frozen business master data authority map + wire reference contracts | `packages/kernel/src/contracts/business-master-data/` |
| PKG-R02–R05 (reserved) | Future domain packages — `authority_only` until domain TIPs | `@afenda/inventory`, `@afenda/hrm`, `@afenda/crm`, `@afenda/procurement` (reserved IDs) |

## Purpose

Lock and maintain TIP-008B business master data authority — five core entities (customer, supplier, product, employee, warehouse) with owning domain, PKG-R02–R05 reservation, identity scope, natural keys, and kernel wire reference contracts. Runtime status remains `authority_only` until domain packages scaffold.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-008-master-data-authority.md`](../../delivery/tips/[Complete]%20tip-008-master-data-authority.md).

## Scope

**In scope**

- `packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts` — authority registry
- `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts` — wire references + branded IDs
- Import/scaffold/shared-package policies under `business-master-data/`
- Contract tests: authority, id-boundary, import-boundary, scaffold, shared-package (14 tests)

**Out of scope**

- PKG-R02–R05 domain schemas, services, and persistence
- Product Hub / MDG runtime workflows
- Platform entity authority (`fdr-010-platform-authority`)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/kernel/src/contracts/business-master-data/` |
| Shared constants | No agent may duplicate `BUSINESS_MASTER_DATA_ENTITY_IDS` outside authority contract |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-010 | **Sequential** with `fdr-010-context-contracts` and `fdr-010-platform-authority` — same `runtimeOwner` |
| Implementation blocked until | Research Slice 1 complete |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled runtime matrix **implemented** (Business master data authority TIP-008B row) with FDR **Not started**; verified five core entities, `authority_only` status, and wire reference contracts.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Are five core MD entities registered? | **Yes** — customer, supplier, product, employee, warehouse | `business-master-data-authority.contract.test.ts` |
| Single owning domain per entity? | **Yes** — no duplicate package claims; `runtimeStatus: authority_only` | same test file |
| Wire reference contracts populated? | **Yes** — `kernelContractPath` → id-boundary contract with exports per entity | id-boundary + authority tests |
| TBD entities outside core five? | **Yes** — `TBD_BUSINESS_MASTER_DATA_ENTITIES` (2) excluded from governed registry | authority drift test |
| Import boundary enforced? | **Yes** — policy tests block illegal cross-package imports | `business-master-data-import-boundary.test.ts` |
| Gates pass? | **Yes** — `typecheck` ✓; MD subdomain 14 tests ✓ | Gate log below |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel typecheck` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A (76 tests package-wide) |
| `business-master-data-authority.contract.test.ts` | 0 | A (6 tests) |
| `business-master-data-id-boundary.test.ts` | 0 | A (6 tests) |
| `business-master-data-import-boundary.test.ts` | 0 | A (2 tests) |
| `business-master-data-scaffold.policy.test.ts` | 0 | A (2 tests) |
| `business-master-data-shared-package.policy.test.ts` | 0 | A (2 tests) |
| `pnpm exec biome check packages/kernel` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A (post-FDR upgrade) |

### v2 FDR audit gate log (2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel typecheck` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A (76 tests, 19 files; MD subdomain 14 tests) |
| `pnpm quality:kernel-context-surface` | 1 | — (PKG010 shared gate; stale `dist/index.d.ts` — see `fdr-010-context-contracts` gap `kernel-context-dist-freshness`) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts` | Authority registry |
| `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts` | Wire references |
| `packages/kernel/src/contracts/business-master-data/business-master-data-import-boundary.policy.ts` | Import governance |
| `packages/kernel/src/contracts/business-master-data/index.ts` | Public barrel |
| `packages/kernel/src/__tests__/business-master-data-authority.contract.test.ts` | Registry drift |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | TIP-008B row |
| [`dependency-registry.md`](../../architecture/dependency-registry.md) | PKG-R02–R05 alignment check in tests |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| MD authority registry | `packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts` | Yes — Grade A (6 tests) |
| Wire id boundary | `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts` | Yes — Grade A (6 tests) |
| Import boundary policy | `packages/kernel/src/contracts/business-master-data/business-master-data-import-boundary.policy.ts` | Yes — Grade A (2 tests) |
| Scaffold policy | `packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts` | Yes — Grade A (2 tests) |
| Shared package policy | `packages/kernel/src/contracts/business-master-data/business-master-data-shared-package.policy.ts` | Yes — Grade A (2 tests) |
| Public barrel | `packages/kernel/src/contracts/business-master-data/index.ts` | Yes — Grade B (root `index.ts` re-exports) |
| TBD entity list | `TBD_BUSINESS_MASTER_DATA_ENTITIES` in authority contract | Yes — Grade B (exclusion test) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `md-authority-domain-runtime` | Entities remain `authority_only` — PKG-R02–R05 schemas/services not started | green | Domain package FDRs | Post Phase 1 | Domain package runtime FDRs promote past `authority_only` |
| `master-data-authority-complete-status` | FDR at 27/30 audit-adjusted (29/30 ceiling); Complete blocked on peer review + PKG010 dist gate | green | Architecture Authority (PR) | Complete | DoD #14 peer review `[x]` |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only in table). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where waivers or open DoD rows cap a dimension, the **audit-adjusted** score is used for the honest total.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + frozen five-entity registry — Grade A | — |
| Test coverage | 5/5 | MD subdomain 14 tests + package `test:run` 76 — Grade A | E2E browser waived (`md-authority-e2e`) |
| Observability + audit | 4/5 | Authority-only wire contracts — Grade B | Waiver `md-authority-observability` |
| Security + RBAC + RLS | 5/5 | Identity scope + import boundary policies tested — Grade A | — |
| Documentation + BRD traceability | 4/5 | FDR v2 + matrix + dependency-registry check in tests — Grade A | DoD #14 peer review still `[ ]` |
| Maintainability + Clean Core | 4/5 | Clean Core A; scaffold + shared-package policies — Grade A | PKG010 shared `quality:kernel-context-surface` exit 1 (stale `dist/`) |
| **Total (audit-adjusted)** | **27/30** | **~9.0 / 10 equivalent** — honest foundation-grade score today | |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound if §Waivers accepted, PKG010 dist gate green, peer review pending only | Not final 9.5 until Complete |

Target at Complete: **29/30** per enterprise 9.5 benchmark ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — frozen authority registry + wire references only; domain runtime deferred to PKG-R02–R05.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| Future `@afenda/crm` (PKG-R04) | `CustomerWireReference`, authority entry | No | A→A (authority_only) |
| Future `@afenda/procurement` (PKG-R05) | `SupplierWireReference` | No | A→A |
| Future `@afenda/inventory` (PKG-R02) | `ProductWireReference` | No | A→A |
| Future `@afenda/hrm` (PKG-R03) | `EmployeeWireReference` | No | A→A |
| `@afenda/kernel` consumers | `getBusinessMasterDataAuthority`, branded MD IDs | No | A→A |

**ERP giant compatibility (Research confirmed):**

- **Entity scale:** 5 governed core entities + 2 TBD exclusions; natural keys and identity scopes documented per entity.
- **Package reservation:** `reservedPackageId` and `pkgCode` align with dependency-registry without duplicate ownership claims.
- **Domain deferral:** `runtimeStatus: authority_only` explicit — kernel does not implement MD persistence.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| MDG | Product Hub authority map | `business-master-data-authority.contract.test.ts` | 1 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP namespace | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Five core MD entities with single owning domain | 1 | `business-master-data-authority.contract.test.ts` |
| internal | Wire reference contracts for each core entity | 18 | `business-master-data-id-boundary.test.ts` |
| internal | Illegal MD imports blocked by policy | 17 | `business-master-data-import-boundary.test.ts` |
| tip-008B (archive) | Authority map frozen; domain packages deferred | 1 | matrix TIP-008B row |
| dependency-registry | PKG-R02–R05 codes align with registry entries | 16 | authority test dependency-registry read |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Five entities with identity scope + natural key metadata | authority contract tests |
| Performance efficiency | Registry lookup O(1); wire refs are plain objects | unit tests |
| Compatibility | `BUSINESS_MASTER_DATA_ENTITY_IDS` count stable | drift test |
| Security | Import boundary policy blocks cross-package MD authority duplication | import-boundary test |
| Maintainability | Scaffold + shared-package policies guard package boundaries | policy tests |
| Reliability | Frozen const registry — deterministic lookups | tests |
| Documentation | Matrix + dependency-registry alignment | drift test reads `dependency-registry.md` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| MD authority registry (read) | N/A — authority_only contracts | — |
| Domain MD mutations (future) | deferred — domain packages | gap `md-authority-domain-runtime` |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-010-master-data-authority**
- Registry: `PKG010_KERNEL` read-only snapshot in §Registry link
- Sibling (sequential): [`fdr-010-context-contracts`](%5BPartially%20Implemented%5D%20fdr-010-context-contracts.md) · [`fdr-010-platform-authority`](%5BPartially%20Implemented%5D%20fdr-010-platform-authority.md)
- [`dependency-registry.md`](../../architecture/dependency-registry.md) — PKG-R02–R05 reservation
- Archive evidence: [`tip-008-master-data-authority.md`](../../delivery/tips/[Complete]%20tip-008-master-data-authority.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-010-master-data-authority.md` | — | Modified per slice |
| `packages/kernel/src/contracts/business-master-data/` | `@afenda/kernel` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/kernel typecheck`
- `pnpm --filter @afenda/kernel test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Business master data authority (TIP-008B)

  Scenario: Core five MD entities are registered with authority_only status
    GIVEN BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY
    WHEN business-master-data-authority.contract.test.ts runs
    THEN exactly five unique entity ids are registered
    AND each entry has runtimeStatus "authority_only"
    AND each reservedPackageId starts with "@afenda/"

  Scenario: Wire reference contracts exist for each core entity
    GIVEN getBusinessMasterDataAuthority for customer, supplier, product, employee, warehouse
    WHEN kernelContractPath is resolved
    THEN business-master-data-id-boundary.contract.ts exports the cited wire reference type

  Scenario: TBD entities are excluded from the governed core registry
    GIVEN TBD_BUSINESS_MASTER_DATA_ENTITIES
    WHEN isBusinessMasterDataEntityId is called for each TBD entityId
    THEN the result is false

  Scenario: Import boundary policy rejects illegal MD package imports
    GIVEN business-master-data-import-boundary.policy.ts rules
    WHEN business-master-data-import-boundary.test.ts runs
    THEN forbidden import patterns are detected
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/kernel test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/kernel typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/kernel` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix TIP-008B row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | policy + drift tests | [x] |
| 17 | Security negative path tested | TBD exclusion + import boundary tests | [x] |
| 18 | Public API compatibility verified | MD barrel + wire refs stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (master-data-authority)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-008B + runtime matrix **implemented** with FDR **Not started**; verify five-entity authority map, wire references, import policies, and PKG-R02–R05 alignment. No source edits.

**Outcomes:**

- Closed gap `fdr-research-slice-1`
- Opened gap `md-authority-domain-runtime` (expected — authority_only by design)
- Status promoted to **Partially Implemented**
- Readiness score: 29/30 (evidence-backed)

### Slice 2 — Evidence-sync (PKG010 surface gate + readiness)

**Status:** Not started  
**Prerequisite:** `fdr-010-context-contracts` Slice 2 Delivered ✓ (`kernel-context-dist-freshness` closed)  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Research Slice 1 confirmed master-data subdomain runtime is complete (five core entities, wire references, import/scaffold policies, 14 tests). No `packages/kernel/src/contracts/business-master-data/` source edits. After sibling `fdr-010-context-contracts` Slice 2 makes `pnpm quality:kernel-context-surface` exit 0, sync this FDR's §Runtime evidence, recalculate §Enterprise readiness score (Maintainability 4/5 → 5/5), and record gate log. Gap `md-authority-domain-runtime` remains open by design (`authority_only` until PKG-R02–R05 domain FDRs). Do not close DoD #14 or promote to `[Complete]`.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-master-data-authority.md

1. Objective    — After PKG010 dist gate is green, sync master-data-authority FDR evidence and recalculate readiness score with Maintainability 5/5; prove MD subdomain gates exit 0.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-010-master-data-authority.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `foundation-disposition.registry.ts`; `do-not-create-accounting-package`; `do-not-implement-resolver-in-kernel`; `@afenda/accounting` (ADR-0010); PKG-R02–R05 domain package scaffolding; parallel PKG-010 Implementation on `packages/kernel` runtimeOwner
5. Authority    — ADR-0014 · ADR-0016 · PKG010_KERNEL registry snapshot (§Registry link) · dependency-registry PKG-R02–R05 reservation
6. Gates        —
   pnpm --filter @afenda/kernel typecheck (read-only — report exit code)
   pnpm --filter @afenda/kernel test:run (read-only — report exit code; MD subdomain 14 tests)
   pnpm quality:kernel-context-surface (read-only — must exit 0; prerequisite from context-contracts Slice 2)
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — DoD #20 (readiness Maintainability uplift after PKG010 gate green); audit note on Maintainability + Clean Core row (4/5 → 5/5)
8. Evidence     —
   packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts
   packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts
   packages/kernel/src/__tests__/business-master-data-authority.contract.test.ts
   packages/kernel/src/__tests__/business-master-data-id-boundary.test.ts
   packages/kernel/src/__tests__/business-master-data-import-boundary.test.ts
9. Attestation  — Documentation (FDR gate log + score sync); Maintainability (PKG010 surface gate exit 0 attestation)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 20 | Enterprise readiness score updated (28/30 audit-adjusted; 29/30 ceiling unchanged) | §Enterprise readiness score table + gate log |

#### Known debt

- `master-data-authority-complete-status` — DoD #14 peer review still open; `[Complete]` promotion requires Architecture Authority PR approval
- `md-authority-domain-runtime` — entities remain `authority_only`; PKG-R02–R05 domain runtime deferred to Post Phase 1 (not this slice)
- PKG010 dist gate owned by `fdr-010-context-contracts` Slice 2 — do not re-implement build choreography in this slice
- Browser E2E waived (`md-authority-e2e`) until external beta go-live

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert business-master-data contract commit | Quarterly-release-safe; const registry data |

Oracle analog: MDG authority map is configuration — rollback = git revert + test re-run. SAP analog: MDG customising transport revert.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `md-authority-observability` | Audit on MD wire reference read | Authority-only contracts; audit at domain mutation surfaces | Architecture Authority (Research) | Domain MD FDRs |
| `md-authority-e2e` | Browser E2E for MD authority | 14 subdomain tests prove registry + policies | Architecture Authority | External beta go-live |
| `md-authority-domain-runtime` | Full MD persistence/runtime in kernel | Explicit `authority_only` — domain packages own runtime | Architecture Authority | PKG-R02–R05 FDRs |

## §Knowledge transfer

### Operational runbook

- Authority registry: `packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts`
- Lookup: `getBusinessMasterDataAuthority(entityId)`
- Wire references: `business-master-data-id-boundary.contract.ts`
- Import policy: `business-master-data-import-boundary.policy.ts`

### Observability

- No kernel audit on wire reference reads (waived)
- Domain packages will own mutation audit when PKG-R02–R05 scaffold

### On-call escalation

- Symptom: duplicate package ownership test failure → fix registry entry `reservedPackageId`
- Symptom: import boundary failure → remove illegal cross-package MD authority import
- Owner: `@afenda/kernel` (PKG-010) via `kernel-context-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open and PKG010 shared `quality:kernel-context-surface` exits 1 (stale `dist/`).

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Browser E2E is waived until external beta go-live (`md-authority-e2e`).
2. MD authority is `authority_only` in kernel, so runtime audit on wire reference read is waived (`md-authority-observability`).
3. Domain MD persistence deferred to PKG-R02–R05 (`md-authority-domain-runtime` waiver).
4. PKG010 dist freshness gap closes via `fdr-010-context-contracts` Slice 2 (`kernel-context-dist-freshness`).
5. **Complete** status requires Architecture Authority peer review and waiver reconfirmation at PR merge.

The **27/30 audit-adjusted** score is the honest foundation-grade benchmark today (~9.0 / 10 equivalent): strong contract, test, and security evidence from v2 audit gates; capped by open peer review, waived E2E, authority-only observability, and PKG010 shared surface gate failure.

Until DoD #14 closes and PKG010 dist gate is green, this FDR must not be represented as fully **Complete** or as final **enterprise 9.5 accepted**.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. PKG010 `pnpm quality:kernel-context-surface` exit 0 (shared with context-contracts Slice 2).
3. Confirmation that §Waivers remain valid at merge time.
4. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 27/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review and PKG010 dist gate closeout.**

Research Slice 1 complete (2026-06-25). v2 audit attests `typecheck` and `test:run` exit 0 (MD subdomain 14 tests within 76 package-wide). Domain runtime intentionally deferred (`authority_only`). Do not represent this FDR as **enterprise 9.5 complete** until peer review closes, PKG010 dist gate green, and status promotes to **Complete — enterprise 9.5 accepted**.
