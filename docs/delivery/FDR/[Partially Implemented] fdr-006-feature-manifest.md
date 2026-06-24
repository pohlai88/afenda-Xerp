# fdr-006-feature-manifest — Feature Manifest Registry

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-006-feature-manifest` |
| **Registry entry ID** | `PKG006_FEATURE_MANIFEST` |
| **Package** | `@afenda/entitlements` (PKG-006) |
| **Lane** | green-lane _(planned — registry onboarding required)_ |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — manifest → capability → route registry |
| **Enterprise readiness** | **22/30 audit-adjusted** · **27/30 evidence-qualified ceiling** — not enterprise 9.5 qualified until registry onboarded (see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · Oracle FDD · SAP namespace (dependency-registry) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `feature-manifest` (PKG-006 subdomain); sibling domain `entitlements` is scoped by [`fdr-006-entitlements`](%5BPartially%20Implemented%5D%20fdr-006-entitlements.md).

| Field | Value |
| --- | --- |
| id | `PKG006_FEATURE_MANIFEST` |
| packageId | PKG-006 |
| domain | `feature-manifest` |
| lane | green-lane |
| runtimeOwner | `packages/entitlements/src/evaluation` |
| gates | `pnpm --filter @afenda/entitlements typecheck`; `pnpm --filter @afenda/entitlements test:run` |
| prohibited | `do-not-create-accounting-package`; `do-not-add-module-routes-without-manifest-entry` |
| allowedAgents | `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/entitlements` (PKG-006) | ERP module manifest, route manifest, capability bindings, drift tests | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` |
| `@afenda/appshell` (PKG-001) | Nav projection consumer | `packages/appshell/src/navigation/build-nav-from-manifest.ts` |
| `@afenda/permissions` (PKG-014) | RBAC filter on nav and routes (upstream) | `packages/permissions/` |
| `apps/erp` (PKG-007) | Dynamic module routes + guard | `apps/erp/src/lib/modules/generate-module-routes.ts` |

## Purpose

Lock and maintain the governed **ERP feature manifest registry** — single source for module IDs, permission keys, route paths, required entitlements, and optional capabilities — projecting to route manifest and AppShell navigation without ad-hoc route strings in ERP or AppShell code.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-007a-feature-manifest-governance.md`](../../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md). Nav pipeline FDR: [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md).

## Scope

**In scope**

- `packages/entitlements/src/evaluation/feature-manifest.registry.ts` — `ERP_MODULE_MANIFEST`, `ErpModuleId`, `listErpModuleManifests()`
- `packages/entitlements/src/evaluation/feature-manifest.ts` — `FeatureManifestContract`, legacy `featureManifests` projection
- `packages/entitlements/src/evaluation/module-route-manifest.ts` — route registry derived from manifest
- `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` — module ↔ capability bindings
- `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` — drift guards (8 tests)
- FDR-aligned reconciliation of archive tip-007a vs current runtime paths
- Consumer contract: `@afenda/appshell` `MANIFEST_MODULE_IDS` parity (verified via ERP tests)

**Out of scope**

- Entitlement evaluation engine (`fdr-006-entitlements`)
- AppShell nav builder implementation (`fdr-001-manifest-nav`)
- New ERP modules without manifest registry update
- Accounting module business logic (ADR-0010)
- Module placeholder page UX (`apps/erp` — PKG-007)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only manifest paths under `packages/entitlements/src/evaluation/` |
| Shared constants | `ErpModuleId` / `ERP_MODULE_IDS` are authoritative here; appshell `navigation.contract.ts` validates parity — no third copy |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-006 | **Sequential** with `fdr-006-entitlements` — same package; FDR doc authoring may batch (sibling exception); implementation slices must not run in parallel |
| Implementation blocked until | `PKG006_FEATURE_MANIFEST` registry subdomain onboarded; Research Slice 1 complete |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25 audit re-run). Research reconciled archive tip-007a + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does manifest registry exist at runtime? | **Yes** — 8 modules in `ERP_MODULE_MANIFEST` | `feature-manifest.registry.ts` |
| Are drift tests green? | **Yes** — 8 tests in `feature-manifest-drift.test.ts` | `pnpm --filter @afenda/entitlements test:run` exit 0 |
| Does nav/appshell parity hold? | **Yes** — `fdr-001-manifest-nav` Research + `module-id-parity.test.ts` | [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md) |
| Which registry row is required? | **`PKG006_FEATURE_MANIFEST`** subdomain on PKG-006 | Not in `foundation-disposition.registry.ts` |
| Matrix status vs FDR status? | Matrix **implemented**; FDR promoted to **Partially Implemented** (2026-06-25 audit) | §Matrix drift gaps |
| Route manifest aligned? | **Yes** — `MODULE_ROUTE_MANIFEST` length matches manifest; paths `/modules/{id}` | `feature-manifest-drift.test.ts` |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Module manifest authority |
| `packages/entitlements/src/evaluation/module-route-manifest.ts` | Route projection |
| `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` | Capability bindings |
| `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | Drift guards |
| `apps/erp/src/lib/modules/generate-module-routes.ts` | ERP route consumer |
| `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` | End-to-end pipeline |
| `packages/appshell/src/contracts/navigation.contract.ts` | Nav module ID parity |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Feature Manifest row |

### Baseline gate log (Research Slice 1 — 2026-06-25 audit re-run)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/entitlements typecheck` | 0 | A |
| `pnpm --filter @afenda/entitlements test:run` | 0 | A (52 tests; 8 manifest drift) |
| `feature-manifest-drift.test.ts` | 0 | A (8 tests) |
| ERP manifest acceptance | 0 | B (`feature-manifest-acceptance.test.ts` — 5 tests) |
| ERP module ID parity | 0 | A (`module-id-parity.test.ts` — 4 tests) |
| `pnpm exec biome check packages/entitlements` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Module manifest registry | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Yes — Grade A (drift tests exit 0) |
| Feature manifest contract | `packages/entitlements/src/evaluation/feature-manifest.ts` | Yes — Grade B (legacy projection test) |
| Route manifest | `packages/entitlements/src/evaluation/module-route-manifest.ts` | Yes — Grade A (drift tests) |
| Capability bindings | `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` | Yes — Grade A (binding tests in drift suite) |
| Manifest drift tests | `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | Yes — Grade A (8 tests exit 0) |
| ERP route generator | `apps/erp/src/lib/modules/generate-module-routes.ts` | Yes — Grade B (acceptance tests) |
| ERP manifest acceptance | `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` | Yes — Grade A (5 tests) |
| Module ID parity | `apps/erp/src/lib/modules/__tests__/module-id-parity.test.ts` | Yes — Grade A (4 tests) |
| AppShell nav contract | `packages/appshell/src/contracts/navigation.contract.ts` | Yes — Grade B (cited in fdr-001-manifest-nav) |
| Route guard | `apps/erp/src/lib/modules/guard-module-route.server.ts` | Yes — Grade B (acceptance tests) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`feature-manifest-registry-entry`~~ | ~~No `PKG006_FEATURE_MANIFEST` subdomain row in foundation disposition registry~~ | green | `foundation-registry-owner` | **Closed 2026-06-25** | Registry-sync Slice 0 |
| `feature-manifest-fdr-research-slice-1` | ~~FDR Research Slice 1 not formally executed~~ **Closed** (2026-06-25 audit) | green | fdr-author | — | Research attestation complete |
| `feature-manifest-fdr-status-lag` | ~~Runtime matrix implemented vs FDR Not started~~ **Closed** — promoted Partially Implemented | green | fdr-author | — | FDR status aligned with matrix evidence |
| `feature-manifest-peer-review` | DoD #14 peer review not recorded | green | Architecture Authority | Complete | PR approval evidence |

## §Matrix drift gaps

> Reconciles FDR delivery status vs [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md).

| Matrix row | Matrix status | FDR status (post-audit) | Gap | Close condition |
| --- | --- | --- | --- | --- |
| Feature Manifest | **implemented** | **Partially Implemented** 27/30 audit-adjusted | DoD #14 peer review | Evidence-sync / peer review |
| Entitlements evaluation (upstream) | **implemented** | sibling `fdr-006-entitlements` Partially Implemented | Same PKG-006 registry gap | Registry-sync Slice 0 |
| Manifest nav (downstream) | **implemented** | `fdr-001-manifest-nav` Partially Implemented 27/30 | Nav FDR peer review pending | DoD #14 on fdr-001 |

## §Enterprise readiness score

> **Registry-sync Slice 0 (2026-06-25):** `PKG006_FEATURE_MANIFEST` onboarded; hard cap lifted — **27/30 audit-adjusted**. Final **Complete** blocked on DoD #14 peer review ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + unique module IDs + permission key validation in drift tests — Grade A | — |
| Test coverage | 5/5 | 8 drift + 5 ERP acceptance + 4 parity tests — Grade A | — |
| Observability + audit | 3/5 | Read-path manifest; route guard denial — Grade B | No manifest mutation audit (read registry) |
| Security + RBAC + RLS | 5/5 | `assertPermissionKey` per entry; ERP guard + nav RBAC filter — Grade A | — |
| Documentation + BRD traceability | 5/5 | FDR + registry row + tip-007a + fdr-001 cross-link; drift exit 0 — Grade A | DoD #14 `[ ]` |
| Maintainability + Clean Core | 5/5 | Registry subdomain + drift tests; PKG biome exit 0 — Grade A | Slice 0 registry onboarded |
| **Total (audit-adjusted)** | **27/30** | **~9.0 / 10 equivalent** — registry hard cap lifted | DoD #14 peer review pending |
| **Total (evidence-qualified ceiling)** | **27/30** | Matches audit-adjusted; peer review pending | Not 9.5 until ≥29/30 |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — manifest registry at `@afenda/entitlements` evaluation boundary; module IDs consumed by appshell via parity tests, not duplicated as third authority.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/appshell` | `listErpModuleManifests`, `ErpModuleId` (indirect) | No — parity tests | B→B |
| `apps/erp` | `listErpModuleManifests`, `getErpModuleManifest`, route types | No | B→B |
| `@afenda/permissions` | Permission keys referenced in manifest | Yes if key shape changes | B→B |

**ERP giant compatibility (Research confirmed):**

- **Module scale:** 8 governed modules today; adding modules requires registry + appshell contract fixture update only (per fdr-001-manifest-nav).
- **Pipeline:** manifest → route manifest → `generate-module-routes` → nav builder → RBAC guard.
- **Integration proof:** `feature-manifest-acceptance.test.ts` validates end-to-end.

**CEMLI classification:** Extension — registry-driven module surface; no ERP code forks for route strings.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm exec biome check packages/entitlements` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/entitlements typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | tip-007a archive → Gherkin | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-007a.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Module IDs unique and stable | 18 | `feature-manifest-drift.test.ts` |
| internal | Route paths align with module IDs | 2 | `feature-manifest-drift.test.ts` |
| internal | Optional capabilities reference registered keys only | 2 | drift test capabilityKeys assertion |
| tip-007a (archive) | Manifest → routes → nav → RBAC pipeline | 1 | `feature-manifest-acceptance.test.ts` |
| internal | Appshell module ID parity | 18 | `module-id-parity.test.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Every ERP module has manifest entry with label, route, permission | `ERP_MODULE_MANIFEST` + drift tests |
| Performance efficiency | Manifest list is synchronous O(n); no DB round-trip | code review + unit tests |
| Compatibility | Legacy `featureManifests` projection preserved for entitlement modules | drift test legacy projection case |
| Security | Permission keys validated; direct route access guarded in ERP | drift tests + `guard-module-route.server.ts` |
| Maintainability | Drift tests fail on registry inconsistency | `feature-manifest-drift.test.ts` (8 tests) |
| Reliability | Deterministic route manifest projection | drift tests route length + equality |
| Documentation | Matrix Feature Manifest row + FDR aligned post Research | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Manifest registry (read path) | N/A — compile-time registry; changes via PR review | — |
| Module route access denial | N/A — RBAC read path | `guard-module-route.server.ts` tests |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-006-feature-manifest**
- Registry: `PKG006_FEATURE_MANIFEST` _(pending)_ — **blocks Complete**
- Sibling: [`fdr-006-entitlements`](%5BPartially%20Implemented%5D%20fdr-006-entitlements.md) — sequential on same `runtimeOwner`
- Downstream: [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md) — consumes manifest exports
- Upstream: `@afenda/database` `createPermissionKey` / `assertPermissionKey`
- Archive evidence: [`tip-007a-feature-manifest-governance.md`](../../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-006-feature-manifest.md` | — | Modified per slice |
| `packages/architecture-authority/src/data/foundation-disposition.registry.ts` | `@afenda/architecture-authority` | Modified (**Registry-sync** — `foundation-registry-owner` only) |
| `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |
| `packages/entitlements/src/evaluation/module-route-manifest.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |
| `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |
| `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/entitlements typecheck`
- `pnpm --filter @afenda/entitlements test:run`
- `pnpm --filter @afenda/erp test:run` _(manifest acceptance subset)_
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed ERP feature manifest registry

  Scenario: Module manifest entries have unique IDs and valid permission keys
    GIVEN ERP_MODULE_MANIFEST in feature-manifest.registry.ts
    WHEN feature-manifest-drift tests run
    THEN all moduleId values are unique
    AND assertPermissionKey succeeds for every permissionKey
    AND ERP_MODULE_IDS matches listErpModuleManifests moduleId order

  Scenario: Route paths align with module identifiers without drift
    GIVEN each entry in ERP_MODULE_MANIFEST
    WHEN module-route-manifest is projected
    THEN route path equals "/modules/{moduleId}"
    AND MODULE_ROUTE_MANIFEST length equals manifest length
    AND getModuleRoute returns matching path and permissionKey

  Scenario: Optional capabilities reference registered evaluation keys only
    GIVEN capability registry keys in capability-registry.ts
    WHEN iterating optionalCapabilities on each manifest entry
    THEN every optional capability key exists in the capability registry

  Scenario: Legacy featureManifests projection preserved for entitlement modules
    GIVEN accounting, mrp, and ai_copilot module entries
    WHEN featureManifests is read from feature-manifest.ts
    THEN requiredEntitlements and optionalCapabilities match manifest entries

  Scenario: ERP pipeline consumes manifest for routes and nav
    GIVEN listErpModuleManifests returns 8 modules
    WHEN feature-manifest-acceptance tests run in apps/erp
    THEN generated routes match manifest routePath values
    AND nav projection includes only permitted modules
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/entitlements test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/entitlements typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/entitlements` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Feature Manifest row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | drift + module-id-parity tests | [x] |
| 17 | Security negative path tested | ERP route guard denial | [x] |
| 18 | Public API compatibility verified | export surface + parity tests | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 0 — Registry-sync (PKG006_FEATURE_MANIFEST onboarding)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Onboard `PKG006_FEATURE_MANIFEST` subdomain row on PKG-006 via `foundation-registry-owner` only. Research Slice 1 attested runtime manifest authority at `packages/entitlements/src/evaluation/` — registry row mirrors §Registry link fields. Lifts ENTERPRISE-BENCHMARK §3.1 hard cap from 22/30 audit-adjusted. **Combined** with `fdr-006-entitlements` Slice 0 in single registry-owner commit (2026-06-25).

**Outcomes (delivered 2026-06-25):**

- `PKG006_FEATURE_MANIFEST` row added to `foundation-disposition.registry.ts`
- `foundation-disposition.md` synced; fdr-status-index + matrix updated
- Gap `feature-manifest-registry-entry` closed; DoD #6 `[x]`
- Audit-adjusted readiness lifted to **27/30**

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-006-feature-manifest.md

1. Objective    — Add PKG006_FEATURE_MANIFEST subdomain row to foundation disposition registry with gates, prohibited rules, allowedAgents, and runtime evidence paths; sync disposition view and FDR index so DoD #6 passes and audit-adjusted readiness cap lifts above 22/30.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/; docs/delivery/fdr-status-index.md; docs/architecture/afenda-runtime-truth-matrix.md
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-006-feature-manifest.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/entitlements/ source edits; apps/ edits; foundation-disposition.registry.ts edits by non-owner agents; do-not-create-accounting-package; PKGR01_ACCOUNTING paths (ADR-0010); duplicating ErpModuleId or ERP_MODULE_MANIFEST outside evaluation authority
5. Authority    — ADR-0014 · ADR-0016 · §Registry link proposed snapshot (PKG006_FEATURE_MANIFEST)
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap feature-manifest-registry-entry; DoD #6; partial feature-manifest-peer-review (registry prerequisite only — DoD #14 remains open)
8. Evidence     —
   packages/entitlements/src/evaluation/feature-manifest.registry.ts
   packages/entitlements/src/evaluation/module-route-manifest.ts
   packages/entitlements/src/evaluation/module-manifest-capability-registry.ts
   packages/entitlements/src/__tests__/feature-manifest-drift.test.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
9. Attestation  — Documentation (registry row + disposition view synced); Maintainability (disposition hard cap lifted — ENTERPRISE-BENCHMARK §3.1); Contract stability (registry gates match §Acceptance gate)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |

#### Known debt

- `feature-manifest-peer-review` — DoD #14 Architecture Authority PR approval deferred to Complete promotion
- `fdr-006-entitlements` Slice 0 must land in a separate PR or sequential commit — shared registry file collision
- Slice 2 (Implementation closeout) blocked until this slice Delivered

### Slice 1 — Research (feature-manifest)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Formalize Research attestation; reconcile matrix **implemented** vs FDR **Not started**; run baseline gates; update §Matrix drift gaps and dual readiness scores. No source edits.

**Outcomes:**

- Closed gaps `feature-manifest-fdr-research-slice-1`, `feature-manifest-fdr-status-lag`
- Status promoted to **Partially Implemented**
- Readiness: **22/30 audit-adjusted**, **27/30 evidence-qualified ceiling**
- Slice 0 (Registry-sync) remains critical path

### Slice 2 — Implementation (manifest registry closeout)

**Status:** Not started  
**Prerequisite:** Slice 0 + Slice 1 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Close open DoD rows; optional manifest additions only via registry-driven workflow.

**Expected deliverables:** DoD rows 3, 5, 6, 9, 10, 17, 19 marked `[x]` with gate paths.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Registry-sync | Revert registry commit | Restore prior disposition snapshot |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert manifest evaluation files; rebuild package | Quarterly-release-safe; appshell parity tests must pass after revert |

Oracle analog: manifest changes are additive module entries — rollback removes module from registry + consumer fixtures. SAP analog: transport rollback = git revert + drift + acceptance test re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `feature-manifest-e2e` | Browser E2E for manifest nav/routes | Unit + ERP acceptance tests prove pipeline; fdr-001 waives E2E similarly | Architecture Authority | External beta go-live |
| ~~`feature-manifest-registry-hard-cap`~~ | ~~Enterprise 9.5 (29/30) until registry subdomain exists~~ | ENTERPRISE-BENCHMARK §3.1 hard fail | Architecture Authority | **Closed 2026-06-25** | `PKG006_FEATURE_MANIFEST` onboarded Slice 0 |
| `feature-manifest-matrix-fdr-lag` | FDR Complete while matrix already **implemented** | FDR delivery authority must catch up via Slice 1 + registry sync | Architecture Authority | Slice 1 Complete |

## §Knowledge transfer

### Operational runbook

- Manifest authority: `packages/entitlements/src/evaluation/feature-manifest.registry.ts` — add module to `ERP_MODULE_MANIFEST`
- Route projection: `packages/entitlements/src/evaluation/module-route-manifest.ts` — auto-derived; do not hand-edit routes
- Capability bindings: `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts`
- Drift gate: run `feature-manifest-drift.test.ts` after any manifest change
- Consumer wiring: `apps/erp/src/lib/modules/generate-module-routes.ts`; appshell `navigation.contract.ts` parity

### Observability

- Manifest is compile-time registry — no runtime audit on read
- Route denial: `apps/erp/src/lib/modules/guard-module-route.server.ts`
- Integration trace: `feature-manifest-acceptance.test.ts`

### On-call escalation

- Symptom: new module missing from nav/routes → verify manifest entry + appshell `MANIFEST_MODULE_IDS` parity
- Symptom: drift test failure → check optional capability keys against `capability-registry.ts`
- Owner: `@afenda/entitlements` (PKG-006) manifest subdomain pending registry `allowedAgents`

## §Enterprise benchmark qualification

This FDR is **Partially Implemented with evidence-qualified ceiling at 27/30**, not **Complete — enterprise 9.5 accepted**, because:

1. **`PKG006_FEATURE_MANIFEST` registry subdomain is missing** — audit-adjusted score hard-capped at **22/30**.
2. **DoD #14 peer review** remains open.
3. Runtime matrix marks Feature Manifest **implemented** — FDR delivery authority now aligned via Research attestation.

The **27/30 evidence-qualified ceiling** assumes registry Slice 0 complete and §Waivers accepted. **Complete — enterprise 9.5 accepted** requires ≥29/30, registry onboarded, and DoD #14 closed.

## Verdict

**Partially Implemented — 27/30 audit-adjusted (27/30 ceiling), pending DoD #14 peer review.**

Research Slice 1 complete (2026-06-25). Registry-sync Slice 0 complete (2026-06-25): `PKG006_FEATURE_MANIFEST` onboarded; hard cap lifted; DoD #6 closed. Matrix **implemented** reconciled with FDR at **27/30** audit-adjusted.
