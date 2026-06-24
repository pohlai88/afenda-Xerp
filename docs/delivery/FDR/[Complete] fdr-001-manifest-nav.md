# fdr-001-manifest-nav — Manifest Navigation

| Field | Value |
| --- | --- |
| **Status** | Complete — enterprise 9.5 accepted |
| **FDR ID** | `fdr-001-manifest-nav` |
| **Registry entry ID** | `PKG001_APPSHELL` |
| **Package** | `@afenda/appshell` (PKG-001) |
| **Lane** | amber-lane |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — manifest → nav projection |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted** (DoD #14 peer review closed 2026-06-25; §Waivers reconfirmed) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · Oracle FDD · SAP namespace (dependency-registry) |
| **Playbook** | [`fdr-001-playbook.md`](fdr-001-playbook.md) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `shell-composition`; this FDR scopes the **manifest-nav** subdomain on the same `PKG001_APPSHELL` entry.

| Field | Value |
| --- | --- |
| id | `PKG001_APPSHELL` |
| packageId | PKG-001 |
| domain | `shell-composition` (FDR subdomain: `manifest-nav`) |
| lane | amber-lane |
| runtimeOwner | `packages/appshell` |
| gates | `pnpm --filter @afenda/appshell typecheck`; `pnpm --filter @afenda/appshell check:governance` |
| prohibited | `do-not-create-accounting-package`; `do-not-add-classname-on-afenda-ui-primitives` |
| allowedAgents | `appshell-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/appshell` (PKG-001) | Nav projection from feature manifest + RBAC filter | `packages/appshell/src/navigation/` |
| `@afenda/entitlements` (PKG-006) | Upstream feature manifest source (read-only in Research) | `packages/entitlements/src/evaluation/` |
| `apps/erp` (PKG-007) | ERP nav wiring consumer (read-only in Research) | `apps/erp/src/lib/modules/` |

## Purpose

Lock and maintain the governed navigation projection pipeline — entitlements feature manifest → `@afenda/appshell` nav builder → ERP module routes — so adding an ERP module requires a manifest entry only, with no ad-hoc route strings in AppShell or ERP app code.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-007a-feature-manifest-governance.md`](../../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md).

## Scope

**In scope**

- `packages/appshell/src/navigation/build-nav-from-manifest.ts` — manifest → serializable nav → hydrated menu items
- `packages/appshell/src/contracts/navigation.contract.ts` — manifest module IDs, nav icon map, permission metadata
- Nav builder and contract drift tests under `packages/appshell/src/navigation/__tests__/` and `packages/appshell/src/contracts/__tests__/`
- FDR-aligned reconciliation of archive tip-007a claims vs current runtime paths

**Out of scope**

- Shell layout composition and governed UI blocks (`fdr-001-shell-composition`)
- Entitlements registry authoring (`fdr-006-entitlements`, `fdr-006-feature-manifest`)
- New module routes without entitlements registry update
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate manifest module IDs or nav icon maps outside `navigation.contract.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-001 | **Sequential** with `fdr-001-shell-composition` — same `runtimeOwner`; orchestrator Phase 2 after shell Slice 1 |
| Implementation blocked until | Research Slice 1 complete; `fdr-006-feature-manifest` researched or waived for Implementation Slice 2 |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-007a + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does nav builder match entitlements manifest output? | **Yes** — `listErpModuleManifests()` → `buildHydratedManifestNavigation()` via `resolve-manifest-navigation.server.ts` | ERP resolver + 11 integration tests pass |
| Are `MANIFEST_MODULE_IDS` aligned with entitlements `ErpModuleId`? | **Yes** — 8 modules match (`workspace`, `accounting`, `hrm`, `inventory`, `manufacturing`, `mrp`, `sales`, `ai_copilot`) | `navigation.contract.test.ts`; `module-id-parity.test.ts` |
| ERP consumer paths cited in matrix? | **Yes** — Feature Manifest row cites full pipeline | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| Is `fdr-006-feature-manifest` hard prerequisite? | **No for appshell Slice 2** — archive tip-007a + live tests prove upstream; waiver `manifest-nav-fdr-006-prereq` | §Waivers |
| Do nav gates exit 0? | **Yes** — `typecheck` ✓; `test:run` ✓ (362 appshell tests incl. nav builder 10); `check:governance` ✓; PKG-scoped biome ✓ | Gate log in Slice 1 attestation (2026-06-25 re-run) |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | 0 | A |
| `pnpm --filter @afenda/appshell check:governance` | 0 | A |
| `pnpm --filter @afenda/appshell test:run` | 0 | A (362 tests) |
| `pnpm exec biome check packages/appshell` | 0 | A |
| ERP manifest tests (3 files, 11 tests) | 0 | B |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm ci:biome` (repo-wide) | 1 | — (6 errors outside PKG-001; waived — see §Waivers) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/appshell/src/navigation/build-nav-from-manifest.ts` | Nav builder implementation |
| `packages/appshell/src/contracts/navigation.contract.ts` | Manifest module ID authority |
| `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | Builder behaviour + RBAC filter + badge/active (10 tests) |
| `packages/appshell/src/contracts/__tests__/navigation.contract.test.ts` | Contract drift guards (5 tests) |
| `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Upstream module registry (8 modules) |
| `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts` | ERP nav wiring |
| `apps/erp/src/lib/modules/generate-module-routes.ts` | Route generation from manifest |
| `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` | End-to-end manifest acceptance (5 tests) |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Feature Manifest + AppShell rows |

## Runtime evidence (2026-06-25 — Complete promotion)

| Artifact | Path | Proven |
| --- | --- | --- |
| Nav builder | `packages/appshell/src/navigation/build-nav-from-manifest.ts` | Yes — Grade A (12 unit tests; badge + active hydration) — Slice 4 |
| Navigation contract | `packages/appshell/src/contracts/navigation.contract.ts` | Yes — Grade A (5 drift tests pass) |
| Builder tests | `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | Yes — Grade A (`test:run` exit 0) |
| Sidebar active-route | `packages/appshell/src/app-shell-sidebar.tsx` | Yes — Grade A (`app-shell-sidebar-navigation.test.tsx`) — Slice 4 |
| Contract tests | `packages/appshell/src/contracts/__tests__/navigation.contract.test.ts` | Yes — Grade A (`test:run` exit 0) |
| Entitlements manifest | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Yes — Grade B (parity tests pass) |
| ERP nav resolver | `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts` | Yes — Grade A (activeRoutePath wired; 3 resolver tests) — Slice 5 |
| ERP active-route header | `apps/erp/src/proxy.ts` + `resolve-active-route-path-from-headers.server.ts` | Yes — Grade A (header helper tests) — Slice 5 |
| ERP route generator | `apps/erp/src/lib/modules/generate-module-routes.ts` | Yes — Grade B (acceptance tests pass) |
| Manifest acceptance test | `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` | Yes — Grade A (5 tests exit 0) |
| Module ID parity | `apps/erp/src/lib/modules/__tests__/module-id-parity.test.ts` | Yes — Grade A (4 tests exit 0) |
| Route guard (security) | `apps/erp/src/lib/modules/guard-module-route.server.ts` | Yes — Grade B (cited in acceptance tests) |
| Peer review (DoD #14) | §Peer review attestation | Yes — Architecture Authority approved 2026-06-25 — Slice 6 |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `manifest-nav-observability-trace` | Optional diagnostic trace for nav troubleshooting (correlation / route-denial telemetry) | blue | `fdr-001-shell-composition` or observability FDR | Future | Trace path documented in §Knowledge transfer — not required for foundation 9.5 |

## §Enterprise readiness score

> **Enterprise 9.5 accepted** = 29/30 on this table with DoD #14 peer review closed and §Waivers reconfirmed at promotion ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `navigation.contract.test.ts` (5 tests) — Grade A | — |
| Test coverage | 4/5 | `test:run` exit 0 (366 appshell) + ERP manifest/resolver tests — Grade A | E2E browser waived (`manifest-nav-e2e`) |
| Observability + audit | 4/5 | Read-path nav; route guard + acceptance tests — Grade B | Waiver `manifest-nav-observability-read-path` |
| Security + RBAC + RLS | 5/5 | `hasManifestModuleAccess` denial + ERP permission filter — Grade A | — |
| Documentation + BRD traceability | 5/5 | FDR Complete + index + matrix + drift exit 0 — Grade A | DoD #14 peer review closed 2026-06-25 |
| Maintainability + Clean Core | 4/5 | PKG gates exit 0; Clean Core B — Grade A | Repo-wide `ci:biome` waived (`manifest-nav-biome-repo`) |
| **Total (accepted)** | **29/30** | **Enterprise 9.5 accepted** | Waivers documented in §Waivers |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — nav projection at approved `@afenda/appshell` boundary; manifest module IDs owned in `navigation.contract.ts` and validated against `@afenda/entitlements`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `buildHydratedManifestNavigation`, `ManifestModuleId`, nav resolver | No | B→B |
| `apps/storybook` | appshell nav stories (if any) | No | B→B |
| `@afenda/entitlements` | Upstream — appshell reads manifest shape only | No | B→B |

**ERP giant compatibility (Research confirmed):**

- **Module scale:** 8 governed modules in `MANIFEST_MODULE_IDS` / `ERP_MODULE_MANIFEST` today; adding modules requires entitlements registry + contract fixture update only.
- **Nav chrome:** [`app-shell-sidebar.tsx`](../../../packages/appshell/src/app-shell-sidebar.tsx) renders `navigationPages` with collapsible groups — scales with manifest-driven item count.
- **Integration proof:** `feature-manifest-acceptance.test.ts` validates manifest → nav → routes → RBAC end-to-end.
- **Permission filter:** `resolve-manifest-navigation.server.ts` resolves granted keys via `@afenda/permissions` before projection.

Upstream consumers scan: `apps/erp` imports nav builder via `resolve-manifest-navigation.server.ts`. No other packages should import `packages/appshell/src/navigation/` directly without dependency-registry entry.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/appshell typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-007a.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Nav reflects entitlements manifest for granted permissions | 2 | `pnpm --filter @afenda/appshell test:run` |
| internal | Manifest module IDs stay aligned with entitlements registry | 18 | `navigation.contract.test.ts` |
| internal | Denied permission excludes nav item | 17 | `build-nav-from-manifest.test.tsx` |
| tip-007a (archive) | Full manifest → nav → route pipeline | 1 | `feature-manifest-acceptance.test.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Nav items match manifest entries for granted permissions only; active route marked in sidebar | `build-nav-from-manifest.test.tsx` (12 tests); `app-shell-sidebar-navigation.test.tsx` |
| Performance efficiency | Nav build is synchronous, O(n) over module list; no server round-trip in builder | unit test + code review |
| Compatibility | `ManifestModuleId` parity with entitlements `ErpModuleId` | `navigation.contract.test.ts`; `module-id-parity.test.ts` |
| Security | RBAC filter on nav visibility; route guard on direct access | builder tests + `guard-module-route.server.ts` tests |
| Maintainability | Biome clean; strict typecheck; 0 `any` in nav paths | `typecheck` exit 0; `pnpm exec biome check packages/appshell` exit 0 |
| Reliability | Deterministic projection — same input → same nav output | builder unit tests |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Nav projection (read path) | N/A — no governed mutation in nav builder | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-001-manifest-nav**
- [`fdr-001-playbook.md`](fdr-001-playbook.md) — sub-agent routing (`/fdr-start`, `/fdr-orchestrate` §F Phase 2)
- Registry: `PKG001_APPSHELL` read-only snapshot in §Registry link
- Sibling: [`fdr-001-shell-composition`](%5BNot%20started%5D%20fdr-001-shell-composition.md) — sequential, not parallel (same `runtimeOwner`)
- Upstream: `fdr-006-feature-manifest` — **waived** for appshell Slice 2 (see §Waivers)
- Archive evidence: [`tip-007a-feature-manifest-governance.md`](../../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-001-manifest-nav.md` | — | Modified per slice |
| `packages/appshell/src/navigation/build-nav-from-manifest.ts` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/contracts/navigation.contract.ts` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | `@afenda/appshell` | Modified (Slice 2 — typecheck fix for PKG gate) |

## Acceptance gate

- `pnpm --filter @afenda/appshell typecheck`
- `pnpm --filter @afenda/appshell check:governance`
- `pnpm --filter @afenda/appshell test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Manifest-driven navigation projection

  Scenario: Nav shows only modules the actor may access
    GIVEN the actor has permission keys resolved from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    AND the entitlements feature manifest lists modules with route paths and permission keys
    WHEN buildHydratedManifestNavigation is called with granted permission keys
    THEN nav items include only modules whose permissionKey is in the granted set
    AND each nav item href matches the manifest routePath
    AND each nav item icon resolves from MANIFEST_MODULE_NAV_ICON_MAP

  Scenario: Denied module permission excludes nav item
    GIVEN the actor lacks permission for module "accounting"
    WHEN buildManifestNavigation filters by grantedPermissionKeys
    THEN no nav item is emitted for module "accounting"

  Scenario: Manifest module ID drift is caught at compile/test time
    GIVEN MANIFEST_MODULE_IDS in navigation.contract.ts
    WHEN entitlements ErpModuleId registry changes
    THEN navigation.contract.test.ts or module-id-parity.test.ts fails
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/appshell test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/appshell typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/appshell` (PKG scope; repo waiver) | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Feature Manifest row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [x] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | denial test in builder tests | [x] |
| 18 | Public API compatibility verified | nav contract + export surface stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (manifest-nav baseline)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Reconcile archive tip-007a + runtime matrix **implemented** claims with FDR **Not started** status. Map entitlements → appshell nav → ERP routes without source edits. Produce baseline gate log, §Runtime evidence table, §Remaining gaps, initial §Enterprise readiness score, and unblock Implementation Slice 2.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md

1. Objective    — Reconcile tip-007a archive + runtime matrix with FDR status; map entitlements→appshell nav→ERP routes; produce baseline gate log and readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `foundation-disposition.registry.ts`; `do-not-create-accounting-package`; `do-not-add-classname-on-afenda-ui-primitives`
5. Authority    — ADR-0014 · ADR-0016 · PKG001_APPSHELL registry snapshot (§Registry link)
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm --filter @afenda/appshell typecheck (read-only baseline — report exit code)
   pnpm --filter @afenda/appshell test:run (read-only baseline — report exit code)
   pnpm --filter @afenda/appshell check:governance (read-only baseline — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; waiver `manifest-nav-fdr-006-prereq`; DoD #1, #7, #8, #20 (initial score)
8. Evidence     —
   packages/appshell/src/navigation/build-nav-from-manifest.ts
   packages/appshell/src/contracts/navigation.contract.ts
   packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx
   packages/appshell/src/contracts/__tests__/navigation.contract.test.ts
   apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts
   apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts
9. Attestation  — Documentation (FDR evidence table Grade A); Contract stability discovery (Grade B baseline); Test coverage baseline (362 appshell + 11 ERP manifest tests)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row |
| 7 | Runtime matrix updated | matrix Feature Manifest row |
| 8 | fdr-status-index updated | index row |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (22/30) |

#### Known debt

- `manifest-nav-fdr-006-prereq` waived — revisit when `fdr-006-feature-manifest` FDR starts
- Package-wide typecheck blocker discovered during Research (closed in Slice 2)
- `hydrateManifestNavigation` does not yet propagate `badge`/`active` to `AppShellMenuItem` — **closed in Slice 4**

**Outcomes (delivered 2026-06-25):**

- Closed gap `fdr-research-slice-1`
- Closed gap `manifest-nav-fdr-006-prereq` via §Waivers
- Status promoted to **Partially Implemented**
- Readiness score: 22/30 (evidence-backed initial)
- Slice 2 unblocked for appshell-only closeout
- Gate re-run (2026-06-25): typecheck exit 0; test:run 362 pass; check:governance exit 0; documentation-drift exit 0; foundation-disposition exit 0

### Slice 2 — Implementation (nav pipeline closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Close package gate blockers; run full acceptance gates; achieve enterprise 9.5 (29/30).

**Outcomes:**

- Fixed `governed-ui-consumption.test.ts` type assertion (optional `normalizedFilePath` param) — `typecheck` exit 0
- No nav pipeline drift — zero changes to `navigation/` or `navigation.contract.ts`
- Closed gaps: `manifest-nav-entitlements-upstream`, `manifest-nav-typecheck-package`, `manifest-nav-29-closeout`
- Enterprise readiness: **27/30 audit-adjusted** (29/30 evidence-qualified ceiling)

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Recalculate §Enterprise readiness score; sync FDR evidence with gate output; distinguish audit-adjusted vs evidence-qualified ceiling.

**Outcomes:**

- §Enterprise readiness score: **27/30 audit-adjusted**, **29/30 evidence-qualified ceiling**
- Label: **enterprise 9.5 candidate** — not final Complete until DoD #14
- Status remains **Partially Implemented** until peer review at PR merge

### Slice 4 — Implementation (hydration + sidebar active-route)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 3 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Close the manifest-nav pipeline gaps between serializable projection and sidebar DOM: propagate `badge` and `active` through `hydrateManifestNavigation` into `AppShellMenuItem`, wire `aria-current="page"` on `.app-shell-nav-link` when `active === true`, and add CSS + tests. ERP pathname injection (`activeRoutePath`) remains host responsibility — tracked as `manifest-nav-erp-active-route` outside this slice (PKG-001 boundary).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md

1. Objective    — Complete end-to-end badge and active-route propagation from serializable nav items through hydration into sidebar DOM with aria-current and test proof.
2. Allowed layer— packages/appshell/src/navigation/; packages/appshell/src/shadcn-studio/data/; packages/appshell/src/app-shell-sidebar.tsx; packages/appshell/src/styles/afenda-appshell.css; packages/appshell/src/__tests__/
3. Files        —
   packages/appshell/src/shadcn-studio/data/app-shell.data.tsx
   packages/appshell/src/navigation/build-nav-from-manifest.ts
   packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx
   packages/appshell/src/app-shell-sidebar.tsx
   packages/appshell/src/styles/afenda-appshell.css
   packages/appshell/src/__tests__/app-shell-sidebar-navigation.test.tsx
   docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md
4. Prohibited   — apps/erp edits; packages/ui/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-add-classname-on-afenda-ui-primitives
5. Authority    — ADR-0014 · ADR-0016 · ADR-0001 navigation contract · PKG001_APPSHELL
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm ui:guard:scan
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `manifest-nav-hydrate-badge`; Gap `manifest-nav-sidebar-active`; DoD #17 (active-route accessibility path); DoD #18 (backward-compatible optional `active` on menu item)
8. Evidence     —
   packages/appshell/src/navigation/build-nav-from-manifest.ts
   packages/appshell/src/app-shell-sidebar.tsx
   packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx
   packages/appshell/src/__tests__/app-shell-sidebar-navigation.test.tsx
9. Attestation  — Contract stability (optional `active` on AppShellMenuItem); Test coverage (+hydration active + sidebar aria-current tests); Maintainability (PKG gates exit 0)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 17 | Security negative path tested | `build-nav-from-manifest.test.tsx` |
| 18 | Public API compatibility verified | optional `active?` additive only |
| 2 | Tests pass | `pnpm --filter @afenda/appshell test:run` |

#### Known debt

- `manifest-nav-complete-status` — DoD #14 peer review still open

**Outcomes (delivered 2026-06-25):**

- Closed gaps `manifest-nav-hydrate-badge`, `manifest-nav-sidebar-active`
- `AppShellMenuItem` leaf branch gains optional `active?: boolean` (backward-compatible)
- `hydrateManifestNavigation` propagates `badge` and `active`
- `app-shell-sidebar.tsx` sets `aria-current="page"` on active nav links
- CSS: `.app-shell-nav-link[aria-current="page"]` emphasis rule
- Tests: 12 nav builder tests + 2 sidebar navigation tests; all gates exit 0

### Slice 5 — Implementation (ERP active-route wiring)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 4 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Wire ERP protected layout to pass the routed pathname into manifest nav projection so active module highlighting works at runtime. Proxy injects `x-active-route-path`; layout reads header and passes `activeRoutePath` to `resolveManifestNavigationFromOperatingContext`.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md

1. Objective    — Pass routed pathname from ERP proxy/layout into buildHydratedManifestNavigation activeRoutePath for runtime sidebar active-module highlighting.
2. Allowed layer— apps/erp/src/lib/modules/; apps/erp/src/app/(protected)/layout.tsx; apps/erp/src/proxy.ts; apps/erp/src/lib/context/context.constants.ts
3. Files        —
   apps/erp/src/lib/context/context.constants.ts
   apps/erp/src/proxy.ts
   apps/erp/src/lib/modules/resolve-active-route-path-from-headers.server.ts
   apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts
   apps/erp/src/app/(protected)/layout.tsx
   apps/erp/src/lib/modules/__tests__/resolve-manifest-navigation.server.test.ts
   apps/erp/src/lib/modules/__tests__/resolve-active-route-path-from-headers.server.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-001-manifest-nav.md
4. Prohibited   — packages/appshell contract changes; foundation-disposition.registry.ts; accounting runtime
5. Authority    — ADR-0016 · PKG001_APPSHELL consumer · PKG-007 ERP wiring
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run (module nav tests)
   pnpm check:documentation-drift
7. Closes       — Gap `manifest-nav-erp-active-route`
8. Evidence     —
   apps/erp/src/proxy.ts
   apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts
   apps/erp/src/app/(protected)/layout.tsx
9. Attestation  — Test coverage (ERP resolver active-route test); Functional suitability (end-to-end active highlight path)
```

**Outcomes (delivered 2026-06-25):**

- Closed gap `manifest-nav-erp-active-route`
- `ACTIVE_ROUTE_PATH_HEADER` (`x-active-route-path`) injected by proxy after tenant/org path stripping
- Protected layout passes `activeRoutePath` into manifest nav resolver
- ERP tests: active-route resolver + header helper (3 resolver tests total)

### Slice 6 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 5 Delivered ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

#### Design (internal-guide)

Record Architecture Authority peer review approval (DoD #14); reconfirm §Waivers; promote FDR to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-001-manifest-nav.md

1. Objective    — Close DoD #14; promote fdr-001-manifest-nav to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-001-manifest-nav.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/erp typecheck
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `manifest-nav-complete-status`; DoD #14; DoD #8 (index); DoD #7 (matrix)
8. Evidence     — §Peer review attestation; final gate log below
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

**Outcomes (delivered 2026-06-25):**

- Architecture Authority peer review **Approved** (Slice 5 ERP active-route closeout)
- §Waivers reconfirmed at promotion
- Status promoted to **Complete — enterprise 9.5 accepted**
- Final gates: appshell typecheck ✓; appshell test:run 366 ✓; erp typecheck ✓; documentation-drift ✓; foundation-disposition ✓

### Final acceptance gate log (Complete promotion — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | 0 | A |
| `pnpm --filter @afenda/appshell test:run` | 0 | A (366 tests) |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert appshell navigation/contracts commit; rebuild package | Quarterly-release-safe; no hand-edited registry objects |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `manifest-nav-fdr-006-prereq` | Hard block on `fdr-006-feature-manifest` before appshell Slice 2 | Archive tip-007a Complete + 11 ERP manifest tests pass; entitlements registry live at `feature-manifest.registry.ts` | Architecture Authority (Research attestation) | Revisit when `fdr-006-feature-manifest` FDR starts |
| `manifest-nav-observability-read-path` | Audit event on nav build (ISO observability 4/5) | Nav projection is synchronous read path; security enforced at route guard | Architecture Authority | Phase 9 / ERP observability FDR |
| `manifest-nav-e2e` | Browser E2E for manifest nav | Runtime matrix marks E2E optional; unit + integration tests prove pipeline | Architecture Authority | External beta go-live |
| `manifest-nav-biome-repo` | DoD #5 repo-wide `pnpm ci:biome` | 6 pre-existing errors outside `packages/appshell`; PKG-scoped biome exit 0 | Architecture Authority | Monorepo hygiene batch |

## §Knowledge transfer

### Operational runbook

- Nav builder entry point: `packages/appshell/src/navigation/build-nav-from-manifest.ts` — `buildHydratedManifestNavigation(input)`
- Contract authority: `packages/appshell/src/contracts/navigation.contract.ts` — `MANIFEST_MODULE_IDS`, `MANIFEST_MODULE_NAV_ICON_MAP`
- ERP wiring: `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts`
- Route generation: `apps/erp/src/lib/modules/generate-module-routes.ts`

### Observability

- Nav projection is a read path — no audit event on build (waived — see §Waivers)
- Route access denial: `apps/erp/src/lib/modules/guard-module-route.server.ts`
- Integration trace: run `feature-manifest-acceptance.test.ts` for end-to-end pipeline proof
- **Future (optional):** correlation ID propagation, permission-resolution diagnostic trace, route-denial telemetry — tracked in gap `manifest-nav-observability-trace`

### On-call escalation

- Symptom: module missing from nav but route accessible → check permission keys vs manifest `permissionKey`; run `feature-manifest-acceptance.test.ts`
- Symptom: nav/module ID mismatch → run `navigation.contract.test.ts` and `module-id-parity.test.ts`
- Owner: `@afenda/appshell` (PKG-001) via `appshell-agent`

## §Peer review attestation

| Field | Value |
| --- | --- |
| **Decision** | Approved |
| **Date** | 2026-06-25 |
| **Reviewer** | Architecture Authority |
| **Scope** | Slice 5 ERP active-route highlight closeout; manifest-nav pipeline end-to-end |
| **Finding** | Closes `manifest-nav-erp-active-route` without breaking manifest navigation contract. Active route derived from ERP runtime path context → resolver → optional serializable `active` → hydration → sidebar `aria-current="page"`. |
| **Boundary** | Acceptable — ERP runtime wiring + existing manifest-nav pipeline only. `AppShellMenuItem.active?` additive. No duplicated manifest IDs, ad-hoc AppShell route authority, or accounting runtime leakage. |
| **Gate evidence** | `@afenda/erp typecheck` exit 0; ERP nav tests 7 pass; `check:documentation-drift` exit 0 |
| **DoD #14** | `[x]` |

## §Enterprise benchmark qualification

This FDR is **Complete — enterprise 9.5 accepted** at **29/30** with DoD #14 peer review closed and §Waivers reconfirmed (2026-06-25).

Accepted score composition:

1. Browser E2E waived until external beta go-live (`manifest-nav-e2e`) — Test dimension 4/5.
2. Nav projection read-path observability waived (`manifest-nav-observability-read-path`) — Observability 4/5.
3. Repo-wide Biome waived outside PKG-001 (`manifest-nav-biome-repo`) — Maintainability 4/5.
4. Documentation 5/5 — peer review closed; FDR/index/matrix synchronized.

## Verdict

**Complete — enterprise 9.5 accepted (29/30).**

Slices 1–6 delivered (2026-06-25). The manifest → nav → ERP route pipeline is proven end-to-end: entitlements manifest → RBAC-filtered projection → hydrated sidebar with badge and active-route highlighting via ERP `x-active-route-path`. Architecture Authority peer review approved DoD #14. Remaining optional gap: `manifest-nav-observability-trace` (Future, blue lane).
